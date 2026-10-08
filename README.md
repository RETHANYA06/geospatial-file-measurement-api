# Geospatial File Measurement API

A full-stack geospatial application for uploading **KML files and zipped Shapefiles**, extracting geospatial features, handling Coordinate Reference Systems (CRS), and calculating **area and length measurements**.

The application provides a **FastAPI REST API** and a **React dashboard** for uploading files and viewing geospatial analysis results.

## Main Features

- Upload KML files and zipped Shapefiles
- Extract feature geometry, geometry type, CRS, and attributes
- Calculate area for Polygon and MultiPolygon geometries
- Calculate length for LineString and MultiLineString geometries
- Handle Point geometries without measurements
- Automatically transform geographic CRS to a suitable projected CRS
- Store processed files, features, and measurements using SQLite
- REST API with interactive Swagger documentation
- React-based dashboard for file upload and measurement visualization

## Tech Stack

### Backend
- Python
- FastAPI
- GeoPandas
- Shapely
- PyProj
- SQLAlchemy
- SQLite

### Frontend
- React
- Vite
- JavaScript
- CSS

### Deployment
- GitHub
- Render
- Vercel

## Project Structure

    geospatial-file-measurement-api/
    │
    ├── app/
    │   ├── api/
    │   ├── models/
    │   ├── services/
    │   └── main.py
    │
    ├── frontend/
    │   ├── src/
    │   └── public/
    │
    ├── requirements.txt
    ├── README.md
    └── .gitignore

## API Endpoints

    POST /api/files/
    GET  /api/files/{id}/
    GET  /api/files/{id}/measurements/

## Live Demo

**Frontend:** [Open Live Application](https://geospatial-file-measurement-api-three.vercel.app/)

**Backend API:** [Open Backend API](https://geospatial-file-measurement-api-0a3i.onrender.com)

**Swagger API Documentation:** [Open Swagger Docs](https://geospatial-file-measurement-api-0a3i.onrender.com/docs)

## Source Code

[View GitHub Repository](https://github.com/RETHANYA06/geospatial-file-measurement-api)

## Author

**Rethanya V**  
Computer Science and Engineering
