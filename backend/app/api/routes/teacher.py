"""Teacher routes."""
from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Body
from pydantic import BaseModel
from pathlib import Path
import logging
from typing import List, Dict, Any

from app.models.teacher import Teacher
from app.models.question_paper import QuestionPaper, Question
from app.models.evaluation import EvaluationResult
from app.core.security import require_role
from app.config import get_settings
from app.utils.file_utils import (
    save_upload_file,
    get_student_name_from_filename,
    ensure_upload_dir,
    extract_zip,
    ALLOWED_EXTENSIONS,
)

from app.utils.pdf_extractor import extract_text_from_file_async
from app.services.question_extraction_service import extract_questions_from_text
from app.services.reference_answer_service import generate_reference_answer
from app.services.student_answer_parser import extract_student_answers_ai
from app.services.evaluation_service import evaluate_answer

router = APIRouter(prefix="/teacher", tags=["Teacher"])
settings = get_settings()

async def get_teacher(user_id: str) -> Teacher:
    """Get teacher by user id."""
    teacher = await Teacher.find_one(Teacher.user_id == ObjectId(user_id))
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher

@router.get("/dashboard")
async def get_dashboard(user: dict = Depends(require_role(["teacher"]))):
    """Get teacher dashboard stats."""
    teacher = await get_teacher(user["sub"])
    papers = await QuestionPaper.find(QuestionPaper.created_by == teacher.id).to_list()
    
    total_papers = len(papers)
    paper_ids = [p.id for p in papers]
    
    total_evaluated = 0
    total_marks_sum = 0.0
    
    for pid in paper_ids:
        evals = await EvaluationResult.find(EvaluationResult.paper_id == pid).to_list()
        total_evaluated += len(evals)
        total_marks_sum += sum([e.total_marks for e in evals])
        
    avg_marks = round(total_marks_sum / total_evaluated, 2) if total_evaluated > 0 else 0.0
    
    return {
        "total_question_papers": total_papers,
        "total_evaluated_sheets": total_evaluated,
        "average_marks": avg_marks,
    }

