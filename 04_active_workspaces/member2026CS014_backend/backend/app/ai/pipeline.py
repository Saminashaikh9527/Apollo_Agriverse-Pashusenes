from pathlib import Path


def run_ai_pipeline(image_path: str) -> dict:
    """
    Central AI pipeline.

    YOLO -> CNN -> XGBoost

    The actual model implementations will be
    connected when teammates provide them.
    """

    image = Path(image_path)

    if not image.exists():
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    # --------------------------------------------------------
    # STEP 1: YOLO
    # --------------------------------------------------------

    yolo_result = {
        "status": "pending",
        "message": "YOLO model not connected yet.",
    }

    # --------------------------------------------------------
    # STEP 2: CNN
    # --------------------------------------------------------

    cnn_result = {
        "status": "pending",
        "message": "CNN model not connected yet.",
    }

    # --------------------------------------------------------
    # STEP 3: XGBoost
    # --------------------------------------------------------

    xgboost_result = {
        "status": "pending",
        "message": "XGBoost model not connected yet.",
    }

    # --------------------------------------------------------
    # FINAL RESULT
    # --------------------------------------------------------

    return {
        "success": True,
        "image": str(image),
        "yolo": yolo_result,
        "cnn": cnn_result,
        "xgboost": xgboost_result,
        "pipeline_status": "waiting_for_models",
    }