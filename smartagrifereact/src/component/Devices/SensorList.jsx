import React from "react";

const SensorList = ({ sensors, loading }) => {
  if (loading) {
    return <div className="sensor-loading">Loading sensors...</div>;
  }

  if (!sensors.length) {
    return (
      <div className="sensor-empty">
        <div>🌱</div>

        <h4>Belum ada sensor</h4>

        <p>Device ini belum memiliki sensor IoT.</p>
      </div>
    );
  }

  return (
    <div className="sensor-grid">
      {sensors.map((sensor) => (
        <div className="sensor-card" key={sensor.id}>
          <div className="sensor-card-icon">📡</div>

          <div className="sensor-card-content">
            <span>{sensor.sensorType}</span>

            <strong>{sensor.pin}</strong>

            <small>{sensor.unit || "No unit"}</small>

            <small>{sensor.location || "No location"}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SensorList;
