from datetime import date, datetime
from pydantic import BaseModel


class AnimalCreate(BaseModel):
    farm_id: int
    tag_number: str
    species: str
    breed: str
    gender: str
    birth_date: date
    weight: float
    status: str


class AnimalResponse(BaseModel):
    animal_id: int
    farm_id: int
    tag_number: str
    species: str
    breed: str
    gender: str
    birth_date: date
    weight: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True