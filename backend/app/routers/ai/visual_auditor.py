from fastapi import APIRouter, HTTPException

from ...schemas.ai_schemas import VisualAuditorRequest
from ...services.ai_service import ai_service

router = APIRouter()


@router.post("/visual-auditor")
async def audit_visual(request: VisualAuditorRequest):
    """Audit a visual design and provide feedback."""
    try:
        system_prompt = """You are an expert visual design auditor. Analyze designs and provide constructive feedback.

Return JSON:
{
  "overallScore": 0-100,
  "categories": {
    "composition": { "score": 0-100, "feedback": "description", "suggestions": ["suggestion1"] },
    "colorHarmony": { "score": 0-100, "feedback": "description", "suggestions": ["suggestion1"] },
    "typography": { "score": 0-100, "feedback": "description", "suggestions": ["suggestion1"] },
    "hierarchy": { "score": 0-100, "feedback": "description", "suggestions": ["suggestion1"] },
    "brandConsistency": { "score": 0-100, "feedback": "description", "suggestions": ["suggestion1"] },
    "accessibility": { "score": 0-100, "feedback": "description", "suggestions": ["suggestion1"] }
  },
  "strengths": ["strength1", "strength2"],
  "priorityFixes": [
    { "issue": "what's wrong", "fix": "how to fix", "impact": "high|medium|low" }
  ],
  "summary": "overall assessment"
}"""

        canvas_info = ""
        if request.canvasState:
            objects = request.canvasState.get("objects", [])
            canvas_info = f"\nCanvas has {len(objects)} objects"

        goal = ""
        if request.designGoal:
            goal = f"\nDesign Goal: {request.designGoal}"

        user_prompt = f"""Audit this design:{canvas_info}{goal}

Provide comprehensive design feedback and improvement suggestions."""

        response = await ai_service.chat_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.3,
        )

        content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
        audit = ai_service.extract_json_from_response(content)

        return audit

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
