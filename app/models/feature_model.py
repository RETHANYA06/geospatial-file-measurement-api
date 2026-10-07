from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.models.database import Base


class Feature(Base):
    __tablename__ = "features"

    id = Column(Integer, primary_key=True, index=True)

    file_id = Column(
        Integer,
        ForeignKey("uploaded_files.id"),
        nullable=False
    )

    feature_id = Column(Integer, nullable=False)
    geometry_type = Column(String, nullable=False)
    geometry = Column(Text, nullable=False)
    properties = Column(Text, nullable=True)