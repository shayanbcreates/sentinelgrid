import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.environment import CloudEnvironment
from app.models.relationship import ResourceRelationship
from app.models.resource import CloudResource
from app.schemas.resource import (
    RelationshipCreate,
    RelationshipRead,
    ResourceCreate,
    ResourceRead,
    ResourceUpdate,
)

router = APIRouter(tags=["resources"])

DB = Annotated[AsyncSession, Depends(get_db)]


async def _get_resource_or_404(db: AsyncSession, resource_id: uuid.UUID) -> CloudResource:
    result = await db.get(CloudResource, resource_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    return result


@router.get("/environments/{env_id}/resources", response_model=list[ResourceRead])
async def list_resources(env_id: uuid.UUID, db: DB) -> list[CloudResource]:
    if await db.get(CloudEnvironment, env_id) is None:
        raise HTTPException(status_code=404, detail="Environment not found")
    result = await db.execute(
        select(CloudResource).where(CloudResource.environment_id == env_id)
    )
    return list(result.scalars().all())


@router.post("/environments/{env_id}/resources", response_model=ResourceRead, status_code=201)
async def create_resource(
    env_id: uuid.UUID, payload: ResourceCreate, db: DB
) -> CloudResource:
    if await db.get(CloudEnvironment, env_id) is None:
        raise HTTPException(status_code=404, detail="Environment not found")
    resource = CloudResource(environment_id=env_id, **payload.model_dump())
    db.add(resource)
    await db.commit()
    await db.refresh(resource)
    return resource


@router.get("/resources/{resource_id}", response_model=ResourceRead)
async def get_resource(resource_id: uuid.UUID, db: DB) -> CloudResource:
    return await _get_resource_or_404(db, resource_id)


@router.patch("/resources/{resource_id}", response_model=ResourceRead)
async def update_resource(
    resource_id: uuid.UUID, payload: ResourceUpdate, db: DB
) -> CloudResource:
    resource = await _get_resource_or_404(db, resource_id)
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(resource, field, value)
    await db.commit()
    await db.refresh(resource)
    return resource


@router.delete("/resources/{resource_id}", status_code=204)
async def delete_resource(resource_id: uuid.UUID, db: DB) -> None:
    resource = await _get_resource_or_404(db, resource_id)
    await db.delete(resource)
    await db.commit()


@router.post("/relationships", response_model=RelationshipRead, status_code=201)
async def create_relationship(payload: RelationshipCreate, db: DB) -> ResourceRelationship:
    if await db.get(CloudResource, payload.source_id) is None:
        raise HTTPException(status_code=404, detail="Source resource not found")
    if await db.get(CloudResource, payload.target_id) is None:
        raise HTTPException(status_code=404, detail="Target resource not found")
    rel = ResourceRelationship(**payload.model_dump())
    db.add(rel)
    await db.commit()
    await db.refresh(rel)
    return rel
