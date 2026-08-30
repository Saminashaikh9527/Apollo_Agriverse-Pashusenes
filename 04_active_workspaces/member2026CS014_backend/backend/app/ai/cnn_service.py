from pathlib import Path

import numpy as np


# ============================================================
# TENSORFLOW
# ============================================================

try:
    import tensorflow as tf

    TENSORFLOW_AVAILABLE = True

except Exception as exc:

    tf = None

    TENSORFLOW_AVAILABLE = False

    print(
        f"TensorFlow unavailable: {exc}"
    )


# ============================================================
# PATH CONFIGURATION
# ============================================================

BASE_DIR = Path(
    __file__
).resolve().parent


CNN_MODEL_PATH = (
    BASE_DIR
    / "models"
    / "cnn"
    / "livestock_cnn_13class.keras"
)


# ============================================================
# CNN MODEL
# ============================================================

CNN_MODEL = None


# ============================================================
# CNN CLASS NAMES
# ============================================================
#
# IMPORTANT:
#
# This order MUST match the order used during CNN training.
#
# Verified from the current CNN model:
#
# Input:
#     (None, 224, 224, 3)
#
# Output:
#     (None, 13)
#
# ============================================================

CNN_CLASSES = [

    "Buffalo_Lumpy_Skin_Disease",

    "Buffalo_Normal_Skin",

    "Chicken_Coccidiosis",

    "Chicken_Healthy",

    "Chicken_Newcastle_Disease",

    "Chicken_Salmonella",

    "Cow_Foot_and_Mouth_Disease",

    "Cow_Healthy",

    "Cow_Lumpy_Skin_Disease",

    "Goat_Healthy",

    "Goat_Unhealthy",

    "Sheep_No_Pain",

    "Sheep_Pain",

]


# ============================================================
# SPECIES -> CNN CLASSES
# ============================================================
#
# YOLO identifies the animal species first.
#
# CNN then evaluates only the health/condition classes
# belonging to that species.
#
# Example:
#
# YOLO -> Cow
#
# CNN is restricted to:
#
#     Cow_Foot_and_Mouth_Disease
#     Cow_Healthy
#     Cow_Lumpy_Skin_Disease
#
# This prevents a Cow detection from being reported as
# Goat_Healthy / Goat_Unhealthy.
#
# ============================================================

SPECIES_CLASSES = {

    "cow": [

        "Cow_Foot_and_Mouth_Disease",

        "Cow_Healthy",

        "Cow_Lumpy_Skin_Disease",

    ],


    "buffalo": [

        "Buffalo_Lumpy_Skin_Disease",

        "Buffalo_Normal_Skin",

    ],


    "chicken": [

        "Chicken_Coccidiosis",

        "Chicken_Healthy",

        "Chicken_Newcastle_Disease",

        "Chicken_Salmonella",

    ],


    "goat": [

        "Goat_Healthy",

        "Goat_Unhealthy",

    ],


    "sheep": [

        "Sheep_No_Pain",

        "Sheep_Pain",

    ],

}


# ============================================================
# CONFIDENCE CONFIGURATION
# ============================================================

# Do NOT lower this just to force a prediction.
#
# If the highest species-specific CNN probability is below
# this value, the result is marked low_confidence.
#
CNN_CONFIDENCE_THRESHOLD = 0.50


# ============================================================
# LOAD CNN MODEL
# ============================================================

