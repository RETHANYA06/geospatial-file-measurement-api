# Geospatial File Measurement API

A full-stack geospatial application for uploading **KML files and zipped Shapefiles**, extracting geospatial features, handling CRS transformations, and calculating **area and length measurements**.

It provides a **FastAPI REST API** with a **React dashboard** for uploading files and viewing geospatial analysis results.

## Main Features

- Upload KML and zipped Shapefiles
- Extract geometry, feature type, CRS, and attributes
- Calculate **area** for Polygon / MultiPolygon
- Calculate **length** for LineString / MultiLineString
- Automatically handle geographic CRS transformation
- Store processed data and measurements in SQLite
- REST API with interactive Swagger documentation
- React-based dashboard for viewing results

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

```text
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

- **Frontend:** [Open Live Application](https://geospatial-file-measurement-api-three.vercel.app/)
- **Backend API:** [Open Backend API](https://geospatial-file-measurement-api-0a3i.onrender.com)
- **Swagger API Documentation:** [Open Swagger Docs](https://geospatial-file-measurement-api-0a3i.onrender.com/docs)

## Repository

[View Source Code on GitHub](https://github.com/RETHANYA06/geospatial-file-measurement-api)

Author

Rethanya V
Computer Science and Engineering
