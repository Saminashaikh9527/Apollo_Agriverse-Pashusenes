from sqlalchemy import (
    Column,
    Integer,
    Float,
    Date,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class EggProduction(Base):
    __tablename__ = "egg_production"

    # ============================================================
    # PRIMARY KEY
    # ============================================================

    egg_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # ============================================================
    # ANIMAL
    # ============================================================

    animal_id = Column(
        Integer,
        ForeignKey(
            "animals.animal_id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    # ============================================================
    # PRODUCTION INFORMATION
    # ============================================================

    production_date = Column(
        Date,
        nullable=False
    )

    egg_count = Column(
        Integer,
        nullable=False,
        default=0
    )

    broken_eggs = Column(
        Integer,
        nullable=False,
        default=0
    )

    average_weight_grams = Column(
        Float,
        nullable=True
    )

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp()
    )

    # ============================================================
    # RELATIONSHIP
    # ============================================================

    animal = relationship(
        "Animal",
        back_populates="egg_records"
    )