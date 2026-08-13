from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.animal import Animal
from app.models.farm import Farm
from app.models.milk import MilkProduction
from app.models.user import User
from app.schemas.milk import MilkCreate, MilkResponse, MilkUpdate


router = APIRouter(
    prefix="/milk",
    tags=["Milk Production"],
)


# ============================================================
# CHECK ANIMAL OWNERSHIP
# ============================================================

def _owned_animal(
    db: Session,
    animal_id: int,
    user_id: int,
):
    return (
        db.query(Animal)
        .join(Farm, Animal.farm_id == Farm.farm_id)
        .filter(
            Animal.animal_id == animal_id,
            Farm.user_id == user_id,
        )
        .first()
    )


# ============================================================
# GET USER'S MILK RECORDS
# ============================================================

def _owned_milk_query(
    db: Session,
    user_id: int,
):
    return (
        db.query(MilkProduction)
        .join(
            Animal,
            MilkProduction.animal_id == Animal.animal_id,
        )
        .join(
            Farm,
            Animal.farm_id == Farm.farm_id,
        )
        .filter(
            Farm.user_id == user_id
        )
    )


# ============================================================
# CREATE MILK RECORD
# ============================================================

@router.post(
    "/",
    response_model=MilkResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_milk_record(
    data: MilkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check animal belongs to current user
    animal = _owned_animal(
        db,
        data.animal_id,
        current_user.user_id,
    )

    if animal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found or does not belong to current user",
        )

    # Calculate total milk
    total_litres = (
        data.morning_litres +
        data.evening_litres
    )

    milk_record = MilkProduction(
        animal_id=data.animal_id,
        production_date=data.production_date,
        morning_litres=data.morning_litres,
        evening_litres=data.evening_litres,
        total_litres=total_litres,
        created_at=datetime.now(),
    )

    db.add(milk_record)
    db.commit()
    db.refresh(milk_record)

    return milk_record


# ============================================================
# GET ALL MILK RECORDS
# ============================================================

@router.get(
    "/",
    response_model=list[MilkResponse],
)
def get_milk_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        _owned_milk_query(
            db,
            current_user.user_id,
        )
        .order_by(
            MilkProduction.production_date.desc(),
            MilkProduction.milk_id.desc(),
        )
        .all()
    )


# ============================================================
# GET ONE MILK RECORD
# ============================================================

@router.get(
    "/{milk_id}",
    response_model=MilkResponse,
)
def get_milk_record(
    milk_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    milk_record = (
        _owned_milk_query(
            db,
            current_user.user_id,
        )
        .filter(
            MilkProduction.milk_id == milk_id
        )
        .first()
    )

    if milk_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Milk record not found or does not belong to current user",
        )

    return milk_record


# ============================================================
# UPDATE MILK RECORD
# ============================================================

@router.put(
    "/{milk_id}",
    response_model=MilkResponse,
)
def update_milk_record(
    milk_id: int,
    data: MilkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Find existing record
    milk_record = (
        _owned_milk_query(
            db,
            current_user.user_id,
        )
        .filter(
            MilkProduction.milk_id == milk_id
        )
        .first()
    )

    if milk_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Milk record not found or does not belong to current user",
        )

    # Get submitted updates
    updates = data.model_dump(
        exclude_unset=True
    )

    # --------------------------------------------------------
    # If animal_id is changed, check ownership
    # --------------------------------------------------------

    if "animal_id" in updates:

        animal = _owned_animal(
            db,
            updates["animal_id"],
            current_user.user_id,
        )

        if animal is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Animal not found or does not belong to current user",
            )

    # --------------------------------------------------------
    # Apply updates
    # --------------------------------------------------------

    for field, value in updates.items():

        if field != "total_litres":
            setattr(
                milk_record,
                field,
                value,
            )

    # --------------------------------------------------------
    # Recalculate total milk
    # --------------------------------------------------------

    milk_record.total_litres = (
        milk_record.morning_litres +
        milk_record.evening_litres
    )

    db.commit()
    db.refresh(milk_record)

    return milk_record


# ============================================================
# DELETE MILK RECORD
# ============================================================

@router.delete(
    "/{milk_id}"
)
def delete_milk_record(
    milk_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    milk_record = (
        _owned_milk_query(
            db,
            current_user.user_id,
        )
        .filter(
            MilkProduction.milk_id == milk_id
        )
        .first()
    )

    if milk_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Milk record not found or does not belong to current user",
        )

    db.delete(milk_record)
    db.commit()

    return {
        "message": "Milk record deleted successfully",
        "milk_id": milk_id,
    }