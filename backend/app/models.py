import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship

from .database import Base


class RequestStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    IN_REVIEW = "in_review"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"


class RequestCategory(str, enum.Enum):
    ROAD_DAMAGE = "road_damage"
    STREETLIGHT = "streetlight"
    WASTE = "waste"
    APPOINTMENT = "appointment"
    OTHER = "other"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    is_admin = Column(Integer, default=0)  # 0 = citizen, 1 = staff/admin
    created_at = Column(DateTime, default=datetime.utcnow)

    requests = relationship("ServiceRequest", back_populates="owner")


class ServiceRequest(Base):
    __tablename__ = "service_requests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(Enum(RequestCategory), nullable=False)
    status = Column(Enum(RequestStatus), default=RequestStatus.SUBMITTED, nullable=False)
    location = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="requests")
