
from sqlalchemy import Column, Integer, String, Date, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class Animal(Base):
    __tablename__ = "animals"

    animal_id = Column(Integer, primary_key=True, index=True)

    farm_id = Column(
        Integer,
        ForeignKey("farms.farm_id", ondelete="CASCADE"),
        nullable=False
    )

    tag_number = Column(String(50), unique=True, nullable=False)
    species = Column(String(50), nullable=False)
    breed = Column(String(100))
    gender = Column(String(10))
    birth_date = Column(Date)
    weight = Column(Numeric(6, 2))
    status = Column(String(20), default="Healthy")

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    farm = relationship("Farm", back_populates="animals")