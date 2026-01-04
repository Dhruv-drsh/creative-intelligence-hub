from fastapi import APIRouter, HTTPException, status, Depends

from ..schemas.profile import ProfileUpdate, ProfileResponse
from ..middleware.auth import get_current_user
from ..models.user import User
from ..models.profile import Profile
from datetime import datetime

router = APIRouter()


@router.get("/me", response_model=ProfileResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile."""
    profile = await Profile.find_one(Profile.id == current_user.id)
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )
    
    return ProfileResponse(
        id=profile.id,
        email=profile.email,
        full_name=profile.full_name,
        avatar_url=profile.avatar_url,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )


@router.put("/me", response_model=ProfileResponse)
async def update_my_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
):
    """Update current user's profile."""
    profile = await Profile.find_one(Profile.id == current_user.id)
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )
    
    update_data = profile_data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await profile.update({"$set": update_data})
    
    updated_profile = await Profile.find_one(Profile.id == current_user.id)
    
    return ProfileResponse(
        id=updated_profile.id,
        email=updated_profile.email,
        full_name=updated_profile.full_name,
        avatar_url=updated_profile.avatar_url,
        created_at=updated_profile.created_at,
        updated_at=updated_profile.updated_at,
    )
