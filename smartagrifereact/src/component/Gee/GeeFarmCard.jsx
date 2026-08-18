import React from "react";

const formatNumber = (value, digits = 2) => {
  if (value === null || value === undefined) {
    return "-";
  }

  return Number(value).toFixed(digits);
};

const GeeFarmCard = ({ farm, crop, gee, weather }) => {
    
  return (
    <article className="gee-farm-card">
      {/* =====================================
          FARM HEADER
      ====================================== */}

      <div className="gee-farm-card-header">
        <div>
          <span className="gee-card-label">FARM</span>
        
          <h3>{farm.name}</h3>

          <span className="gee-crop-name">🌱 {crop?.name || "Crop"}</span>
        </div>

        <div className="gee-farm-id">#{farm.id}</div>
      </div>

      {/* =====================================
          OBSERVATION
      ====================================== */}

      <div className="gee-observation-info">
        <div>
          <span>Analysis Date</span>

          <strong>
            {gee?.date ? new Date(gee.date).toLocaleDateString("id-ID") : "-"}
          </strong>
        </div>

        <div>
          <span>Observation</span>

          <strong>
            {gee?.observationDate
              ? new Date(gee.observationDate).toLocaleDateString("id-ID")
              : "-"}
          </strong>
        </div>
      </div>

      {/* =====================================
          NDVI
      ====================================== */}

      <div className="gee-ndvi">
        <div className="gee-ndvi-main">
          <span>NDVI</span>

          <strong>{formatNumber(gee?.ndvi)}</strong>
        </div>

        <div className="gee-ndvi-description">
          <span>Vegetation Index</span>

          <small>{getNDVIStatus(gee?.ndvi)}</small>
        </div>
      </div>

      {/* =====================================
          VEGETATION INDICES
      ====================================== */}

      <div className="gee-index-grid">
        <GeeMetric label="EVI" value={gee?.evi} />

        <GeeMetric label="GNDVI" value={gee?.gndvi} />

        <GeeMetric label="SAVI" value={gee?.savi} />

        <GeeMetric label="NDMI" value={gee?.ndmi} />

        <GeeMetric label="NDWI" value={gee?.ndwi} />

        <GeeMetric label="MSI" value={gee?.msi} />
      </div>

      {/* =====================================
          WEATHER
      ====================================== */}

      <div className="gee-weather-section">
        <div className="gee-weather-title">☁️ Weather</div>

        <div className="gee-weather-grid">
          <GeeMetric label="Rain" value={weather?.rain} suffix=" mm" />

          <GeeMetric
            label="Temperature"
            value={weather?.temperature}
            suffix=" °C"
          />

          <GeeMetric label="Soil Moisture" value={weather?.soilMoisture} />

          <GeeMetric label="Radiation" value={weather?.radiation} />
        </div>
      </div>
    </article>
  );
};

const GeeMetric = ({ label, value, suffix = "" }) => {
  return (
    <div className="gee-metric">
      <span>{label}</span>

      <strong>
        {value !== null && value !== undefined
          ? `${formatNumber(value)}${suffix}`
          : "-"}
      </strong>
    </div>
  );
};

const getNDVIStatus = (value) => {
  if (value === null || value === undefined) {
    return "No observation";
  }

  const ndvi = Number(value);

  if (ndvi < 0.2) {
    return "Vegetasi sangat rendah";
  }

  if (ndvi < 0.4) {
    return "Vegetasi rendah";
  }

  if (ndvi < 0.6) {
    return "Vegetasi sedang";
  }

  if (ndvi < 0.8) {
    return "Vegetasi sehat";
  }

  return "Vegetasi sangat sehat";
};

export default GeeFarmCard;
