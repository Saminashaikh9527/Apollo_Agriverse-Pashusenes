from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class VaccinationCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    animal_id: int
    vaccine_name: str = Field(min_length=1, max_length=255)
    vaccination_date: date
    next_due_date: date | None = None
    dose: str | None = Field(default=None, min_length=1, max_length=100)
    veterinarian: str | None = Field(default=None, min_length=1, max_length=255)
    status: str = Field(default="Completed", min_length=1, max_length=50)
    notes: str | None = None

    @model_validator(mode="after")
    def validate_due_date(self):
        if (
            self.next_due_date is not None
            and self.next_due_date < self.vaccination_date
        ):
            raise ValueError("next_due_date cannot be before vaccination_date")
        return self


class VaccinationUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    animal_id: int | None = None
    vaccine_name: str | None = Field(default=None, min_length=1, max_length=255)
    vaccination_date: date | None = None
    next_due_date: date | None = None
    dose: str | None = Field(default=None, min_length=1, max_length=100)
    veterinarian: str | None = Field(default=None, min_length=1, max_length=255)
    status: str | None = Field(default=None, min_length=1, max_length=50)
    notes: str | None = None


class VaccinationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    vaccination_id: int
    animal_id: int
    administered_by_user_id: int
    vaccine_name: str
    vaccination_date: date
    next_due_date: date | None = None
    dose: str | None = None
    veterinarian: str | None = None
    status: str
    notes: str | None = None
    created_at: datetime
