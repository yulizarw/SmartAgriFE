import React, { useMemo } from "react";

import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import "./css/FarmDetail.css";

const polygonToPoints = (polygon) => {
  if (!polygon || polygon.type !== "Polygon" || !polygon.coordinates?.[0]) {
    return [];
  }

  return polygon.coordinates[0].map(([lng, lat]) => [lat, lng]);
};

const FitBounds = ({ points }) => {
  const map = useMap();

  React.useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(points, {
        padding: [40, 40],
      });
    }
  }, [points, map]);

  return null;
};

const FarmDetail = ({ farm, onClose, onEdit }) => {
  /*
  |--------------------------------------------------------------------------
  | POLYGON
  |--------------------------------------------------------------------------
  | Hook harus dipanggil SEBELUM conditional return.
  */

  const points = useMemo(() => polygonToPoints(farm?.polygon), [farm?.polygon]);

  /*
  |--------------------------------------------------------------------------
  | BELUM ADA DATA FARM
  |--------------------------------------------------------------------------
  */

  if (!farm) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | FARM LOCATION
  |--------------------------------------------------------------------------
  */

  const latitude =
    farm.latitude !== null && farm.latitude !== undefined
      ? Number(farm.latitude)
      : null;

  const longitude =
    farm.longitude !== null && farm.longitude !== undefined
      ? Number(farm.longitude)
      : null;

  const center =
    latitude !== null && longitude !== null
      ? [latitude, longitude]
      : points.length
        ? points[0]
        : [-6.3211316, 107.6837018];

  /*
  |--------------------------------------------------------------------------
  | FARM STATUS
  |--------------------------------------------------------------------------
  */

  const isActive = farm.status === true || farm.status === "ACTIVE";

  /*
  |--------------------------------------------------------------------------
  | OPEN OPENSTREETMAP
  |--------------------------------------------------------------------------
  */

  const openOpenStreetMap = () => {
    if (latitude === null || longitude === null) {
      return;
    }

    const url =
      `https://www.openstreetmap.org/` +
      `?mlat=${latitude}` +
      `&mlon=${longitude}` +
      `#map=18/${latitude}/${longitude}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="farm-detail">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="farm-detail-header">
        <div className="farm-detail-title">
          <div className="farm-detail-icon">🌱</div>

          <div>
            <span>FARM DETAIL</span>

            <h2>{farm.name}</h2>
          </div>
        </div>

        <button type="button" className="farm-detail-close" onClick={onClose}>
          ×
        </button>
      </div>

      {/* =====================================================
          STATUS
      ===================================================== */}

      <div className="farm-detail-status-row">
        <span
          className={
            isActive
              ? "farm-detail-status active"
              : "farm-detail-status inactive"
          }
        >
          <span />

          {isActive ? "Active Farm" : "Inactive Farm"}
        </span>

        <span>Farm ID #{farm.id}</span>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="farm-detail-content">
        {/* =================================================
            INFO
        ================================================= */}

        <div className="farm-detail-info">
          <div className="detail-info-card">
            <span>AREA</span>

            <strong>
              {Number(farm.area || 0).toLocaleString()}

              <small>m²</small>
            </strong>
          </div>

          <div className="detail-info-card">
            <span>LATITUDE</span>

            <strong>{latitude !== null ? latitude.toFixed(7) : "-"}</strong>
          </div>

          <div className="detail-info-card">
            <span>LONGITUDE</span>

            <strong>{longitude !== null ? longitude.toFixed(7) : "-"}</strong>
          </div>

          <div className="detail-address-card">
            <span>📍 ADDRESS</span>

            <strong>{farm.address || "Address not available"}</strong>
          </div>
        </div>

        {/* =================================================
            MAP
        ================================================= */}

        <div className="farm-detail-map-wrapper">
          <div className="farm-detail-map-header">
            <div>
              <span>LOCATION</span>

              <strong>Farm Boundary</strong>
            </div>

            {latitude !== null && longitude !== null && (
              <button type="button" onClick={openOpenStreetMap}>
                🗺️ OpenStreetMap ↗
              </button>
            )}
          </div>

          <div className="farm-detail-map">
            <MapContainer
              center={center}
              zoom={17}
              scrollWheelZoom={true}
              className="farm-detail-leaflet"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <FitBounds points={points.length ? points : [center]} />

              {latitude !== null && longitude !== null && (
                <Marker position={[latitude, longitude]} />
              )}

              {points.length >= 3 && (
                <Polygon
                  positions={points}
                  pathOptions={{
                    color: "#15803d",
                    fillColor: "#22c55e",
                    fillOpacity: 0.3,
                    weight: 3,
                  }}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="farm-detail-footer">
        <button
          type="button"
          className="detail-secondary-button"
          onClick={onClose}
        >
          Close
        </button>

        <button
          type="button"
          className="detail-edit-button"
          onClick={() => onEdit(farm)}
        >
          ✎ Edit Farm
        </button>
      </div>
    </div>
  );
};

export default FarmDetail;
