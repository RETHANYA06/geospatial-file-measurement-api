from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import zipfile
import uuid
import json

from app.models.database import SessionLocal
from app.models.file_model import UploadedFile
from app.models.measurement_model import Measurement
from app.services.geospatial_service import (
    read_geospatial_file,
    extract_features
)
from app.services.measurement_service import calculate_measurements
from app.models.feature_model import Feature

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
MAX_FILE_SIZE = 10 * 1024 * 1024

def validate_zip_shapefile(file_path: Path) -> bool:
    try:
        with zipfile.ZipFile(file_path, "r") as zip_file:
            files = zip_file.namelist()

            shapefile_parts = {}

            for name in files:
                path = Path(name)

                if path.suffix.lower() in [".shp", ".shx", ".dbf"]:
                    base_name = path.stem.lower()

                    if base_name not in shapefile_parts:
                        shapefile_parts[base_name] = set()

                    shapefile_parts[base_name].add(
                        path.suffix.lower()
                    )

            required_files = {".shp", ".shx", ".dbf"}

            for extensions in shapefile_parts.values():
                if required_files.issubset(extensions):
                    return True

            return False

    except zipfile.BadZipFile:
        return False

@router.post("/api/files/")
async def upload_file(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing"
        )

    file_extension = Path(file.filename).suffix.lower()

    if file_extension not in [".kml", ".zip"]:
        raise HTTPException(
            status_code=400,
            detail="Only .kml and .zip files are supported"
        )

    safe_filename = Path(file.filename).name
    unique_filename = f"{uuid.uuid4()}_{safe_filename}"
    file_path = UPLOAD_DIR / unique_filename

    file_size = 0
    with file_path.open("wb") as buffer:
        while True:
            chunk = file.file.read(1024 * 1024)

            if not chunk:
                break

            file_size += len(chunk)

            if file_size > MAX_FILE_SIZE:
                buffer.close()

                if file_path.exists():
                    file_path.unlink()

                raise HTTPException(
                    status_code=413,
                    detail="File size exceeds the 10 MB limit"
                )

            buffer.write(chunk)

    if file_extension == ".zip":
        if not validate_zip_shapefile(file_path):
            if file_path.exists():
                file_path.unlink()
            raise HTTPException(
                status_code=400,
                detail="ZIP file does not contain a valid Shapefile"
            )

    db = SessionLocal()

    try:
        # Read the geospatial file
        gdf = read_geospatial_file(str(file_path))

        # Get CRS
        crs = str(gdf.crs) if gdf.crs else None

        features = extract_features(gdf)

        # Calculate measurements
        measurements = calculate_measurements(gdf)

        # Create file database record
        uploaded_file = UploadedFile(
            filename=file.filename,
            file_type=file_extension.replace(".", "").upper(),
            file_path=str(file_path),
            crs=crs,
            status="processed"
        )

        db.add(uploaded_file)
        db.commit()
        db.refresh(uploaded_file)

        # Save measurements
        for feature in features:
            feature_record = Feature(
                file_id=uploaded_file.id,
                feature_id=feature["feature_id"],
                geometry_type=feature["geometry_type"],
                geometry=feature["geometry"],
                properties=json.dumps(feature["properties"], default=str)
            )

            db.add(feature_record)

        for result in measurements:
            measurement = Measurement(
                file_id=uploaded_file.id,
                feature_id=result["feature_id"],
                geometry_type=result["geometry_type"],
                area=result["area"],
                length=result["length"]
            )

            db.add(measurement)

        db.commit()

        return {
            "id": uploaded_file.id,
            "filename": uploaded_file.filename,
            "file_type": uploaded_file.file_type,
            "crs": uploaded_file.crs,
            "status": uploaded_file.status,
            "features": features,
            "measurements": measurements
        }

    except HTTPException as e:
        db.rollback()

        if file_path.exists():
            file_path.unlink()
        raise

    except Exception as e:
        db.rollback()
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    finally:
        db.close()


# IMPORTANT:
# This route must come BEFORE /api/files/{file_id}/
@router.get("/api/files/{file_id}/measurements/")
def get_file_measurements(file_id: int):

    db = SessionLocal()

    try:
        uploaded_file = (
            db.query(UploadedFile)
            .filter(UploadedFile.id == file_id)
            .first()
        )

        if uploaded_file is None:
            raise HTTPException(
                status_code=404,
                detail="File not found"
            )

        measurements = (
            db.query(Measurement)
            .filter(Measurement.file_id == file_id)
            .all()
        )

        return {
            "file_id": file_id,
            "filename": uploaded_file.filename,
            "crs": uploaded_file.crs,
            "measurements": [
                {
                    "id": measurement.id,
                    "feature_id": measurement.feature_id,
                    "geometry_type": measurement.geometry_type,
                    "area": measurement.area,
                    "length": measurement.length
                }
                for measurement in measurements
            ]
        }

    finally:
        db.close()


@router.get("/api/files/{file_id}/")
def get_file(file_id: int):

    db = SessionLocal()

    try:
        uploaded_file = (
            db.query(UploadedFile)
            .filter(UploadedFile.id == file_id)
            .first()
        )

        if uploaded_file is None:
            raise HTTPException(
                status_code=404,
                detail="File not found"
            )
        features = (
            db.query(Feature)
            .filter(Feature.file_id == file_id)
            .all()
        )

        return {
            "id": uploaded_file.id,
            "filename": uploaded_file.filename,
            "file_type": uploaded_file.file_type,
            "file_path": uploaded_file.file_path,
            "crs": uploaded_file.crs,
            "status": uploaded_file.status,
            "features": [
                {
                    "id": feature.id,
                    "feature_id": feature.feature_id,
                    "geometry_type": feature.geometry_type,
                    "geometry": feature.geometry,
                    "properties": json.loads(feature.properties)
                    if feature.properties
                    else {}
                }
                for feature in features
            ]
        }

    finally:
        db.close()