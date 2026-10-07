# Geospatial File Measurement API

A full-stack application for uploading and analyzing KML and Shapefile data. It extracts geospatial features, handles CRS transformation, and calculates area and length measurements through a FastAPI backend and React dashboard.

## Features

- Upload KML and zipped Shapefiles
- Extract geometry and feature properties
- Calculate polygon area and line length
- Automatic CRS handling and transformation
- SQLite-based data storage
- REST API with Swagger documentation
- React-based dashboard for file analysis and measurements

## Tech Stack

**Backend:** Python, FastAPI, GeoPandas, Shapely, PyProj, SQLAlchemy, SQLite  
**Frontend:** React, Vite, JavaScript, CSS

## Project Structure

```text
geospatial-file-measurement-api/
├── app/          # FastAPI backend
├── frontend/     # React dashboard
├── sample_data/  # Sample geospatial files
├── requirements.txt
└── README.md
Setup
Backend
git clone https://github.com/RETHANYA06/geospatial-file-measurement-api.git
cd geospatial-file-measurement-api

python -m venv venv
source venv/Scripts/activate

pip install -r requirements.txt
uvicorn app.main:app --reload

API: http://127.0.0.1:8000
Swagger: http://127.0.0.1:8000/docs

Frontend
cd frontend
npm install
npm run dev
API Endpoints
POST /api/files/
GET  /api/files/{id}/
GET  /api/files/{id}/measurements/
CRS Handling

Geographic CRS data such as EPSG:4326 is automatically transformed to a suitable projected CRS before calculating area or length.

Author

Rethanya V
