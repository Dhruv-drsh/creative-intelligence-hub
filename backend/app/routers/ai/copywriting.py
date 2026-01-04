from fastapi import APIRouter, HTTPException

from ...schemas.ai_schemas import CopywritingRequest
from ...services.ai_service import ai_service

router = APIRouter()


@router.post("/copywriting")
async def generate_copy(request: CopywritingRequest):
    """Generate advertising copy variations."""
    try:
        system_prompt = """You are an expert advertising copywriter specializing in digital and retail marketing.

Generate compelling, conversion-focused copy variations. Consider:
- AIDA framework (Attention, Interest, Desire, Action)
- Power words and emotional triggers
- Urgency without being pushy
- Clear value propositions
- Platform-specific character limits
- Brand voice consistency

Return exactly 25-30 variations in this JSON format:
{
  "headlines": [
    { "text": "string", "charCount": number, "style": "bold|minimal|emotional|urgent|playful" }
  ],
  "ctas": [
    { "text": "string", "charCount": number, "style": "direct|soft|urgent|benefit|discovery" }
  ],
  "taglines": [
    { "text": "string", "charCount": number }
  ]
}

Headlines: 10 variations (under 50 chars each)
CTAs: 10 variations (under 20 chars each)
Taglines: 10 variations (under 80 chars each)"""

        existing_copy = ""
        if request.existingCopy:
            existing_copy = f'\nCurrent Copy: "{request.existingCopy}"'

        user_prompt = f"""Generate copy variations for:

Product: {request.productName}
Product Type: {request.productType}
Campaign: {request.campaignType}
Target Audience: {request.targetAudience or 'General consumers'}
Tone: {request.tone or 'Professional yet approachable'}{existing_copy}

Create compelling, diverse variations that could work across Instagram, Facebook, and retail displays."""

        response = await ai_service.chat_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.8,
        )

        content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
        copy_variations = ai_service.extract_json_from_response(content)

        return copy_variations

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
