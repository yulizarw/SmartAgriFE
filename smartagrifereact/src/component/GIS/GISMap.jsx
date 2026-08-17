import React, { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

/*
|--------------------------------------------------------------------------
| FIX LEAFLET MARKER
|--------------------------------------------------------------------------
*/

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/*
|--------------------------------------------------------------------------
| MAP CENTER
|--------------------------------------------------------------------------
*/

const DEFAULT_CENTER = [-6.8, 107.5];

/*
|--------------------------------------------------------------------------
| MAP VIEW CONTROLLER
|--------------------------------------------------------------------------
*/

const MapController = ({ farm, polygon }) => {
  const map = useMap();

  useEffect(() => {
    if (!farm) {
      return;
    }

    if (polygon.length > 0) {
      const bounds = L.latLngBounds(polygon);

      map.fitBounds(bounds, {
        padding: [30, 30],
      });

      return;
    }

    if (farm.latitude && farm.longitude) {
      map.setView([Number(farm.latitude), Number(farm.longitude)], 18);
    }
  }, [farm, polygon, map]);

  return null;
};

/*
|--------------------------------------------------------------------------
| PARSE POLYGON
|--------------------------------------------------------------------------
*/

const parsePolygon = (farm) => {
  if (!farm?.polygon) {
    return [];
  }

  try {
    let polygon = farm.polygon;

    if (typeof polygon === "string") {
      polygon = JSON.parse(polygon);
    }

    /*
    |--------------------------------------------------------------
    | Format:
    | [[lat,lng], [lat,lng]]
    |--------------------------------------------------------------
    */

    if (Array.isArray(polygon) && Array.isArray(polygon[0])) {
      /*
      | Jika GeoJSON:
      | {
      |   type: "Polygon",
      |   coordinates: [...]
      | }
      */

      if (polygon[0].length >= 2 && typeof polygon[0][0] === "number") {
        return polygon.map((point) => [Number(point[0]), Number(point[1])]);
      }

      /*
      |------------------------------------------------------------
      | Nested polygon
      |------------------------------------------------------------
      */

      if (Array.isArray(polygon[0][0])) {
        return polygon[0].map((point) => [Number(point[1]), Number(point[0])]);
      }
    }

    /*
    | GeoJSON Polygon object
    */

    if (polygon.type === "Polygon" && polygon.coordinates) {
      return polygon.coordinates[0].map((point) => [
        Number(point[1]),
        Number(point[0]),
      ]);
    }
  } catch (error) {
    console.error("Parse farm polygon error:", error);
  }

  return [];
};

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const GISMap = ({ farm }) => {
  const polygon = parsePolygon(farm);

  const center =
    farm?.latitude && farm?.longitude
      ? [Number(farm.latitude), Number(farm.longitude)]
      : DEFAULT_CENTER;

  return (
    <section className="gis-map-card">
      <div className="gis-card-header">
        <div>
          <span>GEOSPATIAL VIEW</span>

          <h3>Farm Location</h3>
        </div>

        <div className="gis-map-badge">Leaflet Map</div>
      </div>

      <div className="gis-map-container">
        <MapContainer
          center={center}
          zoom={17}
          scrollWheelZoom={true}
          className="gis-leaflet-map"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController farm={farm} polygon={polygon} />

          {farm?.latitude && farm?.longitude && (
            <Marker position={[Number(farm.latitude), Number(farm.longitude)]}>
              <Popup>
                <strong>{farm.name}</strong>

                <br />

                {farm.address || "Farm location"}
              </Popup>
            </Marker>
          )}

          {polygon.length > 0 && (
            <Polygon
              positions={polygon}
              pathOptions={{
                color: "#15803d",
                fillColor: "#22c55e",
                fillOpacity: 0.25,
                weight: 3,
              }}
            />
          )}
        </MapContainer>
      </div>
    </section>
  );
};

export default GISMap;
