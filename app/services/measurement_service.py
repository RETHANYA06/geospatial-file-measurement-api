import geopandas as gpd


def calculate_measurements(gdf: gpd.GeoDataFrame) -> list:
    if gdf.empty:
        return []

    if gdf.crs is None:
        raise ValueError("The file does not contain a CRS")

    measurement_gdf = gdf

    if gdf.crs.is_geographic:
        projected_crs = gdf.estimate_utm_crs()

        if projected_crs is None:
            raise ValueError("Could not determine a suitable projected CRS")

        measurement_gdf = gdf.to_crs(projected_crs)

    results = []

    for index, row in measurement_gdf.iterrows():
        geometry = row.geometry

        result = {
            "feature_id": index,
            "geometry_type": geometry.geom_type,
            "area": None,
            "length": None,
        }

        if geometry.geom_type in ["Polygon", "MultiPolygon"]:
            result["area"] = geometry.area

        elif geometry.geom_type in ["LineString", "MultiLineString"]:
            result["length"] = geometry.length

        elif geometry.geom_type == "Point":
            pass

        else:
            result["unsupported"] = True

        results.append(result)

    return results