from pathlib import Path

from app.ai.yolo_service import predict_yolo
from app.ai.cnn_service import (
    predict_cnn,
    SPECIES_CLASSES,
)


# ============================================================
# ML SERVICE
# ============================================================

try:

    from app.ml.services.ml_service import (
        predict_model,
        get_loaded_models,
    )

    ML_AVAILABLE = True

except Exception as exc:

    predict_model = None
    get_loaded_models = None

    ML_AVAILABLE = False

    print(
        f"ML service unavailable: {exc}"
    )


# ============================================================
# CENTRAL AI PIPELINE
# ============================================================

def run_ai_pipeline(
    image_path: str,
) -> dict:
    """
    Central AgroLens PLF AI pipeline.

    IMAGE
        ↓
    YOLO
        ↓
    Animal Species
        ↓
    Individual Animal Crop
        ↓
    CNN Species-Specific Classification
        ↓
    ML / XGBoost Availability
        ↓
    FINAL RESULT
    """

    image = Path(
        image_path
    )


    # ========================================================
    # VALIDATE IMAGE
    # ========================================================

    if not image.exists():

        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )


    # ========================================================
    # STEP 1 — YOLO
    # ========================================================

    try:

        yolo_result = predict_yolo(
            str(image)
        )

    except Exception as exc:

        yolo_result = {

            "status":
                "error",

            "model":
                "YOLO",

            "message":
                str(exc),

            "detections":
                [],

            "count":
                0,

        }


    # ========================================================
    # STEP 2 — CNN
    # ========================================================

    cnn_result = {

        "status":
            "skipped",

        "model":
            "CNN",

        "prediction":
            None,

        "confidence":
            0,

        "animals":
            [],

    }


    detected_species = None


    # ========================================================
    # ONLY RUN CNN WHEN YOLO SUCCEEDS
    # ========================================================

    if (
        yolo_result.get("status")
        == "success"
    ):

        detections = (
            yolo_result.get(
                "detections",
                [],
            )
        )


        # ====================================================
        # NO ANIMAL DETECTED
        # ====================================================

        if not detections:

            cnn_result = {

                "status":
                    "skipped",

                "model":
                    "CNN",

                "prediction":
                    None,

                "confidence":
                    0,

                "animals":
                    [],

                "warning":
                    "YOLO detected no animal.",

            }


        else:

            # =================================================
            # PROCESS EVERY DETECTED ANIMAL
            # =================================================

            animals = []


            for detection_id, detection in enumerate(
                detections,
                start=1,
            ):

                species = (
                    detection.get(
                        "class_name"
                    )
                )


                yolo_confidence = float(
                    detection.get(
                        "confidence",
                        0,
                    )
                )


                # ------------------------------------------------
                # Normalize species
                # ------------------------------------------------

                species_key = (
                    str(species)
                    .strip()
                    .lower()
                )


                # ------------------------------------------------
                # Save first detected species
                # ------------------------------------------------

                if detected_species is None:

                    detected_species = species


                # =================================================
                # GET SPECIES-SPECIFIC CNN CLASSES
                # =================================================

                allowed_classes = (
                    SPECIES_CLASSES.get(
                        species_key
                    )
                )


                # =================================================
                # NO CNN MAPPING
                # =================================================

                if not allowed_classes:

                    animals.append({

                        "detection_id":
                            detection_id,

                        "species":
                            species,

                        "yolo_confidence":
                            yolo_confidence,

                        "status":
                            "skipped",

                        "model":
                            "CNN",

                        "prediction":
                            None,

                        "confidence":
                            0,

                        "classification_reliability":
                            "unavailable",

                        "warning": (
                            "No CNN class mapping "
                            f"found for species: "
                            f"{species}"
                        ),

                    })

                    continue


                # =================================================
                # CROP ANIMAL FROM YOLO BOUNDING BOX
                # =================================================

                try:

                    from PIL import Image


                    coordinates = (
                        detection.get(
                            "bbox"
                        )
                    )


                    if (
                        not coordinates
                        or len(coordinates) != 4
                    ):

                        raise ValueError(
                            "Invalid YOLO bounding box."
                        )


                    x1, y1, x2, y2 = (
                        coordinates
                    )


                    # ------------------------------------------------
                    # Open original image
                    # ------------------------------------------------

                    original_image = (
                        Image.open(
                            image
                        )
                    )


                    image_width, image_height = (
                        original_image.size
                    )


                    # ------------------------------------------------
                    # Clamp coordinates
                    # ------------------------------------------------

                    x1 = max(
                        0,
                        min(
                            int(x1),
                            image_width,
                        ),
                    )

                    y1 = max(
                        0,
                        min(
                            int(y1),
                            image_height,
                        ),
                    )

                    x2 = max(
                        0,
                        min(
                            int(x2),
                            image_width,
                        ),
                    )

                    y2 = max(
                        0,
                        min(
                            int(y2),
                            image_height,
                        ),
                    )


                    # ------------------------------------------------
                    # Validate crop
                    # ------------------------------------------------

                    if (
                        x2 <= x1
                        or y2 <= y1
                    ):

                        raise ValueError(
                            "Invalid crop dimensions."
                        )


                    # ------------------------------------------------
                    # Create crop path
                    # ------------------------------------------------

                    crop_path = (
                        image.parent
                        / (
                            f"{image.stem}"
                            f"_animal_{detection_id}"
                            f"{image.suffix}"
                        )
                    )


                    # ------------------------------------------------
                    # Crop
                    # ------------------------------------------------

                    crop = (
                        original_image.crop(
                            (
                                x1,
                                y1,
                                x2,
                                y2,
                            )
                        )
                    )


                    crop.save(
                        crop_path
                    )


                except Exception as exc:

                    animals.append({

                        "detection_id":
                            detection_id,

                        "species":
                            species,

                        "yolo_confidence":
                            yolo_confidence,

                        "status":
                            "error",

                        "model":
                            "CNN",

                        "prediction":
                            None,

                        "confidence":
                            0,

                        "classification_reliability":
                            "unavailable",

                        "warning":
                            str(exc),

                    })

                    continue


                # =================================================
                # RUN CNN ON INDIVIDUAL ANIMAL CROP
                # =================================================

                try:

                    animal_cnn = (
                        predict_cnn(
                            str(crop_path),
                            allowed_classes,
                        )
                    )


                    # ------------------------------------------------
                    # Preserve CNN result exactly
                    # ------------------------------------------------

                    animal_result = {

                        "detection_id":
                            detection_id,

                        "species":
                            species,

                        "yolo_confidence":
                            yolo_confidence,

                        **animal_cnn,

                        "crop":
                            str(crop_path),

                    }


                    # =================================================
                    # FIX CLASSIFICATION RELIABILITY
                    # =================================================

                    if (
                        animal_cnn.get(
                            "status"
                        )
                        == "success"
                    ):

                        animal_result[
                            "classification_reliability"
                        ] = "high"


                    elif (
                        animal_cnn.get(
                            "status"
                        )
                        == "low_confidence"
                    ):

                        animal_result[
                            "classification_reliability"
                        ] = "low"


                    elif (
                        animal_cnn.get(
                            "status"
                        )
                        == "skipped"
                    ):

                        animal_result[
                            "classification_reliability"
                        ] = "unavailable"


                    else:

                        animal_result[
                            "classification_reliability"
                        ] = "unavailable"


                    animals.append(
                        animal_result
                    )


                except Exception as exc:

                    animals.append({

                        "detection_id":
                            detection_id,

                        "species":
                            species,

                        "yolo_confidence":
                            yolo_confidence,

                        "status":
                            "error",

                        "model":
                            "CNN",

                        "prediction":
                            None,

                        "confidence":
                            0,

                        "classification_reliability":
                            "unavailable",

                        "warning":
                            str(exc),

                        "error":
                            str(exc),

                        "crop":
                            str(crop_path),

                    })


            # =================================================
            # AGGREGATE CNN RESULTS
            # =================================================

            successful = [
                animal
                for animal in animals
                if animal.get("status")
                == "success"
            ]


            low_confidence = [
                animal
                for animal in animals
                if animal.get("status")
                == "low_confidence"
            ]


            errors = [
                animal
                for animal in animals
                if animal.get("status")
                == "error"
            ]


            skipped = [
                animal
                for animal in animals
                if animal.get("status")
                == "skipped"
            ]


            # =================================================
            # IMPORTANT:
            #
            # low_confidence is NOT an error.
            #
            # CNN successfully ran but was not confident
            # enough to give a reliable diagnosis.
            # =================================================

            if successful:

                best_animal = max(
                    successful,
                    key=lambda item:
                        item.get(
                            "confidence",
                            0,
                        ),
                )


                cnn_result = {

                    "status":
                        "success",

                    "model":
                        "CNN",

                    "prediction":
                        best_animal.get(
                            "prediction"
                        ),

                    "confidence":
                        best_animal.get(
                            "confidence",
                            0,
                        ),

                    "animals":
                        animals,

                    "classification_reliability":
                        "high",

                }


            elif low_confidence:

                # ----------------------------------------------
                # CNN ran successfully but confidence was low
                # ----------------------------------------------

                best_animal = max(
                    low_confidence,
                    key=lambda item:
                        item.get(
                            "confidence",
                            0,
                        ),
                )


                cnn_result = {

                    "status":
                        "low_confidence",

                    "model":
                        "CNN",

                    "prediction":
                        None,

                    "confidence":
                        best_animal.get(
                            "confidence",
                            0,
                        ),

                    "animals":
                        animals,

                    "classification_reliability":
                        "low",

                    "warning": (
                        "CNN completed "
                        "species-specific "
                        "classification, but "
                        "confidence was too low "
                        "for a reliable diagnosis."
                    ),

                }


            elif errors and not skipped:

                cnn_result = {

                    "status":
                        "error",

                    "model":
                        "CNN",

                    "prediction":
                        None,

                    "confidence":
                        0,

                    "animals":
                        animals,

                    "classification_reliability":
                        "unavailable",

                    "warning": (
                        "CNN analysis failed "
                        "for the detected animals."
                    ),

                }


            else:

                cnn_result = {

                    "status":
                        "skipped",

                    "model":
                        "CNN",

                    "prediction":
                        None,

                    "confidence":
                        0,

                    "animals":
                        animals,

                    "classification_reliability":
                        "unavailable",

                }


    # ========================================================
    # STEP 3 — ML / XGBOOST
    # ========================================================

    ml_result = {

        "status":
            "skipped",

        "model":
            "XGBoost / ML",

        "message": (
            "ML prediction requires "
            "structured sensor/production data."
        ),

    }


    # ========================================================
    # ML SERVICE AVAILABLE
    # ========================================================

    if ML_AVAILABLE:

        try:

            loaded_models = (
                get_loaded_models()
            )


            ml_result = {

                "status":
                    "available",

                "model":
                    "XGBoost / ML",

                "loaded_models":
                    loaded_models,

                "message": (
                    "ML service connected. "
                    "Use structured farm/animal "
                    "data for model-specific "
                    "prediction."
                ),

            }


        except Exception as exc:

            ml_result = {

                "status":
                    "error",

                "model":
                    "XGBoost / ML",

                "message":
                    str(exc),

            }


    # ========================================================
    # PIPELINE STATUS
    # ========================================================

    yolo_ok = (
        yolo_result.get(
            "status"
        )
        == "success"
    )


    cnn_status = (
        cnn_result.get(
            "status"
        )
    )


    ml_ok = (
        ml_result.get(
            "status"
        )
        == "available"
    )


    # ========================================================
    # CNN IS CONSIDERED CONNECTED WHEN IT ACTUALLY RAN
    # ========================================================
    #
    # low_confidence is still a successful CNN execution.
    #
    # It means:
    #
    # YOLO -> CNN = CONNECTED
    #
    # but:
    #
    # CNN -> reliable diagnosis = NOT CONFIRMED
    #
    # ========================================================

    cnn_connected = (
        cnn_status
        in [
            "success",
            "low_confidence",
        ]
    )


    # ========================================================
    # FINAL PIPELINE STATUS
    # ========================================================

    if (
        yolo_ok
        and cnn_connected
        and ml_ok
    ):

        if (
            cnn_status
            == "success"
        ):

            pipeline_status = (
                "fully_connected"
            )

        else:

            pipeline_status = (
                "fully_connected_low_cnn_confidence"
            )


    elif (
        yolo_ok
        and cnn_connected
    ):

        if (
            cnn_status
            == "low_confidence"
        ):

            pipeline_status = (
                "yolo_cnn_connected_low_confidence"
            )

        else:

            pipeline_status = (
                "yolo_cnn_connected"
            )


    elif (
        yolo_ok
        and ml_ok
    ):

        pipeline_status = (
            "yolo_ml_connected"
        )


    elif yolo_ok:

        pipeline_status = (
            "yolo_connected"
        )


    else:

        pipeline_status = (
            "yolo_error"
        )


    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "success":
            True,

        "image":
            str(image),

        "yolo":
            yolo_result,

        "cnn":
            cnn_result,

        "xgboost":
            ml_result,

        "detected_species":
            detected_species,

        "pipeline_status":
            pipeline_status,

    }