import React, { useEffect, useState } from "react";

import FarmMapPicker from "./FarmMapPicker";

import "./css/FarmForm.css";

const FarmForm = ({
  inputForm,
  setInputForm,
  submitForm,
  editingFarm,
  saving,
  onClose,
}) => {
  const [locationMode, setLocationMode] = useState("map");

  const [jsonError, setJsonError] = useState("");

  /*
    |--------------------------------------------------------------------------
    | INPUT
    |--------------------------------------------------------------------------
    */

  const handleInput = (e) => {
    const { name, value } = e.target;

    setInputForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
    |--------------------------------------------------------------------------
    | STATUS
    |--------------------------------------------------------------------------
    */

  const handleStatus = (e) => {
    setInputForm((prev) => ({
      ...prev,
      status: e.target.checked,
    }));
  };

  /*
    |--------------------------------------------------------------------------
    | MAP CHANGE
    |--------------------------------------------------------------------------
    */

  const handleMapChange = (data) => {
    setInputForm((prev) => ({
      ...prev,

      polygon: data.polygon,

      latitude: data.latitude,

      longitude: data.longitude,

      area: data.area !== undefined ? data.area : prev.area,
    }));
  };

  /*
    |--------------------------------------------------------------------------
    | JSON
    |--------------------------------------------------------------------------
    */

  const polygonJSON = inputForm.polygon
    ? JSON.stringify(inputForm.polygon, null, 2)
    : "";

  const handleJSONChange = (e) => {
    const value = e.target.value;

    try {
      const parsed = JSON.parse(value);

      if (parsed.type !== "Polygon") {
        throw new Error("GeoJSON harus bertipe Polygon.");
      }

      setJsonError("");

      setInputForm((prev) => ({
        ...prev,
        polygon: parsed,
      }));
    } catch (err) {
      setJsonError(err.message || "Format GeoJSON tidak valid.");
    }
  };

  /*
    |--------------------------------------------------------------------------
    | RESET LOCATION
    |--------------------------------------------------------------------------
    */

  const resetLocation = () => {
    setInputForm((prev) => ({
      ...prev,

      polygon: null,

      latitude: "",

      longitude: "",

      area: "",
    }));
  };

  return (
    <form className="farm-form" onSubmit={submitForm}>
      {/* =====================================================
                HEADER
            ===================================================== */}

      <div className="farm-form-header">
        <div>
          <span>FARM MANAGEMENT</span>

          <h2>{editingFarm ? "Edit Farm" : "Add New Farm"}</h2>

          <p>
            {editingFarm
              ? "Perbarui informasi farm dan lokasi lahan."
              : "Tambahkan farm baru ke sistem SmartAgri."}
          </p>
        </div>

        <button
          type="button"
          className="farm-form-close"
          onClick={onClose}
          disabled={saving}
        >
          ×
        </button>
      </div>

      {/* =====================================================
                BASIC INFORMATION
            ===================================================== */}

      <div className="farm-form-section">
        <div className="farm-form-section-title">
          <span>01</span>

          <div>
            <strong>Basic Information</strong>

            <small>Informasi utama farm</small>
          </div>
        </div>

        <div className="farm-form-grid">
          <div className="farm-form-group full">
            <label>
              Farm Name
              <span>*</span>
            </label>

            <input
              type="text"
              name="name"
              value={inputForm.name || ""}
              onChange={handleInput}
              placeholder="Contoh: Smart Farm Subang"
              required
            />
          </div>

          <div className="farm-form-group">
            <label>Area</label>

            <div className="input-with-unit">
              <input
                type="number"
                name="area"
                step="any"
                value={inputForm.area ?? ""}
                onChange={handleInput}
                placeholder="400"
              />

              <span>m²</span>
            </div>
          </div>

          <div className="farm-form-group">
            <label>Status</label>

            <label className="farm-toggle">
              <input
                type="checkbox"
                checked={inputForm.status !== false}
                onChange={handleStatus}
              />

              <span className="farm-toggle-slider" />

              <span>{inputForm.status !== false ? "Active" : "Inactive"}</span>
            </label>
          </div>

          <div className="farm-form-group full">
            <label>Address</label>

            <textarea
              name="address"
              value={inputForm.address || ""}
              onChange={handleInput}
              placeholder="Alamat lengkap farm"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
                LOCATION
            ===================================================== */}

      <div className="farm-form-section">
        <div className="farm-form-section-title">
          <span>02</span>

          <div>
            <strong>Farm Location</strong>

            <small>Tentukan batas lahan melalui peta</small>
          </div>
        </div>

        {/* MODE */}

        <div className="location-tabs">
          <button
            type="button"
            className={locationMode === "map" ? "active" : ""}
            onClick={() => setLocationMode("map")}
          >
            <span>🗺️</span>
            Draw on Map
          </button>

          <button
            type="button"
            className={locationMode === "json" ? "active" : ""}
            onClick={() => setLocationMode("json")}
          >
            <span>{"{}"}</span>
            GeoJSON
          </button>
        </div>

        {/* MAP */}

        {locationMode === "map" && (
          <FarmMapPicker
            polygon={inputForm.polygon}
            latitude={inputForm.latitude}
            longitude={inputForm.longitude}
            onChange={handleMapChange}
          />
        )}

        {/* JSON */}

        {locationMode === "json" && (
          <div className="geojson-editor">
            <div className="geojson-header">
              <div>
                <strong>GeoJSON Polygon</strong>

                <span>Format: Polygon</span>
              </div>

              <button type="button" onClick={() => setLocationMode("map")}>
                View Map
              </button>
            </div>

            <textarea
              value={polygonJSON}
              onChange={handleJSONChange}
              placeholder={`{
  "type": "Polygon",
  "coordinates": [
    [
      [107.6837018, -6.3211316],
      [107.6840001, -6.3213368]
    ]
  ]
}`}
            />

            {jsonError && <div className="json-error">⚠ {jsonError}</div>}
          </div>
        )}

        {/* COORDINATES */}

        <div className="coordinate-grid">
          <div className="farm-form-group">
            <label>Latitude</label>

            <input
              type="number"
              step="any"
              name="latitude"
              value={inputForm.latitude ?? ""}
              onChange={handleInput}
              placeholder="-6.3211316"
            />
          </div>

          <div className="farm-form-group">
            <label>Longitude</label>

            <input
              type="number"
              step="any"
              name="longitude"
              value={inputForm.longitude ?? ""}
              onChange={handleInput}
              placeholder="107.6837018"
            />
          </div>
        </div>

        {(inputForm.polygon || inputForm.latitude || inputForm.longitude) && (
          <button
            type="button"
            className="reset-location"
            onClick={resetLocation}
          >
            🗑 Reset Location
          </button>
        )}
      </div>

      {/* =====================================================
                FOOTER
            ===================================================== */}

      <div className="farm-form-footer">
        <button
          type="button"
          className="farm-cancel-button"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>

        <button type="submit" className="farm-save-button" disabled={saving}>
          {saving ? (
            <>
              <span className="button-spinner" />
              Saving...
            </>
          ) : (
            <>✓{editingFarm ? " Update Farm" : " Save Farm"}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default FarmForm;
