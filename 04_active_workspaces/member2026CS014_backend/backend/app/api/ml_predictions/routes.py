# ============================================================
# app/api/ml_predictions/routes.py
# Apollo Agriverse - PashuSense
# ============================================================

from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.ml.services.ml_service import (
    get_loaded_models,
    get_ml_features,
    get_ml_model_features,
    get_ml_models,
    get_ml_status,
    predict_model,
)


# ============================================================
# ROUTER
# IMPORTANT:
# main.py already adds /api
# Therefore this router must NOT contain /api.
# ============================================================

router = APIRouter(
    prefix="/ml-predictions",
    tags=["ML Predictions"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class MLPredictionRequest(BaseModel):

    model_name: str = Field(
        ...,
        description="Loaded ML model name",
    )

    data: Dict[str, Any] = Field(
        default_factory=dict,
        description="Prediction input data",
    )


# ============================================================
# RESPONSE MODEL
# ============================================================

class MLPredictionResponse(BaseModel):

    model: str

    model_name: str

    prediction: Any

    confidence: Any = None

    status: str

    features_used: list[str] = []

    animal_id: Any = None


# ============================================================
# GET MODELS
# ============================================================

@router.get("/models")
def get_models():

    try:

        models = get_ml_models()

        return {
            "success": True,
            "models": models,
            "count": len(models),
        }

    except Exception as exc:

        print(
            "GET ML MODELS ERROR:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )


# ============================================================
# GET STATUS
# ============================================================

@router.get("/status")
def ml_status():

    try:

        return get_ml_status()

    except Exception as exc:

        print(
            "GET ML STATUS ERROR:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )


# ============================================================
# GET ALL MODEL FEATURES
# ============================================================

@router.get("/features")
def all_model_features():

    try:

        return {
            "success": True,
            "features": get_ml_features(),
        }

    except Exception as exc:

        print(
            "GET ML FEATURES ERROR:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )


# ============================================================
# GET FEATURES FOR ONE MODEL
# ============================================================

@router.get("/features/{model_name}")
def model_features(
    model_name: str,
):

    try:

        clean_model_name = str(
            model_name
        ).strip()

        if not clean_model_name:

            raise HTTPException(
                status_code=400,
                detail="ML model name is required.",
            )

        features = get_ml_model_features(
            clean_model_name
        )

        return {
            "success": True,
            "model_name": clean_model_name,
            "features": features,
        }

    except HTTPException:
        raise

    except ValueError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except Exception as exc:

        print(
            "GET MODEL FEATURES ERROR:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )


# ============================================================
# MAIN ML PREDICTION
# ============================================================

@router.post(
    "/predict",
    response_model=MLPredictionResponse,
)
def ml_prediction(
    request: MLPredictionRequest,
):

    try:

        # ----------------------------------------------------
        # Clean model name
        # ----------------------------------------------------

        model_name = str(
            request.model_name or ""
        ).strip()

        if not model_name:

            raise HTTPException(
                status_code=400,
                detail="Model name is required.",
            )

        if model_name == "[object Object]":

            raise HTTPException(
                status_code=400,
                detail="Invalid model name.",
            )

        # ----------------------------------------------------
        # Clean prediction data
        # ----------------------------------------------------

        data = request.data

        if not isinstance(
            data,
            dict,
        ):

            raise HTTPException(
                status_code=400,
                detail="Prediction data must be an object.",
            )

        # ----------------------------------------------------
        # Animal ID
        # ----------------------------------------------------

        animal_id = data.get(
            "animal_id"
        )

        # ----------------------------------------------------
        # Copy features
        # ----------------------------------------------------

        features = dict(data)

        # ----------------------------------------------------
        # Run prediction
        # ----------------------------------------------------

        result = predict_model(
            model_name=model_name,
            features=features,
            animal_data=data,
        )

        # ----------------------------------------------------
        # Make sure result is a dictionary
        # ----------------------------------------------------

        if not isinstance(
            result,
            dict,
        ):

            result = {
                "model": model_name,
                "model_name": model_name,
                "prediction": result,
                "confidence": None,
                "status": "success",
                "features_used": [],
            }

        # ----------------------------------------------------
        # Add frontend-friendly fields
        # ----------------------------------------------------

        result["model"] = result.get(
            "model",
            model_name,
        )

        result["model_name"] = result.get(
            "model_name",
            model_name,
        )

        result["animal_id"] = animal_id

        result["status"] = result.get(
            "status",
            "success",
        )

        result["features_used"] = result.get(
            "features_used",
            [],
        )

        return result

    except HTTPException:
        raise

    except ValueError as exc:

        print(
            "ML PREDICTION VALUE ERROR:",
            repr(exc),
        )

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:

        print(
            "ML PREDICTION ERROR:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )


# ============================================================
# LOADED MODEL NAMES
# ============================================================

@router.get("/loaded-models")
def loaded_models():

    try:

        models = get_loaded_models()

        return {
            "success": True,
            "models": models,
            "count": len(models),
        }

    except Exception as exc:

        print(
            "GET LOADED MODELS ERROR:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )