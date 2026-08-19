from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database.base import Base


class GrowthRecord(Base):
    __tablename__ = "growth_records"

    growth_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    animal_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("animals.animal_id", ondelete="CASCADE"),
        nullable=False,
    )

    recorded_by_user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False,
    )

    measurement_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    weight_kg: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    height_cm: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    body_condition_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    created_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    animal = relationship(
        "Animal",
        back_populates="growth_records",
    )

    recorded_by = relationship(
        "User",
    )