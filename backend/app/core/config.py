from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "CampusRAG"
    debug: bool = True


settings = Settings()