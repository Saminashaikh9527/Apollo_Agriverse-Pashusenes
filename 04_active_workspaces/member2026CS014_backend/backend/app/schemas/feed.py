from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class FeedBase(BaseModel):
    animal_id: int
    feed_date: date
    feed_type: str = Field(min_length=1, max_length=100)
    quantity_kg: float = Field(gt=0)
    cost: Optional[float] = Field(default=None, ge=0)
    notes: Optional[str] = Field(default=None, max_length=500)


class FeedCreate(FeedBase):
    pass


class FeedUpdate(BaseModel):
    animal_id: Optional[int] = None
    feed_date: Optional[date] = None
    feed_type: Optional[str] = Field(default=None, min_length=1, max_length=100)
    quantity_kg: Optional[float] = Field(default=None, gt=0)
    cost: Optional[float] = Field(default=None, ge=0)
    notes: Optional[str] = Field(default=None, max_length=500)


class FeedResponse(FeedBase):
    feed_id: int
    recorded_by_user_id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
