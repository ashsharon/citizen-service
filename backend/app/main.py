from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine
from .routers import auth_router, requests_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Citizen Service Request Portal",
    description="API for citizens to submit and track service requests (e.g. road damage, "
    "streetlight outages, waste collection) and for staff to triage them.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(requests_router.router)


@app.get("/health", tags=["meta"])
def health_check():
    return {"status": "ok"}
