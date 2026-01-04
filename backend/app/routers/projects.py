from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from datetime import datetime

from ..schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from ..middleware.auth import get_current_user
from ..models.user import User
from ..models.project import Project

router = APIRouter()


@router.get("", response_model=List[ProjectResponse])
async def list_projects(current_user: User = Depends(get_current_user)):
    """List all projects for the current user."""
    projects = await Project.find(
        Project.user_id == current_user.id
    ).sort(-Project.updated_at).to_list()
    
    return [
        ProjectResponse(
            id=p.id,
            user_id=p.user_id,
            name=p.name,
            format_id=p.format_id,
            format_width=p.format_width,
            format_height=p.format_height,
            canvas_data=p.canvas_data,
            thumbnail_url=p.thumbnail_url,
            compliance_score=p.compliance_score,
            brand_kit_id=p.brand_kit_id,
            created_at=p.created_at,
            updated_at=p.updated_at,
        )
        for p in projects
    ]


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
):
    """Create a new project."""
    project = Project(
        user_id=current_user.id,
        **project_data.model_dump(),
    )
    await project.insert()
    
    return ProjectResponse(
        id=project.id,
        user_id=project.user_id,
        name=project.name,
        format_id=project.format_id,
        format_width=project.format_width,
        format_height=project.format_height,
        canvas_data=project.canvas_data,
        thumbnail_url=project.thumbnail_url,
        compliance_score=project.compliance_score,
        brand_kit_id=project.brand_kit_id,
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
):
    """Get a specific project."""
    project = await Project.find_one(
        Project.id == project_id,
        Project.user_id == current_user.id,
    )
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    return ProjectResponse(
        id=project.id,
        user_id=project.user_id,
        name=project.name,
        format_id=project.format_id,
        format_width=project.format_width,
        format_height=project.format_height,
        canvas_data=project.canvas_data,
        thumbnail_url=project.thumbnail_url,
        compliance_score=project.compliance_score,
        brand_kit_id=project.brand_kit_id,
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    current_user: User = Depends(get_current_user),
):
    """Update a project."""
    project = await Project.find_one(
        Project.id == project_id,
        Project.user_id == current_user.id,
    )
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    update_data = project_data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await project.update({"$set": update_data})
    
    # Refresh the project data
    updated_project = await Project.find_one(Project.id == project_id)
    
    return ProjectResponse(
        id=updated_project.id,
        user_id=updated_project.user_id,
        name=updated_project.name,
        format_id=updated_project.format_id,
        format_width=updated_project.format_width,
        format_height=updated_project.format_height,
        canvas_data=updated_project.canvas_data,
        thumbnail_url=updated_project.thumbnail_url,
        compliance_score=updated_project.compliance_score,
        brand_kit_id=updated_project.brand_kit_id,
        created_at=updated_project.created_at,
        updated_at=updated_project.updated_at,
    )


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
):
    """Delete a project."""
    project = await Project.find_one(
        Project.id == project_id,
        Project.user_id == current_user.id,
    )
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    await project.delete()
