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


# ============================================================
# GET ALL ANIMALS
# ============================================================

@router.get("/", response_model=list[AnimalResponse])
def get_animals(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    animals = (
        db.query(Animal)
        .join(Farm, Animal.farm_id == Farm.farm_id)
        .filter(
            Farm.user_id == current_user.user_id
        )
        .all()
    )

    return animals


# ============================================================
# CREATE ANIMAL
# ============================================================

@router.post("/", response_model=AnimalResponse)
def create_animal(
    data: AnimalCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # --------------------------------------------------------
    # Check farm belongs to logged-in user
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # Check duplicate tag
    # --------------------------------------------------------

    existing = (
        db.query(Animal)
        .filter(
            Animal.tag_number == data.tag_number
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Animal tag number already exists",
        )

    # --------------------------------------------------------
    # Create animal
    # --------------------------------------------------------

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


# ============================================================
# UPDATE ANIMAL
# ============================================================

@router.put(
    "/{animal_id}",
    response_model=AnimalResponse
)
def update_animal(
    animal_id: int,
    data: AnimalCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # --------------------------------------------------------
    # Find animal belonging to current user's farm
    # --------------------------------------------------------

    animal = (
        db.query(Animal)
        .join(Farm, Animal.farm_id == Farm.farm_id)
        .filter(
            Animal.animal_id == animal_id,
            Farm.user_id == current_user.user_id,
        )
        .first()
    )

    if animal is None:
        raise HTTPException(
            status_code=404,
            detail="Animal not found or does not belong to current user",
        )

    # --------------------------------------------------------
    # Check new farm belongs to logged-in user
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # Check duplicate tag
    # --------------------------------------------------------

    existing = (
        db.query(Animal)
        .filter(
            Animal.tag_number == data.tag_number,
            Animal.animal_id != animal_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Animal tag number already exists",
        )

    # --------------------------------------------------------
    # Update animal fields
    # --------------------------------------------------------

    animal.farm_id = data.farm_id
    animal.tag_number = data.tag_number
    animal.species = data.species
    animal.breed = data.breed
    animal.gender = data.gender
    animal.birth_date = data.birth_date
    animal.weight = data.weight
    animal.status = data.status

    # --------------------------------------------------------
    # Save changes
    # --------------------------------------------------------

    db.commit()
    db.refresh(animal)

    return animal


# ============================================================
# DELETE ANIMAL
# ============================================================

@router.delete("/{animal_id}")
def delete_animal(
    animal_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # --------------------------------------------------------
    # Find animal belonging to current user's farm
    # --------------------------------------------------------

    animal = (
        db.query(Animal)
        .join(Farm, Animal.farm_id == Farm.farm_id)
        .filter(
            Animal.animal_id == animal_id,
            Farm.user_id == current_user.user_id,
        )
        .first()
    )

    if animal is None:
        raise HTTPException(
            status_code=404,
            detail="Animal not found or does not belong to current user",
        )

    # --------------------------------------------------------
    # Save information before deleting
    # --------------------------------------------------------

    tag_number = animal.tag_number

    # --------------------------------------------------------
    # Delete animal
    # --------------------------------------------------------

    db.delete(animal)
    db.commit()

    # --------------------------------------------------------
    # Return confirmation
    # --------------------------------------------------------

    return {
        "message": "Animal deleted successfully",
        "animal_id": animal_id,
        "tag_number": tag_number,
    }