from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    secret_key: str = ""
    hash_algorithm: str = "HS256"
    expiration_minutes: int = 7200
    admin_username: str = ""
    admin_pass: str = ""
    dbname: str = "main.db"


settings = Settings()
