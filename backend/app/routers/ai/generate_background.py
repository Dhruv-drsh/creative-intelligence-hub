from fastapi import APIRouter, HTTPException

from ...schemas.ai_schemas import GenerateBackgroundRequest
from ...services.ai_service import ai_service

router = APIRouter()


@router.post("/generate-background")
async def generate_background(request: GenerateBackgroundRequest):
    """Generate an AI background image."""
    try:
        if not request.prompt:
            raise HTTPException(status_code=400, detail="Prompt is required")

        # Enhance prompt for better background generation
        enhanced_prompt = f"""Professional product photography background: {request.prompt}

Requirements:
- Clean, minimalist background suitable for product placement
- High resolution, commercial quality
- Soft, even lighting
- No text or watermarks
- Subtle gradients or textures only
{f'Product context: {request.productContext}' if request.productContext else ''}"""

        # Generate image
        image_url = await ai_service.generate_image(enhanced_prompt)

        if not image_url:
            raise HTTPException(status_code=500, detail="Failed to generate image")

        return {
            "imageUrl": image_url,
            "message": "Background generated successfully",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
