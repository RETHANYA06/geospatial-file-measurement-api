from app.models.database import Base, engine
from app.models.file_model import UploadedFile
from app.models.measurement_model import Measurement
from app.models.feature_model import Feature

Base.metadata.create_all(bind=engine)

print("Database tables created successfully")