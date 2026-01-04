from fastapi import APIRouter, HTTPException

from ...schemas.ai_schemas import EmotionDesignRequest
from ...services.ai_service import ai_service

router = APIRouter()


@router.post("/emotion-design")
async def generate_emotion_design(request: EmotionDesignRequest):
    """Generate design parameters based on emotion."""
    try:
        system_prompt = """You are an expert in emotional design and visual psychology. Translate emotions into visual design parameters.

Return JSON:
{
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "text": "#hex"
  },
  "typography": {
    "headingFont": "font name",
    "bodyFont": "font name",
    "headingWeight": "bold|normal|light",
    "letterSpacing": "tight|normal|wide"
  },
  "composition": {
    "layout": "centered|asymmetric|grid|organic",
    "spacing": "tight|balanced|airy",
    "alignment": "left|center|right|justified"
  },
  "effects": {
    "shadows": "none|subtle|dramatic",
    "gradients": true|false,
    "textures": "none|subtle|pronounced",
    "borders": "none|thin|bold"
  },
  "mood": {
    "description": "overall mood description",
    "intensity": 0-100,
    "warmth": "cool|neutral|warm"
  }
}"""

        context = ""
        if request.context:
            context = f"\nContext: {request.context}"

        user_prompt = f"""Generate design parameters for:
Emotion: {request.emotion}
Intensity: {request.intensity * 100}%{context}

Create visual parameters that evoke this emotion."""

        response = await ai_service.chat_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.5,
        )

        content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
        design_params = ai_service.extract_json_from_response(content)

        return {
            "designParams": design_params,
            "emotion": request.emotion,
            "intensity": request.intensity,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