def load_cnn_model():

    global CNN_MODEL


    # --------------------------------------------------------
    # TensorFlow check
    # --------------------------------------------------------

    if not TENSORFLOW_AVAILABLE:

        return None


    # --------------------------------------------------------
    # Already loaded
    # --------------------------------------------------------

    if CNN_MODEL is not None:

        return CNN_MODEL


    # --------------------------------------------------------
    # Model existence
    # --------------------------------------------------------

    if not CNN_MODEL_PATH.exists():

        print(
            "CNN model not found:"
        )

        print(
            CNN_MODEL_PATH
        )

        return None


    # --------------------------------------------------------
    # Load model
    # --------------------------------------------------------

    try:

        print(
            "Loading CNN model..."
        )

        print(
            f"CNN model path: {CNN_MODEL_PATH}"
        )


        CNN_MODEL = (
            tf.keras.models.load_model(
                CNN_MODEL_PATH
            )
        )


        print(
            "CNN model loaded successfully."
        )


        print(
            "CNN input shape:",
            CNN_MODEL.input_shape,
        )


        print(
            "CNN output shape:",
            CNN_MODEL.output_shape,
        )


        return CNN_MODEL


    except Exception as exc:

        print(
            f"Failed to load CNN model: {exc}"
        )

        CNN_MODEL = None

        return None


# ============================================================
# IMAGE PREPROCESSING
# ============================================================

def preprocess_image(
    image_path: str,
):

    if not TENSORFLOW_AVAILABLE:

        raise RuntimeError(
            "TensorFlow is not available."
        )


    # --------------------------------------------------------
    # Load image
    # --------------------------------------------------------

    image = (
        tf.keras.utils.load_img(
            image_path,
            target_size=(
                224,
                224,
            ),
        )
    )


    # --------------------------------------------------------
    # Convert image to array
    # --------------------------------------------------------

    image_array = (
        tf.keras.utils.img_to_array(
            image
        )
    )


    # --------------------------------------------------------
    # Normalize
    # --------------------------------------------------------

    image_array = (
        image_array / 255.0
    )


    # --------------------------------------------------------
    # Add batch dimension
    # --------------------------------------------------------

    image_array = (
        np.expand_dims(
            image_array,
            axis=0,
        )
    )


    return image_array


# ============================================================
# CREATE TOP PREDICTIONS
# ============================================================

def build_top_predictions(
    probabilities,
    indices,
):

    predictions = []


    for index in indices:

        index = int(index)


        predictions.append(
            {
                "class_id": index,

                "class_name":
                    CNN_CLASSES[index],

                "confidence":
                    round(
                        float(
                            probabilities[index]
                        ),
                        4,
                    ),
            }
        )


    predictions.sort(
        key=lambda item:
            item["confidence"],
        reverse=True,
    )


    return predictions


# ============================================================
# CNN PREDICTION
# ============================================================

