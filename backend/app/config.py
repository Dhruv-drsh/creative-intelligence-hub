from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # MongoDB Configuration
    mongodb_url: str = "mongodb+srv://dhruvarcade27_db_user:JUtINeHgADsQbxe7@drsh.tvyzxgr.mongodb.net/?appName=drsh"
    mongodb_db_name: str = "creative_hub"
    
    # JWT
    jwt_secret: str = "your-super-secret-jwt-key-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7
    
    # AI Service
    lovable_api_key: str = ""
    lovable_api_url: str = "https://ai.gateway.lovable.dev/v1/chat/completions"
    
    # Storage
    storage_root: str = "./storage"
    public_url_base: str = "http://localhost:8000/storage/v1/object/public/assets"
    
    # CORS
    frontend_url: str = "http://localhost:5173"
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Server
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
