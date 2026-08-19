from typing import Any

from pydantic import BaseModel


class ReportOverviewResponse(BaseModel):
    report_type: str
    period: str
    start_date: str
    end_date: str

    total_animals: int
    animals_change: int

    milk_production_litres: float
    milk_change_percent: float

    egg_production_count: int
    egg_change_percent: float

    wool_production_kg: float
    wool_change_percent: float

    animal_health_percent: float
    milk_performance_percent: float | None
    egg_performance_percent: float | None
    wool_performance_percent: float | None
    feed_efficiency_percent: float | None

    health_summary: dict[str, int]

    production_summary: dict[str, Any]

    insights: list[dict[str, str]]