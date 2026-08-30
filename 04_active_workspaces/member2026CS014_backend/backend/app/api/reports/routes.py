
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
# TARGETS
# ============================================================

MILK_TARGET = 1450
EGG_TARGET = 9000
WOOL_TARGET = 125


# ============================================================
# DATE HELPERS
# ============================================================

def get_month_range(year: int, month: int):
    start_date = date(year, month, 1)

    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    return start_date, end_date


def get_previous_month_range(year: int, month: int):
    if month == 1:
        previous_year = year - 1
        previous_month = 12
    else:
        previous_year = year
        previous_month = month - 1

    return get_month_range(
        previous_year,
        previous_month,
    )


# ============================================================
# PERCENTAGE CHANGE
# ============================================================

def percentage_change(current, previous):
    """
    Return None when there is no previous-month data.

    This is different from returning 0.
    0 means the values were actually unchanged.
    None means there is nothing to compare.
    """

    if previous is None:
        return None

    previous_value = float(previous)
    current_value = float(current or 0)

    if previous_value == 0:
        return None

    return round(
        (
            (current_value - previous_value)
            / previous_value
        ) * 100,
        1,
    )


# ============================================================
# PRODUCTION ACHIEVEMENT
# ============================================================

def achievement_percentage(
    current,
    target,
):
    if target is None or float(target) <= 0:
        return 0.0

    percentage = (
        float(current or 0)
        / float(target)
    ) * 100

    return round(
        min(100.0, percentage),
        1,
    )


# ============================================================
# REPORT OVERVIEW
# ============================================================

