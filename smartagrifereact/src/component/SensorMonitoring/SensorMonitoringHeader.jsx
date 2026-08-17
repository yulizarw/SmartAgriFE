import React from "react";

import "./css/SensorMonitoringHeader.css";

const SensorMonitoringHeader = ({ selectedDevice, collecting, onCollect }) => {
  return (
    <div className="sensor-monitoring-header">
      <div>
        <div className="sensor-monitoring-eyebrow">IOT MONITORING</div>

        <h1>Sensor Monitoring</h1>

        <p>Monitor kondisi device dan data sensor secara realtime.</p>
      </div>

      <div className="sensor-monitoring-header-actions">
        {selectedDevice && (
          <div className="selected-device-chip">
            <span className="online-dot" />

            {selectedDevice.deviceCode}
          </div>
        )}

        <button
          type="button"
          className="sensor-refresh-button"
          disabled={!selectedDevice || collecting}
          onClick={onCollect}
        >
          {collecting ? "⌛ Collecting..." : "↻ Collect Data"}
        </button>
      </div>
    </div>
  );
};

export default SensorMonitoringHeader;
