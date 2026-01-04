from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import List

from ..database import get_db
from ..schemas.brand_kit import BrandKitCreate, BrandKitUpdate, BrandKitResponse
from ..middleware.auth import get_current_user
from ..models.user import User
from ..models.brand_kit import BrandKit

router = APIRouter()


@router.get("", response_model=List[BrandKitResponse])
async def list_brand_kits(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all brand kits for the current user."""
    result = await db.execute(
        select(BrandKit)
        .where(BrandKit.user_id == current_user.id)
        .order_by(BrandKit.updated_at.desc())
    )
    brand_kits = result.scalars().all()
    return [BrandKitResponse.model_validate(bk) for bk in brand_kits]


@router.post("", response_model=BrandKitResponse, status_code=status.HTTP_201_CREATED)
async def create_brand_kit(
    brand_kit_data: BrandKitCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new brand kit."""
    brand_kit = BrandKit(
        user_id=current_user.id,
        **brand_kit_data.model_dump(),
    )
    db.add(brand_kit)
    await db.commit()
    await db.refresh(brand_kit)
    return BrandKitResponse.model_validate(brand_kit)


@router.get("/{brand_kit_id}", response_model=BrandKitResponse)
async def get_brand_kit(
    brand_kit_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific brand kit."""
    result = await db.execute(
        select(BrandKit).where(
            BrandKit.id == brand_kit_id,
            BrandKit.user_id == current_user.id,
        )
    )
    brand_kit = result.scalar_one_or_none()
    
    if not brand_kit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand kit not found",
        )
    
    return BrandKitResponse.model_validate(brand_kit)


@router.put("/{brand_kit_id}", response_model=BrandKitResponse)
async def update_brand_kit(
    brand_kit_id: UUID,
    brand_kit_data: BrandKitUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a brand kit."""
    result = await db.execute(
        select(BrandKit).where(
            BrandKit.id == brand_kit_id,
            BrandKit.user_id == current_user.id,
        )
    )
    brand_kit = result.scalar_one_or_none()
    
    if not brand_kit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand kit not found",
        )
    
    update_data = brand_kit_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(brand_kit, field, value)
    
    await db.commit()
    await db.refresh(brand_kit)
    
    return BrandKitResponse.model_validate(brand_kit)


@router.delete("/{brand_kit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_brand_kit(
    brand_kit_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a brand kit."""
    result = await db.execute(
        select(BrandKit).where(
            BrandKit.id == brand_kit_id,
            BrandKit.user_id == current_user.id,
        )
    )
    brand_kit = result.scalar_one_or_none()
    
    if not brand_kit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand kit not found",
        )
    
    await db.delete(brand_kit)
    await db.commit()
