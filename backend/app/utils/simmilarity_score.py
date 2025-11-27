import pickle
import pdfplumber
from sqlalchemy.orm import Session
from models.resume import Resume
from models.job import Job

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file."""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + " "
    except Exception as e:
        print("Error reading PDF:", e)
    return text.strip()

model_filename = "ml/models/resume_classifier_cnb.pkl"
with open(model_filename, "rb") as file:
    loaded_model = pickle.load(file)

def predict_resume_prob(resume_text: str, job_title: str) -> float:
    """
    Get the probability/confidence of the resume matching the specific job title.
    Returns a value between 0 and 1.
    """
    classes = loaded_model.classes_ 

    probs = loaded_model.predict_proba([resume_text])[0]

    if job_title in classes:
        idx = list(classes).index(job_title)
        return float(probs[idx])
    
    return 0.0

def simimilarity_score(db: Session, resume_id: int, job_id: int) -> float:
    """
    Calculate similarity score between resume and job title.
    Returns a value between 0 and 1.
    """
    pdf_file_path = db.query(Resume).filter(Resume.id == resume_id).first()
    if not pdf_file_path:
        raise ValueError("Resume file path not found.")
    
    resume_text = extract_text_from_pdf(str(pdf_file_path.storage_path))
    if not resume_text:
        return 0.0
    
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise ValueError("Job not found.")
    job_title = str(job.title)
    
    score = predict_resume_prob(resume_text, job_title)
    return score
