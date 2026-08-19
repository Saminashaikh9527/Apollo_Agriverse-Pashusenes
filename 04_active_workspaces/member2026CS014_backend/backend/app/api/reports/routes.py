from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db

from app.models.user import User
from app.models.farm import Farm
from app.models.animal import Animal
from app.models.animal_health import AnimalHealthRecord
from app.models.milk import MilkProduction
from app.models.egg import EggProduction
from app.models.wool import WoolRecord
from app.models.feed import FeedRecord


router = APIRouter(
    prefix="/reports",
    tags=["Reports & Analytics"],
)


# ============================================================
# DATE HELPERS
# ============================================================

def get_month_range(year: int, month: int):
    """
    Return first day of current month and first day of next month.
    """

    start_date = date(year, month, 1)

    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    return start_date, end_date


def get_previous_month_range(year: int, month: int):
    """
    Return first day of previous month and first day of current month.
    """

    if month == 1:
        previous_year = year - 1
        previous_month = 12
    else:
        previous_year = year
        previous_month = month - 1

    return get_month_range(previous_year, previous_month)


def percentage_change(current, previous):
    """
    Calculate percentage change safely.
    """

    if previous in (None, 0):
        if current in (None, 0):
            return 0.0
        return 100.0

    return round(
        ((float(current) - float(previous)) / float(previous)) * 100,
        1,
    )


# ============================================================
# REPORT OVERVIEW
# ============================================================

