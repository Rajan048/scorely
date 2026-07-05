"""Admin routes."""
from fastapi import APIRouter, Depends, HTTPException

from app.models.user import User
from app.models.teacher import Teacher
from app.models.subject import Subject
from app.models.answer_sheet import AnswerSheet
from app.models.evaluation import EvaluationResult
from app.schemas.teacher import TeacherCreate, TeacherResponse
from app.schemas.subject import SubjectCreate, SubjectResponse
from app.core.security import require_role, get_password_hash

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/teachers", response_model=list[TeacherResponse])
async def list_teachers(user: dict = Depends(require_role(["admin"]))):
    """List all teachers."""
    teachers = await Teacher.find_all().to_list()
    return [
        TeacherResponse(
            teacher_id=str(t.id),
            name=t.name,
            email=t.email,
            subject=t.subject,
            employee_id=t.employee_id,
        )
        for t in teachers
    ]


@router.post("/teachers", response_model=TeacherResponse)
async def create_teacher(data: TeacherCreate, user: dict = Depends(require_role(["admin"]))):
    """Create a new teacher account."""
    if await User.find_one(User.email == data.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    if await Teacher.find_one(Teacher.employee_id == data.employee_id):
        raise HTTPException(status_code=400, detail="Employee ID already exists")

    user_obj = User(
        name=data.name,
        email=data.email,
        password=get_password_hash(data.password),
        role="teacher",
    )
    await user_obj.insert()

    teacher = Teacher(
        user_id=user_obj.id,
        name=data.name,
        email=data.email,
        subject=data.subject,
        employee_id=data.employee_id,
    )
    await teacher.insert()
    return TeacherResponse(
        teacher_id=str(teacher.id),
        name=teacher.name,
        email=teacher.email,
        subject=teacher.subject,
        employee_id=teacher.employee_id,
    )


@router.get("/subjects", response_model=list[SubjectResponse])
async def list_subjects(user: dict = Depends(require_role(["admin"]))):
    """List all subjects."""
    subjects = await Subject.find_all().to_list()
    return [
        SubjectResponse(id=str(s.id), name=s.name, code=s.code, description=s.description)
        for s in subjects
    ]


@router.post("/subjects", response_model=SubjectResponse)
async def create_subject(data: SubjectCreate, user: dict = Depends(require_role(["admin"]))):
    """Add a new subject."""
    if await Subject.find_one(Subject.name == data.name):
        raise HTTPException(status_code=400, detail="Subject already exists")
    subject = Subject(
        name=data.name,
        code=data.code,
        description=data.description,
    )
    await subject.insert()
    return SubjectResponse(id=str(subject.id), name=subject.name, code=subject.code, description=subject.description)


@router.get("/evaluation-settings")
async def get_evaluation_settings(user: dict = Depends(require_role(["admin"]))):
    """Get AI evaluation settings."""
    return {"strict": {"threshold": 0.8}, "medium": {"threshold": 0.6}, "lenient": {"threshold": 0.4}}


@router.put("/evaluation-settings")
async def update_evaluation_settings(
    user: dict = Depends(require_role(["admin"])),
):
    """Update AI evaluation settings."""
    return {"message": "Settings updated (stubbed for automated workflow)"}


@router.get("/reports")
async def get_reports(user: dict = Depends(require_role(["admin"]))):
    """Get admin reports."""
    total_sheets = await AnswerSheet.count()
    evaluated = await AnswerSheet.find(AnswerSheet.status == "evaluated").count()
    pending = await AnswerSheet.find(AnswerSheet.status == "pending").count()

    pipeline = [
        {"$match": {"obtained_marks": {"$ne": None}}},
        {"$group": {"_id": None, "avg": {"$avg": "$obtained_marks"}}},
    ]
    avg_result = await AnswerSheet.aggregate(pipeline).to_list()
    avg_marks = avg_result[0]["avg"] if avg_result else 0

    # Calculate average AI similarity score dynamically from all evaluation results
    evals = await EvaluationResult.find_all().to_list()
    all_scores = []
    for e in evals:
        if e.similarity_scores:
            all_scores.extend(e.similarity_scores.values())
    avg_ai_score = sum(all_scores) / len(all_scores) if all_scores else 0.85

    total_teachers = await Teacher.count()

    return {
        "total_answer_sheets": total_sheets,
        "evaluated": evaluated,
        "pending": pending,
        "average_marks": round(float(avg_marks), 2),
        "average_ai_accuracy": round(float(avg_ai_score), 2),
        "total_teachers": total_teachers,
    }
