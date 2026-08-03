from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class AnimalCreate(BaseModel):
    farm_id: int
    tag_number: str
    species: str
    breed: Optional[str] = None
    gender: Optional[str] = None
    birth_date: Optional[date] = None
    weight: Optional[float] = None
    status: Optional[str] = "Healthy"


class AnimalResponse(AnimalCreate):
    animal_id: int
    created_at: datetime

    class Config:
        from_attributes = True