from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.database import Base

if TYPE_CHECKING:
    from app.models.environment import CloudEnvironment
    from app.models.relationship import ResourceRelationship


class CloudResource(Base):
    __tablename__ = "cloud_resources"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    environment_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("cloud_environments.id", ondelete="CASCADE"), nullable=False
    )
    resource_type: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    region: Mapped[str] = mapped_column(String(50), default="us-east-1")
    state: Mapped[str] = mapped_column(String(30), default="available")
    # Use JSON for SQLite compat; Postgres will use JSONB via dialect override
    properties: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    environment: Mapped[CloudEnvironment] = relationship(  # noqa: F821
        back_populates="resources"
    )
    outgoing_relationships: Mapped[list[ResourceRelationship]] = relationship(  # noqa: F821
        back_populates="source",
        foreign_keys="ResourceRelationship.source_id",
        cascade="all, delete-orphan",
    )
    incoming_relationships: Mapped[list[ResourceRelationship]] = relationship(  # noqa: F821
        back_populates="target",
        foreign_keys="ResourceRelationship.target_id",
        cascade="all, delete-orphan",
    )
