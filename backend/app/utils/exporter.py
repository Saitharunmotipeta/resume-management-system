from openpyxl import Workbook
from app.models.resume import Resume
from typing import List
import datetime

def export_shortlisted_resumes(resumes: List[Resume], file_path: str = "shortlisted_resumes.xlsx") -> str:
    wb = Workbook()
    ws = wb.active
    ws.title = "Shortlisted Candidates"

    # Header row
    headers = ["Candidate Name", "Email", "Phone", "Job ID", "Score", "Summary", "Matched Points", "Flags", "Uploaded At"]
    ws.append(headers)

    for resume in resumes:
        try:
            row = [
                resume.uploaded_by,
                resume.email,
                resume.phone,
                resume.job_id,
                resume.match_score,
                resume.match_summary,
                ", ".join(resume.match_points) if isinstance(resume.match_points, list) else str(resume.match_points),
                ", ".join(resume.match_flags) if isinstance(resume.match_flags, list) else str(resume.match_flags),
                resume.created_at.strftime("%Y-%m-%d %H:%M:%S") if resume.created_at else "",
            ]
            ws.append(row)
        except Exception as e:
            print(f"❌ Failed to write resume row: {e}")

    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    output_path = file_path.replace(".xlsx", f"_{timestamp}.xlsx")
    wb.save(output_path)
    return output_path
