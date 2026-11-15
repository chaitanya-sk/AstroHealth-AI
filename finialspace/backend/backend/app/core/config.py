import os
from typing import Optional


class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "AstroHealth AI")
    PROJECT_DESCRIPTION: str = os.getenv(
        "PROJECT_DESCRIPTION",
        "Integrated Astronaut Health Monitoring and Decision-Support Platform"
    )
    VERSION: str = os.getenv("VERSION", "1.0.0")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api")
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./astrohealth.db")
    
    # CORS Configuration
    CORS_ORIGINS: str = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"
    )

    @property
    def cors_origins_list(self) -> list:
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    # Path configurations
    APP_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    BACKEND_DIR: str = os.path.dirname(APP_DIR)
    TRAINED_MODELS_DIR: str = os.getenv(
        "TRAINED_MODELS_DIR",
        os.path.join(BACKEND_DIR, "trained_models")
    )
    DATASETS_DIR: str = os.getenv(
        "DATASETS_DIR",
        os.path.join(BACKEND_DIR, "datasets")
    )
    
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")


settings = Settings()
