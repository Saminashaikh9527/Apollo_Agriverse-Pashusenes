from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class MilkCreate(BaseModel):
    animal_id: int
    production_date: date
    morning_litres: float = Field(default=0, ge=0)
    evening_litres: float = Field(default=0, ge=0)


class MilkUpdate(BaseModel):
    animal_id: int | None = None
    production_date: date | None = None
    morning_litres: float | None = Field(default=None, ge=0)
    evening_litres: float | None = Field(default=None, ge=0)


class MilkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    milk_id: int
    animal_id: int
    production_date: date
    morning_litres: float
    evening_litres: float
    total_litres: float
    created_at: datetime