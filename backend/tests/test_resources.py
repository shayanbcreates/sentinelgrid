import pytest
from httpx import AsyncClient


@pytest.fixture
async def env_id(client: AsyncClient) -> str:
    resp = await client.post("/api/v1/environments", json={"name": "Test Env"})
    return str(resp.json()["id"])


@pytest.mark.asyncio
async def test_list_resources_empty(client: AsyncClient, env_id: str) -> None:
    response = await client.get(f"/api/v1/environments/{env_id}/resources")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_create_resource(client: AsyncClient, env_id: str) -> None:
    payload = {
        "resource_type": "vpc",
        "name": "main-vpc",
        "region": "us-east-1",
        "properties": {"cidr": "10.0.0.0/16"},
    }
    response = await client.post(f"/api/v1/environments/{env_id}/resources", json=payload)
    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "main-vpc"
    assert body["resource_type"] == "vpc"
    assert body["state"] == "available"
    assert body["environment_id"] == env_id
    assert body["properties"]["cidr"] == "10.0.0.0/16"


@pytest.mark.asyncio
async def test_get_resource(client: AsyncClient, env_id: str) -> None:
    created = (
        await client.post(
            f"/api/v1/environments/{env_id}/resources",
            json={"resource_type": "ec2_instance", "name": "web-01"},
        )
    ).json()
    response = await client.get(f"/api/v1/resources/{created['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


@pytest.mark.asyncio
async def test_update_resource_state(client: AsyncClient, env_id: str) -> None:
    created = (
        await client.post(
            f"/api/v1/environments/{env_id}/resources",
            json={"resource_type": "ec2_instance", "name": "web-01"},
        )
    ).json()
    response = await client.patch(
        f"/api/v1/resources/{created['id']}", json={"state": "stopped"}
    )
    assert response.status_code == 200
    assert response.json()["state"] == "stopped"


@pytest.mark.asyncio
async def test_delete_resource(client: AsyncClient, env_id: str) -> None:
    created = (
        await client.post(
            f"/api/v1/environments/{env_id}/resources",
            json={"resource_type": "s3_bucket", "name": "my-bucket"},
        )
    ).json()
    response = await client.delete(f"/api/v1/resources/{created['id']}")
    assert response.status_code == 204
    assert (await client.get(f"/api/v1/resources/{created['id']}")).status_code == 404


@pytest.mark.asyncio
async def test_create_relationship(client: AsyncClient, env_id: str) -> None:
    vpc = (
        await client.post(
            f"/api/v1/environments/{env_id}/resources",
            json={"resource_type": "vpc", "name": "main-vpc"},
        )
    ).json()
    subnet = (
        await client.post(
            f"/api/v1/environments/{env_id}/resources",
            json={"resource_type": "subnet", "name": "public-subnet"},
        )
    ).json()
    response = await client.post(
        "/api/v1/relationships",
        json={
            "source_id": vpc["id"],
            "target_id": subnet["id"],
            "relationship_type": "contains",
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["source_id"] == vpc["id"]
    assert body["target_id"] == subnet["id"]
    assert body["relationship_type"] == "contains"
