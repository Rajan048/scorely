"""Service for evaluating student answers using sentence-transformers."""
import logging

try:
    from sentence_transformers import SentenceTransformer, util
    # Load the model globally so it's only loaded once in memory
    logging.info("Loading sentence-transformers model...")
    model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
    HAS_MODEL = True
except ImportError:
    HAS_MODEL = False
    logging.warning("sentence-transformers is not installed. Similarity evaluation will fail.")

def evaluate_answer(student_answer: str, reference_answer: str, max_marks: float) -> tuple[float, float]:
    """
    Computes cosine similarity between student and reference answer.
    Returns (similarity_score, marks_obtained).
    """
    if not HAS_MODEL:
        raise RuntimeError("sentence-transformers package is missing.")
        
    if not student_answer or not reference_answer:
        return 0.0, 0.0
        
    embeddings1 = model.encode(student_answer, convert_to_tensor=True)
    embeddings2 = model.encode(reference_answer, convert_to_tensor=True)
    
    # Compute cosine similarity
    cosine_scores = util.cos_sim(embeddings1, embeddings2)
    similarity = float(cosine_scores[0][0])
    
    # Normalize similarity
    similarity = max(0.0, min(1.0, similarity))
    
    # Apply thresholding
    if similarity < 0.2:
        marks = 0.0
    elif similarity >= 0.85:
        marks = float(max_marks)
    else:
        # Scale between 0.2 and 0.85 to get marks
        normalized_sim = (similarity - 0.2) / (0.85 - 0.2)
        marks = round(normalized_sim * max_marks, 2)
        
    return similarity, marks
