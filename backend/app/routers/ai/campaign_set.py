from fastapi import APIRouter, HTTPException
from typing import Any

from ...schemas.ai_schemas import CampaignSetRequest
from ...services.ai_service import ai_service

router = APIRouter()

CHANNEL_FORMATS = [
    {"id": "instagram-feed", "name": "Instagram Feed", "width": 1080, "height": 1080, "platform": "instagram"},
    {"id": "instagram-story", "name": "Instagram Story", "width": 1080, "height": 1920, "platform": "instagram"},
    {"id": "facebook-feed", "name": "Facebook Feed", "width": 1200, "height": 628, "platform": "facebook"},
    {"id": "facebook-story", "name": "Facebook Story", "width": 1080, "height": 1920, "platform": "facebook"},
    {"id": "twitter-post", "name": "Twitter Post", "width": 1200, "height": 675, "platform": "twitter"},
    {"id": "linkedin-post", "name": "LinkedIn Post", "width": 1200, "height": 627, "platform": "linkedin"},
    {"id": "youtube-thumbnail", "name": "YouTube Thumbnail", "width": 1280, "height": 720, "platform": "youtube"},
    {"id": "pinterest-pin", "name": "Pinterest Pin", "width": 1000, "height": 1500, "platform": "pinterest"},
]


def get_fallback_canvas(format_info: dict[str, Any]) -> dict[str, Any]:
    """Generate a fallback canvas template."""
    return {
        "version": "5.3.0",
        "objects": [
            {
                "type": "rect",
                "left": 0,
                "top": 0,
                "width": format_info["width"],
                "height": format_info["height"],
                "fill": "#1a1a2e",
            },
            {
                "type": "text",
                "left": format_info["width"] / 2,
                "top": format_info["height"] / 2,
                "text": "Campaign Creative",
                "fontSize": 48,
                "fill": "#ffffff",
                "originX": "center",
                "originY": "center",
            },
        ],
    }


@router.post("/campaign-set")
async def generate_campaign_set(request: CampaignSetRequest):
    """Generate campaign variations for different channels."""
    try:
        # Filter channels
        if request.selectedChannels:
            channels = [c for c in CHANNEL_FORMATS if c["id"] in request.selectedChannels]
        else:
            channels = CHANNEL_FORMATS[:5]  # Default to first 5

        variations = []
        hero_creative = None

        for i, channel in enumerate(channels):
            system_prompt = f"""You are an expert creative designer. Generate a fabric.js compatible JSON canvas layout for a {channel['name']} ({channel['width']}x{channel['height']}px) advertisement.

Return only valid JSON that can be loaded into fabric.js with version "5.3.0".
Include objects like rect, text, and image placeholders with proper positioning."""

            user_prompt = f"""Create a {channel['name']} creative for:
Campaign: {request.campaignName}
Product: {request.productDescription}
Canvas size: {channel['width']}x{channel['height']}px

Generate a professional advertising layout."""

            try:
                response = await ai_service.chat_completion(
                    system_prompt=system_prompt,
                    user_prompt=user_prompt,
                    temperature=0.7,
                )

                content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
                canvas_data = ai_service.extract_json_from_response(content)
            except Exception:
                canvas_data = get_fallback_canvas(channel)

            variation = {
                "id": channel["id"],
                "name": channel["name"],
                "width": channel["width"],
                "height": channel["height"],
                "platform": channel["platform"],
                "canvasData": canvas_data,
            }

            if i == 0:
                hero_creative = variation
            else:
                variations.append(variation)

        return {
            "campaignName": request.campaignName,
            "heroCreative": hero_creative,
            "variations": variations,
            "allChannels": CHANNEL_FORMATS,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
