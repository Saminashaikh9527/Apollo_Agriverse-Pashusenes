from typing import Any, Dict

from pydantic import BaseModel, Field


class MLPredictionRequest(BaseModel):
    """
    Request sent by the frontend.

    The frontend only needs to provide:
    - model_name
    - animal_id inside data

    The ML service prepares the remaining
    model-specific features.
    """

    model_name: str = Field(
        ...,
        description="Loaded ML model name"
    )

    data: Dict[str, Any] = Field(
        default_factory=dict,
        description="Animal data / model input data"
    )


class MLPredictionResponse(BaseModel):
    model: str
    animal_id: Any | None = None
    prediction: Any | None = None
    confidence: float | None = None
    status: str = "success"