# ============================================================
# app/ml/services/ml_service.py
# Apollo Agriverse - PashuSense
# ML Prediction Service
# ============================================================

from __future__ import annotations

import logging
import pickle
from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import numpy as np

logger = logging.getLogger(__name__)


# ============================================================
# PATHS
# ============================================================

CURRENT_FILE = Path(__file__).resolve()

# ml_service.py
#   -> services
#   -> ml
#   -> app
#   -> backend
BACKEND_DIR = CURRENT_FILE.parents[3]

MODEL_DIR = BACKEND_DIR / "app" / "ml" / "models"


# ============================================================
# ACTUAL MODEL FILES IN YOUR PROJECT
# ============================================================

MODEL_FILES: Dict[str, str] = {
    "health": "health_xgb_model.pkl",
    "egg": "egg_xgb_model.pkl",
    "feed": "feed_xgb_model.pkl",
    "milk": "milk_xgb_model.pkl",
    "behaviour": "behaviour_xgb_model.pkl",
    "anomaly": "cow_behaviour_anomaly_model.pkl",
    "milk_forecast": "milk_forecast_xgb_model.pkl",
    "katanning": "katanning_model.pkl",
    "murdoch": "murdoch_xgb_model.pkl",
    "muresk": "muresk_model.pkl",
    "muresk_dry": "muresk_dry_model.pkl",
    "muresk_stubble": "muresk_stubble_xgb_model.pkl",
}


# ============================================================
# EXPECTED MODELS
# ============================================================

EXPECTED_MODELS = list(MODEL_FILES.keys())


# ============================================================
# MODEL ALIASES
# ============================================================

MODEL_ALIASES: Dict[str, str] = {
    "health": "health",
    "health_xgb": "health",

    "egg": "egg",
    "egg_xgb": "egg",

    "feed": "feed",
    "feed_xgb": "feed",

    "milk": "milk",
    "milk_xgb": "milk",

    "behaviour": "behaviour",
    "behavior": "behaviour",
    "cow_behaviour": "behaviour",
    "cow_behavior": "behaviour",

    "anomaly": "anomaly",
    "cow_behaviour_anomaly": "anomaly",
    "cow_behavior_anomaly": "anomaly",

    "milk_forecast": "milk_forecast",
    "milkforecast": "milk_forecast",

    "katanning": "katanning",
    "murdoch": "murdoch",
    "muresk": "muresk",

    "muresk_dry": "muresk_dry",
    "muresk-dry": "muresk_dry",

    "muresk_stubble": "muresk_stubble",
    "muresk-stubble": "muresk_stubble",
}


# ============================================================
# CLASS MAPPING FILES
# ============================================================

CLASS_MAPPING_FILES: Dict[str, str] = {
    "health": "health_class_mapping.pkl",
    "egg": "egg_class_mapping.pkl",
}


# ============================================================
# FALLBACK VALUES
# ============================================================

DEFAULT_FEATURE_VALUE = 0


# ============================================================
# JSON SAFE
# ============================================================

def make_json_safe(value: Any) -> Any:

    if value is None:
        return None

    if isinstance(value, np.ndarray):
        return value.tolist()

    if isinstance(value, np.generic):
        return value.item()

    if isinstance(value, Path):
        return str(value)

    if isinstance(value, dict):
        return {
            str(key): make_json_safe(val)
            for key, val in value.items()
        }

    if isinstance(value, (list, tuple)):
        return [
            make_json_safe(item)
            for item in value
        ]

    return value


# ============================================================
# NORMALIZE MODEL NAME
# ============================================================

def normalize_model_name(model_name: str) -> str:

    if model_name is None:
        raise ValueError("ML model name is required.")

    # IMPORTANT:
    # Never accept a dictionary/object as a model name.
    if isinstance(model_name, dict):
        raise ValueError(
            "Invalid ML model name. Please send the model name as text."
        )

    clean = str(model_name).strip().lower()

    clean = clean.replace(".pkl", "")
    clean = clean.replace(".joblib", "")
    clean = clean.replace(".pickle", "")
    clean = clean.replace(" ", "_")

    if clean in MODEL_ALIASES:
        return MODEL_ALIASES[clean]

    if clean in EXPECTED_MODELS:
        return clean

    raise ValueError(
        f"Unknown ML model '{model_name}'. "
        f"Available models: {', '.join(EXPECTED_MODELS)}"
    )


