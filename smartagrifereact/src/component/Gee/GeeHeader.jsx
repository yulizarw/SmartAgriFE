import React from "react";

import "./css/GeeHeader.css";

const GeeHeader = () => {
  return (
    <header className="gee-header">
      <div>
        <div className="gee-header-eyebrow">GEOSPATIAL INTELLIGENCE</div>

        <h1>GIS & Earth Engine</h1>

        <p>
          Analisis kondisi lahan menggunakan Google Earth Engine, satellite
          imagery, NDVI, dan data cuaca.
        </p>
      </div>

      <div className="gee-header-badge">
        <span className="gee-header-badge-dot" />
        Google Earth Engine
      </div>
    </header>
  );
};

export default GeeHeader;
