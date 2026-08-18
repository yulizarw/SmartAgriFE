import React from "react";

import "./css/DeviceHeader.css";

const DeviceHeader = ({
  totalDevices,
  onlineDevices,
  offlineDevices,
  onAdd,
  listAllSensors
}) => {
  return (
    <>
      <div className="device-page-header">
        <div>
          <div className="device-page-eyebrow">IOT MANAGEMENT</div>

          <h1>Devices & IoT</h1>

          <p>
            Kelola perangkat IoT, ESP32, dan sensor yang terhubung dengan
            SmartAgri.
          </p>
        </div>

        <button type="button" className="device-add-button" onClick={onAdd}>
          <span>+</span>
          Add New Device
        </button>
      </div>

      <div className="device-stat-grid">
        <div className="device-stat-card">
          <div className="device-stat-icon">📡</div>

          <div>
            <span>TOTAL DEVICES</span>

            <strong>{totalDevices}</strong>
          </div>
        </div>

        <div className="device-stat-card">
          <div className="device-stat-icon online">●</div>

          <div>
            <span>ONLINE</span>

            <strong>{onlineDevices}</strong>
          </div>
        </div>

        <div className="device-stat-card">
          <div className="device-stat-icon offline">●</div>

          <div>
            <span>OFFLINE</span>

            <strong>{offlineDevices}</strong>
          </div>
        </div>

        <div className="device-stat-card">
          <div className="device-stat-icon sensor">🌡️</div>

          <div>
            <span>IOT SENSOR</span>

            <strong>{listAllSensors?.length}</strong>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeviceHeader;
