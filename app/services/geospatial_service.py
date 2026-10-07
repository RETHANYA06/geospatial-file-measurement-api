from pathlib import Path

import geopandas as gpd


def read_geospatial_file(file_path: str) -> gpd.GeoDataFrame:
    path = Path(file_path)

    if path.suffix.lower() == ".kml":
        gdf = gpd.read_file(path, driver="KML")

    elif path.suffix.lower() == ".zip":
        gdf = gpd.read_file(f"zip://{path}")

    else:
        raise ValueError("Unsupported file format")

    return gdf


def extract_features(gdf: gpd.GeoDataFrame) -> list:
    features = []

    for index, row in gdf.iterrows():
        geometry = row.geometry

        properties = {}

        for key, value in row.drop(labels=["geometry"]).items():
            if value is None:
                properties[key] = None
            else:
                try:
                    if value != value:
                        properties[key] = None
                    else:
                        properties[key] = str(value) if hasattr(value, "isoformat") else value
                except Exception:
                    properties[key] = str(value)

        feature = {
            "feature_id": index,
            "geometry_type": geometry.geom_type,
            "geometry": geometry.wkt,
            "properties": properties,
        }

        features.append(feature)

    return features