from fastapi import APIRouter, HTTPException

from ...schemas.ai_schemas import AttentionHeatmapRequest
from ...services.ai_service import ai_service

router = APIRouter()


@router.post("/attention-heatmap")
async def generate_attention_heatmap(request: AttentionHeatmapRequest):
    """Generate attention heatmap predictions for canvas elements."""
    try:
        system_prompt = """You are an eye-tracking prediction AI that simulates viewer gaze patterns for advertisements.

Based on the canvas elements provided, predict attention hotspots. Consider:
1. F-pattern and Z-pattern reading behavior
2. Faces and eyes attract immediate attention
3. High-contrast areas draw focus
4. Text (especially headlines) gets early attention
5. CTAs and buttons are natural endpoints
6. Motion/implied motion in images
7. Rule of thirds placement
8. Logo placement patterns

Return a JSON array of attention zones with intensity (0-100):
{
  "zones": [
    { "x": number, "y": number, "radius": number, "intensity": number, "label": string, "order": number }
  ],
  "gazeOrder": ["element1", "element2", ...],
  "summary": "Brief description of expected viewing pattern"
}

Coordinates should be in percentage (0-100) relative to canvas size."""

        elements_desc = []
        for i, el in enumerate(request.elements):
            x_percent = ((el.left + el.width / 2) / request.canvasWidth * 100)
            y_percent = ((el.top + el.height / 2) / request.canvasHeight * 100)
            text_info = f' ("{el.text[:30]}")' if el.text else ''
            elements_desc.append(
                f"{i + 1}. {el.type}{text_info}: center at {x_percent:.1f}%x, {y_percent:.1f}%y, size {el.width}x{el.height}px"
            )

        user_prompt = f"""Analyze this {request.format} creative ({request.canvasWidth}x{request.canvasHeight}px) and predict viewer attention patterns:

Elements on canvas:
{chr(10).join(elements_desc)}

Generate attention hotspots predicting where viewers will look first, second, etc."""

        response = await ai_service.chat_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.2,
        )

        content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
        heatmap_data = ai_service.extract_json_from_response(content)

        return heatmap_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
