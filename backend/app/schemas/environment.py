import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EnvironmentCreate(BaseModel):
    name: str
    description: str | None = None
    region: str = "us-east-1"
    state: str = "active"


class EnvironmentUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    region: str | None = None
    state: str | None = None


class EnvironmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    description: str | None
    region: str
    state: str
    created_at: datetime
    updated_at: datetime
