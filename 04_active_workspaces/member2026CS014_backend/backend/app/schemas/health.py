from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


Severity = Literal["mild", "moderate", "severe", "critical"]


class AnimalHealthRecordCreate(BaseModel):
    animal_id: int
    record_date: date
    condition_name: str = Field(min_length=1, max_length=255)
    symptoms: str | None = None
    severity: Severity
    status: str = Field(default="open", min_length=1, max_length=50)
    notes: str | None = None


class AnimalHealthRecordUpdate(BaseModel):
    record_date: date | None = None
    condition_name: str | None = Field(default=None, min_length=1, max_length=255)
    symptoms: str | None = None
    severity: Severity | None = None
    status: str | None = Field(default=None, min_length=1, max_length=50)
    notes: str | None = None


class AnimalHealthRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    health_record_id: int
    animal_id: int
    recorded_by_user_id: int
    record_date: date
    condition_name: str
    symptoms: str | None = None
    severity: Severity
    status: str
    notes: str | None = None
    created_at: datetime
