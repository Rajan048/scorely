"""PDF and image text extraction using pdfplumber and Gemini API."""
from pathlib import Path
from app.config import get_settings

try:
    import pdfplumber
    HAS_PDFPLUMBER = True
except ImportError:
    HAS_PDFPLUMBER = False

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False


async def extract_text_with_ai(image: 'Image.Image') -> str:
    """Uses Gemini Vision API to accurately extract text from an image, including handwritten."""
    settings = get_settings()
    if settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = "Accurately transcribe all the text in this image. Do not summarize or format, just extract the verbatim text. Pay special attention to handwritten text and numbers."
        try:
            response = await model.generate_content_async([prompt, image])
            return response.text.strip()
        except Exception as e:
            print(f"Gemini Vision extraction failed: {e}")
            # fallback sync 
            try:
                 response = model.generate_content([prompt, image])
                 return response.text.strip()
            except Exception as ex:
                 print(f"Gemini sync fallback failed: {ex}")
                 return ""
    elif settings.AI_PROVIDER == "nvidia" and settings.NVIDIA_API_KEY:
        import base64
        from io import BytesIO
        from openai import AsyncOpenAI
        
        client = AsyncOpenAI(
            api_key=settings.NVIDIA_API_KEY,
            base_url="https://integrate.api.nvidia.com/v1"
        )
        
        prompt = "Accurately transcribe all the text in this image. Do not summarize or format, just extract the verbatim text. Pay special attention to handwritten text and numbers."
        
        try:
            buffered = BytesIO()
            image.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            response = await client.chat.completions.create(
                model="meta/llama-3.2-11b-vision-instruct",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{img_str}"
                                }
                            }
                        ]
                    }
                ]
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            import traceback
            with open("ocr_error.txt", "w") as f:
                f.write(f"Nvidia Vision Exception: {str(e)}\n")
                traceback.print_exc(file=f)
            print(f"NVIDIA Vision extraction failed: {e}")
            return ""
    return ""


async def extract_pdf_text_async(file_path: str) -> str:
    """
    Extract text from PDF. For scanned/handwritten PDFs, renders each page
    as an image using PyMuPDF and sends to AI Vision OCR.
    """
    extracted_text = ""

    # Try PyMuPDF first - works for both text and scanned PDFs
    try:
        import fitz  # PyMuPDF
        from PIL import Image as PILImage
        import io

        doc = fitz.open(file_path)
        for page_num in range(len(doc)):
            page = doc[page_num]

            # First try: extract embedded text
            text = page.get_text().strip()

            if text and len(text) >= 50:
                extracted_text += text + "\n"
            else:
                # Render page as image at high DPI for OCR
                try:
                    mat = fitz.Matrix(2.0, 2.0)  # 2x zoom = ~144 DPI
                    pix = page.get_pixmap(matrix=mat)
                    img_bytes = pix.tobytes("jpeg")
                    pil_img = PILImage.open(io.BytesIO(img_bytes)).convert("RGB")
                    ai_text = await extract_text_with_ai(pil_img)
                    if ai_text:
                        extracted_text += ai_text + "\n"
                        print(f"PyMuPDF OCR page {page_num+1}: {len(ai_text)} chars")
                    else:
                        print(f"AI OCR returned empty for page {page_num+1}")
                except Exception as e:
                    print(f"PyMuPDF render failed page {page_num+1}: {e}")
        doc.close()
        return extracted_text.strip()

    except ImportError:
        print("PyMuPDF not installed, falling back to pdfplumber")
    except Exception as e:
        print(f"PyMuPDF failed: {e}, falling back to pdfplumber")

    # Fallback: pdfplumber text-only extraction
    if HAS_PDFPLUMBER:
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + "\n"
        except Exception as e:
            print(f"pdfplumber failed: {e}")

    return extracted_text.strip()


async def extract_text_from_file_async(file_path: str) -> str:
    """Extract text from PDF or image file."""
    path = Path(file_path)
    ext = path.suffix.lower()
    
    if ext == ".pdf":
        return await extract_pdf_text_async(file_path)
    elif ext in {".jpg", ".jpeg", ".png"}:
        if HAS_PIL:
            try:
                # Load fully into memory BEFORE passing to AI (don't use context manager)
                img = Image.open(file_path)
                rgb_im = img.convert('RGB')
                img.close()
                result = await extract_text_with_ai(rgb_im)
                return result
            except Exception as e:
                import traceback
                with open("ocr_error.txt", "w") as f:
                    f.write(f"Image processing exception: {str(e)}\n")
                    traceback.print_exc(file=f)
                print(f"Image processing failed: {e}")
    return ""
