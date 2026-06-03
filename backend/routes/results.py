from fastapi import APIRouter
from pydantic import BaseModel
from database import supabase

router = APIRouter()


class ResultRequest(BaseModel):
    user_id: str
    total_questions: int
    correct_answers: int
    wrong_answers: int
    session_result: int
    improvement_level: int
    difficulty_level: str
    subject: str


@router.post("/")
async def save_result(request: ResultRequest):
    try:
        result = supabase.table("quiz_results").insert(
            {
                "user_id": request.user_id,
                "total_questions": request.total_questions,
                "correct_answers": request.correct_answers,
                "wrong_answers": request.wrong_answers,
                "session_result": request.session_result,
                "improvement_level": request.improvement_level,
                "difficulty_level": request.difficulty_level,
                "subject": request.subject,
            }
        ).execute()

        if not result.data:
            return {"error": "Insert returned no data — check table schema and permissions."}

        record = result.data[0]
        return record
    except Exception as e:
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=500,
            content={"detail": f"Failed to save quiz result: {str(e)}"},
        )


@router.get("/{user_id}")
async def get_results(user_id: str):
    try:
        result = (
            supabase.table("quiz_results")
            .select("*")
            .eq("user_id", user_id)
            .order("completed_at", desc=True)
            .execute()
        )

        return result.data
    except Exception as e:
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=500,
            content={"detail": f"Failed to fetch results: {str(e)}"},
        )
