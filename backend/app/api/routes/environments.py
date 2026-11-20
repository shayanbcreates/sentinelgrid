import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.environment import CloudEnvironment
from app.schemas.environment import EnvironmentCreate, EnvironmentRead, EnvironmentUpdate

router = APIRouter(prefix="/environments", tags=["environments"])

DB = Annotated[AsyncSession, Depends(get_db)]


async def _get_or_404(db: AsyncSession, env_id: uuid.UUID) -> CloudEnvironment:
    result = await db.get(CloudEnvironment, env_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Environment not found")
    return result


@router.get("", response_model=list[EnvironmentRead])
async def list_environments(db: DB) -> list[CloudEnvironment]:
    result = await db.execute(select(CloudEnvironment))
    return list(result.scalars().all())


@router.post("", response_model=EnvironmentRead, status_code=201)
async def create_environment(payload: EnvironmentCreate, db: DB) -> CloudEnvironment:
    env = CloudEnvironment(**payload.model_dump())
    db.add(env)
    await db.commit()
    await db.refresh(env)
    return env


@router.get("/{env_id}", response_model=EnvironmentRead)
async def get_environment(env_id: uuid.UUID, db: DB) -> CloudEnvironment:
    return await _get_or_404(db, env_id)


@router.patch("/{env_id}", response_model=EnvironmentRead)
async def update_environment(
    env_id: uuid.UUID, payload: EnvironmentUpdate, db: DB
) -> CloudEnvironment:
    env = await _get_or_404(db, env_id)
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(env, field, value)
    await db.commit()
    await db.refresh(env)
    return env


@router.delete("/{env_id}", status_code=204)
async def delete_environment(env_id: uuid.UUID, db: DB) -> None:
    env = await _get_or_404(db, env_id)
    await db.delete(env)
    await db.commit()
