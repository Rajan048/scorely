"""Seed comprehensive demo data: subjects, question papers, answer sheets, and evaluations."""
import asyncio
import sys
from pathlib import Path
from datetime import datetime, timedelta
import random

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database import init_db
from app.models.user import User
from app.models.teacher import Teacher
from app.models.subject import Subject
from app.models.question_paper import QuestionPaper, Question
from app.models.answer_sheet import AnswerSheet, Answer
from app.models.evaluation import EvaluationResult
from app.core.security import get_password_hash


# ─── Demo Data ────────────────────────────────────────────────────────────────

SUBJECTS = [
    {"name": "Mathematics", "code": "MATH101", "description": "Algebra, Calculus, and Statistics"},
    {"name": "Physics", "code": "PHY101", "description": "Mechanics, Thermodynamics, and Optics"},
    {"name": "Computer Science", "code": "CS101", "description": "Programming, Data Structures, and Algorithms"},
    {"name": "English Literature", "code": "ENG101", "description": "Poetry, Prose, and Grammar"},
]

TEACHERS = [
    {"name": "Dr. Priya Sharma", "email": "priya@school.com", "password": "teacher123", "subject": "Mathematics", "employee_id": "EMP101"},
    {"name": "Prof. Arjun Mehta", "email": "arjun@school.com", "password": "teacher123", "subject": "Physics", "employee_id": "EMP102"},
    {"name": "Ms. Neha Kapoor",  "email": "neha@school.com",  "password": "teacher123", "subject": "Computer Science", "employee_id": "EMP103"},
]

QUESTION_PAPERS = [
    {
        "subject": "Mathematics",
        "exam_name": "Midterm Exam - Algebra & Calculus",
        "questions": [
            {
                "text": "Explain the concept of derivatives and their real-world applications.",
                "marks": 10,
                "reference": "A derivative represents the rate of change of a function with respect to a variable. In real-world applications, derivatives are used to find velocity (rate of change of position), acceleration (rate of change of velocity), optimize business profits, and determine the slope of a curve at any point. For example, in physics, if position is s(t), then velocity is s'(t) and acceleration is s''(t)."
            },
            {
                "text": "Solve and explain the quadratic equation: 2x² - 5x + 3 = 0",
                "marks": 10,
                "reference": "Using the quadratic formula x = (-b ± sqrt(b²-4ac)) / 2a where a=2, b=-5, c=3. Discriminant = 25-24 = 1. x = (5 ± 1)/4. Therefore x = 3/2 or x = 1. Both roots are real and distinct."
            },
            {
                "text": "What is the difference between permutation and combination? Give examples.",
                "marks": 5,
                "reference": "Permutation is an arrangement of objects where order matters. Combination is a selection of objects where order does not matter. Example: Selecting 3 students from 5 for a race (1st, 2nd, 3rd positions) is permutation: P(5,3)=60. Selecting 3 students for a committee from 5 is combination: C(5,3)=10."
            },
            {
                "text": "Define integration and state the fundamental theorem of calculus.",
                "marks": 5,
                "reference": "Integration is the reverse process of differentiation. The Fundamental Theorem of Calculus states that if F is an antiderivative of f on [a,b], then the definite integral of f from a to b equals F(b) - F(a). This connects differentiation and integration as inverse operations."
            },
        ]
    },
    {
        "subject": "Physics",
        "exam_name": "Unit Test - Laws of Motion",
        "questions": [
            {
                "text": "State Newton's three laws of motion and give one example for each.",
                "marks": 15,
                "reference": "1st Law (Inertia): An object remains at rest or in uniform motion unless acted upon by an external force. Example: A book on a table stays put until pushed. 2nd Law: Force = mass × acceleration (F=ma). Example: Pushing a heavy cart requires more force than a light one. 3rd Law: For every action there is an equal and opposite reaction. Example: A rocket expels gas downward and is propelled upward."
            },
            {
                "text": "Explain the concept of friction. What are its types and applications?",
                "marks": 10,
                "reference": "Friction is a force that opposes relative motion between surfaces in contact. Types: Static friction (acts when object is at rest), Kinetic/sliding friction (acts when object is moving), Rolling friction (when object rolls), Fluid friction (in liquids/gases). Applications: Friction helps us walk, vehicles brake, machines work. It is reduced using lubricants and ball bearings."
            },
            {
                "text": "A car of mass 1000 kg accelerates from rest to 20 m/s in 10 seconds. Calculate the net force.",
                "marks": 5,
                "reference": "Using F = ma. Acceleration a = (v-u)/t = (20-0)/10 = 2 m/s². Net Force F = 1000 × 2 = 2000 N. The net force acting on the car is 2000 Newtons in the direction of motion."
            },
        ]
    },
    {
        "subject": "Computer Science",
        "exam_name": "Final Exam - Data Structures",
        "questions": [
            {
                "text": "Explain the difference between a stack and a queue with real-life examples.",
                "marks": 10,
                "reference": "A Stack follows Last-In-First-Out (LIFO) principle. The last element added is the first to be removed. Real-life example: A stack of plates - you add and remove from the top. A Queue follows First-In-First-Out (FIFO) principle. The first element added is the first to be removed. Real-life example: A ticket counter queue - first person in line is served first."
            },
            {
                "text": "What is a binary search tree? Explain insertion and search operations.",
                "marks": 10,
                "reference": "A Binary Search Tree (BST) is a binary tree where each node has at most two children, and for every node, all values in the left subtree are smaller and all values in the right subtree are larger. Insertion: Compare value with root, go left if smaller, right if larger, recursively until empty spot found. Search: Compare target with node, return if equal, go left if smaller, go right if larger. Time complexity: O(log n) average, O(n) worst case."
            },
            {
                "text": "Write a brief algorithm for bubble sort and state its time complexity.",
                "marks": 10,
                "reference": "Bubble Sort Algorithm: 1) Start from index 0. 2) Compare adjacent elements. 3) If left > right, swap them. 4) Move to next pair. 5) Repeat for all pairs in one pass (largest bubbles to end). 6) Repeat n-1 passes. Time Complexity: Best case O(n) when array is sorted, Average and Worst case O(n²). Space complexity O(1)."
            },
        ]
    },
]

