from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database.base import Base


class Animal(Base):
    __tablename__ = "animals"

    animal_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    farm_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("farms.farm_id", ondelete="CASCADE"),
        nullable=False,
    )

    tag_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    species: Mapped[str] = mapped_column(String(50), nullable=False)
    breed: Mapped[str | None] = mapped_column(String(100), nullable=True)
    gender: Mapped[str | None] = mapped_column(String(10), nullable=True)
    birth_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    weight: Mapped[float | None] = mapped_column(Numeric(6, 2), nullable=True)
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="Healthy",
        server_default="Healthy",
    )
    created_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
        server_default=func.now(),
    )

    # Relationship with Farm
    farm = relationship(
        "Farm",
        back_populates="animals",
    )

    # Relationship with Animal Health
    health_records = relationship(
        "AnimalHealthRecord",
        back_populates="animal",
        cascade="all, delete-orphan",
    )

    # Relationship with Milk Production
    milk_records = relationship(
        "MilkProduction",
        back_populates="animal",
        cascade="all, delete-orphan",
    )

    # Relationship with Wool Production
    wool_records = relationship(
        "WoolRecord",
        back_populates="animal",
        cascade="all, delete-orphan",
    )

    # Relationship with Vaccination
    vaccination_records = relationship(
        "VaccinationRecord",
        back_populates="animal",
        cascade="all, delete-orphan",
    )

    # Relationship with Feed
    feed_records = relationship(
        "FeedRecord",
        back_populates="animal",
        cascade="all, delete-orphan",
    )

    # Relationship with Egg Production
    egg_records = relationship(
        "EggProduction",
        back_populates="animal",
        cascade="all, delete-orphan",
    )

    growth_records = relationship(
       "GrowthRecord",
        back_populates="animal",
        cascade="all, delete-orphan",
   )
