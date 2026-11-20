import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class ResourceCreate(BaseModel):
    resource_type: str
    name: str
    region: str = "us-east-1"
    state: str = "available"
    properties: dict[str, Any] | None = None


class ResourceUpdate(BaseModel):
    name: str | None = None
    region: str | None = None
    state: str | None = None
    properties: dict[str, Any] | None = None


class ResourceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    environment_id: uuid.UUID
    resource_type: str
    name: str
    region: str
    state: str
    properties: dict[str, Any] | None
    created_at: datetime
    updated_at: datetime


class RelationshipCreate(BaseModel):
    source_id: uuid.UUID
    target_id: uuid.UUID
    relationship_type: str


class RelationshipRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    source_id: uuid.UUID
    target_id: uuid.UUID
    relationship_type: str
    created_at: datetime
