import React from "react";

import "./css/IrrigationHeader.css";

const IrrigationHeader = ({ pumpStatus, loading }) => {
  const isOn = pumpStatus === "ON";

  return (
    <header className="irrigation-header">
      <div>
        <div className="irrigation-eyebrow">SMART IRRIGATION</div>

        <h1>Irrigation Control</h1>

        <p>Monitor dan kendalikan sistem irigasi SmartAgri secara real-time.</p>
      </div>

      <div
        className={
          isOn ? "irrigation-header-status on" : "irrigation-header-status off"
        }
      >
        <span className="irrigation-status-dot" />

        <div>
          <small>PUMP STATUS</small>

          <strong>
            {loading ? "Checking..." : isOn ? "PUMP ON" : "PUMP OFF"}
          </strong>
        </div>
      </div>
    </header>
  );
};

export default IrrigationHeader;
