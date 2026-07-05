"""Service for extracting student answers from raw text."""
import re
from typing import Dict

def extract_student_answers(text: str) -> Dict[str, str]:
    """
    Extracts answers based on regex patterns like Q1, Q2, etc.
    Returns a dictionary mapping Question identifier (e.g. '1', '2') to the answer string.
    """
    answers = {}
    
    # Pattern looks for Q1., Q1:, Question 1, etc., allowing optional leading spaces
    pattern = re.compile(r'(?:^|\n)\s*(?:Q|Question)\s*(\d+)[\.\:\-\s]+', re.IGNORECASE)
    
    matches = list(pattern.finditer(text))
    
    if not matches:
        # Provide the whole text as a generic answer if no numbers are found
        # (This handles unstructured responses temporarily)
        return {"1": text.strip()} if text.strip() else {}
        
    for i, match in enumerate(matches):
        q_num = str(int(match.group(1)))  # Normalise to string integer
        start_idx = match.end()
        end_idx = matches[i+1].start() if i + 1 < len(matches) else len(text)
        
        answer_text = text[start_idx:end_idx].strip()
        if q_num in answers:
            answers[q_num] += "\n" + answer_text
        else:
            answers[q_num] = answer_text
            
    return answers
