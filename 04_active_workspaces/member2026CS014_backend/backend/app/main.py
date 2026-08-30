
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.openapi.docs import (
    get_swagger_ui_html,
    get_redoc_html,
)
from sqlalchemy import text


# ============================================================
# API ROUTES
# ============================================================

from app.api.auth.routes import router as auth_router
from app.api.animals.routes import router as animals_router
from app.api.farms.routes import router as farms_router
from app.api.health.routes import router as health_router
from app.api.milk.routes import router as milk_router
from app.api.reports.routes import router as reports_router

# AI
from app.api.ai.routes import router as ai_router

# ML Predictions
from app.api.ml_predictions.routes import (
    router as ml_predictions_router,
)


# ============================================================
# OPTIONAL MODULE ROUTES
# ============================================================

try:
    from app.api.wool.routes import router as wool_router
except (ModuleNotFoundError, ImportError):
    wool_router = None


try:
    from app.api.vaccination.routes import (
        router as vaccination_router
    )
except (ModuleNotFoundError, ImportError):
    vaccination_router = None


try:
    from app.api.feed.routes import router as feed_router
except (ModuleNotFoundError, ImportError):
    feed_router = None


try:
    from app.api.egg.routes import router as egg_router
except (ModuleNotFoundError, ImportError):
    egg_router = None


try:
    from app.api.growth.routes import router as growth_router
except (ModuleNotFoundError, ImportError):
    growth_router = None


try:
    from app.api.digital_twin.routes import (
        router as digital_twin_router
    )
except (ModuleNotFoundError, ImportError):
    digital_twin_router = None


try:
    from app.api.milk_forecast.routes import (
        router as milk_forecast_router
    )
except (ModuleNotFoundError, ImportError):
    milk_forecast_router = None


# ============================================================
# CORE / DATABASE
# ============================================================

from app.core.config import CORS_ORIGINS

import app.models

from app.database.connection import engine


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Apollo Agriverse PashuSense API",
    description=(
        "AI Powered Precision Livestock Farming System "
        "for Apollo Agriverse PashuSense"
    ),
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
)


# ============================================================
# FRONTEND
# ============================================================

FRONTEND_HOME = "http://localhost:5173/dashboard"


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# CORE ROUTES
# ============================================================

app.include_router(
    auth_router,
    prefix="/api",
    tags=["Authentication"],
)


app.include_router(
    animals_router,
    prefix="/api",
    tags=["Animals"],
)


app.include_router(
    farms_router,
    prefix="/api",
    tags=["Farms"],
)


app.include_router(
    health_router,
    prefix="/api",
    tags=["Animal Health"],
)


app.include_router(
    milk_router,
    prefix="/api",
    tags=["Milk Production"],
)


# ============================================================
# AI & COMPUTER VISION
# ============================================================

app.include_router(
    ai_router,
    prefix="/api",
    tags=["AI & Computer Vision"],
)

app.include_router(
    ml_predictions_router,
    prefix="/api",
    tags=["ML Predictions"],
)


# ============================================================
# OPTIONAL MODULES
# ============================================================

if wool_router is not None:
    app.include_router(
        wool_router,
        prefix="/api",
        tags=["Wool Management"],
    )


if vaccination_router is not None:
    app.include_router(
        vaccination_router,
        prefix="/api",
        tags=["Vaccination Management"],
    )


if feed_router is not None:
    app.include_router(
        feed_router,
        prefix="/api",
        tags=["Feed Management"],
    )


if egg_router is not None:
    app.include_router(
        egg_router,
        prefix="/api",
        tags=["Egg Production"],
    )


if growth_router is not None:
    app.include_router(
        growth_router,
        prefix="/api",
        tags=["Growth Tracking"],
    )


if digital_twin_router is not None:
    app.include_router(
        digital_twin_router,
        prefix="/api",
        tags=["Digital Twin"],
    )


if milk_forecast_router is not None:
    app.include_router(
        milk_forecast_router,
        prefix="/api",
        tags=["Milk Forecast"],
    )


# ============================================================
# REPORTS & ANALYTICS
# ============================================================

app.include_router(
    reports_router,
    prefix="/api",
    tags=["Reports & Analytics"],
)


# ============================================================
# CUSTOM SWAGGER
# ============================================================

