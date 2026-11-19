from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "SentinelGrid"
    debug: bool = False
    version: str = "0.1.0"

    database_url: str = "postgresql+asyncpg://sentinelgrid:sentinelgrid@localhost:5432/sentinelgrid"

    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Agent AI settings
    bedrock_region: str = "us-east-1"
    offline_mode: bool = True  # run deterministic agents without LLM calls


settings = Settings()
