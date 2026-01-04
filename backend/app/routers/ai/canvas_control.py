from fastapi import APIRouter, HTTPException

from ...schemas.ai_schemas import CanvasControlRequest
from ...services.ai_service import ai_service

router = APIRouter()


@router.post("/canvas-control")
async def control_canvas(request: CanvasControlRequest):
    """Control canvas elements using natural language."""
    try:
        if not request.prompt:
            raise HTTPException(status_code=400, detail="Prompt is required")

        system_prompt = """You are an AI assistant that controls a fabric.js canvas. Parse natural language commands and return structured actions.

Available actions:
- add_text: Add text element {text, fontSize, color, position}
- add_shape: Add shape {type: rect|circle|triangle, fill, position, size}
- add_image: Add image {url, position, size}
- modify: Modify element {selector, properties}
- delete: Delete element {selector}
- arrange: Arrange elements {action: align|distribute, direction}
- style: Apply style {selector, styles}

Return JSON:
{
  "message": "Friendly response describing what you're doing",
  "commands": [
    { "action": "action_name", "targets": ["element_ids"], "params": {} }
  ]
}"""

        canvas_state = ""
        if request.canvasState:
            objects = request.canvasState.get("objects", [])
            canvas_state = f"\n\nCurrent canvas has {len(objects)} objects."

        user_prompt = f"""User command: {request.prompt}{canvas_state}

Parse this command and return the appropriate canvas actions."""

        response = await ai_service.chat_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.3,
        )

        content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
        result = ai_service.extract_json_from_response(content)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
