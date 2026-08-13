from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.animal import Animal
from app.models.feed import FeedRecord
from app.models.farm import Farm
from app.models.user import User
from app.schemas.feed import FeedCreate, FeedResponse, FeedUpdate


router = APIRouter(prefix="/feed", tags=["Feed Management"])


def _owned_animal(db: Session, animal_id: int, user_id: int):
    return (
        db.query(Animal)
        .join(Farm, Animal.farm_id == Farm.farm_id)
        .filter(Animal.animal_id == animal_id, Farm.user_id == user_id)
        .first()
    )


def _owned_feed_query(db: Session, user_id: int):
    return (
        db.query(FeedRecord)
        .join(Animal, FeedRecord.animal_id == Animal.animal_id)
        .join(Farm, Animal.farm_id == Farm.farm_id)
        .filter(Farm.user_id == user_id)
    )


@router.post("/", response_model=FeedResponse, status_code=status.HTTP_201_CREATED)
def create_feed_record(
    data: FeedCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if _owned_animal(db, data.animal_id, current_user.user_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found or does not belong to current user",
        )

    record = FeedRecord(
        **data.model_dump(),
        recorded_by_user_id=current_user.user_id,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/", response_model=list[FeedResponse])
def get_feed_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        _owned_feed_query(db, current_user.user_id)
        .order_by(FeedRecord.feed_date.desc(), FeedRecord.feed_id.desc())
        .all()
    )


@router.get("/{feed_id}", response_model=FeedResponse)
def get_feed_record(
    feed_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        _owned_feed_query(db, current_user.user_id)
        .filter(FeedRecord.feed_id == feed_id)
        .first()
    )
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feed record not found or does not belong to current user",
        )
    return record


def _update_feed_record(
    feed_id: int,
    data: FeedUpdate,
    db: Session,
    current_user: User,
):
    record = (
        _owned_feed_query(db, current_user.user_id)
        .filter(FeedRecord.feed_id == feed_id)
        .first()
    )
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feed record not found or does not belong to current user",
        )

    updates = data.model_dump(exclude_unset=True)
    if "animal_id" in updates and _owned_animal(
        db, updates["animal_id"], current_user.user_id
    ) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal not found or does not belong to current user",
        )

    for field, value in updates.items():
        setattr(record, field, value)
    db.commit()
    db.refresh(record)
    return record


@router.put("/{feed_id}", response_model=FeedResponse)
def replace_feed_record(
    feed_id: int,
    data: FeedUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _update_feed_record(feed_id, data, db, current_user)


@router.patch("/{feed_id}", response_model=FeedResponse)
def update_feed_record(
    feed_id: int,
    data: FeedUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _update_feed_record(feed_id, data, db, current_user)


@router.delete("/{feed_id}")
def delete_feed_record(
    feed_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        _owned_feed_query(db, current_user.user_id)
        .filter(FeedRecord.feed_id == feed_id)
        .first()
    )
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feed record not found or does not belong to current user",
        )
    db.delete(record)
    db.commit()
    return {"message": "Feed record deleted successfully", "feed_id": feed_id}
