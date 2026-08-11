from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.animal import Animal
from app.models.farm import Farm
from app.schemas.animal import AnimalCreate, AnimalResponse


router = APIRouter(
    prefix="/animals",
    tags=["Animals"],
)


@router.get("/", response_model=list[AnimalResponse])
def get_animals(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    animals = (
        db.query(Animal)
        .join(Farm, Animal.farm_id == Farm.farm_id)
        .filter(Farm.user_id == current_user.user_id)
        .all()
    )

    return animals


@router.post("/", response_model=AnimalResponse)
def create_animal(
    data: AnimalCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    farm = (
        db.query(Farm)
        .filter(
            Farm.farm_id == data.farm_id,
            Farm.user_id == current_user.user_id,
        )
        .first()
    )

    if farm is None:
        raise HTTPException(
            status_code=404,
            detail="Farm not found or does not belong to current user",
        )

    existing = (
        db.query(Animal)
        .filter(Animal.tag_number == data.tag_number)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Animal tag number already exists",
        )

    animal = Animal(
        farm_id=data.farm_id,
        tag_number=data.tag_number,
        species=data.species,
        breed=data.breed,
        gender=data.gender,
        birth_date=data.birth_date,
        weight=data.weight,
        status=data.status,
        created_at=datetime.now(),
    )

    db.add(animal)
    db.commit()
    db.refresh(animal)

    return animal
