from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class WoolCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    animal_id: int
    shearing_date: date
    wool_weight: float = Field(gt=0)
    wool_quality: str = Field(min_length=1, max_length=100)
    wool_color: str | None = Field(default=None, min_length=1, max_length=100)
    estimated_price: float | None = Field(default=None, ge=0)
    notes: str | None = None


class WoolUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    animal_id: int | None = None
    shearing_date: date | None = None
    wool_weight: float | None = Field(default=None, gt=0)
    wool_quality: str | None = Field(default=None, min_length=1, max_length=100)
    wool_color: str | None = Field(default=None, min_length=1, max_length=100)
    estimated_price: float | None = Field(default=None, ge=0)
    notes: str | None = None


class WoolResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    wool_record_id: int
    animal_id: int
    recorded_by_user_id: int
    shearing_date: date
    wool_weight: float
    wool_quality: str
    wool_color: str | None = None
    estimated_price: float | None = None
    notes: str | None = None
    created_at: datetime
