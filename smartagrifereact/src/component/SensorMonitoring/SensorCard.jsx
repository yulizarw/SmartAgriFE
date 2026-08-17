import React from "react";

import "./css/SensorCard.css";

const SENSOR_META = {
  temperature: {
    icon: "🌡️",
    label: "Temperature",
    unit: "°C",
  },

  humidity: {
    icon: "💧",
    label: "Humidity",
    unit: "%",
  },

  soil_moisture: {
    icon: "🌱",
    label: "Soil Moisture",
    unit: "%",
  },

  light: {
    icon: "☀️",
    label: "Light",
    unit: "lux",
  },

  rainfall: {
    icon: "🌧️",
    label: "Rainfall",
    unit: "mm",
  },
};

const SensorCard = ({ reading }) => {
  const type = String(reading.sensorType || "").toLowerCase();

  const meta = SENSOR_META[type] || {
    icon: "📊",
    label: reading.sensorType || "Sensor",
    unit: "",
  };

  return (
    <div className="sensor-card">
      <div className="sensor-card-top">
        <div className="sensor-card-icon">{meta.icon}</div>

        <span className="sensor-live">LIVE</span>
      </div>

      <div className="sensor-card-label">{meta.label}</div>

      <div className="sensor-card-value">
        <strong>
          {Number(reading.value || 0).toLocaleString("id-ID", {
            maximumFractionDigits: 2,
          })}
        </strong>

        <span>{meta.unit || reading.unit || ""}</span>
      </div>

      <div className="sensor-card-time">
        {reading.recordedAt
          ? new Date(reading.recordedAt).toLocaleString("id-ID")
          : "No timestamp"}
      </div>
    </div>
  );
};

export default SensorCard;
