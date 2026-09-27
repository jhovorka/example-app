import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

from app.database import Base, engine
from app.routers import auth, tasks

app = FastAPI(title="TaskFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)


@app.on_event("startup")
def create_tables():
    # Postgres may still be starting up when this container boots, so retry
    # briefly instead of crashing on the first connection attempt.
    for attempt in range(10):
        try:
            Base.metadata.create_all(bind=engine)
            return
        except OperationalError:
            time.sleep(2)
    raise RuntimeError("Could not connect to the database after 10 attempts")


@app.get("/health")
def health():
    return {"status": "ok"}
