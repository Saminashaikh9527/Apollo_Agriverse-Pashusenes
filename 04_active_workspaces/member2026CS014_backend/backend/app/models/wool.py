from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database.base import Base


class WoolRecord(Base):
    __tablename__ = "wool_records"

    wool_record_id: Mapped[int] = mapped_column(
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
    shearing_date: Mapped[date] = mapped_column(Date, nullable=False)
    wool_weight: Mapped[float] = mapped_column(Numeric(8, 2), nullable=False)
    wool_quality: Mapped[str] = mapped_column(String(100), nullable=False)
    wool_color: Mapped[str | None] = mapped_column(String(100), nullable=True)
    estimated_price: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    animal = relationship("Animal", back_populates="wool_records")
    recorded_by = relationship("User")
