from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from .config import get_settings
from .database import init_db
from .routers import auth, profiles, projects, brand_kits, templates, storage
from .routers.ai import (
    attention_heatmap,
    brand_dna,
    campaign_set,
    canvas_control,
    color_psychology,
    copywriting,
    creative_multiverse,
    emotion_design,
    performance_predictions,
    trend_forecast,
    typography_harmony,
    visual_auditor,
    generate_background,
)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    
    # Create storage directory
    os.makedirs(os.path.join(settings.storage_root, "assets"), exist_ok=True)
    
    yield
    
    # Shutdown
    pass


app = FastAPI(
    title="Creative Hub API",
    description="FastAPI backend for Creative Hub application",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for storage
app.mount("/storage", StaticFiles(directory=settings.storage_root), name="storage")

# Auth & CRUD routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(profiles.router, prefix="/api/profiles", tags=["Profiles"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(brand_kits.router, prefix="/api/brand-kits", tags=["Brand Kits"])
app.include_router(templates.router, prefix="/api/templates", tags=["Templates"])
app.include_router(storage.router, prefix="/api/storage", tags=["Storage"])

# AI routers
app.include_router(attention_heatmap.router, prefix="/api/ai", tags=["AI"])
app.include_router(brand_dna.router, prefix="/api/ai", tags=["AI"])
app.include_router(campaign_set.router, prefix="/api/ai", tags=["AI"])
app.include_router(canvas_control.router, prefix="/api/ai", tags=["AI"])
app.include_router(color_psychology.router, prefix="/api/ai", tags=["AI"])
app.include_router(copywriting.router, prefix="/api/ai", tags=["AI"])
app.include_router(creative_multiverse.router, prefix="/api/ai", tags=["AI"])
app.include_router(emotion_design.router, prefix="/api/ai", tags=["AI"])
app.include_router(performance_predictions.router, prefix="/api/ai", tags=["AI"])
app.include_router(trend_forecast.router, prefix="/api/ai", tags=["AI"])
app.include_router(typography_harmony.router, prefix="/api/ai", tags=["AI"])
app.include_router(visual_auditor.router, prefix="/api/ai", tags=["AI"])
app.include_router(generate_background.router, prefix="/api/ai", tags=["AI"])


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)
