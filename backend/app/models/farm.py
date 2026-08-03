from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class Farm(Base):
    
    __tablename__ = "farms"

    farm_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False
    )

    farm_name = Column(
        String(100),
        nullable=False
    )

    village = Column(
        String(100)
    )

    district = Column(
        String(100)
    )

    state = Column(
        String(100)
    )

    total_land = Column(
        Numeric(8, 2)
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    # Relationship with User
    user = relationship(
        "User",
        back_populates="farms"
    )

    # Relationship with Animals
    animals = relationship(
        "Animal",
        back_populates="farm",
        cascade="all, delete-orphan"
    )