from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from datetime import datetime

from ..schemas.brand_kit import BrandKitCreate, BrandKitUpdate, BrandKitResponse
from ..middleware.auth import get_current_user
from ..models.user import User
from ..models.brand_kit import BrandKit

router = APIRouter()


@router.get("", response_model=List[BrandKitResponse])
async def list_brand_kits(current_user: User = Depends(get_current_user)):
    """List all brand kits for the current user."""
    brand_kits = await BrandKit.find(
        BrandKit.user_id == current_user.id
    ).sort(-BrandKit.updated_at).to_list()
    
    return [
        BrandKitResponse(
            id=bk.id,
            user_id=bk.user_id,
            name=bk.name,
            primary_color=bk.primary_color,
            secondary_color=bk.secondary_color,
            accent_color=bk.accent_color,
            font_heading=bk.font_heading,
            font_body=bk.font_body,
            logo_url=bk.logo_url,
            guidelines=bk.guidelines,
            created_at=bk.created_at,
            updated_at=bk.updated_at,
        )
        for bk in brand_kits
    ]


@router.post("", response_model=BrandKitResponse, status_code=status.HTTP_201_CREATED)
async def create_brand_kit(
    brand_kit_data: BrandKitCreate,
    current_user: User = Depends(get_current_user),
):
    """Create a new brand kit."""
    brand_kit = BrandKit(
        user_id=current_user.id,
        **brand_kit_data.model_dump(),
    )
    await brand_kit.insert()
    
    return BrandKitResponse(
        id=brand_kit.id,
        user_id=brand_kit.user_id,
        name=brand_kit.name,
        primary_color=brand_kit.primary_color,
        secondary_color=brand_kit.secondary_color,
        accent_color=brand_kit.accent_color,
        font_heading=brand_kit.font_heading,
        font_body=brand_kit.font_body,
        logo_url=brand_kit.logo_url,
        guidelines=brand_kit.guidelines,
        created_at=brand_kit.created_at,
        updated_at=brand_kit.updated_at,
    )


@router.get("/{brand_kit_id}", response_model=BrandKitResponse)
async def get_brand_kit(
    brand_kit_id: str,
    current_user: User = Depends(get_current_user),
):
    """Get a specific brand kit."""
    brand_kit = await BrandKit.find_one(
        BrandKit.id == brand_kit_id,
        BrandKit.user_id == current_user.id,
    )
    
    if not brand_kit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand kit not found",
        )
    
    return BrandKitResponse(
        id=brand_kit.id,
        user_id=brand_kit.user_id,
        name=brand_kit.name,
        primary_color=brand_kit.primary_color,
        secondary_color=brand_kit.secondary_color,
        accent_color=brand_kit.accent_color,
        font_heading=brand_kit.font_heading,
        font_body=brand_kit.font_body,
        logo_url=brand_kit.logo_url,
        guidelines=brand_kit.guidelines,
        created_at=brand_kit.created_at,
        updated_at=brand_kit.updated_at,
    )


@router.put("/{brand_kit_id}", response_model=BrandKitResponse)
async def update_brand_kit(
    brand_kit_id: str,
    brand_kit_data: BrandKitUpdate,
    current_user: User = Depends(get_current_user),
):
    """Update a brand kit."""
    brand_kit = await BrandKit.find_one(
        BrandKit.id == brand_kit_id,
        BrandKit.user_id == current_user.id,
    )
    
    if not brand_kit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand kit not found",
        )
    
    update_data = brand_kit_data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await brand_kit.update({"$set": update_data})
    
    # Refresh the data
    updated_brand_kit = await BrandKit.find_one(BrandKit.id == brand_kit_id)
    
    return BrandKitResponse(
        id=updated_brand_kit.id,
        user_id=updated_brand_kit.user_id,
        name=updated_brand_kit.name,
        primary_color=updated_brand_kit.primary_color,
        secondary_color=updated_brand_kit.secondary_color,
        accent_color=updated_brand_kit.accent_color,
        font_heading=updated_brand_kit.font_heading,
        font_body=updated_brand_kit.font_body,
        logo_url=updated_brand_kit.logo_url,
        guidelines=updated_brand_kit.guidelines,
        created_at=updated_brand_kit.created_at,
        updated_at=updated_brand_kit.updated_at,
    )


@router.delete("/{brand_kit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_brand_kit(
    brand_kit_id: str,
    current_user: User = Depends(get_current_user),
):
    """Delete a brand kit."""
    brand_kit = await BrandKit.find_one(
        BrandKit.id == brand_kit_id,
        BrandKit.user_id == current_user.id,
    )
    
    if not brand_kit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand kit not found",
        )
    
    await brand_kit.delete()
