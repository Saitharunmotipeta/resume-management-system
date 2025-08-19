from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    admin = "admin"
    hr = "hr"
    manager = "manager"
    student = "student"


# ✅ For registering a new user
class UserCreate(BaseModel):
    username: constr(min_length=3) # type: ignore
    password: constr(min_length=6) # type: ignore
    email: EmailStr
    phone: Optional[str] = None
    role: UserRole


# ✅ For login
class UserLogin(BaseModel):
    username: str
    password: str


# ✅ For returning user info in response
class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: UserRole

    class Config:
        orm_mode = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
