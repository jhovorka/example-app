from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict

from app.models import TaskStatus


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TaskCreate(BaseModel):
    title: str
    description: str = ""
    status: TaskStatus = TaskStatus.todo


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None


class TaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    status: TaskStatus
    created_at: datetime
    updated_at: datetime
