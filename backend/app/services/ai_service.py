import httpx
from typing import Optional, Any
import json
import re

from ..config import get_settings

settings = get_settings()


class AIService:
    def __init__(self):
        self.api_url = settings.lovable_api_url
        self.api_key = settings.lovable_api_key

    async def chat_completion(
        self,
        system_prompt: str,
        user_prompt: str,
        model: str = "google/gemini-2.5-flash",
        temperature: float = 0.7,
        tools: Optional[list[dict]] = None,
    ) -> dict[str, Any]:
        if not self.api_key:
            raise ValueError("LOVABLE_API_KEY is not configured")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        body = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": temperature,
        }

        if tools:
            body["tools"] = tools

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(self.api_url, headers=headers, json=body)

            if response.status_code == 429:
                raise Exception("Rate limit exceeded")
            
            if response.status_code != 200:
                raise Exception(f"AI gateway error: {response.status_code}")

            return response.json()

    @staticmethod
    def extract_json_from_response(content: str) -> dict[str, Any]:
        """Extract JSON from AI response content."""
        # Try to find JSON in markdown code blocks
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", content)
        if json_match:
            return json.loads(json_match.group(1).strip())
        
        # Try to find raw JSON
        json_match = re.search(r"\{[\s\S]*\}", content)
        if json_match:
            return json.loads(json_match.group(0))
        
        raise ValueError("Failed to parse JSON from AI response")

    async def generate_image(
        self,
        prompt: str,
        model: str = "google/gemini-3-pro-image-preview",
    ) -> str:
        """Generate an image using the AI gateway."""
        if not self.api_key:
            raise ValueError("LOVABLE_API_KEY is not configured")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        body = {
            "model": model,
            "messages": [
                {"role": "user", "content": prompt},
            ],
        }

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(self.api_url, headers=headers, json=body)

            if response.status_code == 429:
                raise Exception("Rate limit exceeded")
            
            if response.status_code != 200:
                raise Exception(f"AI gateway error: {response.status_code}")

            data = response.json()
            # Extract image URL from response
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            # Look for image URL in response
            url_match = re.search(r'https?://[^\s"\']+\.(?:png|jpg|jpeg|webp)', content)
            if url_match:
                return url_match.group(0)
            
            return content


# Singleton instance
ai_service = AIService()
