"""FastAPI application entry point."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import init_db
from .api.routes import auth, admin, teacher

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    # Cleanup if needed


app = FastAPI(
    title=settings.APP_NAME,
    description="AI-based answer sheet evaluation system",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(teacher.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "AI Answer Sheet Evaluation API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
