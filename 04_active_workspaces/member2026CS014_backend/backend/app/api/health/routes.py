from fastapi import APIRouter, Depends, HTTPException, Query, status
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


router = APIRouter(prefix="/health", tags=["Animal Health"])


def _owned_health_record_query(db: Session, user_id: int):
    return (
        db.query(AnimalHealthRecord)
        .join(Animal, AnimalHealthRecord.animal_id == Animal.animal_id)
        .join(Farm, Animal.farm_id == Farm.farm_id)
        .filter(Farm.user_id == user_id)
    )


@router.post("/", response_model=AnimalHealthRecordResponse, status_code=status.HTTP_201_CREATED)
def create_health_record(
    data: AnimalHealthRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found or does not belong to the current user",
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


@router.get("/", response_model=list[AnimalHealthRecordResponse])
def get_health_records(
    animal_id: int | None = Query(default=None),
    record_status: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = _owned_health_record_query(db, current_user.user_id)
    if animal_id is not None:
        query = query.filter(AnimalHealthRecord.animal_id == animal_id)
    if record_status is not None:
        query = query.filter(AnimalHealthRecord.status == record_status)
    return query.order_by(AnimalHealthRecord.record_date.desc()).all()


@router.get("/{health_record_id}", response_model=AnimalHealthRecordResponse)
def get_health_record(
    health_record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    health_record = (
        _owned_health_record_query(db, current_user.user_id)
        .filter(AnimalHealthRecord.health_record_id == health_record_id)
        .first()
    )
    if health_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health record not found",
        )
    return health_record


@router.patch("/{health_record_id}", response_model=AnimalHealthRecordResponse)
def update_health_record(
    health_record_id: int,
    data: AnimalHealthRecordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    health_record = (
        _owned_health_record_query(db, current_user.user_id)
        .filter(AnimalHealthRecord.health_record_id == health_record_id)
        .first()
    )
    if health_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health record not found",
        )

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(health_record, field, value)

    db.commit()
    db.refresh(health_record)
    return health_record
