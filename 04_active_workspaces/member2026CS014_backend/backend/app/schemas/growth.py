from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class GrowthBase(BaseModel):
    animal_id: int
    measurement_date: date
    weight_kg: float = Field(gt=0)
    height_cm: float | None = Field(default=None, gt=0)
    body_condition_score: float | None = Field(
        default=None,
        ge=0,
    )
    notes: str | None = Field(
        default=None,
        max_length=500,
    )


class GrowthCreate(GrowthBase):
    pass


class GrowthUpdate(BaseModel):
    animal_id: int | None = None
    measurement_date: date | None = None
    weight_kg: float | None = Field(default=None, gt=0)
    height_cm: float | None = Field(default=None, gt=0)
    body_condition_score: float | None = Field(
        default=None,
        ge=0,
    )
    notes: str | None = Field(
        default=None,
        max_length=500,
    )


class GrowthResponse(GrowthBase):
    growth_id: int
    recorded_by_user_id: int
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)