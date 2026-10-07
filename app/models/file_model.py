from sqlalchemy import Column, Integer, String

from app.models.database import Base


class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    crs = Column(String, nullable=True)
    status = Column(String, nullable=False)