from pydantic import BaseModel


class UserCreate(BaseModel):
    full_name: str
    email: str
    phone: str | None = None
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str
