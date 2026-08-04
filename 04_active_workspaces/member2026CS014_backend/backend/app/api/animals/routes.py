from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database.connection import get_db
from app.models.animal import Animal
from app.schemas.animal import AnimalCreate, AnimalResponse


router = APIRouter(
    prefix="/animals",
    tags=["Animals"]
)


@router.post("/", response_model=AnimalResponse)
def create_animal(
    animal: AnimalCreate,
    db: Session = Depends(get_db)
):

    new_animal = Animal(
        **animal.model_dump()
    )

    try:
        db.add(new_animal)
        db.commit()
        db.refresh(new_animal)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=f"Animal with tag number {animal.tag_number} already exists"
        )

    return new_animal


@router.get("/", response_model=list[AnimalResponse])
def get_animals(
    db: Session = Depends(get_db)
):

    animals = db.query(Animal).all()

    return animals