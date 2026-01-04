from fastapi import APIRouter, HTTPException

from ...schemas.ai_schemas import PerformancePredictionsRequest
from ...services.ai_service import ai_service

router = APIRouter()


@router.post("/performance-predictions")
async def predict_performance(request: PerformancePredictionsRequest):
    """Predict advertising performance metrics."""
    try:
        system_prompt = """You are an advertising performance analyst. Predict engagement metrics based on creative analysis.

Return JSON:
{
  "predictions": {
    "ctr": { "value": 0.0, "range": [min, max], "confidence": 0-100 },
    "engagement": { "value": 0.0, "range": [min, max], "confidence": 0-100 },
    "conversion": { "value": 0.0, "range": [min, max], "confidence": 0-100 },
    "recall": { "value": 0.0, "range": [min, max], "confidence": 0-100 }
  },
  "benchmarks": {
    "industry": "industry name",
    "averageCtr": 0.0,
    "topPerformerCtr": 0.0
  },
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "overallScore": 0-100
}"""

        analysis = request.canvasAnalysis
        user_prompt = f"""Predict performance for this creative:
Format: {analysis.get('format', 'Unknown')}
Elements: {len(analysis.get('elements', []))} objects
Colors: {analysis.get('colorAnalysis', 'Not analyzed')}
Text content: {analysis.get('textContent', 'None')}

Provide performance predictions and recommendations."""

        response = await ai_service.chat_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.3,
        )

        content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
        predictions = ai_service.extract_json_from_response(content)

        return predictions

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
