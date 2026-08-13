from pydantic import BaseModel, ConfigDict
from typing import Optional


# ============================================================
# CREATE FARM
# ============================================================

class FarmCreate(BaseModel):
    farm_name: str
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    total_land: Optional[float] = None


# ============================================================
# FARM RESPONSE
# ============================================================

class FarmResponse(BaseModel):
    farm_id: int
    user_id: int
    farm_name: str
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    total_land: Optional[float] = None

    model_config = ConfigDict(
        from_attributes=True
    )