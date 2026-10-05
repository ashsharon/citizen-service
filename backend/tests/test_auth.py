def test_register_user(client):
    resp = client.post(
        "/auth/register",
        json={"email": "new@example.com", "password": "securepass1", "full_name": "New User"},
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["email"] == "new@example.com"
    assert "hashed_password" not in body  # never leak the hash


def test_register_duplicate_email_rejected(client):
    payload = {"email": "dupe@example.com", "password": "securepass1", "full_name": "Dupe"}
    client.post("/auth/register", json=payload)
    resp = client.post("/auth/register", json=payload)
    assert resp.status_code == 400


def test_login_success(client):
    client.post(
        "/auth/register",
        json={"email": "login@example.com", "password": "securepass1", "full_name": "Login User"},
    )
    resp = client.post("/auth/login", data={"username": "login@example.com", "password": "securepass1"})
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_login_wrong_password_rejected(client):
    client.post(
        "/auth/register",
        json={"email": "wrong@example.com", "password": "securepass1", "full_name": "Wrong Pw"},
    )
    resp = client.post("/auth/login", data={"username": "wrong@example.com", "password": "notright"})
    assert resp.status_code == 401


def test_protected_route_requires_token(client):
    resp = client.get("/requests/")
    assert resp.status_code == 401