def predict_cnn(
    image_path: str,
    allowed_classes: list | None = None,
) -> dict:

    image = Path(
        image_path
    )


    # ========================================================
    # VALIDATE IMAGE
    # ========================================================

    if not image.exists():

        return {

            "status": "error",

            "model": "CNN",

            "message": (
                f"Image not found: "
                f"{image_path}"
            ),

        }


    # ========================================================
    # TENSORFLOW CHECK
    # ========================================================

    if not TENSORFLOW_AVAILABLE:

        return {

            "status": "unavailable",

            "model": "CNN",

            "message": (
                "TensorFlow is not installed. "
                "CNN prediction is unavailable."
            ),

        }


    # ========================================================
    # LOAD MODEL
    # ========================================================

    model = (
        load_cnn_model()
    )


    if model is None:

        return {

            "status": "error",

            "model": "CNN",

            "message": (
                "CNN model could not be loaded."
            ),

        }


    # ========================================================
    # RUN CNN
    # ========================================================

    try:

        # ----------------------------------------------------
        # Preprocess
        # ----------------------------------------------------

        input_image = (
            preprocess_image(
                str(image)
            )
        )


        # ----------------------------------------------------
        # Prediction
        # ----------------------------------------------------

        predictions = (
            model.predict(
                input_image,
                verbose=0,
            )
        )


        probabilities = (
            predictions[0]
        )


        # ====================================================
        # CHECK OUTPUT COUNT
        # ====================================================

        num_outputs = (
            len(probabilities)
        )


        if (
            num_outputs
            != len(CNN_CLASSES)
        ):

            return {

                "status": "error",

                "model": "CNN",

                "message": (
                    "CNN output count does "
                    "not match class mapping. "
                    f"Model outputs: "
                    f"{num_outputs}, "
                    f"Classes: "
                    f"{len(CNN_CLASSES)}"
                ),

            }


        # ====================================================
        # SPECIES-SPECIFIC PREDICTION
        # ====================================================

        if allowed_classes:

            # ------------------------------------------------
            # Find valid CNN indices
            # ------------------------------------------------

            allowed_indices = []


            for class_name in (
                allowed_classes
            ):

                if (
                    class_name
                    in CNN_CLASSES
                ):

                    allowed_indices.append(
                        CNN_CLASSES.index(
                            class_name
                        )
                    )


            # ------------------------------------------------
            # No matching classes
            # ------------------------------------------------

            if not allowed_indices:

                return {

                    "status": "skipped",

                    "model": "CNN",

                    "message": (
                        "No matching CNN "
                        "classes found for "
                        "detected species."
                    ),

                }


            # ------------------------------------------------
            # Species-specific predictions
            # ------------------------------------------------

            species_predictions = (
                build_top_predictions(
                    probabilities,
                    allowed_indices,
                )
            )


            # ------------------------------------------------
            # Best species prediction
            # ------------------------------------------------

            best_prediction = (
                species_predictions[0]
            )


            predicted_index = (
                best_prediction[
                    "class_id"
                ]
            )


            predicted_class = (
                best_prediction[
                    "class_name"
                ]
            )


            confidence = (
                best_prediction[
                    "confidence"
                ]
            )


            # =================================================
            # LOW CONFIDENCE
            # =================================================

            if (
                confidence
                < CNN_CONFIDENCE_THRESHOLD
            ):

                return {

                    "status":
                        "low_confidence",

                    "model":
                        "CNN",

                    "prediction":
                        None,

                    "class_id":
                        None,

                    "confidence":
                        confidence,

                    "top_predictions":
                        species_predictions,

                    "classes":
                        allowed_classes,

                    "classification_reliability":
                        "low",

                    "warning": (
                        "CNN confidence is too "
                        "low for a reliable "
                        "species-specific "
                        "health classification."
                    ),

                }


            # =================================================
            # RELIABLE PREDICTION
            # =================================================

            return {

                "status":
                    "success",

                "model":
                    "CNN",

                "prediction":
                    predicted_class,

                "class_id":
                    predicted_index,

                "confidence":
                    confidence,

                "top_predictions":
                    species_predictions,

                "classes":
                    allowed_classes,

                "classification_reliability":
                    "high",

            }


        # ====================================================
        # GENERAL 13-CLASS PREDICTION
        # ====================================================

        predicted_index = int(
            np.argmax(
                probabilities
            )
        )


        predicted_class = (
            CNN_CLASSES[
                predicted_index
            ]
        )


        confidence = round(
            float(
                probabilities[
                    predicted_index
                ]
            ),
            4,
        )


        # ----------------------------------------------------
        # Top 5 from all 13 classes
        # ----------------------------------------------------

        top_indices = (
            np.argsort(
                probabilities
            )[::-1][:5]
        )


        top_predictions = (
            build_top_predictions(
                probabilities,
                top_indices,
            )
        )


        # ====================================================
        # GENERAL RESPONSE
        # ====================================================

        return {

            "status":
                "success",

            "model":
                "CNN",

            "prediction":
                predicted_class,

            "class_id":
                predicted_index,

            "confidence":
                confidence,

            "top_predictions":
                top_predictions,

            "classes":
                CNN_CLASSES,

        }


    # ========================================================
    # CNN ERROR
    # ========================================================

    except Exception as exc:

        return {

            "status":
                "error",

            "model":
                "CNN",

            "message":
                str(exc),

        }