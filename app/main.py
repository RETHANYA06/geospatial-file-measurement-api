from fastapi import FastAPI
from app.api.routes_files import router as files_router


app = FastAPI()

app.include_router(files_router)


@app.get("/")
def home():
    return {"message": "Geospatial File Measurement API"}