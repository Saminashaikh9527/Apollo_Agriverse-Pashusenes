from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.animal import Animal
from app.models.farm import Farm
from app.models.user import User
from app.models.vaccination import VaccinationRecord
from app.schemas.vaccination import (
    VaccinationCreate,
    VaccinationResponse,
    VaccinationUpdate,
)


router = APIRouter(prefix="/vaccination", tags=["Vaccination Management"])


def _owned_animal(db: Session, animal_id: int, user_id: int):
    return (
        db.query(Animal)
        .join(Farm, Animal.farm_id == Farm.farm_id)
        .filter(
            Animal.animal_id == animal_id,
            Farm.user_id == user_id,
        )
        .first()
    )


def _owned_vaccination_query(db: Session, user_id: int):
    return (
        db.query(VaccinationRecord)
        .join(Animal, VaccinationRecord.animal_id == Animal.animal_id)
        .join(Farm, Animal.farm_id == Farm.farm_id)
        .filter(Farm.user_id == user_id)
    )


@router.post("/", response_model=VaccinationResponse, status_code=status.HTTP_201_CREATED)
def create_vaccination_record(
    data: VaccinationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if _owned_animal(db, data.animal_id, current_user.user_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found or does not belong to current user",
        )

    vaccination_record = VaccinationRecord(
        **data.model_dump(),
        administered_by_user_id=current_user.user_id,
    )
    db.add(vaccination_record)
    db.commit()
    db.refresh(vaccination_record)
    return vaccination_record


@router.get("/", response_model=list[VaccinationResponse])
def get_vaccination_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        _owned_vaccination_query(db, current_user.user_id)
        .order_by(
            VaccinationRecord.vaccination_date.desc(),
            VaccinationRecord.vaccination_id.desc(),
        )
        .all()
    )


@router.get("/{vaccination_id}", response_model=VaccinationResponse)
def get_vaccination_record(
    vaccination_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    vaccination_record = (
        _owned_vaccination_query(db, current_user.user_id)
        .filter(VaccinationRecord.vaccination_id == vaccination_id)
        .first()
    )
    if vaccination_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vaccination record not found or does not belong to current user",
        )
    return vaccination_record


@router.patch("/{vaccination_id}", response_model=VaccinationResponse)
def update_vaccination_record(
    vaccination_id: int,
    data: VaccinationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    vaccination_record = (
        _owned_vaccination_query(db, current_user.user_id)
        .filter(VaccinationRecord.vaccination_id == vaccination_id)
        .first()
    )
    if vaccination_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vaccination record not found or does not belong to current user",
        )

    updates = data.model_dump(exclude_unset=True)
    new_animal_id = updates.get("animal_id")
    if new_animal_id is not None and _owned_animal(db, new_animal_id, current_user.user_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found or does not belong to current user",
        )

    vaccination_date = updates.get(
        "vaccination_date",
        vaccination_record.vaccination_date,
    )
    next_due_date = updates.get(
        "next_due_date",
        vaccination_record.next_due_date,
    )
    if next_due_date is not None and next_due_date < vaccination_date:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="next_due_date cannot be before vaccination_date",
        )

    for field, value in updates.items():
        setattr(vaccination_record, field, value)

    db.commit()
    db.refresh(vaccination_record)
    return vaccination_record


@router.delete("/{vaccination_id}")
def delete_vaccination_record(
    vaccination_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    vaccination_record = (
        _owned_vaccination_query(db, current_user.user_id)
        .filter(VaccinationRecord.vaccination_id == vaccination_id)
        .first()
    )
    if vaccination_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vaccination record not found or does not belong to current user",
        )

    db.delete(vaccination_record)
    db.commit()
    return {
        "message": "Vaccination record deleted successfully",
        "vaccination_id": vaccination_id,
    }