@router.get("/overview")
def get_report_overview(
    farm_id: int | None = Query(
        default=None,
        description="Optional farm ID. If omitted, all farms belonging to current user are used.",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Generate complete Farm Overview report.

    Data is calculated dynamically from existing AgroLens PLF tables.
    """

    today = date.today()

    current_start, current_end = get_month_range(
        today.year,
        today.month,
    )

    previous_start, previous_end = get_previous_month_range(
        today.year,
        today.month,
    )

    # ========================================================
    # USER FARMS
    # ========================================================

    farm_query = db.query(Farm).filter(
        Farm.user_id == current_user.user_id
    )

    if farm_id is not None:
        farm_query = farm_query.filter(
            Farm.farm_id == farm_id
        )

    farms = farm_query.all()

    if not farms:
        return {
            "report_type": "Farm Overview",
            "period": "This Month",
            "farm_count": 0,
            "total_animals": 0,
            "milk_production": {
                "litres": 0,
                "change_percent": 0,
            },
            "egg_production": {
                "count": 0,
                "change_percent": 0,
            },
            "wool_production": {
                "kg": 0,
                "change_percent": 0,
            },
            "animal_health": {
                "healthy": 0,
                "under_observation": 0,
                "critical": 0,
                "health_percentage": 0,
            },
            "feed": {
                "quantity_kg": 0,
                "cost": 0,
            },
            "performance": {
                "animal_health": 0,
                "milk_production": 0,
                "egg_production": 0,
                "wool_production": 0,
                "feed_efficiency": 0,
            },
            "ai_insights": [],
        }

    farm_ids = [farm.farm_id for farm in farms]

    # ========================================================
    # TOTAL ANIMALS
    # ========================================================

    total_animals = (
        db.query(func.count(Animal.animal_id))
        .filter(Animal.farm_id.in_(farm_ids))
        .scalar()
        or 0
    )

    # ========================================================
    # MILK PRODUCTION
    # ========================================================

    current_milk = (
        db.query(func.coalesce(func.sum(MilkProduction.total_litres), 0))
        .join(
            Animal,
            Animal.animal_id == MilkProduction.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            MilkProduction.production_date >= current_start,
            MilkProduction.production_date < current_end,
        )
        .scalar()
        or 0
    )

    previous_milk = (
        db.query(func.coalesce(func.sum(MilkProduction.total_litres), 0))
        .join(
            Animal,
            Animal.animal_id == MilkProduction.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            MilkProduction.production_date >= previous_start,
            MilkProduction.production_date < previous_end,
        )
        .scalar()
        or 0
    )

    milk_change = percentage_change(
        current_milk,
        previous_milk,
    )

    # ========================================================
    # EGG PRODUCTION
    # ========================================================

    current_eggs = (
        db.query(func.coalesce(func.sum(EggProduction.egg_count), 0))
        .join(
            Animal,
            Animal.animal_id == EggProduction.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            EggProduction.production_date >= current_start,
            EggProduction.production_date < current_end,
        )
        .scalar()
        or 0
    )

    previous_eggs = (
        db.query(func.coalesce(func.sum(EggProduction.egg_count), 0))
        .join(
            Animal,
            Animal.animal_id == EggProduction.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            EggProduction.production_date >= previous_start,
            EggProduction.production_date < previous_end,
        )
        .scalar()
        or 0
    )

    egg_change = percentage_change(
        current_eggs,
        previous_eggs,
    )

    # ========================================================
    # WOOL PRODUCTION
    # ========================================================

    current_wool = (
        db.query(func.coalesce(func.sum(WoolRecord.wool_weight), 0))
        .join(
            Animal,
            Animal.animal_id == WoolRecord.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            WoolRecord.shearing_date >= current_start,
            WoolRecord.shearing_date < current_end,
        )
        .scalar()
        or 0
    )

    previous_wool = (
        db.query(func.coalesce(func.sum(WoolRecord.wool_weight), 0))
        .join(
            Animal,
            Animal.animal_id == WoolRecord.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            WoolRecord.shearing_date >= previous_start,
            WoolRecord.shearing_date < previous_end,
        )
        .scalar()
        or 0
    )

    wool_change = percentage_change(
        current_wool,
        previous_wool,
    )

    # ========================================================
    # ANIMAL HEALTH
    # ========================================================

    animals = (
        db.query(Animal)
        .filter(Animal.farm_id.in_(farm_ids))
        .all()
    )

    healthy = 0
    under_observation = 0
    critical = 0

    for animal in animals:

        latest_health = (
            db.query(AnimalHealthRecord)
            .filter(
                AnimalHealthRecord.animal_id
                == animal.animal_id
            )
            .order_by(
                AnimalHealthRecord.record_date.desc(),
                AnimalHealthRecord.health_record_id.desc(),
            )
            .first()
        )

        if latest_health is None:
            # Use animal status if no health record exists.
            status_value = (
                animal.status or "Healthy"
            ).lower()

        else:
            status_value = (
                latest_health.status or ""
            ).lower()

            severity_value = (
                latest_health.severity or ""
            ).lower()

            if (
                severity_value == "critical"
                or status_value == "critical"
            ):
                critical += 1
                continue

            if (
                severity_value in ["moderate", "medium"]
                or status_value
                in ["observation", "under observation", "open"]
            ):
                under_observation += 1
                continue

            status_value = (
                latest_health.condition_name or "Healthy"
            ).lower()

        if status_value in [
            "critical",
            "severe",
            "emergency",
        ]:
            critical += 1

        elif status_value in [
            "observation",
            "under observation",
            "monitoring",
            "sick",
            "open",
        ]:
            under_observation += 1

        else:
            healthy += 1

    if total_animals > 0:
        health_percentage = round(
            (healthy / total_animals) * 100
        )
    else:
        health_percentage = 0

    # ========================================================
    # FEED
    # ========================================================

    feed_quantity = (
        db.query(
            func.coalesce(
                func.sum(FeedRecord.quantity_kg),
                0,
            )
        )
        .join(
            Animal,
            Animal.animal_id == FeedRecord.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            FeedRecord.feed_date >= current_start,
            FeedRecord.feed_date < current_end,
        )
        .scalar()
        or 0
    )

    feed_cost = (
        db.query(
            func.coalesce(
                func.sum(FeedRecord.cost),
                0,
            )
        )
        .join(
            Animal,
            Animal.animal_id == FeedRecord.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            FeedRecord.feed_date >= current_start,
            FeedRecord.feed_date < current_end,
        )
        .scalar()
        or 0
    )

    # ========================================================
    # PERFORMANCE SCORES
    # ========================================================

    animal_health_score = health_percentage

    # Production scores are currently calculated as
    # normalized values from available production data.
    #
    # Later, configurable targets can be stored per farm.

    milk_score = min(
        100,
        round((float(current_milk) / 1450) * 100)
        if current_milk
        else 0,
    )

    egg_score = min(
        100,
        round((float(current_eggs) / 9000) * 100)
        if current_eggs
        else 0,
    )

    wool_score = min(
        100,
        round((float(current_wool) / 125) * 100)
        if current_wool
        else 0,
    )

    # Simple feed efficiency score.
    # This will later be replaced by ML-based feed efficiency.
    if feed_quantity > 0:
        feed_efficiency = min(
            100,
            round(
                (
                    float(current_milk)
                    + float(current_eggs) * 0.1
                    + float(current_wool) * 2
                )
                / float(feed_quantity)
                * 100
            ),
        )
    else:
        feed_efficiency = 0

    # ========================================================
    # AI FARM INSIGHTS
    # ========================================================

    ai_insights = []

    if milk_change > 0:
        ai_insights.append({
            "category": "Production",
            "message": (
                f"Milk production is trending upward "
                f"by {milk_change}% compared with last month."
            ),
            "severity": "positive",
        })

    elif milk_change < 0:
        ai_insights.append({
            "category": "Production",
            "message": (
                f"Milk production decreased "
                f"by {abs(milk_change)}% compared with last month."
            ),
            "severity": "warning",
        })

    else:
        ai_insights.append({
            "category": "Production",
            "message": (
                "Milk production is stable compared with last month."
            ),
            "severity": "info",
        })

    ai_insights.append({
        "category": "Animal Health",
        "message": (
            f"{health_percentage}% of animals are currently "
            f"classified as healthy."
        ),
        "severity": (
            "positive"
            if health_percentage >= 80
            else "warning"
        ),
    })

    if critical > 0:
        ai_insights.append({
            "category": "Attention Required",
            "message": (
                f"{critical} animal(s) require immediate "
                f"health monitoring."
            ),
            "severity": "critical",
        })
    else:
        ai_insights.append({
            "category": "Attention Required",
            "message": (
                "No animals are currently classified as critical."
            ),
            "severity": "positive",
        })

    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {
        "report_type": "Farm Overview",
        "period": "This Month",

        "date_range": {
            "start": current_start.isoformat(),
            "end": (
                current_end - timedelta(days=1)
            ).isoformat(),
        },

        "farm_count": len(farms),

        "farm_ids": farm_ids,

        "total_animals": total_animals,

        "milk_production": {
            "litres": round(float(current_milk), 2),
            "previous_month_litres": round(
                float(previous_milk),
                2,
            ),
            "change_percent": milk_change,
        },

        "egg_production": {
            "count": int(current_eggs),
            "previous_month_count": int(previous_eggs),
            "change_percent": egg_change,
        },

        "wool_production": {
            "kg": round(float(current_wool), 2),
            "previous_month_kg": round(
                float(previous_wool),
                2,
            ),
            "change_percent": wool_change,
        },

        "animal_health": {
            "healthy": healthy,
            "under_observation": under_observation,
            "critical": critical,
            "health_percentage": health_percentage,
        },

        "feed": {
            "quantity_kg": round(
                float(feed_quantity),
                2,
            ),
            "cost": round(
                float(feed_cost),
                2,
            ),
        },

        "performance": {
            "animal_health": animal_health_score,
            "milk_production": milk_score,
            "egg_production": egg_score,
            "wool_production": wool_score,
            "feed_efficiency": feed_efficiency,
        },

        "targets": {
            "milk_litres": 1450,
            "eggs": 9000,
            "wool_kg": 125,
        },

        "ai_insights": ai_insights,

        "generated_by": "AgroLens PLF",
    }


# ============================================================
# HEALTH SUMMARY
# ============================================================

@router.get("/health-summary")
def get_health_summary(
    farm_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return health distribution for the user's animals.
    """

    farm_query = db.query(Farm).filter(
        Farm.user_id == current_user.user_id
    )

    if farm_id is not None:
        farm_query = farm_query.filter(
            Farm.farm_id == farm_id
        )

    farms = farm_query.all()

    farm_ids = [farm.farm_id for farm in farms]

    animals = (
        db.query(Animal)
        .filter(Animal.farm_id.in_(farm_ids))
        .all()
    )

    healthy = 0
    observation = 0
    critical = 0

    for animal in animals:

        latest = (
            db.query(AnimalHealthRecord)
            .filter(
                AnimalHealthRecord.animal_id
                == animal.animal_id
            )
            .order_by(
                AnimalHealthRecord.record_date.desc()
            )
            .first()
        )

        if latest:

            status_value = (
                latest.status or ""
            ).lower()

            severity_value = (
                latest.severity or ""
            ).lower()

            if (
                severity_value == "critical"
                or status_value == "critical"
            ):
                critical += 1

            elif (
                status_value in [
                    "open",
                    "observation",
                    "under observation",
                    "monitoring",
                ]
                or severity_value in [
                    "moderate",
                    "medium",
                ]
            ):
                observation += 1

            else:
                healthy += 1

        else:
            healthy += 1

    return {
        "total_animals": len(animals),
        "healthy": healthy,
        "under_observation": observation,
        "critical": critical,
    }


# ============================================================
# PRODUCTION SUMMARY
# ============================================================

@router.get("/production")
def get_production_summary(
    farm_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return current month production totals.
    """

    today = date.today()

    start_date, end_date = get_month_range(
        today.year,
        today.month,
    )

    farms_query = db.query(Farm).filter(
        Farm.user_id == current_user.user_id
    )

    if farm_id is not None:
        farms_query = farms_query.filter(
            Farm.farm_id == farm_id
        )

    farms = farms_query.all()

    farm_ids = [farm.farm_id for farm in farms]

    milk = (
        db.query(
            func.coalesce(
                func.sum(MilkProduction.total_litres),
                0,
            )
        )
        .join(
            Animal,
            Animal.animal_id == MilkProduction.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            MilkProduction.production_date >= start_date,
            MilkProduction.production_date < end_date,
        )
        .scalar()
        or 0
    )

    eggs = (
        db.query(
            func.coalesce(
                func.sum(EggProduction.egg_count),
                0,
            )
        )
        .join(
            Animal,
            Animal.animal_id == EggProduction.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            EggProduction.production_date >= start_date,
            EggProduction.production_date < end_date,
        )
        .scalar()
        or 0
    )

    wool = (
        db.query(
            func.coalesce(
                func.sum(WoolRecord.wool_weight),
                0,
            )
        )
        .join(
            Animal,
            Animal.animal_id == WoolRecord.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            WoolRecord.shearing_date >= start_date,
            WoolRecord.shearing_date < end_date,
        )
        .scalar()
        or 0
    )

    return {
        "period": "This Month",
        "milk_litres": round(float(milk), 2),
        "eggs": int(eggs),
        "wool_kg": round(float(wool), 2),
        "targets": {
            "milk_litres": 1450,
            "eggs": 9000,
            "wool_kg": 125,
        },
    }