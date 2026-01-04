from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from uuid import UUID
from typing import List

from ..database import get_db
from ..schemas.template import TemplateCreate, TemplateUpdate, TemplateResponse, TemplateFavoriteResponse
from ..middleware.auth import get_current_user, get_current_user_optional
from ..models.user import User
from ..models.template import Template
from ..models.template_favorite import TemplateFavorite

router = APIRouter()


@router.get("", response_model=List[TemplateResponse])
async def list_templates(
    current_user: User = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    """List all accessible templates (public + user's own)."""
    if current_user:
        result = await db.execute(
            select(Template)
            .where(
                or_(
                    Template.is_public == True,
                    Template.user_id == current_user.id,
                )
            )
            .order_by(Template.updated_at.desc())
        )
    else:
        result = await db.execute(
            select(Template)
            .where(Template.is_public == True)
            .order_by(Template.updated_at.desc())
        )
    
    templates = result.scalars().all()
    return [TemplateResponse.model_validate(t) for t in templates]


@router.post("", response_model=TemplateResponse, status_code=status.HTTP_201_CREATED)
async def create_template(
    template_data: TemplateCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new template."""
    template = Template(
        user_id=current_user.id,
        **template_data.model_dump(),
    )
    db.add(template)
    await db.commit()
    await db.refresh(template)
    return TemplateResponse.model_validate(template)


@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template(
    template_id: UUID,
    current_user: User = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific template."""
    result = await db.execute(select(Template).where(Template.id == template_id))
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )
    
    # Check access
    if not template.is_public:
        if not current_user or template.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this template",
            )
    
    return TemplateResponse.model_validate(template)


@router.put("/{template_id}", response_model=TemplateResponse)
async def update_template(
    template_id: UUID,
    template_data: TemplateUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a template."""
    result = await db.execute(
        select(Template).where(
            Template.id == template_id,
            Template.user_id == current_user.id,
        )
    )
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )
    
    update_data = template_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(template, field, value)
    
    await db.commit()
    await db.refresh(template)
    
    return TemplateResponse.model_validate(template)


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    template_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a template."""
    result = await db.execute(
        select(Template).where(
            Template.id == template_id,
            Template.user_id == current_user.id,
        )
    )
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )
    
    await db.delete(template)
    await db.commit()


# Favorites
@router.get("/favorites/list", response_model=List[TemplateFavoriteResponse])
async def list_favorites(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List user's favorite templates."""
    result = await db.execute(
        select(TemplateFavorite)
        .where(TemplateFavorite.user_id == current_user.id)
        .order_by(TemplateFavorite.created_at.desc())
    )
    favorites = result.scalars().all()
    return [TemplateFavoriteResponse.model_validate(f) for f in favorites]


@router.post("/favorites/{template_id}", response_model=TemplateFavoriteResponse, status_code=status.HTTP_201_CREATED)
async def add_favorite(
    template_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Add a template to favorites."""
    # Check if template exists
    result = await db.execute(select(Template).where(Template.id == template_id))
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )
    
    # Check if already favorited
    result = await db.execute(
        select(TemplateFavorite).where(
            TemplateFavorite.user_id == current_user.id,
            TemplateFavorite.template_id == template_id,
        )
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Template already in favorites",
        )
    
    favorite = TemplateFavorite(user_id=current_user.id, template_id=template_id)
    db.add(favorite)
    await db.commit()
    await db.refresh(favorite)
    
    return TemplateFavoriteResponse.model_validate(favorite)


@router.delete("/favorites/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_favorite(
    template_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Remove a template from favorites."""
    result = await db.execute(
        select(TemplateFavorite).where(
            TemplateFavorite.user_id == current_user.id,
            TemplateFavorite.template_id == template_id,
        )
    )
    favorite = result.scalar_one_or_none()
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found",
        )
    
    await db.delete(favorite)
    await db.commit()
