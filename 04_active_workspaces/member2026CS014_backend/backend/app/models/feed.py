from sqlalchemy import Column, Integer, Float, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func

from sqlalchemy.orm import relationship

from app.database.base import Base


class FeedRecord(Base):
    __tablename__ = "feed_records"

    feed_id = Column(Integer, primary_key=True, index=True)

    animal_id = Column(
        Integer,
        ForeignKey("animals.animal_id"),
        nullable=False,
        index=True
    )

    recorded_by_user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False,
        index=True,
    )

    feed_date = Column(Date, nullable=False)

    feed_type = Column(String(100), nullable=False)

    quantity_kg = Column(Float, nullable=False)

    cost = Column(Float, nullable=True)

    notes = Column(String(500), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    animal = relationship(
        "Animal",
        back_populates="feed_records",
    )

    recorded_by = relationship("User")
