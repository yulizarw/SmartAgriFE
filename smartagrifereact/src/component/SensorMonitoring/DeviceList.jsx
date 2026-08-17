import React from "react";

import DeviceCard from "./DeviceCard";

import "./css/DeviceList.css";

const DeviceList = ({ devices, loading, selectedDevice, onSelect }) => {
  return (
    <div className="device-list-panel">
      <div className="device-list-header">
        <div>
          <span>DEVICES</span>

          <h3>Connected Devices</h3>
        </div>

        <strong>{devices.length}</strong>
      </div>

      {loading ? (
        <div className="device-list-empty">Loading devices...</div>
      ) : devices.length === 0 ? (
        <div className="device-list-empty">
          <div>📡</div>

          <strong>No devices found</strong>

          <span>Belum ada device IoT yang terdaftar.</span>
        </div>
      ) : (
        <div className="device-list">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              selected={selectedDevice?.id === device.id}
              onClick={() => onSelect(device)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DeviceList;
