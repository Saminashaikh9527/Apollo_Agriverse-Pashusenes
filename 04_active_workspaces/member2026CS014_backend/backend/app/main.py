from fastapi import FastAPI
from sqlalchemy import text

from app.models import User, Farm, Animal

from app.api.animals.routes import router as animal_router
from app.api.auth.routes import router as auth_router

from app.database.connection import engine


app = FastAPI(
    title="AgroLens PLF API",
    version="1.0.0",
    description="AI Powered Precision Livestock Farming System"
)


# Register API routers
app.include_router(animal_router)
app.include_router(auth_router)


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