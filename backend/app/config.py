import os


class Settings:
    database_url: str = os.getenv(
        "DATABASE_URL", "postgresql://taskflow:taskflow@localhost:5432/taskflow"
    )
    secret_key: str = os.getenv("SECRET_KEY", "dev-secret-change-me")
    access_token_expire_minutes: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    )


settings = Settings()
