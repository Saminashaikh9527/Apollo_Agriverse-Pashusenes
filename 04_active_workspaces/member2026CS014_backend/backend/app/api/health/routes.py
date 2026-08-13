from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.animal import Animal
from app.models.animal_health import AnimalHealthRecord
from app.models.farm import Farm
from app.models.user import User
from app.schemas.health import (
    AnimalHealthRecordCreate,
    AnimalHealthRecordResponse,
    AnimalHealthRecordUpdate,
)


router = APIRouter(
    prefix="/health",
    tags=["Animal Health"],
)


# ============================================================
# HELPER - CHECK ANIMAL OWNERSHIP
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
# HELPER - HEALTH RECORDS BELONGING TO USER
# ============================================================

def _owned_health_query(
    db: Session,
    user_id: int,
):
    return (
        db.query(AnimalHealthRecord)
        .join(
            Animal,
            AnimalHealthRecord.animal_id == Animal.animal_id,
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
# CREATE HEALTH RECORD
# ============================================================

@router.post(
    "/",
    response_model=AnimalHealthRecordResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_health_record(
    data: AnimalHealthRecordCreate,
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

    health_record = AnimalHealthRecord(
        animal_id=data.animal_id,
        recorded_by_user_id=current_user.user_id,
        record_date=data.record_date,
        condition_name=data.condition_name,
        symptoms=data.symptoms,
        severity=data.severity,
        status=data.status,
        notes=data.notes,
    )

    db.add(health_record)
    db.commit()
    db.refresh(health_record)

    return health_record


# ============================================================
# GET ALL HEALTH RECORDS
# ============================================================

@router.get(
    "/",
    response_model=list[AnimalHealthRecordResponse],
)
def get_health_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        _owned_health_query(db, current_user.user_id)
        .order_by(
            AnimalHealthRecord.record_date.desc(),
            AnimalHealthRecord.health_record_id.desc(),
        )
        .all()
    )


# ============================================================
# GET SINGLE HEALTH RECORD
# ============================================================

@router.get(
    "/{health_record_id}",
    response_model=AnimalHealthRecordResponse,
)
def get_health_record(
    health_record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    health_record = (
        _owned_health_query(db, current_user.user_id)
        .filter(
            AnimalHealthRecord.health_record_id
            == health_record_id
        )
        .first()
    )

    if health_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health record not found or does not belong to current user",
        )

    return health_record


# ============================================================
# UPDATE HEALTH RECORD
# ============================================================

@router.patch(
    "/{health_record_id}",
    response_model=AnimalHealthRecordResponse,
)
def update_health_record(
    health_record_id: int,
    data: AnimalHealthRecordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    health_record = (
        _owned_health_query(db, current_user.user_id)
        .filter(
            AnimalHealthRecord.health_record_id
            == health_record_id
        )
        .first()
    )

    if health_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health record not found or does not belong to current user",
        )

    updates = data.model_dump(
        exclude_unset=True
    )

    for field, value in updates.items():
        setattr(health_record, field, value)

    db.commit()
    db.refresh(health_record)

    return health_record


# ============================================================
# DELETE HEALTH RECORD
# ============================================================

@router.delete("/{health_record_id}")
def delete_health_record(
    health_record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    health_record = (
        _owned_health_query(db, current_user.user_id)
        .filter(
            AnimalHealthRecord.health_record_id
            == health_record_id
        )
        .first()
    )

    if health_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health record not found or does not belong to current user",
        )

    db.delete(health_record)
    db.commit()

    return {
        "message": "Health record deleted successfully",
        "health_record_id": health_record_id,
    }