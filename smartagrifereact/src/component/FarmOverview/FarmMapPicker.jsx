import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Polyline,
  CircleMarker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./css/FarmMapPicker.css";

/* =========================================================
   LEAFLET MARKER
========================================================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* =========================================================
   GEOJSON → LEAFLET
========================================================= */

const geoJsonToLeaflet = (polygon) => {
  if (!polygon || polygon.type !== "Polygon" || !polygon.coordinates?.[0]) {
    return [];
  }

  let coordinates = polygon.coordinates[0];

  /*
   * GeoJSON Polygon biasanya mempunyai titik pertama
   * yang diulang di akhir untuk menutup polygon.
   *
   * Contoh:
   * [
   *   [lng1, lat1],
   *   [lng2, lat2],
   *   [lng3, lat3],
   *   [lng1, lat1]
   * ]
   *
   * Untuk state drawing kita TIDAK mau titik terakhir
   * dianggap sebagai titik baru.
   */

  if (coordinates.length > 1) {
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];

    if (first[0] === last[0] && first[1] === last[1]) {
      coordinates = coordinates.slice(0, -1);
    }
  }

  return coordinates.map(([lng, lat]) => [lat, lng]);
};

/* =========================================================
   LEAFLET → GEOJSON
========================================================= */

const leafletToGeoJson = (points) => {
  if (points.length < 3) {
    return null;
  }

  const coordinates = points.map(([lat, lng]) => [lng, lat]);

  /*
   * GeoJSON Polygon HARUS ditutup.
   * Tetapi titik penutup hanya ditambahkan pada output,
   * bukan pada state points.
   */

  const first = coordinates[0];

  coordinates.push([first[0], first[1]]);

  return {
    type: "Polygon",
    coordinates: [coordinates],
  };
};

/* =========================================================
   AREA CALCULATION
========================================================= */

const calculateArea = (points) => {
  if (points.length < 3) {
    return 0;
  }

  const earthRadius = 6378137;

  const latAverage =
    points.reduce((sum, point) => sum + point[0], 0) / points.length;

  const latRad = (latAverage * Math.PI) / 180;

  const coordinates = points.map(([lat, lng]) => ({
    x: ((lng * Math.PI) / 180) * earthRadius * Math.cos(latRad),

    y: ((lat * Math.PI) / 180) * earthRadius,
  }));

  let area = 0;

  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length;

    area +=
      coordinates[i].x * coordinates[j].y - coordinates[j].x * coordinates[i].y;
  }

  return Math.abs(area / 2);
};

/* =========================================================
   MAP CLICK HANDLER
========================================================= */

const MapClickHandler = ({ onMapClick, disabled }) => {
  useMapEvents({
    click(e) {
      if (disabled) {
        return;
      }

      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
};

/* =========================================================
   MAP CONTROLLER
========================================================= */

const MapController = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (!center) {
      return;
    }

    map.flyTo(center, 18, {
      duration: 1,
    });
  }, [center, map]);

  return null;
};

/* =========================================================
   COMPONENT
========================================================= */

