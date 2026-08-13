from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.animal import Animal
from app.models.egg import EggProduction
from app.models.farm import Farm
from app.models.user import User
from app.schemas.egg import EggCreate, EggResponse, EggUpdate


router = APIRouter(
    prefix="/egg",
    tags=["Egg Production"],
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
# GET USER'S EGG RECORDS
# ============================================================

def _owned_egg_query(
    db: Session,
    user_id: int,
):
    return (
        db.query(EggProduction)
        .join(
            Animal,
            EggProduction.animal_id == Animal.animal_id,
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
# CREATE EGG RECORD
# ============================================================

@router.post(
    "/",
    response_model=EggResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_egg_record(
    data: EggCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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

    if data.broken_eggs > data.egg_count:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Broken eggs cannot be greater than total egg count",
        )

    egg_record = EggProduction(
        animal_id=data.animal_id,
        production_date=data.production_date,
        egg_count=data.egg_count,
        broken_eggs=data.broken_eggs,
        average_weight_grams=data.average_weight_grams,
    )

    db.add(egg_record)
    db.commit()
    db.refresh(egg_record)

    return egg_record


# ============================================================
# GET ALL EGG RECORDS
# ============================================================

@router.get(
    "/",
    response_model=list[EggResponse],
)
def get_egg_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        _owned_egg_query(
            db,
            current_user.user_id,
        )
        .order_by(
            EggProduction.production_date.desc(),
            EggProduction.egg_id.desc(),
        )
        .all()
    )


# ============================================================
# GET SINGLE EGG RECORD
# ============================================================

@router.get(
    "/{egg_id}",
    response_model=EggResponse,
)
def get_egg_record(
    egg_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    egg_record = (
        _owned_egg_query(
            db,
            current_user.user_id,
        )
        .filter(
            EggProduction.egg_id == egg_id
        )
        .first()
    )

    if egg_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Egg record not found or does not belong to current user",
        )

    return egg_record


# ============================================================
# UPDATE EGG RECORD
# ============================================================

@router.put(
    "/{egg_id}",
    response_model=EggResponse,
)
def update_egg_record(
    egg_id: int,
    data: EggUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    egg_record = (
        _owned_egg_query(
            db,
            current_user.user_id,
        )
        .filter(
            EggProduction.egg_id == egg_id
        )
        .first()
    )

    if egg_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Egg record not found or does not belong to current user",
        )

    updates = data.model_dump(
        exclude_unset=True
    )

    # --------------------------------------------------------
    # Check new animal ownership
    # --------------------------------------------------------

    new_animal_id = updates.get("animal_id")

    if new_animal_id is not None:
        animal = _owned_animal(
            db,
            new_animal_id,
            current_user.user_id,
        )

        if animal is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Animal not found or does not belong to current user",
            )

    # --------------------------------------------------------
    # Validate egg counts
    # --------------------------------------------------------

    new_egg_count = updates.get(
        "egg_count",
        egg_record.egg_count,
    )

    new_broken_eggs = updates.get(
        "broken_eggs",
        egg_record.broken_eggs,
    )

    if new_broken_eggs > new_egg_count:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Broken eggs cannot be greater than total egg count",
        )

    # --------------------------------------------------------
    # Update fields
    # --------------------------------------------------------

    for field, value in updates.items():
        setattr(
            egg_record,
            field,
            value,
        )

    db.commit()
    db.refresh(egg_record)

    return egg_record


# ============================================================
# DELETE EGG RECORD
# ============================================================

@router.delete(
    "/{egg_id}"
)
def delete_egg_record(
    egg_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    egg_record = (
        _owned_egg_query(
            db,
            current_user.user_id,
        )
        .filter(
            EggProduction.egg_id == egg_id
        )
        .first()
    )

    if egg_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Egg record not found or does not belong to current user",
        )

    db.delete(egg_record)
    db.commit()

    return {
        "message": "Egg record deleted successfully",
        "egg_id": egg_id,
    }