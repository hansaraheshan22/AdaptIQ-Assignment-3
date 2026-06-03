from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, subjects, results

app = FastAPI()

# CORS middleware
origins = [
    "http://localhost:5173",
    "https://adaptiq-a3.vercel.app",  # Update with your actual Vercel URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(subjects.router, prefix="/subjects", tags=["subjects"])
app.include_router(results.router, prefix="/results", tags=["results"])


@app.get("/")
async def root():
    return {"message": "AdaptIQ API running"}