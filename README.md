# Geospatial File Measurement API

A REST API built with Python and FastAPI for uploading and processing geospatial files in KML and Shapefile ZIP formats.

The API extracts geospatial features, handles coordinate reference systems (CRS), calculates polygon areas and LineString lengths, and stores file information, features, and measurements in a SQLite database.

---

## Features

- Upload KML files
- Upload Shapefile ZIP archives
- Validate uploaded file formats
- Validate Shapefile ZIP contents
- Extract feature IDs and geometry types
- Extract geometry in WKT format
- Extract feature properties/attributes
- Detect CRS
- Transform geographic CRS to a suitable projected CRS for measurement
- Calculate Polygon and MultiPolygon area
- Calculate LineString and MultiLineString length
- Handle Point geometries without measurement
- Handle unsupported geometries gracefully
- Store file information in SQLite
- Store extracted features in SQLite
- Store calculated measurements in SQLite
- Unique filenames for uploaded files
- File-size limit of 10 MB
- Cleanup failed uploads
- REST API documentation through Swagger UI

---

## Technology Stack

- Python 3.10
- FastAPI
- Uvicorn
- GeoPandas
- Shapely
- PyProj
- Fiona
- SQLAlchemy
- SQLite
- python-multipart

---

## Project Architecture

```text
Client
   |
   v
FastAPI API Routes
   |
   v
Geospatial Services
   |
   +---- GeoPandas
   +---- Shapely
   +---- PyProj
   +---- Fiona
   |
   v
Measurement Processing
   |
   v
SQLite Database

## Project Structure

geospatial-file-measurement-api/
│
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   └── routes_files.py
│   │
│   ├── models/
│   │   ├── database.py
│   │   ├── file_model.py
│   │   ├── feature_model.py
│   │   ├── measurement_model.py
│   │   └── init_db.py
│   │
│   └── services/
│       ├── geospatial_service.py
│       └── measurement_service.py
│
├── uploads/
├── requirements.txt
├── README.md
└── .gitignore