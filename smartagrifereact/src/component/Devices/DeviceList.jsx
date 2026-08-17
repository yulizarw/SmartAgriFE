import React from "react";

import "./css/DeviceList.css";

const DeviceList = ({ devices, farms, loading, onView, onAdd }) => {
  const getFarmName = (farmId) => {
    const farm = farms.find((item) => Number(item.id) === Number(farmId));

    return farm?.name || "No Farm";
  };

  if (loading) {
    return (
      <div className="device-list-card">
        <div className="device-loading">Loading devices...</div>
      </div>
    );
  }

  return (
    <div className="device-list-card">
      <div className="device-list-header">
        <div>
          <span>REGISTERED DEVICES</span>

          <h2>IoT Devices</h2>
        </div>

        <span className="device-count">{devices.length} devices</span>
      </div>

      {devices.length === 0 ? (
        <div className="device-empty">
          <div className="device-empty-icon">📡</div>

          <h3>Belum ada device</h3>

          <p>Tambahkan ESP32 atau perangkat IoT pertama kamu.</p>

          <button type="button" onClick={onAdd}>
            + Add Device
          </button>
        </div>
      ) : (
        <div className="device-table-wrapper">
          <table className="device-table">
            <thead>
              <tr>
                <th>DEVICE</th>

                <th>FARM</th>

                <th>CONNECTION</th>

                <th>IP ADDRESS</th>

                <th>STATUS</th>

                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {devices.map((device) => {
                const online =
                  device.status === true ||
                  device.status === "ONLINE" ||
                  device.status === "ACTIVE";

                return (
                  <tr key={device.id}>
                    <td>
                      <div className="device-name-cell">
                        <div className="device-avatar">📡</div>

                        <div>
                          <strong>
                            {device.deviceName || device.deviceCode}
                          </strong>

                          <small>{device.deviceCode}</small>
                        </div>
                      </div>
                    </td>

                    <td>{getFarmName(device.farmId)}</td>

                    <td>
                      <span className="connection-badge">
                        {device.connectionType || "-"}
                      </span>
                    </td>

                    <td>{device.ipAddress || "-"}</td>

                    <td>
                      <span
                        className={
                          online
                            ? "device-status online"
                            : "device-status offline"
                        }
                      >
                        <span />
                        {online ? "ONLINE" : "OFFLINE"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="device-manage-button"
                        onClick={() => onView(device)}
                      >
                        Manage IoT →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeviceList;
