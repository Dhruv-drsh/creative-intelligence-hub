from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import datetime

from ..schemas.template import TemplateCreate, TemplateUpdate, TemplateResponse, TemplateFavoriteResponse
from ..middleware.auth import get_current_user, get_current_user_optional
from ..models.user import User
from ..models.template import Template
from ..models.template_favorite import TemplateFavorite

router = APIRouter()


@router.get("", response_model=List[TemplateResponse])
async def list_templates(current_user: Optional[User] = Depends(get_current_user_optional)):
    """List all accessible templates (public + user's own)."""
    if current_user:
        templates = await Template.find(
            {"$or": [
                {"is_public": True},
                {"user_id": current_user.id},
            ]}
        ).sort(-Template.updated_at).to_list()
    else:
        templates = await Template.find(
            Template.is_public == True
        ).sort(-Template.updated_at).to_list()
    
    return [
        TemplateResponse(
            id=t.id,
            user_id=t.user_id,
            name=t.name,
            description=t.description,
            category=t.category,
            format_width=t.format_width,
            format_height=t.format_height,
            canvas_data=t.canvas_data,
            thumbnail_url=t.thumbnail_url,
            is_public=t.is_public,
            created_at=t.created_at,
            updated_at=t.updated_at,
        )
        for t in templates
    ]


@router.post("", response_model=TemplateResponse, status_code=status.HTTP_201_CREATED)
async def create_template(
    template_data: TemplateCreate,
    current_user: User = Depends(get_current_user),
):
    """Create a new template."""
    template = Template(
        user_id=current_user.id,
        **template_data.model_dump(),
    )
    await template.insert()
    
    return TemplateResponse(
        id=template.id,
        user_id=template.user_id,
        name=template.name,
        description=template.description,
        category=template.category,
        format_width=template.format_width,
        format_height=template.format_height,
        canvas_data=template.canvas_data,
        thumbnail_url=template.thumbnail_url,
        is_public=template.is_public,
        created_at=template.created_at,
        updated_at=template.updated_at,
    )


@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template(
    template_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Get a specific template."""
    template = await Template.find_one(Template.id == template_id)
    
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
    
    return TemplateResponse(
        id=template.id,
        user_id=template.user_id,
        name=template.name,
        description=template.description,
        category=template.category,
        format_width=template.format_width,
        format_height=template.format_height,
        canvas_data=template.canvas_data,
        thumbnail_url=template.thumbnail_url,
        is_public=template.is_public,
        created_at=template.created_at,
        updated_at=template.updated_at,
    )


@router.put("/{template_id}", response_model=TemplateResponse)
async def update_template(
    template_id: str,
    template_data: TemplateUpdate,
    current_user: User = Depends(get_current_user),
):
    """Update a template."""
    template = await Template.find_one(
        Template.id == template_id,
        Template.user_id == current_user.id,
    )
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )
    
    update_data = template_data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await template.update({"$set": update_data})
    
    updated_template = await Template.find_one(Template.id == template_id)
    
    return TemplateResponse(
        id=updated_template.id,
        user_id=updated_template.user_id,
        name=updated_template.name,
        description=updated_template.description,
        category=updated_template.category,
        format_width=updated_template.format_width,
        format_height=updated_template.format_height,
        canvas_data=updated_template.canvas_data,
        thumbnail_url=updated_template.thumbnail_url,
        is_public=updated_template.is_public,
        created_at=updated_template.created_at,
        updated_at=updated_template.updated_at,
    )


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    template_id: str,
    current_user: User = Depends(get_current_user),
):
    """Delete a template."""
    template = await Template.find_one(
        Template.id == template_id,
        Template.user_id == current_user.id,
    )
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )
    
    await template.delete()


# Favorites
@router.get("/favorites/list", response_model=List[TemplateFavoriteResponse])
async def list_favorites(current_user: User = Depends(get_current_user)):
    """List user's favorite templates."""
    favorites = await TemplateFavorite.find(
        TemplateFavorite.user_id == current_user.id
    ).sort(-TemplateFavorite.created_at).to_list()
    
    return [
        TemplateFavoriteResponse(
            id=f.id,
            user_id=f.user_id,
            template_id=f.template_id,
            created_at=f.created_at,
        )
        for f in favorites
    ]


@router.post("/favorites/{template_id}", response_model=TemplateFavoriteResponse, status_code=status.HTTP_201_CREATED)
async def add_favorite(
    template_id: str,
    current_user: User = Depends(get_current_user),
):
    """Add a template to favorites."""
    # Check if template exists
    template = await Template.find_one(Template.id == template_id)
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )
    
    # Check if already favorited
    existing = await TemplateFavorite.find_one(
        TemplateFavorite.user_id == current_user.id,
        TemplateFavorite.template_id == template_id,
    )
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Template already in favorites",
        )
    
    favorite = TemplateFavorite(user_id=current_user.id, template_id=template_id)
    await favorite.insert()
    
    return TemplateFavoriteResponse(
        id=favorite.id,
        user_id=favorite.user_id,
        template_id=favorite.template_id,
        created_at=favorite.created_at,
    )


@router.delete("/favorites/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_favorite(
    template_id: str,
    current_user: User = Depends(get_current_user),
):
    """Remove a template from favorites."""
    favorite = await TemplateFavorite.find_one(
        TemplateFavorite.user_id == current_user.id,
        TemplateFavorite.template_id == template_id,
    )
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found",
        )
    
    await favorite.delete()
