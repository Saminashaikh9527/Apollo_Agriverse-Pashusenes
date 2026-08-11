from pydantic import BaseModel


class FarmCreate(BaseModel):
    farm_name: str
    village: str
    district: str
    state: str
    total_land: float


class FarmResponse(FarmCreate):
    farm_id: int
    user_id: int

    class Config:
        from_attributes = True