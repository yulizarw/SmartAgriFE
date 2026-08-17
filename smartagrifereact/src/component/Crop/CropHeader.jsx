import React from "react";

const CropHeader = ({ totalCrops, activeCrops, harvestedCrops, onAdd }) => {
  return (
    <header className="crop-header">
      <div>
        <span className="crop-eyebrow">CROP MANAGEMENT</span>

        <h1>Crops</h1>

        <p>
          Kelola tanaman, target pertumbuhan, dan konfigurasi lahan SmartAgri.
        </p>
      </div>

      <button type="button" className="crop-add-button" onClick={onAdd}>
        + Add New Crop
      </button>

      <div className="crop-stat-grid">
        <div className="crop-stat-card">
          <span>Total Crops</span>
          <strong>{totalCrops}</strong>
        </div>

        <div className="crop-stat-card">
          <span>Growing</span>
          <strong>{activeCrops}</strong>
        </div>

        <div className="crop-stat-card">
          <span>Harvested</span>
          <strong>{harvestedCrops}</strong>
        </div>
      </div>
    </header>
  );
};

export default CropHeader;