const FarmMapPicker = ({ polygon, latitude, longitude, onChange }) => {
  /*
   * polygonClosed hanya untuk UI.
   *
   * FALSE:
   * user masih boleh menambahkan titik.
   *
   * TRUE:
   * polygon sudah selesai dan map tidak menerima
   * titik baru.
   */

  const [polygonClosed, setPolygonClosed] = useState(
    Boolean(polygon?.coordinates?.[0]?.length >= 4),
  );

  const [points, setPoints] = useState(() => geoJsonToLeaflet(polygon));

  const [gpsLoading, setGpsLoading] = useState(false);

  /*
   * Menandai bahwa perubahan polygon berasal dari
   * component ini sendiri.
   *
   * Ini mencegah useEffect polygon melakukan reset
   * terhadap points setiap kali kita klik map.
   */

  const internalPolygonChange = useRef(false);

  /* =====================================================
     SYNC EXISTING FARM
  ===================================================== */

  useEffect(() => {
    if (internalPolygonChange.current) {
      internalPolygonChange.current = false;
      return;
    }

    const converted = geoJsonToLeaflet(polygon);

    setPoints(converted);

    setPolygonClosed(Boolean(polygon?.coordinates?.[0]?.length >= 4));
  }, [polygon]);

  /* =====================================================
     CENTER
  ===================================================== */

  const center = useMemo(() => {
    if (
      latitude !== "" &&
      latitude !== null &&
      latitude !== undefined &&
      longitude !== "" &&
      longitude !== null &&
      longitude !== undefined
    ) {
      return [Number(latitude), Number(longitude)];
    }

    if (points.length > 0) {
      return points[0];
    }

    /*
     * Default Subang
     */

    return [-6.3211316, 107.6837018];
  }, [latitude, longitude, points]);

  /* =====================================================
     HANDLE MAP CLICK
  ===================================================== */

  const handleMapClick = (point) => {
    /*
     * Kalau polygon sudah selesai,
     * jangan menerima titik baru.
     */

    if (polygonClosed) {
      return;
    }

    const newPoints = [...points, point];

    setPoints(newPoints);

    /*
     * Polygon baru valid setelah 3 titik.
     */

    const newPolygon =
      newPoints.length >= 3 ? leafletToGeoJson(newPoints) : null;

    const area = newPoints.length >= 3 ? calculateArea(newPoints) : 0;

    /*
     * Beritahu parent bahwa lokasi berubah.
     */

    internalPolygonChange.current = true;

    onChange({
      polygon: newPolygon,

      /*
       * Latitude / longitude mengikuti
       * titik terakhir yang diklik.
       */

      latitude: point[0],

      longitude: point[1],

      area: area > 0 ? Number(area.toFixed(2)) : "",
    });
  };

  /* =====================================================
     FINISH POLYGON
  ===================================================== */

  const handleFinishPolygon = () => {
    if (points.length < 3) {
      alert("Minimal 3 titik diperlukan untuk membuat polygon.");

      return;
    }

    const finalPolygon = leafletToGeoJson(points);

    const area = calculateArea(points);

    setPolygonClosed(true);

    internalPolygonChange.current = true;

    onChange({
      polygon: finalPolygon,

      /*
       * Center tetap menggunakan titik terakhir.
       */

      latitude: points[points.length - 1][0],

      longitude: points[points.length - 1][1],

      area: area > 0 ? Number(area.toFixed(2)) : "",
    });
  };

  /* =====================================================
     GPS
  ===================================================== */

  const handleGPS = () => {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung GPS.");

      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;

        const lng = position.coords.longitude;

        /*
         * GPS hanya menentukan posisi tengah / lokasi farm.
         *
         * GPS TIDAK otomatis menjadi titik polygon.
         */

        onChange({
          polygon: points.length >= 3 ? leafletToGeoJson(points) : null,

          latitude: lat,

          longitude: lng,

          area:
            points.length >= 3 ? Number(calculateArea(points).toFixed(2)) : "",
        });

        setGpsLoading(false);
      },

      (error) => {
        console.error(error);

        alert(
          "Lokasi GPS tidak dapat diperoleh. Pastikan izin lokasi diberikan.",
        );

        setGpsLoading(false);
      },

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 0,
      },
    );
  };

  /* =====================================================
     UNDO
  ===================================================== */

  const handleUndo = () => {
    if (points.length === 0) {
      return;
    }

    /*
     * Kalau sebelumnya sudah Finish,
     * Undo akan membuka kembali polygon.
     */

    setPolygonClosed(false);

    const newPoints = points.slice(0, -1);

    setPoints(newPoints);

    const newPolygon =
      newPoints.length >= 3 ? leafletToGeoJson(newPoints) : null;

    const area = newPoints.length >= 3 ? calculateArea(newPoints) : 0;

    internalPolygonChange.current = true;

    onChange({
      polygon: newPolygon,

      latitude: newPoints.length > 0 ? newPoints[newPoints.length - 1][0] : "",

      longitude: newPoints.length > 0 ? newPoints[newPoints.length - 1][1] : "",

      area: area > 0 ? Number(area.toFixed(2)) : "",
    });
  };

  /* =====================================================
     CLEAR
  ===================================================== */

  const handleClear = () => {
    setPoints([]);

    setPolygonClosed(false);

    internalPolygonChange.current = true;

    onChange({
      polygon: null,

      latitude: "",

      longitude: "",

      area: "",
    });
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="farm-map-picker">
      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="map-picker-toolbar">
        <div className="map-picker-info">
          <div className="map-picker-status">
            <span />
            Interactive Map
          </div>

          <small>
            {polygonClosed ? "Polygon selesai" : "Klik titik-titik batas lahan"}
          </small>
        </div>

        <div className="map-picker-actions">
          {/* GPS */}

          <button type="button" onClick={handleGPS} disabled={gpsLoading}>
            {gpsLoading ? "⌛ Locating..." : "📍 Use GPS"}
          </button>

          {/* FINISH */}

          {points.length >= 3 && !polygonClosed && (
            <button
              type="button"
              className="map-finish-button"
              onClick={handleFinishPolygon}
            >
              ✓ Finish Polygon
            </button>
          )}

          {/* UNDO */}

          <button
            type="button"
            onClick={handleUndo}
            disabled={points.length === 0}
          >
            ↶ Undo
          </button>

          {/* CLEAR */}

          <button
            type="button"
            className="danger"
            onClick={handleClear}
            disabled={points.length === 0}
          >
            Clear
          </button>
        </div>
      </div>

      {/* =================================================
          MAP
      ================================================= */}

      <div className="farm-map-container">
        <MapContainer
          center={center}
          zoom={18}
          scrollWheelZoom={true}
          className="farm-map"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler
            onMapClick={handleMapClick}
            disabled={polygonClosed}
          />

          <MapController center={center} />

          {/* =================================================
              GPS MARKER
          ================================================= */}

          {latitude !== "" &&
            latitude !== null &&
            longitude !== "" &&
            longitude !== null && (
              <Marker position={[Number(latitude), Number(longitude)]} />
            )}

          {/* =================================================
              DRAWING LINE
          ================================================= */}

          {points.length >= 2 && !polygonClosed && (
            <Polyline
              positions={points}
              pathOptions={{
                color: "#16a34a",
                weight: 3,
              }}
            />
          )}

          {/* =================================================
              FINISHED POLYGON
          ================================================= */}

          {polygonClosed && points.length >= 3 && (
            <Polygon
              positions={points}
              pathOptions={{
                color: "#16a34a",
                fillColor: "#22c55e",
                fillOpacity: 0.25,
                weight: 3,
              }}
            />
          )}

          {/* =================================================
              POINTS
          ================================================= */}

          {points.map((point, index) => (
            <CircleMarker
              key={`${point[0]}-${point[1]}-${index}`}
              center={point}
              radius={7}
              pathOptions={{
                color: "#ffffff",
                fillColor: "#15803d",
                fillOpacity: 1,
                weight: 2,
              }}
            />
          ))}
        </MapContainer>

        {/* =================================================
            POINT COUNTER
        ================================================= */}

        <div className="map-point-counter">
          <strong>{points.length}</strong>

          <span>points</span>
        </div>

        {/* =================================================
            AREA
        ================================================= */}

        {points.length >= 3 && (
          <div className="map-area-card">
            <span>ESTIMATED AREA</span>

            <strong>
              {calculateArea(points).toLocaleString("id-ID", {
                maximumFractionDigits: 2,
              })}

              <small>m²</small>
            </strong>
          </div>
        )}
      </div>

      {/* =================================================
          HELP
      ================================================= */}

      <div className="map-picker-help">
        <div>
          <span>1</span>
          Klik titik pertama pada batas lahan
        </div>

        <div>
          <span>2</span>
          Lanjutkan klik mengikuti bentuk lahan
        </div>

        <div>
          <span>3</span>
          Minimal 3 titik untuk membuat polygon
        </div>

        <div>
          <span>4</span>
          Klik <strong>Finish Polygon</strong> jika batas lahan sudah selesai
        </div>
      </div>
    </div>
  );
};

export default FarmMapPicker;
