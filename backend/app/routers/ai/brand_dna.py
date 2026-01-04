from fastapi import APIRouter, HTTPException

from ...schemas.ai_schemas import BrandDNARequest
from ...services.ai_service import ai_service

router = APIRouter()


@router.post("/brand-dna")
async def extract_brand_dna(request: BrandDNARequest):
    """Extract brand DNA from an image and generate a brand kit."""
    try:
        if not request.imageUrl and not request.imageBase64:
            raise HTTPException(status_code=400, detail="Either imageUrl or imageBase64 is required")

        system_prompt = """You are an expert brand analyst specializing in visual identity extraction.

Analyze the provided product or brand image and extract detailed brand DNA. Return a JSON object with:
{
  "brandDNA": {
    "personality": ["trait1", "trait2", "trait3"],
    "values": ["value1", "value2", "value3"],
    "tone": "description of brand voice/tone",
    "visualStyle": "description of visual aesthetic",
    "targetAudience": "description of ideal customer",
    "industryCategory": "industry or category",
    "colorMood": "emotional association of colors",
    "typography": "suggested typography style"
  },
  "extractedColors": {
    "primary": "#hexcolor",
    "secondary": "#hexcolor",
    "accent": "#hexcolor",
    "background": "#hexcolor",
    "text": "#hexcolor"
  },
  "suggestedFonts": {
    "heading": "font name",
    "body": "font name"
  }
}"""

        image_context = ""
        if request.imageUrl:
            image_context = f"Image URL: {request.imageUrl}"
        elif request.imageBase64:
            image_context = "Analyze the provided base64 image"

        user_prompt = f"""Analyze this brand/product image and extract the brand DNA.

{image_context}
{f'Brand Name: {request.brandName}' if request.brandName else ''}

Extract colors, personality traits, and suggest appropriate fonts."""

        response = await ai_service.chat_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.3,
        )

        content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
        brand_data = ai_service.extract_json_from_response(content)

        # Build brand kit
        brand_kit = {
            "primaryColor": brand_data.get("extractedColors", {}).get("primary", "#22C55E"),
            "secondaryColor": brand_data.get("extractedColors", {}).get("secondary", "#38BDF8"),
            "accentColor": brand_data.get("extractedColors", {}).get("accent", "#F59E0B"),
            "fontHeading": brand_data.get("suggestedFonts", {}).get("heading", "Inter"),
            "fontBody": brand_data.get("suggestedFonts", {}).get("body", "Inter"),
        }

        return {
            "brandDNA": brand_data.get("brandDNA", {}),
            "brandKit": brand_kit,
            "message": "Brand DNA extracted successfully",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
