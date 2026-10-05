def create_request(client, headers, **overrides):
    payload = {
        "title": "Pothole on Hauptstraße",
        "description": "Large pothole near house number 12, risk to cyclists.",
        "category": "road_damage",
        "location": "Hauptstraße 12",
    }
    payload.update(overrides)
    return client.post("/requests/", json=payload, headers=headers)


def test_create_request(client, auth_headers):
    resp = create_request(client, auth_headers)
    assert resp.status_code == 201
    body = resp.json()
    assert body["title"] == "Pothole on Hauptstraße"
    assert body["status"] == "submitted"


def test_create_request_validates_min_length(client, auth_headers):
    resp = create_request(client, auth_headers, description="short")
    assert resp.status_code == 422


def test_list_requests_only_shows_own(client, auth_headers):
    create_request(client, auth_headers)
    create_request(client, auth_headers, title="Streetlight out")

    # Second citizen should see none of the first citizen's requests.
    client.post(
        "/auth/register",
        json={"email": "other@example.com", "password": "securepass1", "full_name": "Other Citizen"},
    )
    login = client.post("/auth/login", data={"username": "other@example.com", "password": "securepass1"})
    other_headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    resp = client.get("/requests/", headers=other_headers)
    assert resp.status_code == 200
    assert resp.json() == []

    resp_own = client.get("/requests/", headers=auth_headers)
    assert len(resp_own.json()) == 2


def test_cannot_view_others_request_by_id(client, auth_headers):
    created = create_request(client, auth_headers).json()

    client.post(
        "/auth/register",
        json={"email": "intruder@example.com", "password": "securepass1", "full_name": "Intruder"},
    )
    login = client.post("/auth/login", data={"username": "intruder@example.com", "password": "securepass1"})
    intruder_headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    resp = client.get(f"/requests/{created['id']}", headers=intruder_headers)
    assert resp.status_code == 403


def test_non_admin_cannot_update_status(client, auth_headers):
    created = create_request(client, auth_headers).json()
    resp = client.patch(
        f"/requests/{created['id']}/status", json={"status": "resolved"}, headers=auth_headers
    )
    assert resp.status_code == 403


def test_delete_own_request(client, auth_headers):
    created = create_request(client, auth_headers).json()
    resp = client.delete(f"/requests/{created['id']}", headers=auth_headers)
    assert resp.status_code == 204

    resp_get = client.get(f"/requests/{created['id']}", headers=auth_headers)
    assert resp_get.status_code == 404
