from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database.base import Base


class VaccinationRecord(Base):
    __tablename__ = "vaccination_records"

    vaccination_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )
    animal_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("animals.animal_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    administered_by_user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False,
        index=True,
    )
    vaccine_name: Mapped[str] = mapped_column(String(255), nullable=False)
    vaccination_date: Mapped[date] = mapped_column(Date, nullable=False)
    next_due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    dose: Mapped[str | None] = mapped_column(String(100), nullable=True)
    veterinarian: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Completed",
        server_default="Completed",
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    animal = relationship("Animal", back_populates="vaccination_records")
    administered_by = relationship("User")
