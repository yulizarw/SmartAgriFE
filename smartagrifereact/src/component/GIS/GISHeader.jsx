import React from "react";

const GISHeader = () => {
  return (
    <div className="gis-header">
      <div>
        <span className="gis-eyebrow">GEOSPATIAL ANALYTICS</span>

        <h1>GIS & Map</h1>

        <p>Visualisasi lokasi farm dan analisis data Google Earth Engine.</p>
      </div>

      <div className="gis-header-status">
        <span className="gis-status-dot" />
        GEE Analytics
      </div>
    </div>
  );
};

export default GISHeader;
