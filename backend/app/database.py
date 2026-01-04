from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from .config import get_settings
from .models.user import User
from .models.profile import Profile
from .models.project import Project
from .models.brand_kit import BrandKit
from .models.template import Template
from .models.template_favorite import TemplateFavorite

settings = get_settings()

# MongoDB client instance
client: AsyncIOMotorClient = None


async def connect_db():
    """Initialize MongoDB connection and Beanie ODM."""
    global client
    client = AsyncIOMotorClient(settings.mongodb_url)
    
    # Initialize beanie with document models
    await init_beanie(
        database=client[settings.mongodb_db_name],
        document_models=[
            User,
            Profile,
            Project,
            BrandKit,
            Template,
            TemplateFavorite,
        ]
    )
    print(f"Connected to MongoDB: {settings.mongodb_db_name}")


async def disconnect_db():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        print("Disconnected from MongoDB")


def get_database():
    """Get the database instance."""
    return client[settings.mongodb_db_name]
