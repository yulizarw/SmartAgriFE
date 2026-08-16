import React from "react";

import "./css/CropHealthSensor.css";

const CropHealthSensor = ({ sensor }) => {
  if (!sensor) {
    return null;
  }

  const entries = typeof sensor === "object" ? Object.entries(sensor) : [];

  return (
    <section className="crop-health-sensor">
      <div className="crop-health-sensor-header">
        <div>
          <span>SENSOR DATA</span>

          <h3>Sensor Information</h3>
        </div>

        <div className="sensor-live-badge">● SENSOR</div>
      </div>

      <div className="crop-health-sensor-grid">
        {entries.map(([key, value]) => (
          <div className="crop-health-sensor-item" key={key}>
            <span>
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (char) => char.toUpperCase())}
            </span>

            <strong>
              {typeof value === "object"
                ? JSON.stringify(value)
                : String(value)}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CropHealthSensor;
