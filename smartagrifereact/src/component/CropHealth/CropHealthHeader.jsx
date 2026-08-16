import React from "react";

import "./css/CropHealthHeader.css";

const CropHealthHeader = () => {
  return (
    <header className="crop-health-header">
      <div>
        <div className="crop-health-eyebrow">SMART MONITORING</div>

        <h1>Crop Health</h1>

        <p>
          Analisis kondisi kesehatan tanaman berdasarkan farm, crop, tanggal,
          dan data sensor.
        </p>
      </div>

      <div className="crop-health-header-badge">
        <span className="crop-health-live-dot" />
        Analysis Engine Ready
      </div>
    </header>
  );
};

export default CropHealthHeader;
