from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

# ============================================================
# API ROUTES
# ============================================================

from app.api.auth.routes import router as auth_router
from app.api.animals.routes import router as animals_router
from app.api.farms.routes import router as farms_router
from app.api.health.routes import router as health_router
from app.api.milk.routes import router as milk_router
try:
    from app.api.wool.routes import router as wool_router
except ModuleNotFoundError:
    wool_router = None

try:
    from app.api.vaccination.routes import router as vaccination_router
except ModuleNotFoundError:
    vaccination_router = None

try:
    from app.api.feed.routes import router as feed_router
except ModuleNotFoundError:
    feed_router = None

try:
    from app.api.egg.routes import router as egg_router
except ModuleNotFoundError:
    egg_router = None
from app.core.config import CORS_ORIGINS
import app.models  # Register all SQLAlchemy models before handling requests.
from app.database.connection import engine


# ============================================================
# CREATE FASTAPI APP
# ============================================================

app = FastAPI(
    title="AgroLens PLF API",
    description="AI Powered Precision Livestock Farming System",
    version="1.0.0",
)


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
# API ROUTES
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

if wool_router is not None:
    app.include_router(wool_router, prefix="/api", tags=["Wool Management"])

if vaccination_router is not None:
    app.include_router(
        vaccination_router,
        prefix="/api",
        tags=["Vaccination Management"],
    )

if feed_router is not None:
    app.include_router(feed_router, prefix="/api", tags=["Feed Management"])

if egg_router is not None:
    app.include_router(egg_router, prefix="/api", tags=["Egg Production"])


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "AgroLens PLF Backend is running",
        "status": "online",
        "frontend": "http://localhost:5173",
    }


@app.get("/database-test")
def database_test():
    """Compatibility endpoint that verifies the configured database connection."""
    try:
        with engine.connect() as connection:
            database = connection.execute(
                text("SELECT current_database()")
            ).scalar_one()
        return {
            "database": database,
            "connection": "Successful",
        }
    except Exception:
        return {
            "connection": "Failed",
        }
