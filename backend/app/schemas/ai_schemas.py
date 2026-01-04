from pydantic import BaseModel
from typing import Optional, Any


# Attention Heatmap
class CanvasElement(BaseModel):
    type: str
    left: float
    top: float
    width: float
    height: float
    colors: Optional[list[str]] = None
    text: Optional[str] = None
    fontSize: Optional[float] = None


class AttentionHeatmapRequest(BaseModel):
    elements: list[CanvasElement]
    canvasWidth: int
    canvasHeight: int
    format: str


# Brand DNA
class BrandDNARequest(BaseModel):
    imageUrl: Optional[str] = None
    imageBase64: Optional[str] = None
    brandName: Optional[str] = None


# Campaign Set
class CampaignSetRequest(BaseModel):
    canvasState: dict[str, Any]
    campaignName: str
    productDescription: str
    selectedChannels: Optional[list[str]] = None


# Canvas Control
class CanvasControlRequest(BaseModel):
    prompt: str
    canvasState: Optional[dict[str, Any]] = None


# Color Psychology
class ColorPsychologyRequest(BaseModel):
    targetEmotion: str
    industry: str
    existingColors: Optional[list[str]] = None


# Copywriting
class CopywritingRequest(BaseModel):
    productName: str
    productType: str
    campaignType: str
    targetAudience: Optional[str] = None
    tone: Optional[str] = None
    existingCopy: Optional[str] = None


# Creative Multiverse
class CreativeMultiverseRequest(BaseModel):
    canvasState: dict[str, Any]
    productDescription: str
    selectedStyles: Optional[list[str]] = None


# Emotion Design
class EmotionDesignRequest(BaseModel):
    emotion: str
    intensity: float
    context: Optional[str] = None


# Performance Predictions
class PerformancePredictionsRequest(BaseModel):
    canvasAnalysis: dict[str, Any]


# Trend Forecast
class TrendForecastRequest(BaseModel):
    industry: str
    platform: str
    targetAudience: Optional[str] = None


# Typography Harmony
class TypographyHarmonyRequest(BaseModel):
    brandStyle: str
    currentHeadingFont: Optional[str] = None
    currentBodyFont: Optional[str] = None
    context: Optional[str] = None


# Visual Auditor
class VisualAuditorRequest(BaseModel):
    canvasState: dict[str, Any]
    imageBase64: Optional[str] = None
    designGoal: Optional[str] = None


# Generate Background
class GenerateBackgroundRequest(BaseModel):
    prompt: str
    productContext: Optional[str] = None
