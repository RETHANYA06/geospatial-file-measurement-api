# Geospatial File Measurement Platform & Analytics Dashboard

A production-grade geospatial analytics dashboard and REST API built with React, Vite, Tailwind CSS, Python, and FastAPI for uploading, analyzing, and measuring spatial datasets in KML and Shapefile ZIP formats.

The platform extracts geospatial features, inspects and clarifies Coordinate Reference Systems (CRS), calculates polygon areas and LineString lengths via projected metric transforms, displays features on an interactive cartography map, and stores all records in a SQLite database.

---

## Features

### Geospatial Analytics Dashboard (Frontend UI)
- **Executive KPI Metrics**: Live aggregation of Total Files, Total Features, Aggregated Area (m²), and Aggregated Length (m).
- **Interactive Spatial Cartography**: Vector map powered by Leaflet rendering polygons, linestrings, and points from WKT strings with custom popup tooltips and auto-fit layer bounding boxes.
- **Visual Geometry Analytics**: Real-time breakdown of features across Polygon, MultiPolygon, LineString, MultiLineString, and Point types.
- **Dedicated CRS Transformation Card**: Visual demonstration and technical explanation of geographic (angular) to local projected (planar UTM) coordinate system transformations via PyProj.
- **Comprehensive Measurements Table**: Search, filter, and sort features by geometry type, area, and length with expandable inspection of custom feature properties/attributes.
- **Polished Drag-and-Drop Upload Experience**: State transitions (Idle, Selected, Processing, Success, Error) with friendly error handling, payload limits, and format enforcement.
- **Dark & Light Cartography Themes**: Sleek dark GIS UI (slate/emerald) with one-click toggle to high-contrast light mode.
- **Live API Health Monitoring**: Header status indicator displaying real backend connectivity status.
- **Dataset Management & History**: Registry of uploaded datasets with quick inspection and file details.

### Geospatial Backend & Engine
- Upload KML files
- Upload Shapefile ZIP archives
- Validate uploaded file formats (.kml, .zip)
- Validate Shapefile ZIP contents (.shp, .shx, .dbf)
- Extract feature IDs and geometry types
- Extract geometry in WKT format
- Extract feature properties/attributes
- Detect CRS
- Transform geographic CRS to a suitable projected UTM CRS for accurate metric measurements
- Calculate Polygon and MultiPolygon area
- Calculate LineString and MultiLineString length
- Handle Point geometries without measurement
- Handle unsupported geometries gracefully
- Store file information in SQLite
- Store extracted features in SQLite
- Store calculated measurements in SQLite
- Unique filenames for uploaded files
- File-size limit of 10 MB with chunked validation
- Cleanup failed uploads
- REST API documentation through Swagger UI (`/docs`)

---

## Technology Stack

### Frontend
- **Framework**: React 19, Vite 8
- **Styling**: Tailwind CSS v4, Modern Custom Design Tokens
- **Icons**: Lucide React
- **Mapping & Cartography**: Leaflet, CartoDB Dark Cartography Tiles
- **GIS Parser**: Wellknown (WKT to GeoJSON translation)

### Backend
- **Framework**: Python 3.10+, FastAPI, Uvicorn
- **Geospatial Processing**: GeoPandas 1.1, Shapely 2.1, PyProj 3.7, Fiona 1.10
- **Database & ORM**: SQLite, SQLAlchemy 2.0
- **File Handling**: python-multipart

---

## Project Architecture

```text
Web Browser (React + Leaflet + Tailwind)
   |
   | (HTTP / JSON / Multipart Form-Data)
   v
FastAPI Routes (/api/files/, /api/files/{id}/, /api/files/{id}/measurements/)
   |
   v
Geospatial Services
   |
   +---- GeoPandas & Fiona (Format parsing: KML, Shapefile ZIP)
   +---- PyProj (Dynamic UTM estimation & CRS reprojection)
   +---- Shapely (Metric Area & Length calculation)
   |
   v
SQLite Database (uploaded_files, features, measurements)
```

---

## Project Structure

```text
geospatial-ui-version/
│
├── app/
│   ├── main.py                    # FastAPI entrypoint with CORS & DB init
│   ├── api/
│   │   └── routes_files.py        # Existing API routes (Upload, File, Measurements)
│   ├── models/
│   │   ├── database.py            # SQLite engine & session
│   │   ├── file_model.py          # UploadedFile model
│   │   ├── feature_model.py       # Feature model (WKT & JSON attributes)
│   │   ├── measurement_model.py   # Measurement model (Area & Length)
│   │   └── init_db.py             # Table schema initializer
│   └── services/
│       ├── geospatial_service.py  # File reader & feature extractor
│       └── measurement_service.py # CRS transform & measurement math
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── analysis/          # GeospatialMap, MeasurementsTable, CrsPresentationCard
│   │   │   ├── common/            # KpiCard, Badge, EmptyState, Toast
│   │   │   ├── dashboard/         # DashboardOverview & Geometry charts
│   │   │   ├── files/             # FilesListView
│   │   │   ├── layout/            # Collapsible Sidebar & Header
│   │   │   ├── measurements/      # MeasurementsView
│   │   │   ├── settings/          # SettingsView & API diagnostics
│   │   │   └── upload/            # UploadDropzone
│   │   ├── context/
│   │   │   └── GeoContext.jsx     # Global GIS state, API ping, and theme management
│   │   ├── services/
│   │   │   └── api.js             # API service communicating with FastAPI
│   │   ├── utils/
│   │   │   └── formatters.js      # Metric formatting (m², m) & WKT translation
│   │   ├── App.jsx                # Main application layout
│   │   ├── index.css              # Custom GIS theme & Leaflet styles
│   │   └── main.jsx               # React entry point
│   ├── package.json
│   └── vite.config.js             # Vite config with backend proxy
│
├── sample_data/                   # Test files (KML & Shapefile ZIP)
├── uploads/                       # Uploaded file storage
├── requirements.txt
└── README.md
```

---

## How to Run

### 1. Run the FastAPI Backend

Ensure dependencies from `requirements.txt` are installed in your Python environment:

```bash
# Start backend server on port 8000
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend will be available at:
- API Root: `http://127.0.0.1:8000/`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`

### 2. Run the Frontend Dashboard

In a separate terminal:

```bash
cd frontend

# Install frontend dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```

The frontend dashboard will be available at:
- `http://127.0.0.1:5173/`

Vite is configured with a reverse proxy to automatically route `/api`, `/docs`, and `/openapi.json` to the FastAPI backend running on port 8000.