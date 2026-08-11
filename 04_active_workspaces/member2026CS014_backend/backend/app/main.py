from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import CORS_ORIGINS
from app.models import User, Farm, Animal

from app.api.auth.routes import router as auth_router
from app.api.farms.routes import router as farms_router
from app.api.animals.routes import router as animals_router
from app.api.milk.routes import router as milk_router
from app.api.health.routes import router as health_router
from app.database.connection import engine


app = FastAPI(
    title="AgroLens PLF API",
    description="AI Powered Precision Livestock Farming System",
    version="1.0.0",
)


# ============================================================
# ROUTERS
# ============================================================

app.include_router(
    auth_router
)

app.include_router(
    farms_router
)

app.include_router(
    animals_router
)

app.include_router(
    milk_router
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(
    health_router
)


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "project": "AgroLens PLF",
        "status": "Running",
        "version": "1.0.0"
    }


@app.get("/database-test")
def database_test():

    try:
        with engine.connect() as connection:
            result = connection.execute(
                text("SELECT current_database();")
            )

            database = result.fetchone()[0]

        return {
            "database": database,
            "connection": "Successful"
        }

    except Exception as e:
        return {
            "connection": "Failed",
            "error": str(e)
        }