STUDENTS = [
    "Aarav Singh", "Priya Patel", "Rohit Kumar", "Sneha Gupta", "Arjun Reddy",
    "Divya Sharma", "Vikram Joshi", "Meera Nair", "Karan Malhotra", "Anjali Verma",
    "Siddharth Rao", "Pooja Iyer", "Rahul Desai", "Kavya Menon", "Aditya Tiwari",
]

STUDENT_ANSWERS = {
    "excellent": [
        "This is a comprehensive and accurate answer that demonstrates thorough understanding of the concept. The student has provided relevant examples and shown deep knowledge.",
        "The student has correctly identified all key points and presented a well-structured answer with appropriate examples and clear explanations.",
        "Excellent response demonstrating mastery of the topic. All aspects have been covered with accurate details and proper terminology.",
    ],
    "good": [
        "The student has covered most of the key concepts but missed a few minor details. The answer is mostly accurate with some good examples provided.",
        "Good understanding shown with correct explanation of main points. The answer could be improved with more specific examples.",
        "The student demonstrates solid knowledge of the topic with mostly correct information, though some points could be elaborated further.",
    ],
    "average": [
        "The student has a basic understanding but the answer lacks depth. Some key concepts are mentioned but not fully explained.",
        "Partial understanding demonstrated. The answer covers some aspects correctly but misses important details and examples.",
        "The response shows some knowledge but is incomplete. Several important points are either missing or incorrectly stated.",
    ],
    "poor": [
        "The answer shows minimal understanding. Most key concepts are missing or incorrectly described.",
        "Very limited knowledge demonstrated. The answer is mostly incorrect with fundamental misconceptions present.",
        "The student has attempted to answer but the response is largely incorrect and lacks proper understanding of the topic.",
    ],
}


async def clear_demo_data():
    """Remove all existing demo data."""
    await Answer.find_all().delete()
    await AnswerSheet.find_all().delete()
    await Question.find_all().delete()
    await QuestionPaper.find_all().delete()
    await Subject.find_all().delete()
    # Remove demo teachers (not the original test teacher)
    demo_emails = [t["email"] for t in TEACHERS]
    for email in demo_emails:
        user = await User.find_one(User.email == email)
        if user:
            teacher = await Teacher.find_one(Teacher.user_id == user.id)
            if teacher:
                await teacher.delete()
            await user.delete()
    print("Cleared existing demo data.")


