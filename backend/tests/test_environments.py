import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_environments_empty(client: AsyncClient) -> None:
    response = await client.get("/api/v1/environments")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_create_environment(client: AsyncClient) -> None:
    payload = {"name": "Dev AWS", "description": "Development environment", "region": "us-east-1"}
    response = await client.post("/api/v1/environments", json=payload)
    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "Dev AWS"
    assert body["region"] == "us-east-1"
    assert body["state"] == "active"
    assert "id" in body
    assert "created_at" in body


@pytest.mark.asyncio
async def test_get_environment(client: AsyncClient) -> None:
    created = (await client.post("/api/v1/environments", json={"name": "Prod"})).json()
    response = await client.get(f"/api/v1/environments/{created['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


@pytest.mark.asyncio
async def test_get_environment_not_found(client: AsyncClient) -> None:
    response = await client.get("/api/v1/environments/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_environment(client: AsyncClient) -> None:
    created = (await client.post("/api/v1/environments", json={"name": "Old Name"})).json()
    response = await client.patch(
        f"/api/v1/environments/{created['id']}", json={"name": "New Name", "state": "inactive"}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "New Name"
    assert response.json()["state"] == "inactive"


@pytest.mark.asyncio
async def test_delete_environment(client: AsyncClient) -> None:
    created = (await client.post("/api/v1/environments", json={"name": "To Delete"})).json()
    response = await client.delete(f"/api/v1/environments/{created['id']}")
    assert response.status_code == 204
    assert (await client.get(f"/api/v1/environments/{created['id']}")).status_code == 404
