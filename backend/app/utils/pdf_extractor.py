"""PDF and image text extraction using pdfplumber and Gemini API."""
from pathlib import Path
from app.config import get_settings

try:
    import pdfplumber
    from PIL import Image
    HAS_LIBS = True
except ImportError:
    HAS_LIBS = False


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
            print(f"NVIDIA Vision extraction failed: {e}")
            return ""
    return ""


async def extract_pdf_text_async(file_path: str) -> str:
    """
    Extract text from PDF file using pdfplumber.
    If text is too short or empty, fall back to AI Vision via Gemini.
    """
    if not HAS_LIBS:
        return ""
        
    extracted_text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                
                # If text is suspiciously short, it might be a scanned image
                if not text or len(text.strip()) < 50:
                    try:
                        im = page.to_image(resolution=300).original
                        ai_text = await extract_text_with_ai(im)
                        extracted_text += ai_text + "\n"
                    except Exception as e:
                        print(f"AI OCR failed for page: {e}")
                else:
                    extracted_text += text + "\n"
    except Exception as e:
        print(f"Failed to read PDF {file_path}: {e}")
        
    return extracted_text.strip()


async def extract_text_from_file_async(file_path: str) -> str:
    """Extract text from PDF or image file."""
    path = Path(file_path)
    ext = path.suffix.lower()
    
    if ext == ".pdf":
        return await extract_pdf_text_async(file_path)
    elif ext in {".jpg", ".jpeg", ".png"}:
        if HAS_LIBS:
            try:
                # Need to convert image to RGB if not already
                with Image.open(file_path) as img:
                    rgb_im = img.convert('RGB')
                return await extract_text_with_ai(rgb_im)
            except Exception as e:
                print(f"Image processing failed: {e}")
    return ""