# ============================================================
# LOAD FILE
# ============================================================

def load_pickle_file(path: Path) -> Any:

    if not path.exists():
        raise FileNotFoundError(
            f"File not found: {path}"
        )

    try:
        return joblib.load(path)
    except Exception:
        with open(path, "rb") as file:
            return pickle.load(file)


# ============================================================
# FEATURE DETECTION
# ============================================================

def detect_model_features(model: Any) -> List[str]:

    # --------------------------------------------------------
    # sklearn feature_names_in_
    # --------------------------------------------------------

    feature_names = getattr(
        model,
        "feature_names_in_",
        None,
    )

    if feature_names is not None:

        try:
            return [
                str(feature)
                for feature in feature_names
            ]
        except Exception:
            pass

    # --------------------------------------------------------
    # XGBoost booster feature names
    # --------------------------------------------------------

    try:

        booster = model.get_booster()

        names = getattr(
            booster,
            "feature_names",
            None,
        )

        if names:
            return [
                str(feature)
                for feature in names
            ]

    except Exception:
        pass

    # --------------------------------------------------------
    # Pipeline
    # --------------------------------------------------------

    try:

        named_steps = getattr(
            model,
            "named_steps",
            {},
        )

        if named_steps:

            for _, step in named_steps.items():

                names = getattr(
                    step,
                    "feature_names_in_",
                    None,
                )

                if names is not None:

                    return [
                        str(feature)
                        for feature in names
                    ]

    except Exception:
        pass

    return []


# ============================================================
# ML SERVICE
# ============================================================

