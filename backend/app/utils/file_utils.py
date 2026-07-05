"""File handling utilities."""
import os
import re
import uuid
import zipfile
from pathlib import Path
from typing import Optional, Tuple
from fastapi import UploadFile

from ..config import get_settings

settings = get_settings()
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".zip"}


def get_student_name_from_filename(filename: str) -> str:
    """
    Extract student name from filename.
    Examples: CS101_Aman.pdf -> Aman, Math_John_Doe.pdf -> John Doe
    """
    name = Path(filename).stem
    # Remove common prefixes (subject codes, roll numbers)
    parts = re.split(r"[_\-\s]+", name)
    # Filter out numeric parts and short codes
    name_parts = [p for p in parts if not p.isdigit() and len(p) > 1]
    if name_parts:
        return " ".join(name_parts[:3])  # Max 3 parts for name
    return name.replace("_", " ").replace("-", " ")


def sanitize_filename(filename: str) -> str:
    """Sanitize filename for storage."""
    ext = Path(filename).suffix.lower()
    safe_name = re.sub(r"[^\w\s\-.]", "", Path(filename).stem)[:50]
    return f"{safe_name}_{uuid.uuid4().hex[:8]}{ext}"


def ensure_upload_dir(base_path: str, subdir: str = "") -> Path:
    """Ensure upload directory exists."""
    path = Path(settings.UPLOAD_DIR) / base_path
    if subdir:
        path = path / subdir
    path.mkdir(parents=True, exist_ok=True)
    return path


async def save_upload_file(
    file: UploadFile,
    base_path: str,
    subdir: str = "",
    custom_name: Optional[str] = None
) -> Tuple[str, str]:
    """
    Save uploaded file. Returns (file_path, original_filename).
    """
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS and ext != ".zip":
        raise ValueError(f"File type {ext} not allowed")

    upload_dir = ensure_upload_dir(base_path, subdir)
    filename = custom_name or sanitize_filename(file.filename or "file")
    file_path = upload_dir / filename

    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise ValueError("File too large")

    with open(file_path, "wb") as f:
        f.write(content)

    return str(file_path), file.filename or filename


def extract_zip(zip_path: str, extract_to: str) -> list[str]:
    """Extract ZIP and return list of extracted file paths."""
    extracted = []
    with zipfile.ZipFile(zip_path, "r") as zf:
        for member in zf.namelist():
            if member.startswith("__MACOSX") or member.endswith("/"):
                continue
            ext = Path(member).suffix.lower()
            if ext in {".pdf", ".jpg", ".jpeg", ".png"}:
                zf.extract(member, extract_to)
                extracted.append(str(Path(extract_to) / member))
    return extracted
