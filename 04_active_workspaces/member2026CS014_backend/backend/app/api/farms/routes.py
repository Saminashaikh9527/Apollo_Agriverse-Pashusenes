from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.farm import Farm
from app.models.user import User
from app.schemas.farm import FarmCreate, FarmResponse


router = APIRouter(
    prefix="/farms",
    tags=["Farms"],
)


# ============================================================
# GET ALL FARMS
# ============================================================

@router.get("/", response_model=list[FarmResponse])
def get_farms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Farm)
        .filter(Farm.user_id == current_user.user_id)
        .all()
    )


# ============================================================
# GET SINGLE FARM
# ============================================================

@router.get("/{farm_id}", response_model=FarmResponse)
def get_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    farm = (
        db.query(Farm)
        .filter(
            Farm.farm_id == farm_id,
            Farm.user_id == current_user.user_id,
        )
        .first()
    )

    if farm is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found or does not belong to current user",
        )

    return farm


# ============================================================
# CREATE FARM
# ============================================================

@router.post(
    "/",
    response_model=FarmResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_farm(
    farm: FarmCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_farm = Farm(
        user_id=current_user.user_id,
        farm_name=farm.farm_name,
        village=farm.village,
        district=farm.district,
        state=farm.state,
        total_land=farm.total_land,
    )

    db.add(new_farm)
    db.commit()
    db.refresh(new_farm)

    return new_farm


# ============================================================
# UPDATE FARM
# ============================================================

@router.put(
    "/{farm_id}",
    response_model=FarmResponse,
)
def update_farm(
    farm_id: int,
    farm_data: FarmCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    farm = (
        db.query(Farm)
        .filter(
            Farm.farm_id == farm_id,
            Farm.user_id == current_user.user_id,
        )
        .first()
    )

    if farm is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found or does not belong to current user",
        )

    farm.farm_name = farm_data.farm_name
    farm.village = farm_data.village
    farm.district = farm_data.district
    farm.state = farm_data.state
    farm.total_land = farm_data.total_land

    db.commit()
    db.refresh(farm)

    return farm


# ============================================================
# DELETE FARM
# ============================================================

@router.delete("/{farm_id}")
def delete_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    farm = (
        db.query(Farm)
        .filter(
            Farm.farm_id == farm_id,
            Farm.user_id == current_user.user_id,
        )
        .first()
    )

    if farm is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found or does not belong to current user",
        )

    db.delete(farm)
    db.commit()

    return {
        "message": "Farm deleted successfully",
        "farm_id": farm_id,
    }