import React from "react";

import SensorCard from "./SensorCard";

import "./css/SensorGrid.css";

const SensorGrid = ({ device, readings }) => {
  if (!device) {
    return (
      <div className="sensor-grid-empty">
        <div className="sensor-grid-empty-icon">📡</div>

        <h3>Select a Device</h3>

        <p>Pilih device di sebelah kiri untuk melihat sensor.</p>
      </div>
    );
  }

  if (!readings.length) {
    return (
      <div className="sensor-grid-empty">
        <div className="sensor-grid-empty-icon">🌱</div>

        <h3>No Sensor Data</h3>

        <p>Belum ada data sensor untuk device ini.</p>
      </div>
    );
  }

  return (
    <div className="sensor-grid">
      {readings.map((reading, index) => (
        <SensorCard
          key={reading.sensorId || `${reading.sensorType}-${index}`}
          reading={reading}
        />
      ))}
    </div>
  );
};

export default SensorGrid;
