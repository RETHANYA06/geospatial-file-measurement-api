from sqlalchemy import Column, Integer, Float, String, ForeignKey

from app.models.database import Base


class Measurement(Base):
    __tablename__ = "measurements"

    id = Column(Integer, primary_key=True, index=True)

    file_id = Column(
        Integer,
        ForeignKey("uploaded_files.id"),
        nullable=False
    )

    feature_id = Column(Integer, nullable=False)
    geometry_type = Column(String, nullable=False)

    area = Column(Float, nullable=True)
    length = Column(Float, nullable=True)