@router.post("/upload-question-paper")
async def upload_question_paper(
    subject: str = Form(...),
    exam_name: str = Form(...),
    file: UploadFile = File(...),
    user: dict = Depends(require_role(["teacher"])),
):
    """Upload Question Paper PDF, extract questions and generate reference answers via AI."""
    teacher = await get_teacher(user["sub"])

    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")
    
    try:
        file_path, _ = await save_upload_file(file, "question_papers", str(teacher.id))
        
        # 1. Parse Text
        raw_text = await extract_text_from_file_async(file_path)
        if not raw_text:
            raise ValueError("Failed to extract any text from the provided document.")
            
        # 2. Extract Questions with AI
        extracted_json = await extract_questions_from_text(raw_text)
        questions_data = extracted_json.get("questions", [])
        
        if not questions_data:
            raise ValueError("AI could not map any questions from the document.")

        # 3. Create DB Models
        qp = QuestionPaper(
            created_by=teacher.id,
            subject=subject,
            exam_name=exam_name,
            pdf_path=file_path,
        )
        await qp.insert()

        # 4. Generate all reference answers in parallel (much faster than sequential)
        import asyncio
        
        async def build_question(q_data):
            q_text = q_data.get("question", "")
            if not q_text.strip():
                return None
            try:
                q_marks = float(q_data.get("marks", 0.0))
                if q_marks <= 0.0:
                    q_marks = 10.0
            except (ValueError, TypeError):
                q_marks = 10.0
            try:
                ref_ans = await generate_reference_answer(q_text)
            except Exception:
                ref_ans = ""
            return Question(
                paper_id=qp.id,
                question_text=q_text,
                marks=q_marks,
                reference_answer=ref_ans,
            )
        
        questions_to_insert = await asyncio.gather(*[build_question(q) for q in questions_data])
        for q in questions_to_insert:
            if q is not None:
                await q.insert()

        return {"id": str(qp.id), "message": "Question paper uploaded and parsed successfully!"}
    except ValueError as e:
        import traceback
        with open("ocr_error.txt", "w") as f:
            f.write(f"ValueError: {str(e)}\n")
            traceback.print_exc(file=f)
        logging.error(f"Value Error during parsing: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        import traceback
        with open("ocr_error.txt", "w") as f:
            f.write(f"Exception: {str(e)}\n")
            traceback.print_exc(file=f)
        logging.error(f"Failed to process question paper: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.get("/question-papers")
async def list_question_papers(user: dict = Depends(require_role(["teacher"]))):
    """List teacher's question papers."""
    teacher = await get_teacher(user["sub"])
    papers = await QuestionPaper.find(QuestionPaper.created_by == teacher.id).to_list()
    return [{"id": str(p.id), "subject": p.subject, "exam_name": p.exam_name, "created_at": p.created_at} for p in papers]

@router.get("/question-papers/{paper_id}")
async def get_question_paper(paper_id: str, user: dict = Depends(require_role(["teacher"]))):
    """Get paper details and questions."""
    teacher = await get_teacher(user["sub"])
    qp = await QuestionPaper.find_one(QuestionPaper.id == ObjectId(paper_id), QuestionPaper.created_by == teacher.id)
    if not qp:
         raise HTTPException(status_code=404, detail="Question paper not found")
         
    questions = await Question.find(Question.paper_id == qp.id).to_list()
    total_marks = sum(q.marks for q in questions)
    
    return {
        "id": str(qp.id),
        "subject": qp.subject,
        "exam_name": qp.exam_name,
        "total_marks": total_marks,
        "questions": [{"id": str(q.id), "text": q.question_text, "marks": q.marks, "ref_answer": q.reference_answer} for q in questions]
    }

@router.delete("/question-papers/{paper_id}")
async def delete_question_paper(paper_id: str, user: dict = Depends(require_role(["teacher"]))):
    """Delete a question paper and its associated questions/evaluations."""
    teacher = await get_teacher(user["sub"])
    qp = await QuestionPaper.find_one(QuestionPaper.id == ObjectId(paper_id), QuestionPaper.created_by == teacher.id)
    if not qp:
         raise HTTPException(status_code=404, detail="Question paper not found")
         
    # Find and delete questions
    await Question.find(Question.paper_id == qp.id).delete()
    
    # Find and delete associated evaluations
    await EvaluationResult.find(EvaluationResult.paper_id == qp.id).delete()
    
    # Finally delete the paper itself
    await qp.delete()
    
    return {"message": "Question paper deleted successfully"}

@router.post("/upload-answer-sheets")
async def upload_answer_sheets(
    question_paper_id: str = Form(...),
    files: list[UploadFile] = File(...),
    user: dict = Depends(require_role(["teacher"])),
):
    """Upload student answer sheets, extract text, evaluate via semantic similarity."""
    teacher = await get_teacher(user["sub"])
    qp = await QuestionPaper.find_one(QuestionPaper.id == ObjectId(question_paper_id), QuestionPaper.created_by == teacher.id)
    if not qp:
        raise HTTPException(status_code=404, detail="Question paper not found")
        
    questions = await Question.find(Question.paper_id == qp.id).to_list()
    if not questions:
        raise HTTPException(status_code=400, detail="No questions exist for this paper to evaluate against.")

    results_out = []
    errors = []
    
    # Process each uploaded file
    for file in files:
        if not file.filename:
            continue
            
        ext = Path(file.filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            errors.append(f"{file.filename}: unsupported file type")
            continue
            
        try:
            path, _ = await save_upload_file(file, "answer_sheets", f"{teacher.id}/{question_paper_id}")
            student_name = get_student_name_from_filename(file.filename)
            
            # Extract student text via AI OCR
            logging.info(f"Extracting text from: {file.filename}")
            raw_text = await extract_text_from_file_async(path)
            if not raw_text:
                errors.append(f"{file.filename}: could not extract text (OCR failed)")
                logging.warning(f"OCR returned empty text for: {file.filename}")
                continue
            
            logging.info(f"Extracted {len(raw_text)} chars from {file.filename}")
            
            # Parse answers via AI (understands unstructured/handwritten OCR text)
            questions_for_ai = [{"num": idx + 1, "text": q.question_text} for idx, q in enumerate(questions)]
            parsed_answers = await extract_student_answers_ai(raw_text, questions_for_ai)
            logging.info(f"Parsed {len(parsed_answers)} answers for {student_name}")
            
            sim_scores = {}
            marks_obtained = {}
            total_obtained = 0.0
            
            # Evaluate each question
            for idx, q in enumerate(questions):
                q_idx_str = str(idx + 1)
                s_ans = parsed_answers.get(q_idx_str, "")
                
                sim, q_mark = evaluate_answer(s_ans, q.reference_answer or "", q.marks)
                
                q_id_str = str(q.id)
                sim_scores[q_id_str] = sim
                marks_obtained[q_id_str] = q_mark
                total_obtained += q_mark
                parsed_answers[q_id_str] = s_ans
                
            filtered_answers = {str(q.id): parsed_answers.get(str(q.id), "") for q in questions}

            evaluation = EvaluationResult(
                student_name=student_name,
                paper_id=qp.id,
                answers=filtered_answers,
                similarity_scores=sim_scores,
                marks=marks_obtained,
                total_marks=total_obtained
            )
            await evaluation.insert()
            results_out.append({"student_name": student_name, "total_marks": total_obtained, "eval_id": str(evaluation.id)})
            logging.info(f"Evaluated {student_name}: {total_obtained} marks")
            
        except Exception as e:
            import traceback
            logging.error(f"Error processing {file.filename}: {e}")
            errors.append(f"{file.filename}: {str(e)}")

    if not results_out and errors:
        raise HTTPException(status_code=400, detail=f"No sheets evaluated. Errors: {'; '.join(errors)}")

    return {"uploaded": len(results_out), "results": results_out, "errors": errors}

@router.get("/evaluation-reports/{paper_id}")
async def get_evaluation_reports(paper_id: str, user: dict = Depends(require_role(["teacher"]))):
    """Get all evaluation results for a specific paper."""
    teacher = await get_teacher(user["sub"]) # to check auth
    evals = await EvaluationResult.find(EvaluationResult.paper_id == ObjectId(paper_id)).to_list()
    
    return [
         {
             "id": str(e.id),
             "student_name": e.student_name,
             "total_marks": e.total_marks,
             "created_at": e.created_at
         } for e in evals
    ]
    
@router.get("/evaluation-reports/detail/{eval_id}")
async def get_evaluation_detail(eval_id: str, user: dict = Depends(require_role(["teacher"]))):
    """Get detailed report of a single evaluation."""
    e = await EvaluationResult.find_one(EvaluationResult.id == ObjectId(eval_id))
    if not e:
        raise HTTPException(status_code=404, detail="Evaluation not found")
        
    qp = await QuestionPaper.find_one(QuestionPaper.id == e.paper_id)
    questions = await Question.find(Question.paper_id == e.paper_id).to_list()
    q_map = {str(q.id): q for q in questions}
    
    details = []
    
    for q_id, s_ans in e.answers.items():
        q_obj = q_map.get(q_id)
        if q_obj:
            details.append({
                "id": str(q_id),
                "question": q_obj.question_text,
                "reference_answer": q_obj.reference_answer,
                "max_marks": q_obj.marks,
                "student_answer": s_ans,
                "similarity_score": round(e.similarity_scores.get(q_id, 0.0), 2),
                "marks_obtained": e.marks.get(q_id, 0.0)
            })
            
    return {
        "student_name": e.student_name,
        "exam_name": qp.exam_name if qp else "Unknown",
        "total_marks": e.total_marks,
        "details": details
    }

class MarksUpdateBody(BaseModel):
    marks: Dict[str, float]

@router.put("/evaluation-reports/{eval_id}/marks")
async def update_evaluation_marks(
    eval_id: str,
    update_data: MarksUpdateBody,
    user: dict = Depends(require_role(["teacher"]))
):
    """Update marks for specific questions in an evaluation."""
    teacher = await get_teacher(user["sub"])
    e = await EvaluationResult.find_one(EvaluationResult.id == ObjectId(eval_id))
    if not e:
        raise HTTPException(status_code=404, detail="Evaluation not found")
        
    qp = await QuestionPaper.find_one(QuestionPaper.id == e.paper_id, QuestionPaper.created_by == teacher.id)
    if not qp:
        raise HTTPException(status_code=403, detail="Not authorized to edit this evaluation")
        
    # Update marks
    for q_id, new_mark in update_data.marks.items():
        if q_id in e.marks:
            e.marks[q_id] = float(new_mark)
            
    # Recalculate total
    e.total_marks = sum(e.marks.values())
    await e.save()
    
    return {"message": "Marks updated successfully", "total_marks": e.total_marks}


class QuestionUpdateItem(BaseModel):
    id: str
    question_text: str
    marks: float


class QuestionsUpdateBody(BaseModel):
    questions: List[QuestionUpdateItem]


@router.put("/question-papers/{paper_id}/questions")
async def update_question_paper_questions(
    paper_id: str,
    update_data: QuestionsUpdateBody,
    user: dict = Depends(require_role(["teacher"]))
):
    """Update question texts and max marks for a question paper, and recalculate evaluation results."""
    teacher = await get_teacher(user["sub"])
    qp = await QuestionPaper.find_one(QuestionPaper.id == ObjectId(paper_id), QuestionPaper.created_by == teacher.id)
    if not qp:
        raise HTTPException(status_code=404, detail="Question paper not found")
        
    for q_item in update_data.questions:
        q_obj = await Question.find_one(Question.id == ObjectId(q_item.id), Question.paper_id == qp.id)
        if q_obj:
            q_obj.question_text = q_item.question_text
            q_obj.marks = float(q_item.marks)
            await q_obj.save()
            
    # Re-evaluate all student sheets associated with this paper to update their scores based on new max marks!
    eval_results = await EvaluationResult.find(EvaluationResult.paper_id == qp.id).to_list()
    questions = await Question.find(Question.paper_id == qp.id).to_list()
    
    for e in eval_results:
        total_obtained = 0.0
        for q in questions:
            q_id_str = str(q.id)
            sim = e.similarity_scores.get(q_id_str, 0.0)
            
            # Re-calculate marks obtained using the same formula:
            if sim < 0.2:
                q_mark = 0.0
            elif sim >= 0.85:
                q_mark = float(q.marks)
            else:
                normalized_sim = (sim - 0.2) / (0.85 - 0.2)
                q_mark = round(normalized_sim * q.marks, 2)
                
            e.marks[q_id_str] = q_mark
            total_obtained += q_mark
            
        e.total_marks = total_obtained
        await e.save()
        
    return {"message": "Questions updated successfully and evaluations recalculated."}

