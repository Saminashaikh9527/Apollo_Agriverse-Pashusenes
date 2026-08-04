from pydantic import BaseModel


class UserCreate(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str


class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: str
    phone: str
    role: str

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str