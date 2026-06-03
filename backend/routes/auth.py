from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import bcrypt
from database import supabase

router = APIRouter()


class SignUpRequest(BaseModel):
    full_name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/signup")
async def signup(request: SignUpRequest):
    # Validate email ends with .edu.au
    if not request.email.endswith(".edu.au"):
        raise HTTPException(
            status_code=400,
            detail="Please use your university email address (.edu.au)",
        )

    # Check if user already exists
    existing = supabase.table("users").select("*").eq("email", request.email).execute()
    if existing.data:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists. Please log in instead.",
        )

    # Hash password
    hashed_password = bcrypt.hashpw(
        request.password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    # Insert user into Supabase
    result = supabase.table("users").insert(
        {
            "full_name": request.full_name,
            "email": request.email,
            "password_hash": hashed_password,
        }
    ).execute()

    user = result.data[0]
    return {
        "id": user["id"],
        "full_name": user["full_name"],
        "email": user["email"],
        "created_at": user["created_at"],
    }


@router.post("/login")
async def login(request: LoginRequest):
    # Fetch user by email
    result = supabase.table("users").select("*").eq("email", request.email).execute()

    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user = result.data[0]

    # Verify password
    if not bcrypt.checkpw(
        request.password.encode("utf-8"), user["password_hash"].encode("utf-8")
    ):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "id": user["id"],
        "full_name": user["full_name"],
        "email": user["email"],
    }