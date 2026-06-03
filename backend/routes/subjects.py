from fastapi import APIRouter
from pydantic import BaseModel
from database import supabase

router = APIRouter()


class SubjectRequest(BaseModel):
    user_id: str
    subject: str


@router.post("/")
async def save_subject(request: SubjectRequest):
    result = supabase.table("subject_selections").insert(
        {
            "user_id": request.user_id,
            "subject": request.subject,
        }
    ).execute()

    record = result.data[0]
    return record