async def seed():
    await init_db()
    await clear_demo_data()

    # ── 1. Create Subjects ──────────────────────────────────────────────────
    subject_map = {}
    for s in SUBJECTS:
        subj = Subject(name=s["name"], code=s["code"], description=s["description"])
        await subj.insert()
        subject_map[s["name"]] = subj
    print(f"Created {len(SUBJECTS)} subjects.")

    # ── 2. Create Teachers ──────────────────────────────────────────────────
    teacher_map = {}
    for t in TEACHERS:
        user = User(
            name=t["name"],
            email=t["email"],
            password=get_password_hash(t["password"]),
            role="teacher",
        )
        await user.insert()
        teacher = Teacher(
            user_id=user.id,
            name=t["name"],
            email=t["email"],
            subject=t["subject"],
            employee_id=t["employee_id"],
        )
        await teacher.insert()
        teacher_map[t["subject"]] = teacher
    print(f"Created {len(TEACHERS)} teachers.")

    # ── 3. Create Question Papers & Questions ───────────────────────────────
    paper_map = {}
    for paper_data in QUESTION_PAPERS:
        teacher = teacher_map.get(paper_data["subject"])
        if not teacher:
            continue
        paper = QuestionPaper(
            created_by=teacher.id,
            subject=paper_data["subject"],
            exam_name=paper_data["exam_name"],
        )
        await paper.insert()

        questions = []
        for q in paper_data["questions"]:
            question = Question(
                paper_id=paper.id,
                question_text=q["text"],
                marks=q["marks"],
                reference_answer=q["reference"],
            )
            await question.insert()
            questions.append(question)

        paper_map[paper_data["subject"]] = {"paper": paper, "questions": questions}
    print(f"Created {len(QUESTION_PAPERS)} question papers with questions.")

    # ── 4. Create Answer Sheets & Answers ───────────────────────────────────
    total_sheets = 0
    for subj_name, data in paper_map.items():
        paper = data["paper"]
        questions = data["questions"]
        teacher = teacher_map[subj_name]

        # 5 students per paper
        students = random.sample(STUDENTS, 5)
        for i, student_name in enumerate(students):
            # Randomly assign performance tier
            tier = random.choice(["excellent", "excellent", "good", "good", "average", "poor"])
            marks_pct = {"excellent": 0.9, "good": 0.75, "average": 0.55, "poor": 0.35}[tier]

            total_marks = sum(q.marks for q in questions)
            obtained = round(total_marks * marks_pct + random.uniform(-2, 2), 1)
            obtained = max(0, min(obtained, total_marks))

            created_time = datetime.utcnow() - timedelta(days=random.randint(1, 30))

            sheet = AnswerSheet(
                question_paper_id=paper.id,
                teacher_id=teacher.id,
                student_name=student_name,
                student_roll=f"ROLL{random.randint(1000, 9999)}",
                file_path=f"uploads/{student_name.replace(' ', '_')}_{paper.id}.pdf",
                total_marks=total_marks,
                obtained_marks=obtained,
                status="evaluated",
                feedback=f"Student performed at {tier} level. Score: {obtained}/{total_marks}.",
                created_at=created_time,
                evaluated_at=created_time + timedelta(hours=random.randint(1, 5)),
            )
            await sheet.insert()

            # Create answers for each question
            for question in questions:
                answer_text = random.choice(STUDENT_ANSWERS[tier])
                q_obtained = round(question.marks * marks_pct + random.uniform(-0.5, 0.5), 1)
                q_obtained = max(0, min(q_obtained, question.marks))
                ai_score = marks_pct + random.uniform(-0.05, 0.05)
                ai_score = max(0.0, min(1.0, ai_score))

                answer = Answer(
                    answer_sheet_id=sheet.id,
                    question_id=question.id,
                    answer_text=answer_text,
                    marks_obtained=q_obtained,
                    max_marks=question.marks,
                    ai_score=round(ai_score, 2),
                    feedback=f"AI feedback: {answer_text[:80]}...",
                    created_at=created_time,
                )
                await answer.insert()

            total_sheets += 1

    print(f"Created {total_sheets} answer sheets with evaluated answers.")

    print("\n--- DEMO DATA SUMMARY ---")
    print(f"Subjects   : {len(SUBJECTS)}")
    print(f"Teachers   : {len(TEACHERS)}")
    print(f"Papers     : {len(QUESTION_PAPERS)}")
    print(f"Students   : {total_sheets}")
    print("\nTeacher Logins (password: teacher123):")
    for t in TEACHERS:
        print(f"  {t['email']}  ->  {t['subject']}")
    print("\nAdmin Login: admin@admin.com / admin123")
    print("Done!")


if __name__ == "__main__":
    asyncio.run(seed())
