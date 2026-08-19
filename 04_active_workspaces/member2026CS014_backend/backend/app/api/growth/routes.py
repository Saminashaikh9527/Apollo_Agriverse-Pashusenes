from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.animal import Animal
from app.models.farm import Farm
from app.models.growth import GrowthRecord
from app.models.user import User
from app.schemas.growth import (
    GrowthCreate,
    GrowthResponse,
    GrowthUpdate,
)


# ============================================================
# GROWTH ROUTER
# ============================================================

router = APIRouter(
    prefix="/growth",
)


# ============================================================
# HELPER: CHECK ANIMAL OWNERSHIP
# ============================================================

def _owned_animal(
    db: Session,
    animal_id: int,
    user_id: int,
):
    return (
        db.query(Animal)
        .join(
            Farm,
            Animal.farm_id == Farm.farm_id,
        )
        .filter(
            Animal.animal_id == animal_id,
            Farm.user_id == user_id,
        )
        .first()
    )


# ============================================================
# HELPER: GET ONLY CURRENT USER'S GROWTH RECORDS
# ============================================================

def _owned_growth_query(
    db: Session,
    user_id: int,
):
    return (
        db.query(GrowthRecord)
        .join(
            Animal,
            GrowthRecord.animal_id == Animal.animal_id,
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
# CREATE GROWTH RECORD
# POST /api/growth/
# ============================================================

@router.post(
    "/",
    response_model=GrowthResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_growth_record(
    data: GrowthCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check that the animal belongs to the current user
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

    # Create growth record
    record = GrowthRecord(
        **data.model_dump(),
        recorded_by_user_id=current_user.user_id,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


# ============================================================
# GET ALL GROWTH RECORDS
# GET /api/growth/
# ============================================================

@router.get(
    "/",
    response_model=list[GrowthResponse],
)
def get_growth_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        _owned_growth_query(
            db,
            current_user.user_id,
        )
        .order_by(
            GrowthRecord.measurement_date.desc(),
            GrowthRecord.growth_id.desc(),
        )
        .all()
    )


# ============================================================
# GET ONE GROWTH RECORD
# GET /api/growth/{growth_id}
# ============================================================

@router.get(
    "/{growth_id}",
    response_model=GrowthResponse,
)
def get_growth_record(
    growth_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        _owned_growth_query(
            db,
            current_user.user_id,
        )
        .filter(
            GrowthRecord.growth_id == growth_id
        )
        .first()
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Growth record not found or does not belong to current user",
        )

    return record


# ============================================================
# HELPER: UPDATE GROWTH RECORD
# ============================================================

def _update_growth_record(
    growth_id: int,
    data: GrowthUpdate,
    db: Session,
    current_user: User,
):
    # Find record belonging to current user's farm
    record = (
        _owned_growth_query(
            db,
            current_user.user_id,
        )
        .filter(
            GrowthRecord.growth_id == growth_id
        )
        .first()
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Growth record not found or does not belong to current user",
        )

    # Get only fields sent by the user
    updates = data.model_dump(
        exclude_unset=True
    )

    # If animal_id is being changed,
    # make sure the new animal belongs to the current user
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

    # Apply updates
    for field, value in updates.items():
        setattr(
            record,
            field,
            value,
        )

    db.commit()
    db.refresh(record)

    return record


# ============================================================
# REPLACE GROWTH RECORD
# PUT /api/growth/{growth_id}
# ============================================================

@router.put(
    "/{growth_id}",
    response_model=GrowthResponse,
)
def replace_growth_record(
    growth_id: int,
    data: GrowthUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _update_growth_record(
        growth_id,
        data,
        db,
        current_user,
    )


# ============================================================
# PARTIAL UPDATE GROWTH RECORD
# PATCH /api/growth/{growth_id}
# ============================================================

@router.patch(
    "/{growth_id}",
    response_model=GrowthResponse,
)
def update_growth_record(
    growth_id: int,
    data: GrowthUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _update_growth_record(
        growth_id,
        data,
        db,
        current_user,
    )


# ============================================================
# DELETE GROWTH RECORD
# DELETE /api/growth/{growth_id}
# ============================================================

@router.delete(
    "/{growth_id}"
)
def delete_growth_record(
    growth_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Find record belonging to current user's farm
    record = (
        _owned_growth_query(
            db,
            current_user.user_id,
        )
        .filter(
            GrowthRecord.growth_id == growth_id
        )
        .first()
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Growth record not found or does not belong to current user",
        )

    db.delete(record)
    db.commit()

    return {
        "message": "Growth record deleted successfully",
        "growth_id": growth_id,
    }