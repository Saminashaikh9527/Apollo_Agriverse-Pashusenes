from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class AnimalCreate(BaseModel):
    farm_id: int
    tag_number: str
    species: str
    breed: str | None = None
    gender: str | None = None
    birth_date: date | None = None
    weight: float | None = None
    status: str = "Healthy"


class AnimalResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    animal_id: int
    farm_id: int
    tag_number: str
    species: str
    breed: str | None = None
    gender: str | None = None
    birth_date: date | None = None
    weight: float | None = None
    status: str
    created_at: datetime