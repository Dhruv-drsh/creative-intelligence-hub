from fastapi import APIRouter, HTTPException

from ...schemas.ai_schemas import ColorPsychologyRequest
from ...services.ai_service import ai_service

router = APIRouter()


@router.post("/color-psychology")
async def analyze_color_psychology(request: ColorPsychologyRequest):
    """Get color psychology analysis and recommendations."""
    try:
        system_prompt = """You are an expert in color psychology and marketing. Analyze emotions and provide color recommendations.

Return JSON:
{
  "primaryRecommendations": [
    { "color": "#hex", "name": "Color Name", "emotion": "primary emotion", "strength": 0-100 }
  ],
  "complementaryPalette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "psychologyInsights": {
    "primaryEmotion": "description",
    "secondaryEmotions": ["emotion1", "emotion2"],
    "culturalConsiderations": "notes on cultural meanings",
    "industryFit": "how colors fit the industry"
  },
  "usageGuidelines": {
    "backgrounds": "recommendation",
    "text": "recommendation",
    "accents": "recommendation",
    "ctaButtons": "recommendation"
  }
}"""

        existing_colors = ""
        if request.existingColors:
            existing_colors = f"\nExisting brand colors: {', '.join(request.existingColors)}"

        user_prompt = f"""Provide color psychology analysis for:
Target emotion: {request.targetEmotion}
Industry: {request.industry}{existing_colors}

Generate comprehensive color recommendations."""

        response = await ai_service.chat_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.4,
        )

        content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
        color_analysis = ai_service.extract_json_from_response(content)

        return {
            "colorAnalysis": color_analysis,
            "targetEmotion": request.targetEmotion,
            "industry": request.industry,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
