from fastapi import APIRouter, HTTPException
from typing import Any

from ...schemas.ai_schemas import CreativeMultiverseRequest
from ...services.ai_service import ai_service

router = APIRouter()

STYLE_VARIATIONS = [
    {"id": "minimalist", "name": "Minimalist", "description": "Clean, simple, lots of white space"},
    {"id": "bold", "name": "Bold & Vibrant", "description": "Strong colors, impactful typography"},
    {"id": "elegant", "name": "Elegant", "description": "Sophisticated, refined, luxury feel"},
    {"id": "playful", "name": "Playful", "description": "Fun, colorful, energetic"},
    {"id": "retro", "name": "Retro", "description": "Vintage-inspired, nostalgic"},
    {"id": "futuristic", "name": "Futuristic", "description": "Modern, tech-forward, innovative"},
    {"id": "organic", "name": "Organic", "description": "Natural, earthy, sustainable"},
    {"id": "brutalist", "name": "Brutalist", "description": "Raw, bold, unconventional"},
]


def get_fallback_variation(style: dict[str, Any]) -> dict[str, Any]:
    """Generate a fallback canvas for a style."""
    return {
        "version": "5.3.0",
        "objects": [
            {
                "type": "rect",
                "left": 0,
                "top": 0,
                "width": 1080,
                "height": 1080,
                "fill": "#1a1a2e",
            },
            {
                "type": "text",
                "left": 540,
                "top": 540,
                "text": style["name"],
                "fontSize": 48,
                "fill": "#ffffff",
                "originX": "center",
                "originY": "center",
            },
        ],
    }


@router.post("/creative-multiverse")
async def generate_creative_multiverse(request: CreativeMultiverseRequest):
    """Generate multiple creative variations in different styles."""
    try:
        # Filter styles
        if request.selectedStyles:
            styles = [s for s in STYLE_VARIATIONS if s["id"] in request.selectedStyles]
        else:
            styles = STYLE_VARIATIONS[:4]  # Default to first 4

        variations = []

        for style in styles[:8]:  # Limit to 8 variations
            system_prompt = f"""You are an expert creative designer. Generate a fabric.js compatible JSON canvas layout in the "{style['name']}" style.

Style description: {style['description']}

Return only valid JSON that can be loaded into fabric.js with version "5.3.0"."""

            user_prompt = f"""Create a creative design for:
Product: {request.productDescription}
Style: {style['name']} - {style['description']}
Canvas size: 1080x1080px

Generate a professional advertising layout in this exact style."""

            try:
                response = await ai_service.chat_completion(
                    system_prompt=system_prompt,
                    user_prompt=user_prompt,
                    temperature=0.8,
                )

                content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
                canvas_data = ai_service.extract_json_from_response(content)
            except Exception:
                canvas_data = get_fallback_variation(style)

            variations.append({
                "id": style["id"],
                "name": style["name"],
                "description": style["description"],
                "canvasData": canvas_data,
            })

        return {
            "variations": variations,
            "allStyles": STYLE_VARIATIONS,
            "message": "Creative variations generated successfully",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
