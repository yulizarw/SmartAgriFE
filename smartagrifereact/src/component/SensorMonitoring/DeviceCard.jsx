import React from "react";

import "./css/DeviceCard.css";

const DeviceCard = ({ device, selected, onClick }) => {
  const isOnline =
    device.status === true ||
    device.status === "ONLINE" ||
    device.status === "ACTIVE";

  return (
    <button
      type="button"
      className={selected ? "device-card selected" : "device-card"}
      onClick={onClick}
      disabled={!isOnline}
    >
      <div className="device-card-icon">📡</div>

      <div className="device-card-content">
        <strong>
          {device.deviceCode || device.name || `Device #${device.id}`}
        </strong>

        <span>{device.ipAddress || "IP address unavailable"}</span>

        <small>Farm ID: {device.farmId ?? "-"}</small>
      </div>

      <div
        className={isOnline ? "device-status online" : "device-status offline"}
      >
        <span />
        {isOnline ? "ONLINE" : "OFFLINE"}
      </div>
    </button>
  );
};

export default DeviceCard;
