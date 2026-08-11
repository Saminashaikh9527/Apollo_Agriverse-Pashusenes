
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.farm import Farm
from app.schemas.farm import FarmCreate, FarmResponse
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/farms",
    tags=["Farms"]
)


@router.post("/", response_model=FarmResponse)
def create_farm(
    farm: FarmCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_farm = Farm(
        user_id=current_user.user_id,
        farm_name=farm.farm_name,
        village=farm.village,
        district=farm.district,
        state=farm.state,
        total_land=farm.total_land
    )

    db.add(new_farm)
    db.commit()
    db.refresh(new_farm)

    return new_farm


@router.get("/", response_model=list[FarmResponse])
def get_farms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Farm).filter(
        Farm.user_id == current_user.user_id
    ).all()

