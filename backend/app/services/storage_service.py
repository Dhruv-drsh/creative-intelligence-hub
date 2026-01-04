import os
import uuid
import aiofiles
from pathlib import Path
from typing import Optional

from ..config import get_settings

settings = get_settings()


class StorageService:
    def __init__(self):
        self.storage_root = Path(settings.storage_root)
        self.public_url_base = settings.public_url_base

    async def upload_file(
        self,
        file_content: bytes,
        filename: str,
        folder: str = "assets",
    ) -> str:
        """Upload a file and return its public URL."""
        # Generate unique filename
        ext = Path(filename).suffix
        unique_name = f"{uuid.uuid4()}{ext}"
        
        # Create folder if it doesn't exist
        folder_path = self.storage_root / folder
        folder_path.mkdir(parents=True, exist_ok=True)
        
        # Save file
        file_path = folder_path / unique_name
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(file_content)
        
        # Return public URL
        return f"{self.public_url_base}/{folder}/{unique_name}"

    async def delete_file(self, file_path: str) -> bool:
        """Delete a file by its path."""
        # Convert URL to local path
        if file_path.startswith(self.public_url_base):
            relative_path = file_path.replace(f"{self.public_url_base}/", "")
        else:
            relative_path = file_path
        
        full_path = self.storage_root / relative_path
        
        if full_path.exists():
            os.remove(full_path)
            return True
        return False

    def get_file_path(self, url: str) -> Optional[Path]:
        """Get the local file path from a URL."""
        if url.startswith(self.public_url_base):
            relative_path = url.replace(f"{self.public_url_base}/", "")
            return self.storage_root / relative_path
        return None


# Singleton instance
storage_service = StorageService()
