from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from .models import RequestCategory, RequestStatus


# ---- Auth ----

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    is_admin: int

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---- Service requests ----

class ServiceRequestCreate(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    description: str = Field(min_length=10, max_length=2000)
    category: RequestCategory
    location: Optional[str] = None


class ServiceRequestUpdate(BaseModel):
    status: RequestStatus


class ServiceRequestOut(BaseModel):
    id: int
    title: str
    description: str
    category: RequestCategory
    status: RequestStatus
    location: Optional[str]
    created_at: datetime
    updated_at: datetime
    owner_id: int

    class Config:
        from_attributes = True
