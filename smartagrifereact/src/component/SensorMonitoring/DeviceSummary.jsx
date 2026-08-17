import React from "react";

import "./css/DeviceSummary.css";

const DeviceSummary = ({ total, online, offline }) => {
  return (
    <div className="device-summary-grid">
      <div className="device-summary-card">
        <div className="device-summary-icon">📡</div>

        <div>
          <span>TOTAL DEVICES</span>
          <strong>{total}</strong>
        </div>
      </div>

      <div className="device-summary-card">
        <div className="device-summary-icon online">●</div>

        <div>
          <span>ONLINE</span>
          <strong>{online}</strong>
        </div>
      </div>

      <div className="device-summary-card">
        <div className="device-summary-icon offline">●</div>

        <div>
          <span>OFFLINE</span>
          <strong>{offline}</strong>
        </div>
      </div>
    </div>
  );
};

export default DeviceSummary;
