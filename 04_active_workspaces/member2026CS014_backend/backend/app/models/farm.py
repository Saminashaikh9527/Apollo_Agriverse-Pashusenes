from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database.base import Base


class Farm(Base):
    __tablename__ = "farms"

    farm_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False,
    )

    farm_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    village: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    district: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    state: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    total_land: Mapped[float | None] = mapped_column(
        Numeric(8, 2),
        nullable=True,
    )

    created_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
        server_default=func.now(),
    )

    user = relationship(
        "User",
        back_populates="farms",
    )

    animals = relationship(
        "Animal",
        back_populates="farm",
        cascade="all, delete-orphan",
    )
