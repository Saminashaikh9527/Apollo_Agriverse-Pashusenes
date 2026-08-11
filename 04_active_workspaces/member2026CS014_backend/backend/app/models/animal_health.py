from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database.base import Base


class AnimalHealthRecord(Base):
    __tablename__ = "animal_health_records"

    health_record_id: Mapped[int] = mapped_column(
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
    recorded_by_user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False,
        index=True,
    )
    record_date: Mapped[date] = mapped_column(Date, nullable=False)
    condition_name: Mapped[str] = mapped_column(String(255), nullable=False)
    symptoms: Mapped[str | None] = mapped_column(Text, nullable=True)
    severity: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="open",
        server_default="open",
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    animal = relationship("Animal", back_populates="health_records")
    recorded_by = relationship("User")
