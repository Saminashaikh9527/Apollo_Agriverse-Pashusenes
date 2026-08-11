from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.animal import Animal
from app.models.farm import Farm
from app.models.milk import MilkProduction
from app.schemas.milk import MilkCreate, MilkResponse
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/milk",
    tags=["Milk Production"],
)


@router.get("/", response_model=list[MilkResponse])
def get_milk_records(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    records = (
        db.query(MilkProduction)
        .join(Animal, MilkProduction.animal_id == Animal.animal_id)
        .join(Farm, Animal.farm_id == Farm.farm_id)
        .filter(Farm.user_id == current_user.user_id)
        .all()
    )

    return records


@router.post("/", response_model=MilkResponse)
def create_milk_record(
    data: MilkCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    animal = (
        db.query(Animal)
        .join(Farm, Animal.farm_id == Farm.farm_id)
        .filter(
            Animal.animal_id == data.animal_id,
            Farm.user_id == current_user.user_id,
        )
        .first()
    )

    if animal is None:
        raise HTTPException(
            status_code=404,
            detail="Animal not found or does not belong to your farm",
        )

    total_litres = (
        data.morning_litres +
        data.evening_litres
    )

    record = MilkProduction(
        animal_id=data.animal_id,
        production_date=data.production_date,
        morning_litres=data.morning_litres,
        evening_litres=data.evening_litres,
        total_litres=total_litres,
        created_at=datetime.now(),
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record
