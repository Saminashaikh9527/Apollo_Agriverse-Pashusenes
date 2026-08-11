from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(15), unique=True, nullable=True)
    password_hash = Column(Text, nullable=False)

    role = Column(String(20), default="farmer", server_default="farmer")
    created_at = Column(DateTime, server_default=func.now())

    # Farms owned by this user
    farms = relationship(
        "Farm",
        back_populates="user",
        cascade="all, delete-orphan",
    )
