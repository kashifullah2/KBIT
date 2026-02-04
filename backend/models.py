from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "KBIT_Users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    address = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    cvs = relationship("CV", back_populates="owner")
    ideas = relationship("BusinessIdea", back_populates="owner")

class CV(Base):
    __tablename__ = "cvs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("KBIT_Users.id"))
    filename = Column(String, nullable=True)
    content = Column(Text, nullable=True)
    original_pdf_path = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="cvs")

class BusinessIdea(Base):
    __tablename__ = "business_ideas"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("KBIT_Users.id"), nullable=True)
    title = Column(String, nullable=False)
    input_data = Column(Text)  # JSON of form inputs
    analysis_result = Column(Text)  # JSON of AI analysis
    viability_score = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="ideas")
