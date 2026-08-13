from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class EggCreate(BaseModel):
    animal_id: int
    production_date: date

    egg_count: int = Field(
        ge=0,
        default=0,
    )

    broken_eggs: int = Field(
        ge=0,
        default=0,
    )

    average_weight_grams: float | None = Field(
        default=None,
        ge=0,
    )


class EggUpdate(BaseModel):
    animal_id: int | None = None
    production_date: date | None = None

    egg_count: int | None = Field(
        default=None,
        ge=0,
    )

    broken_eggs: int | None = Field(
        default=None,
        ge=0,
    )

    average_weight_grams: float | None = Field(
        default=None,
        ge=0,
    )


class EggResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    egg_id: int
    animal_id: int
    production_date: date
    egg_count: int
    broken_eggs: int
    average_weight_grams: float | None
    created_at: datetime