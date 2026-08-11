from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class MilkCreate(BaseModel):
    animal_id: int
    production_date: date
    morning_litres: float = 0
    evening_litres: float = 0


class MilkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    milk_id: int
    animal_id: int
    production_date: date
    morning_litres: float
    evening_litres: float
    total_litres: float
    created_at: datetime