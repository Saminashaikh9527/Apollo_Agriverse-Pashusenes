from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    full_name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(100),
        unique=True,
        nullable=False
    )

    phone = Column(
        String(15),
        unique=True
    )

    password_hash = Column(
        Text,
        nullable=False
    )

    role = Column(
        String(20),
        default="farmer"
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    # Relationship with Farm
    farms = relationship(
        "Farm",
        back_populates="user",
        cascade="all, delete-orphan"
    )