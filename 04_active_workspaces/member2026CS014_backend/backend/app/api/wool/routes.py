from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.animal import Animal
from app.models.farm import Farm
from app.models.user import User
from app.models.wool import WoolRecord
from app.schemas.wool import WoolCreate, WoolResponse, WoolUpdate


router = APIRouter(prefix="/wool", tags=["Wool Management"])


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


def _owned_wool_record_query(db: Session, user_id: int):
    return (
        db.query(WoolRecord)
        .join(Animal, WoolRecord.animal_id == Animal.animal_id)
        .join(Farm, Animal.farm_id == Farm.farm_id)
        .filter(Farm.user_id == user_id)
    )


@router.post("/", response_model=WoolResponse, status_code=status.HTTP_201_CREATED)
def create_wool_record(
    data: WoolCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if _owned_animal(db, data.animal_id, current_user.user_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found or does not belong to current user",
        )

    wool_record = WoolRecord(
        **data.model_dump(),
        recorded_by_user_id=current_user.user_id,
    )
    db.add(wool_record)
    db.commit()
    db.refresh(wool_record)
    return wool_record


@router.get("/", response_model=list[WoolResponse])
def get_wool_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        _owned_wool_record_query(db, current_user.user_id)
        .order_by(WoolRecord.shearing_date.desc(), WoolRecord.wool_record_id.desc())
        .all()
    )


@router.get("/{wool_record_id}", response_model=WoolResponse)
def get_wool_record(
    wool_record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wool_record = (
        _owned_wool_record_query(db, current_user.user_id)
        .filter(WoolRecord.wool_record_id == wool_record_id)
        .first()
    )
    if wool_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wool record not found or does not belong to current user",
        )
    return wool_record


@router.patch("/{wool_record_id}", response_model=WoolResponse)
def update_wool_record(
    wool_record_id: int,
    data: WoolUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wool_record = (
        _owned_wool_record_query(db, current_user.user_id)
        .filter(WoolRecord.wool_record_id == wool_record_id)
        .first()
    )
    if wool_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wool record not found or does not belong to current user",
        )

    updates = data.model_dump(exclude_unset=True)
    new_animal_id = updates.get("animal_id")
    if new_animal_id is not None and _owned_animal(db, new_animal_id, current_user.user_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found or does not belong to current user",
        )

    for field, value in updates.items():
        setattr(wool_record, field, value)

    db.commit()
    db.refresh(wool_record)
    return wool_record


@router.delete("/{wool_record_id}")
def delete_wool_record(
    wool_record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wool_record = (
        _owned_wool_record_query(db, current_user.user_id)
        .filter(WoolRecord.wool_record_id == wool_record_id)
        .first()
    )
    if wool_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wool record not found or does not belong to current user",
        )

    db.delete(wool_record)
    db.commit()
    return {
        "message": "Wool record deleted successfully",
        "wool_record_id": wool_record_id,
    }
