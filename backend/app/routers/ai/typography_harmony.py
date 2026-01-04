from fastapi import APIRouter, HTTPException

from ...schemas.ai_schemas import TypographyHarmonyRequest
from ...services.ai_service import ai_service

router = APIRouter()


@router.post("/typography-harmony")
async def suggest_typography(request: TypographyHarmonyRequest):
    """Get typography pairing suggestions."""
    try:
        system_prompt = """You are a typography expert. Suggest font pairings that create visual harmony.

Return JSON:
{
  "suggestions": [
    {
      "heading": "font name",
      "body": "font name",
      "compatibility": 0-100,
      "mood": "description",
      "useCase": "best for..."
    }
  ],
  "currentAnalysis": {
    "headingStyle": "classification",
    "bodyStyle": "classification",
    "harmonyScore": 0-100,
    "improvements": ["suggestion1", "suggestion2"]
  },
  "categories": {
    "modern": [{ "heading": "font", "body": "font" }],
    "elegant": [{ "heading": "font", "body": "font" }],
    "creative": [{ "heading": "font", "body": "font" }],
    "minimal": [{ "heading": "font", "body": "font" }]
  }
}"""

        current_fonts = ""
        if request.currentHeadingFont or request.currentBodyFont:
            current_fonts = f"\nCurrent fonts - Heading: {request.currentHeadingFont or 'None'}, Body: {request.currentBodyFont or 'None'}"

        context = ""
        if request.context:
            context = f"\nContext: {request.context}"

        user_prompt = f"""Suggest typography pairings for:
Brand Style: {request.brandStyle}{current_fonts}{context}

Provide harmonious font pairing recommendations."""

        response = await ai_service.chat_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.4,
        )

        content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
        suggestions = ai_service.extract_json_from_response(content)

        return {
            "suggestions": suggestions.get("suggestions", []),
            "currentAnalysis": suggestions.get("currentAnalysis", {}),
            "categories": suggestions.get("categories", {}),
            "message": "Typography suggestions generated successfully",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
