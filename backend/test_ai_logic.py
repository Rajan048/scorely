import asyncio
import os
import json
from dotenv import load_dotenv

load_dotenv()

from app.services.question_extraction_service import extract_questions_from_text
from app.services.reference_answer_service import generate_reference_answer
from app.services.student_answer_parser import extract_student_answers
from app.services.evaluation_service import evaluate_answer

async def test_extraction():
    # Mocking AI extracted questions and reference answers
    questions = [
        {"question": "What is the difference between a process and a thread?", "marks": 10, "ref_answer": "A process is an instance of a program in execution, managed by the OS. A thread is a smaller unit of a process that can be scheduled independently. Multiple threads can exist within a single process."},
        {"question": "Explain the concept of deadlocks in operating systems.", "marks": 15, "ref_answer": "A deadlock occurs when two or more processes are blocked indefinitely, each waiting for a resource held by the other, creating a cycle. The four Coffman conditions (mutual exclusion, hold and wait, no preemption, and circular wait) must be met for a deadlock to occur."}
    ]

    print("1. Testing Student Parser")
    student_paper = """
    Name: John Doe
    
    Q1: A process is an executing program, while a thread is a lightweight process that can be managed independently by a scheduler. Multiple threads can belong to the same process.
    
    Q2: A deadlock happens when processes are stuck waiting for each other to release resources, leading to a standstill.
    """
    
    parsed_answers = extract_student_answers(student_paper)
    print("Parsed Student Answers:")
    print(json.dumps(parsed_answers, indent=2))
    
    print("\n2. Testing Evaluation Similarity")
    for idx, q in enumerate(questions):
        idx_str = str(idx + 1)
        student_ans = parsed_answers.get(idx_str, "")
        ref_ans = q['ref_answer']
        max_marks = float(q.get('marks', 0))
        
        sim, marks = evaluate_answer(student_ans, ref_ans, max_marks)
        print(f"Q{idx_str} -> Sim: {sim:.2f}, Marks: {marks:.2f} / {max_marks}")

if __name__ == "__main__":
    asyncio.run(test_extraction())