@router.get("/overview")
def get_report_overview(
    farm_id: int | None = Query(
        default=None,
        description="Optional farm ID.",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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
            "date_range": {
                "start": current_start.isoformat(),
                "end": (
                    current_end - timedelta(days=1)
                ).isoformat(),
            },
            "farm_count": 0,
            "farm_ids": [],
            "total_animals": 0,

            "milk_production": {
                "litres": 0.0,
                "previous_month_litres": None,
                "change_percent": None,
                "has_previous_data": False,
            },

            "egg_production": {
                "count": 0,
                "previous_month_count": None,
                "change_percent": None,
                "has_previous_data": False,
            },

            "wool_production": {
                "kg": 0.0,
                "previous_month_kg": None,
                "change_percent": None,
                "has_previous_data": False,
            },

            "animal_health": {
                "healthy": 0,
                "under_observation": 0,
                "critical": 0,
                "health_percentage": 0.0,
            },

            "feed": {
                "quantity_kg": 0.0,
                "cost": 0.0,
            },

            "performance": {
                "animal_health": 0.0,
                "milk_production": 0.0,
                "egg_production": 0.0,
                "wool_production": 0.0,
                "feed_efficiency": 0.0,
            },

            "targets": {
                "milk_litres": MILK_TARGET,
                "eggs": EGG_TARGET,
                "wool_kg": WOOL_TARGET,
            },

            "ai_insights": [
                {
                    "category": "Farm Status",
                    "message": "No farm data is available.",
                    "severity": "info",
                }
            ],

            "generated_by": "Apollo Agriverse - PashuSense",
        }

    farm_ids = [
        farm.farm_id
        for farm in farms
    ]

    # ========================================================
    # TOTAL ANIMALS
    # ========================================================

    total_animals = (
        db.query(
            func.count(
                Animal.animal_id
            )
        )
        .filter(
            Animal.farm_id.in_(farm_ids)
        )
        .scalar()
        or 0
    )

    # ========================================================
    # MILK - CURRENT MONTH
    # ========================================================

    current_milk = (
        db.query(
            func.sum(
                MilkProduction.total_litres
            )
        )
        .join(
            Animal,
            Animal.animal_id
            == MilkProduction.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            MilkProduction.production_date
            >= current_start,
            MilkProduction.production_date
            < current_end,
        )
        .scalar()
    )

    current_milk = (
        float(current_milk)
        if current_milk is not None
        else 0.0
    )

    # ========================================================
    # MILK - PREVIOUS MONTH
    # ========================================================

    previous_milk = (
        db.query(
            func.sum(
                MilkProduction.total_litres
            )
        )
        .join(
            Animal,
            Animal.animal_id
            == MilkProduction.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            MilkProduction.production_date
            >= previous_start,
            MilkProduction.production_date
            < previous_end,
        )
        .scalar()
    )

    milk_has_previous_data = (
        previous_milk is not None
    )

    milk_change = percentage_change(
        current_milk,
        previous_milk,
    )

    # ========================================================
    # EGGS - CURRENT MONTH
    # ========================================================

    current_eggs = (
        db.query(
            func.sum(
                EggProduction.egg_count
            )
        )
        .join(
            Animal,
            Animal.animal_id
            == EggProduction.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            EggProduction.production_date
            >= current_start,
            EggProduction.production_date
            < current_end,
        )
        .scalar()
    )

    current_eggs = (
        int(current_eggs)
        if current_eggs is not None
        else 0
    )

    # ========================================================
    # EGGS - PREVIOUS MONTH
    # ========================================================

    previous_eggs = (
        db.query(
            func.sum(
                EggProduction.egg_count
            )
        )
        .join(
            Animal,
            Animal.animal_id
            == EggProduction.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            EggProduction.production_date
            >= previous_start,
            EggProduction.production_date
            < previous_end,
        )
        .scalar()
    )

    egg_has_previous_data = (
        previous_eggs is not None
    )

    egg_change = percentage_change(
        current_eggs,
        previous_eggs,
    )

    # ========================================================
    # WOOL - CURRENT MONTH
    # ========================================================

    current_wool = (
        db.query(
            func.sum(
                WoolRecord.wool_weight
            )
        )
        .join(
            Animal,
            Animal.animal_id
            == WoolRecord.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            WoolRecord.shearing_date
            >= current_start,
            WoolRecord.shearing_date
            < current_end,
        )
        .scalar()
    )

    current_wool = (
        float(current_wool)
        if current_wool is not None
        else 0.0
    )

    # ========================================================
    # WOOL - PREVIOUS MONTH
    # ========================================================

    previous_wool = (
        db.query(
            func.sum(
                WoolRecord.wool_weight
            )
        )
        .join(
            Animal,
            Animal.animal_id
            == WoolRecord.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            WoolRecord.shearing_date
            >= previous_start,
            WoolRecord.shearing_date
            < previous_end,
        )
        .scalar()
    )

    wool_has_previous_data = (
        previous_wool is not None
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
        .filter(
            Animal.farm_id.in_(farm_ids)
        )
        .all()
    )

    healthy = 0
    under_observation = 0
    critical = 0

    for animal in animals:

        latest_health = (
            db.query(
                AnimalHealthRecord
            )
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

            status_value = (
                animal.status
                or "Healthy"
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

            continue

        status_value = (
            latest_health.status
            or ""
        ).lower()

        severity_value = (
            latest_health.severity
            or ""
        ).lower()

        condition_value = (
            latest_health.condition_name
            or ""
        ).lower()

        if (
            severity_value
            in [
                "critical",
                "severe",
            ]
            or status_value
            in [
                "critical",
                "emergency",
            ]
            or condition_value
            in [
                "critical",
                "severe",
                "emergency",
            ]
        ):
            critical += 1

        elif (
            severity_value
            in [
                "moderate",
                "medium",
            ]
            or status_value
            in [
                "observation",
                "under observation",
                "monitoring",
                "open",
            ]
            or condition_value
            in [
                "observation",
                "under observation",
                "monitoring",
                "sick",
            ]
        ):
            under_observation += 1

        else:
            healthy += 1

    if total_animals > 0:
        health_percentage = round(
            (
                healthy
                / total_animals
            ) * 100,
            1,
        )
    else:
        health_percentage = 0.0

    # ========================================================
    # FEED
    # ========================================================

    feed_quantity = (
        db.query(
            func.sum(
                FeedRecord.quantity_kg
            )
        )
        .join(
            Animal,
            Animal.animal_id
            == FeedRecord.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            FeedRecord.feed_date
            >= current_start,
            FeedRecord.feed_date
            < current_end,
        )
        .scalar()
    )

    feed_quantity = (
        float(feed_quantity)
        if feed_quantity is not None
        else 0.0
    )

    feed_cost = (
        db.query(
            func.sum(
                FeedRecord.cost
            )
        )
        .join(
            Animal,
            Animal.animal_id
            == FeedRecord.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            FeedRecord.feed_date
            >= current_start,
            FeedRecord.feed_date
            < current_end,
        )
        .scalar()
    )

    feed_cost = (
        float(feed_cost)
        if feed_cost is not None
        else 0.0
    )

    # ========================================================
    # PERFORMANCE
    # ========================================================

    milk_score = achievement_percentage(
        current_milk,
        MILK_TARGET,
    )

    egg_score = achievement_percentage(
        current_eggs,
        EGG_TARGET,
    )

    wool_score = achievement_percentage(
        current_wool,
        WOOL_TARGET,
    )

    # Feed efficiency
    if feed_quantity > 0:

        efficiency_raw = (
            (
                current_milk
                + current_eggs * 0.1
                + current_wool * 2
            )
            / feed_quantity
        ) * 100

        feed_efficiency = round(
            min(100.0, efficiency_raw),
            1,
        )

    else:
        feed_efficiency = 0.0

    # ========================================================
    # AI INSIGHTS
    # ========================================================

    ai_insights = []

    # Milk insight
    if milk_change is None:

        milk_message = (
            "Milk production has no "
            "previous-month data for comparison."
        )

        milk_severity = "info"

    elif milk_change > 0:

        milk_message = (
            f"Milk production increased "
            f"by {milk_change}% compared with "
            f"last month."
        )

        milk_severity = "positive"

    elif milk_change < 0:

        milk_message = (
            f"Milk production decreased "
            f"by {abs(milk_change)}% compared "
            f"with last month."
        )

        milk_severity = "warning"

    else:

        milk_message = (
            "Milk production is unchanged "
            "compared with last month."
        )

        milk_severity = "info"

    ai_insights.append({
        "category": "Production",
        "message": milk_message,
        "severity": milk_severity,
    })

    # Health insight
    ai_insights.append({
        "category": "Animal Health",
        "message": (
            f"{health_percentage}% of animals "
            f"are currently classified as healthy."
        ),
        "severity": (
            "positive"
            if health_percentage >= 80
            else "warning"
        ),
    })

    # Critical insight
    if critical > 0:

        ai_insights.append({
            "category": "Attention Required",
            "message": (
                f"{critical} animal(s) require "
                "immediate health monitoring."
            ),
            "severity": "critical",
        })

    else:

        ai_insights.append({
            "category": "Attention Required",
            "message": (
                "No animals are currently "
                "classified as critical."
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
                current_end
                - timedelta(days=1)
            ).isoformat(),
        },

        "farm_count": len(farms),

        "farm_ids": farm_ids,

        "total_animals": int(
            total_animals
        ),

        # ----------------------------------------------------
        # MILK
        # ----------------------------------------------------

        "milk_production": {

            "litres": round(
                current_milk,
                2,
            ),

            "previous_month_litres": (
                round(
                    float(previous_milk),
                    2,
                )
                if milk_has_previous_data
                else None
            ),

            "change_percent": milk_change,

            "has_previous_data":
                milk_has_previous_data,
        },

        # ----------------------------------------------------
        # EGGS
        # ----------------------------------------------------

        "egg_production": {

            "count": int(
                current_eggs
            ),

            "previous_month_count": (
                int(previous_eggs)
                if egg_has_previous_data
                else None
            ),

            "change_percent": egg_change,

            "has_previous_data":
                egg_has_previous_data,
        },

        # ----------------------------------------------------
        # WOOL
        # ----------------------------------------------------

        "wool_production": {

            "kg": round(
                current_wool,
                2,
            ),

            "previous_month_kg": (
                round(
                    float(previous_wool),
                    2,
                )
                if wool_has_previous_data
                else None
            ),

            "change_percent": wool_change,

            "has_previous_data":
                wool_has_previous_data,
        },

        # ----------------------------------------------------
        # HEALTH
        # ----------------------------------------------------

        "animal_health": {

            "healthy": int(
                healthy
            ),

            "under_observation": int(
                under_observation
            ),

            "critical": int(
                critical
            ),

            "health_percentage":
                health_percentage,
        },

        # ----------------------------------------------------
        # FEED
        # ----------------------------------------------------

        "feed": {

            "quantity_kg": round(
                feed_quantity,
                2,
            ),

            "cost": round(
                feed_cost,
                2,
            ),
        },

        # ----------------------------------------------------
        # PERFORMANCE
        # ----------------------------------------------------

        "performance": {

            "animal_health":
                health_percentage,

            "milk_production":
                milk_score,

            "egg_production":
                egg_score,

            "wool_production":
                wool_score,

            "feed_efficiency":
                feed_efficiency,
        },

        # ----------------------------------------------------
        # TARGETS
        # ----------------------------------------------------

        "targets": {

            "milk_litres":
                MILK_TARGET,

            "eggs":
                EGG_TARGET,

            "wool_kg":
                WOOL_TARGET,
        },

        # ----------------------------------------------------
        # AI INSIGHTS
        # ----------------------------------------------------

        "ai_insights":
            ai_insights,

        # ----------------------------------------------------
        # GENERATED BY
        # ----------------------------------------------------

        "generated_by":
            "Apollo Agriverse - PashuSense",
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

    farm_query = db.query(Farm).filter(
        Farm.user_id == current_user.user_id
    )

    if farm_id is not None:
        farm_query = farm_query.filter(
            Farm.farm_id == farm_id
        )

    farms = farm_query.all()

    farm_ids = [
        farm.farm_id
        for farm in farms
    ]

    if not farm_ids:
        return {
            "total_animals": 0,
            "healthy": 0,
            "under_observation": 0,
            "critical": 0,
            "health_percentage": 0.0,
        }

    animals = (
        db.query(Animal)
        .filter(
            Animal.farm_id.in_(farm_ids)
        )
        .all()
    )

    healthy = 0
    observation = 0
    critical = 0

    for animal in animals:

        latest = (
            db.query(
                AnimalHealthRecord
            )
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

        if latest is None:

            status_value = (
                animal.status
                or "Healthy"
            ).lower()

        else:

            status_value = (
                latest.status
                or ""
            ).lower()

            severity_value = (
                latest.severity
                or ""
            ).lower()

            condition_value = (
                latest.condition_name
                or ""
            ).lower()

            if (
                severity_value
                in ["critical", "severe"]
                or status_value
                in ["critical", "emergency"]
                or condition_value
                in ["critical", "severe", "emergency"]
            ):
                critical += 1
                continue

            if (
                severity_value
                in ["moderate", "medium"]
                or status_value
                in [
                    "open",
                    "observation",
                    "under observation",
                    "monitoring",
                ]
                or condition_value
                in [
                    "observation",
                    "under observation",
                    "monitoring",
                    "sick",
                ]
            ):
                observation += 1
                continue

            status_value = (
                condition_value
                or "healthy"
            )

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
            observation += 1

        else:
            healthy += 1

    total = len(animals)

    health_percentage = (
        round(
            (healthy / total) * 100,
            1,
        )
        if total > 0
        else 0.0
    )

    return {
        "total_animals": total,
        "healthy": healthy,
        "under_observation": observation,
        "critical": critical,
        "health_percentage":
            health_percentage,
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

    farm_ids = [
        farm.farm_id
        for farm in farms
    ]

    if not farm_ids:
        return {
            "period": "This Month",
            "milk_litres": 0.0,
            "eggs": 0,
            "wool_kg": 0.0,
            "targets": {
                "milk_litres": MILK_TARGET,
                "eggs": EGG_TARGET,
                "wool_kg": WOOL_TARGET,
            },
        }

    milk = (
        db.query(
            func.sum(
                MilkProduction.total_litres
            )
        )
        .join(
            Animal,
            Animal.animal_id
            == MilkProduction.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            MilkProduction.production_date
            >= start_date,
            MilkProduction.production_date
            < end_date,
        )
        .scalar()
    )

    eggs = (
        db.query(
            func.sum(
                EggProduction.egg_count
            )
        )
        .join(
            Animal,
            Animal.animal_id
            == EggProduction.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            EggProduction.production_date
            >= start_date,
            EggProduction.production_date
            < end_date,
        )
        .scalar()
    )

    wool = (
        db.query(
            func.sum(
                WoolRecord.wool_weight
            )
        )
        .join(
            Animal,
            Animal.animal_id
            == WoolRecord.animal_id,
        )
        .filter(
            Animal.farm_id.in_(farm_ids),
            WoolRecord.shearing_date
            >= start_date,
            WoolRecord.shearing_date
            < end_date,
        )
        .scalar()
    )

    return {

        "period":
            "This Month",

        "milk_litres":
            round(
                float(milk or 0),
                2,
            ),

        "eggs":
            int(
                eggs or 0
            ),

        "wool_kg":
            round(
                float(wool or 0),
                2,
            ),

        "targets": {

            "milk_litres":
                MILK_TARGET,

            "eggs":
                EGG_TARGET,

            "wool_kg":
                WOOL_TARGET,
        },
    }

