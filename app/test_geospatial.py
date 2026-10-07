from app.services.geospatial_service import read_geospatial_file
from app.services.measurement_service import calculate_measurements


file_path = "uploads/test_point.kml"

gdf = read_geospatial_file(file_path)

results = calculate_measurements(gdf)

print("\nMeasurements:")

for result in results:
    print(result)