from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List

from ..middleware.auth import get_current_user
from ..models.user import User
from ..services.storage_service import storage_service

router = APIRouter()


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    folder: str = "assets",
    current_user: User = Depends(get_current_user),
):
    """Upload a file to storage."""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided",
        )
    
    # Read file content
    content = await file.read()
    
    # Validate file size (max 10MB)
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large (max 10MB)",
        )
    
    # Upload file
    url = await storage_service.upload_file(content, file.filename, folder)
    
    return {"url": url, "filename": file.filename}


@router.post("/upload-multiple")
async def upload_multiple_files(
    files: List[UploadFile] = File(...),
    folder: str = "assets",
    current_user: User = Depends(get_current_user),
):
    """Upload multiple files to storage."""
    results = []
    
    for file in files:
        if not file.filename:
            continue
        
        content = await file.read()
        
        # Skip files that are too large
        if len(content) > 10 * 1024 * 1024:
            results.append({"filename": file.filename, "error": "File too large"})
            continue
        
        url = await storage_service.upload_file(content, file.filename, folder)
        results.append({"url": url, "filename": file.filename})
    
    return {"files": results}


@router.delete("/{path:path}")
async def delete_file(
    path: str,
    current_user: User = Depends(get_current_user),
):
    """Delete a file from storage."""
    success = await storage_service.delete_file(path)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )
    
    return {"message": "File deleted successfully"}