@app.get(
    "/docs",
    include_in_schema=False,
)
async def custom_swagger_ui():

    response = get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title="Apollo Agriverse PashuSense API - Swagger",
    )

    html = response.body.decode("utf-8")

    home_button = f"""
    <style>

        #apollo-home-button {{
            position: fixed;
            top: 14px;
            left: 20px;
            z-index: 999999;

            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;

            min-width: 145px;
            padding: 10px 18px;

            background: linear-gradient(
                135deg,
                #047857,
                #059669
            );

            color: white;
            border: none;
            border-radius: 10px;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            font-size: 14px;
            font-weight: 800;

            text-decoration: none;
            cursor: pointer;

            box-shadow:
                0 4px 14px
                rgba(0, 0, 0, 0.20);

            transition: all 0.2s ease;
        }}

        #apollo-home-button:hover {{
            background: linear-gradient(
                135deg,
                #065f46,
                #047857
            );

            transform: translateY(-2px);

            box-shadow:
                0 7px 18px
                rgba(0, 0, 0, 0.25);
        }}

        #apollo-home-button .arrow {{
            font-size: 22px;
            line-height: 1;
            font-weight: 900;
        }}

        #apollo-home-button .home-text {{
            line-height: 1;
        }}

        .swagger-ui .topbar {{
            padding-left: 175px;
        }}

    </style>

    <a
        id="apollo-home-button"
        href="{FRONTEND_HOME}"
        title="Go back to Apollo Agriverse PashuSense Dashboard"
    >
        <span class="arrow">←</span>
        <span class="home-text">
            Back to Home
        </span>
    </a>
    """

    html = html.replace(
        "</head>",
        home_button + "</head>",
    )

    return HTMLResponse(
        content=html,
        media_type="text/html",
    )


# ============================================================
# CUSTOM REDOC
# ============================================================

@app.get(
    "/redoc",
    include_in_schema=False,
)
async def custom_redoc():

    response = get_redoc_html(
        openapi_url=app.openapi_url,
        title="Apollo Agriverse PashuSense API - ReDoc",
    )

    html = response.body.decode("utf-8")

    home_button = f"""
    <style>

        #apollo-redoc-home-button {{
            position: fixed;
            top: 18px;
            left: 20px;
            z-index: 999999;

            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;

            padding: 10px 18px;

            background: linear-gradient(
                135deg,
                #047857,
                #059669
            );

            color: white;
            border-radius: 10px;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            font-size: 14px;
            font-weight: 800;

            text-decoration: none;

            box-shadow:
                0 4px 14px
                rgba(0, 0, 0, 0.20);

            transition: all 0.2s ease;
        }}

        #apollo-redoc-home-button:hover {{
            background: linear-gradient(
                135deg,
                #065f46,
                #047857
            );

            transform: translateY(-2px);

            box-shadow:
                0 7px 18px
                rgba(0, 0, 0, 0.25);
        }}

        #apollo-redoc-home-button .arrow {{
            font-size: 22px;
            line-height: 1;
        }}

    </style>

    <a
        id="apollo-redoc-home-button"
        href="{FRONTEND_HOME}"
        title="Go back to Apollo Agriverse PashuSense Dashboard"
    >
        <span class="arrow">←</span>
        <span>Back to Home</span>
    </a>
    """

    html = html.replace(
        "</head>",
        home_button + "</head>",
    )

    return HTMLResponse(
        content=html,
        media_type="text/html",
    )


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "message": (
            "Apollo Agriverse PashuSense Backend "
            "is running"
        ),
        "status": "online",
        "application": (
            "Apollo Agriverse PashuSense"
        ),
        "frontend": FRONTEND_HOME,
        "swagger": "/docs",
        "redoc": "/redoc",
        "openapi": "/openapi.json",
        "ml_predictions": "/api/ml-predictions",
    }


# ============================================================
# DATABASE TEST
# ============================================================

@app.get("/database-test")
def database_test():

    try:

        with engine.connect() as connection:

            database = connection.execute(
                text(
                    "SELECT current_database()"
                )
            ).scalar_one()

        return {
            "database": database,
            "connection": "Successful",
            "application": (
                "Apollo Agriverse PashuSense"
            ),
        }

    except Exception as exc:

        return {
            "connection": "Failed",
            "application": (
                "Apollo Agriverse PashuSense"
            ),
            "error": str(exc),
        }