class MLService:

    def __init__(self) -> None:

        self.models: Dict[str, Any] = {}

        self.model_paths: Dict[str, str] = {}

        self.model_features: Dict[
            str,
            List[str]
        ] = {}

        self.class_mappings: Dict[
            str,
            Dict[Any, Any]
        ] = {}

        self.load_all_models()


    # ========================================================
    # LOAD ALL MODELS
    # ========================================================

    def load_all_models(self) -> None:

        print("=" * 60)
        print("ML MODEL DIRECTORY:")
        print(MODEL_DIR)
        print("=" * 60)

        if not MODEL_DIR.exists():

            logger.error(
                "ML model directory does not exist: %s",
                MODEL_DIR,
            )

            return

        print()
        print("=" * 60)
        print("LOADING ML MODELS")
        print("=" * 60)

        loaded_count = 0

        for model_name, filename in MODEL_FILES.items():

            model_path = MODEL_DIR / filename

            try:

                if not model_path.exists():

                    logger.warning(
                        "Model file not found: %s",
                        model_path,
                    )

                    continue

                model = load_pickle_file(
                    model_path
                )

                self.models[
                    model_name
                ] = model

                self.model_paths[
                    model_name
                ] = str(model_path)

                features = detect_model_features(
                    model
                )

                self.model_features[
                    model_name
                ] = features

                # ------------------------------------------------
                # Load class mapping when available
                # ------------------------------------------------

                mapping_filename = CLASS_MAPPING_FILES.get(
                    model_name
                )

                if mapping_filename:

                    mapping_path = (
                        MODEL_DIR /
                        mapping_filename
                    )

                    if mapping_path.exists():

                        mapping = load_pickle_file(
                            mapping_path
                        )

                        if isinstance(
                            mapping,
                            dict,
                        ):
                            self.class_mappings[
                                model_name
                            ] = mapping

                loaded_count += 1

                print(
                    f"ML model loaded: {model_name}"
                )

                print(
                    f"  Features: {len(features)}"
                )

                if model_name in self.class_mappings:

                    print(
                        "  Class mapping:",
                        self.class_mappings[
                            model_name
                        ]
                    )

            except Exception as exc:

                logger.exception(
                    "Failed to load model '%s': %s",
                    model_name,
                    exc,
                )

                print(
                    f"ML model FAILED: {model_name}"
                )

        print()
        print(
            f"ML service ready: "
            f"{loaded_count}/{len(EXPECTED_MODELS)} models loaded."
        )
        print()


    # ========================================================
    # MODEL LIST
    # ========================================================

    def get_models(self) -> List[Dict[str, Any]]:

        result = []

        for model_name in EXPECTED_MODELS:

            loaded = (
                model_name in self.models
            )

            result.append(
                {
                    "name": model_name,
                    "model_name": model_name,
                    "loaded": loaded,
                    "available": loaded,
                    "features": self.model_features.get(
                        model_name,
                        [],
                    ),
                    "feature_count": len(
                        self.model_features.get(
                            model_name,
                            [],
                        )
                    ),
                }
            )

        return result


    # ========================================================
    # STATUS
    # ========================================================

    def get_status(self) -> Dict[str, Any]:

        loaded_models = [
            model_name
            for model_name in EXPECTED_MODELS
            if model_name in self.models
        ]

        missing_models = [
            model_name
            for model_name in EXPECTED_MODELS
            if model_name not in self.models
        ]

        return {
            "status": (
                "ready"
                if loaded_models
                else "error"
            ),
            "total_models": len(
                EXPECTED_MODELS
            ),
            "loaded_models": len(
                loaded_models
            ),
            "models": loaded_models,
            "missing_models": missing_models,
        }


    # ========================================================
    # ALL FEATURES
    # ========================================================

    def get_all_features(
        self,
    ) -> Dict[str, List[str]]:

        return {
            model_name:
                self.model_features.get(
                    model_name,
                    [],
                )
            for model_name in EXPECTED_MODELS
        }


    # ========================================================
    # ONE MODEL FEATURES
    # ========================================================

    def get_features(
        self,
        model_name: str,
    ) -> List[str]:

        canonical = normalize_model_name(
            model_name
        )

        if canonical not in self.models:

            raise ValueError(
                f"Model '{canonical}' is not loaded."
            )

        return self.model_features.get(
            canonical,
            [],
        )


    # ========================================================
    # PREPARE FEATURES
    # ========================================================

    def prepare_features(
        self,
        model_name: str,
        features: Optional[
            Dict[str, Any]
        ] = None,
        animal_data: Optional[
            Dict[str, Any]
        ] = None,
        health_data: Optional[
            Dict[str, Any]
        ] = None,
    ) -> Dict[str, Any]:

        canonical = normalize_model_name(
            model_name
        )

        merged: Dict[str, Any] = {}

        # ----------------------------------------------------
        # Animal data
        # ----------------------------------------------------

        if isinstance(
            animal_data,
            dict,
        ):
            merged.update(
                animal_data
            )

        # ----------------------------------------------------
        # Health data
        # ----------------------------------------------------

        if isinstance(
            health_data,
            dict,
        ):
            merged.update(
                health_data
            )

        # ----------------------------------------------------
        # Frontend features
        # ----------------------------------------------------

        if isinstance(
            features,
            dict,
        ):
            merged.update(
                features
            )

        # ----------------------------------------------------
        # Common aliases
        # ----------------------------------------------------

        aliases = {
            "animalId": "animal_id",
            "animalID": "animal_id",

            "bodyWeight": "body_weight",
            "bodyTemperature": "body_temperature",

            "milkYield": "milk_yield",
            "milkProduction": "milk_production",

            "eggProduction": "egg_production",
            "eggCount": "egg_count",

            "woolProduction": "wool_production",

            "activityLevel": "activity_level",

            "feedAmount": "feed_amount",
            "feedIntake": "feed_intake",
        }

        for old_key, new_key in aliases.items():

            if (
                old_key in merged
                and new_key not in merged
            ):

                merged[new_key] = (
                    merged[old_key]
                )

        # ----------------------------------------------------
        # Get exact model features
        # ----------------------------------------------------

        required_features = (
            self.model_features.get(
                canonical,
                [],
            )
        )

        prepared: Dict[str, Any] = {}

        # ----------------------------------------------------
        # Exact feature order
        # ----------------------------------------------------

        if required_features:

            for feature_name in required_features:

                if feature_name in merged:

                    prepared[
                        feature_name
                    ] = merged[
                        feature_name
                    ]

                else:

                    # Missing values are automatically
                    # filled with zero.
                    prepared[
                        feature_name
                    ] = DEFAULT_FEATURE_VALUE

            return prepared

        # ----------------------------------------------------
        # No feature names available
        # ----------------------------------------------------

        return merged


    # ========================================================
    # CONVERT VALUE
    # ========================================================

    @staticmethod
    def convert_value(
        value: Any,
    ) -> Any:

        if value is None:
            return 0

        if isinstance(
            value,
            bool,
        ):
            return int(value)

        if isinstance(
            value,
            (int, float),
        ):
            return value

        if isinstance(
            value,
            np.generic,
        ):
            return value.item()

        if isinstance(
            value,
            dict,
        ):
            # Never pass dictionaries to XGBoost.
            return 0

        if isinstance(
            value,
            (list, tuple),
        ):
            return 0

        text = str(value).strip()

        if not text:
            return 0

        try:
            return float(text)
        except ValueError:
            return 0


    # ========================================================
    # BUILD MODEL INPUT
    # ========================================================

    def build_model_input(
        self,
        model_name: str,
        prepared_features: Dict[str, Any],
    ) -> np.ndarray:

        canonical = normalize_model_name(
            model_name
        )

        model = self.models.get(
            canonical
        )

        if model is None:

            raise ValueError(
                f"Model '{canonical}' is not loaded."
            )

        feature_names = (
            self.model_features.get(
                canonical,
                [],
            )
        )

        # ----------------------------------------------------
        # Exact feature order
        # ----------------------------------------------------

        if feature_names:

            values = [
                self.convert_value(
                    prepared_features.get(
                        feature_name,
                        0,
                    )
                )
                for feature_name
                in feature_names
            ]

        else:

            # Fallback to n_features_in_
            n_features = getattr(
                model,
                "n_features_in_",
                None,
            )

            if n_features:

                values = [0] * int(
                    n_features
                )

                supplied_values = list(
                    prepared_features.values()
                )

                for index, value in enumerate(
                    supplied_values[
                        :int(n_features)
                    ]
                ):

                    values[index] = (
                        self.convert_value(
                            value
                        )
                    )

            else:

                values = [
                    self.convert_value(
                        value
                    )
                    for value
                    in prepared_features.values()
                ]

        return np.asarray(
            [values],
            dtype=float,
        )


    # ========================================================
    # DECODE CLASSIFICATION RESULT
    # ========================================================

    def decode_prediction(
        self,
        model_name: str,
        prediction: Any,
    ) -> Any:

        canonical = normalize_model_name(
            model_name
        )

        mapping = self.class_mappings.get(
            canonical
        )

        if not mapping:
            return prediction

        # Convert numpy scalar.
        if isinstance(
            prediction,
            np.generic,
        ):
            prediction = prediction.item()

        # ----------------------------------------------------
        # IMPORTANT:
        # prediction must NEVER be used as a dictionary
        # key unless it is a scalar.
        # ----------------------------------------------------

        if isinstance(
            prediction,
            (list, tuple, np.ndarray),
        ):

            if len(prediction) == 0:
                return prediction

            prediction = prediction[0]

            if isinstance(
                prediction,
                np.generic,
            ):
                prediction = prediction.item()

        if isinstance(
            prediction,
            dict,
        ):
            return prediction

        # ----------------------------------------------------
        # Mapping format in your project:
        #
        # egg:
        # {'High': 0, 'Low': 1, 'Medium': 2}
        #
        # Therefore reverse the mapping.
        # ----------------------------------------------------

        for label, numeric_value in mapping.items():

            try:

                if prediction == numeric_value:

                    return label

            except Exception:
                continue

        return prediction


    # ========================================================
    # PREDICT MODEL
    # ========================================================

    def predict_model(
        self,
        model_name: str,
        features: Optional[
            Dict[str, Any]
        ] = None,
        animal_data: Optional[
            Dict[str, Any]
        ] = None,
        health_data: Optional[
            Dict[str, Any]
        ] = None,
    ) -> Dict[str, Any]:

        canonical = normalize_model_name(
            model_name
        )

        model = self.models.get(
            canonical
        )

        if model is None:

            raise ValueError(
                f"ML model '{canonical}' is not loaded."
            )

        # ----------------------------------------------------
        # Prepare
        # ----------------------------------------------------

        prepared = self.prepare_features(
            canonical,
            features=features,
            animal_data=animal_data,
            health_data=health_data,
        )

        # ----------------------------------------------------
        # Build exact input
        # ----------------------------------------------------

        model_input = self.build_model_input(
            canonical,
            prepared,
        )

        logger.info(
            "Prediction input | model=%s shape=%s",
            canonical,
            model_input.shape,
        )

        # ----------------------------------------------------
        # Prediction
        # ----------------------------------------------------

        raw_prediction = model.predict(
            model_input
        )

        raw_prediction = make_json_safe(
            raw_prediction
        )

        # ----------------------------------------------------
        # Get scalar prediction
        # ----------------------------------------------------

        prediction_value = raw_prediction

        if isinstance(
            prediction_value,
            list,
        ):

            if len(
                prediction_value
            ) == 1:

                prediction_value = (
                    prediction_value[0]
                )

        # ----------------------------------------------------
        # Decode classification
        # ----------------------------------------------------

        prediction_value = (
            self.decode_prediction(
                canonical,
                prediction_value,
            )
        )

        # ----------------------------------------------------
        # Confidence
        # ----------------------------------------------------

        confidence = None

        if hasattr(
            model,
            "predict_proba",
        ):

            try:

                probabilities = (
                    model.predict_proba(
                        model_input
                    )
                )

                probabilities = (
                    make_json_safe(
                        probabilities
                    )
                )

                if (
                    isinstance(
                        probabilities,
                        list,
                    )
                    and len(
                        probabilities
                    ) > 0
                ):

                    first_row = (
                        probabilities[0]
                    )

                    if isinstance(
                        first_row,
                        list,
                    ) and first_row:

                        confidence = float(
                            max(
                                first_row
                            )
                        )

            except Exception as exc:

                logger.warning(
                    "Confidence unavailable for %s: %s",
                    canonical,
                    exc,
                )

        # ----------------------------------------------------
        # Result
        # ----------------------------------------------------

        result = {
            "model": canonical,
            "model_name": canonical,
            "prediction": prediction_value,
            "confidence": confidence,
            "status": "success",
            "features_used": list(
                prepared.keys()
            ),
        }

        return make_json_safe(
            result
        )


# ============================================================
# SINGLE SERVICE INSTANCE
# ============================================================

ml_service = MLService()


# ============================================================
# CONVENIENCE FUNCTIONS
# ============================================================

def get_ml_models() -> List[
    Dict[str, Any]
]:
    return ml_service.get_models()


def get_ml_status() -> Dict[
    str,
    Any
]:
    return ml_service.get_status()


def get_ml_features() -> Dict[
    str,
    List[str]
]:
    return ml_service.get_all_features()


def get_ml_model_features(
    model_name: str,
) -> List[str]:

    return ml_service.get_features(
        model_name
    )


def predict_model(
    model_name: str,
    features: Optional[
        Dict[str, Any]
    ] = None,
    animal_data: Optional[
        Dict[str, Any]
    ] = None,
    health_data: Optional[
        Dict[str, Any]
    ] = None,
) -> Dict[str, Any]:

    return ml_service.predict_model(
        model_name=model_name,
        features=features,
        animal_data=animal_data,
        health_data=health_data,
    )


# Compatibility function.
def get_loaded_models() -> List[str]:

    return [
        model_name
        for model_name in EXPECTED_MODELS
        if model_name in ml_service.models
    ]