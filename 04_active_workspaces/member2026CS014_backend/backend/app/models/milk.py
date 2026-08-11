from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

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
        nullable=False,
        default=0,
        server_default="0",
    )

    evening_litres: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0,
        server_default="0",
    )

    total_litres: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    animal = relationship(
        "Animal",
        back_populates="milk_records",
    )