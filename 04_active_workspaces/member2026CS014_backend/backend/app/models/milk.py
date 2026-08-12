from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database.base import Base


class MilkProduction(Base):
    __tablename__ = "milk_production"

    milk_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    animal_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("animals.animal_id", ondelete="CASCADE"),
        nullable=False,
    )

    production_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    morning_litres: Mapped[float] = mapped_column(
        Float,
        nullable=True,
        default=0,
        server_default="0",
    )

    evening_litres: Mapped[float] = mapped_column(
        Float,
        nullable=True,
        default=0,
        server_default="0",
    )

    total_litres: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    created_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
        server_default=func.now(),
    )

    animal = relationship(
        "Animal",
        back_populates="milk_records",
    )
