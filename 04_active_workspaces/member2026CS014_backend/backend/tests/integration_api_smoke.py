"""Run against a locally started AgroLens API instance.

This intentionally creates uniquely named test records and never deletes or
updates records, so it is safe to use with an existing development database.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from urllib.error import HTTPError
from urllib.request import Request, urlopen


BASE_URL = "http://127.0.0.1:8011"
RUN_ID = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f")


def request(method: str, path: str, payload=None, token: str | None = None):
    body = None if payload is None else json.dumps(payload).encode()
    headers = {"Accept": "application/json"}
    if body is not None:
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"

    http_request = Request(
        f"{BASE_URL}{path}",
        data=body,
        headers=headers,
        method=method,
    )
    try:
        with urlopen(http_request, timeout=20) as response:
            return response.status, json.loads(response.read())
    except HTTPError as error:
        raise AssertionError(
            f"{method} {path} returned {error.code}: {error.read().decode()}"
        ) from error


def assert_status(expected: int, actual: int, name: str):
    if actual != expected:
        raise AssertionError(f"{name}: expected {expected}, got {actual}")
    print(f"PASS {name}")


def main():
    status, _ = request("GET", "/")
    assert_status(200, status, "root health endpoint")

    status, database_result = request("GET", "/database-test")
    assert_status(200, status, "database connection endpoint")
    if database_result.get("connection") != "Successful":
        raise AssertionError(f"database connection endpoint: {database_result}")

    email = f"agrolens.smoke.{RUN_ID}@example.invalid"
    password = "AgroLensSmokePass123!"
    status, _ = request(
        "POST",
        "/api/auth/register",
        {
            "full_name": "AgroLens API Smoke Test",
            "email": email,
            "phone": None,
            "password": password,
        },
    )
    assert_status(200, status, "registration")

    status, login_result = request(
        "POST",
        "/api/auth/login",
        {"email": email, "password": password},
    )
    assert_status(200, status, "login")
    token = login_result.get("access_token")
    if not token or login_result.get("token_type") != "bearer":
        raise AssertionError("login response did not include a bearer access token")

    status, farm = request(
        "POST",
        "/api/farms/",
        {
            "farm_name": f"Smoke Farm {RUN_ID}",
            "village": "Test Village",
            "district": "Test District",
            "state": "Test State",
            "total_land": 1.5,
        },
        token,
    )
    assert_status(201, status, "authenticated farm POST")
    farm_id = farm["farm_id"]

    status, farms = request("GET", "/api/farms/", token=token)
    assert_status(200, status, "authenticated farm GET")
    if not any(item["farm_id"] == farm_id for item in farms):
        raise AssertionError("created farm not returned by authenticated farm GET")

    status, animal = request(
        "POST",
        "/api/animals/",
        {
            "farm_id": farm_id,
            "tag_number": f"SMOKE-{RUN_ID}",
            "species": "Cattle",
            "breed": "Test Breed",
            "gender": "Female",
            "birth_date": "2024-01-01",
            "weight": 425.5,
            "status": "Healthy",
        },
        token,
    )
    assert_status(200, status, "authenticated animal POST")
    animal_id = animal["animal_id"]

    status, animals = request("GET", "/api/animals/", token=token)
    assert_status(200, status, "authenticated animal GET")
    if not any(item["animal_id"] == animal_id for item in animals):
        raise AssertionError("created animal not returned by authenticated animal GET")

    status, milk = request(
        "POST",
        "/api/milk/",
        {
            "animal_id": animal_id,
            "production_date": "2026-08-12",
            "morning_litres": 8.5,
            "evening_litres": 7.25,
        },
        token,
    )
    assert_status(201, status, "authenticated milk POST")
    milk_id = milk["milk_id"]
    if milk["total_litres"] != 15.75:
        raise AssertionError("milk total was not calculated correctly")

    status, milk_records = request("GET", "/api/milk/", token=token)
    assert_status(200, status, "authenticated milk GET")
    if not any(item["milk_id"] == milk_id for item in milk_records):
        raise AssertionError("created milk record not returned by authenticated milk GET")


if __name__ == "__main__":
    main()
