import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# Use a dedicated in-memory-style SQLite file for tests, isolated from dev DB.
os.environ["DATABASE_URL"] = "sqlite:///./test_citizen_portal.db"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

TEST_DATABASE_URL = "sqlite:///./test_citizen_portal.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def auth_headers(client):
    client.post(
        "/auth/register",
        json={"email": "citizen@example.com", "password": "testpass123", "full_name": "Test Citizen"},
    )
    resp = client.post(
        "/auth/login",
        data={"username": "citizen@example.com", "password": "testpass123"},
    )
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
