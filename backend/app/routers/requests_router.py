from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/requests", tags=["requests"])


@router.post("/", response_model=schemas.ServiceRequestOut, status_code=status.HTTP_201_CREATED)
def create_request(
    payload: schemas.ServiceRequestCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    req = models.ServiceRequest(**payload.model_dump(), owner_id=current_user.id)
    db.add(req)
    db.commit()
    db.refresh(req)
    return req


@router.get("/", response_model=List[schemas.ServiceRequestOut])
def list_requests(
    status_filter: Optional[models.RequestStatus] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    query = db.query(models.ServiceRequest)
    # Citizens only see their own requests; staff/admin see everything.
    if not current_user.is_admin:
        query = query.filter(models.ServiceRequest.owner_id == current_user.id)
    if status_filter:
        query = query.filter(models.ServiceRequest.status == status_filter)
    return query.order_by(models.ServiceRequest.created_at.desc()).all()


@router.get("/{request_id}", response_model=schemas.ServiceRequestOut)
def get_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    req = db.query(models.ServiceRequest).filter(models.ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if not current_user.is_admin and req.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this request")
    return req


@router.patch("/{request_id}/status", response_model=schemas.ServiceRequestOut)
def update_status(
    request_id: int,
    payload: schemas.ServiceRequestUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin),
):
    req = db.query(models.ServiceRequest).filter(models.ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    req.status = payload.status
    db.commit()
    db.refresh(req)
    return req


@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    req = db.query(models.ServiceRequest).filter(models.ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if not current_user.is_admin and req.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this request")
    db.delete(req)
    db.commit()
