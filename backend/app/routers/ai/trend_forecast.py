from fastapi import APIRouter, HTTPException

from ...schemas.ai_schemas import TrendForecastRequest
from ...services.ai_service import ai_service

router = APIRouter()


@router.post("/trend-forecast")
async def forecast_trends(request: TrendForecastRequest):
    """Get creative trend forecasts for an industry."""
    try:
        system_prompt = """You are a creative trends analyst. Provide trend forecasts for advertising and design.

Return JSON:
{
  "currentTrends": [
    { "name": "trend name", "description": "description", "momentum": "rising|stable|declining", "adoptionRate": 0-100 }
  ],
  "emergingTrends": [
    { "name": "trend name", "description": "description", "timeToMainstream": "months", "potentialImpact": "high|medium|low" }
  ],
  "decliningTrends": [
    { "name": "trend name", "description": "description", "recommendation": "action to take" }
  ],
  "recommendations": [
    { "action": "what to do", "priority": "high|medium|low", "impact": "expected impact" }
  ],
  "industryInsights": "overall industry observations"
}"""

        audience = ""
        if request.targetAudience:
            audience = f"\nTarget Audience: {request.targetAudience}"

        user_prompt = f"""Provide trend forecasts for:
Industry: {request.industry}
Platform: {request.platform}{audience}

Analyze current and emerging creative trends."""

        response = await ai_service.chat_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.5,
        )

        content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
        trends = ai_service.extract_json_from_response(content)

        return trends

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
