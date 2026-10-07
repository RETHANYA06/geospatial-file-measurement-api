from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes_files import router as files_router
from app.models.database import Base, engine
import app.models.file_model
import app.models.feature_model
import app.models.measurement_model

# Ensure SQLite tables exist upon application startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Geospatial File Measurement API")

# Enable CORS for frontend client integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(files_router)


@app.get("/")
def home():
    return {"message": "Geospatial File Measurement API"}