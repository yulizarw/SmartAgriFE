import React from "react";

import "./css/SensorReadingTable.css";

const SensorReadingTable = ({ readings }) => {
  return (
    <div className="sensor-reading-panel">
      <div className="sensor-reading-header">
        <div>
          <span>RECENT DATA</span>

          <h3>Sensor Readings</h3>
        </div>

        <span>{readings.length} readings</span>
      </div>

      {readings.length === 0 ? (
        <div className="sensor-reading-empty">
          No sensor readings available.
        </div>
      ) : (
        <div className="sensor-reading-table-wrapper">
          <table className="sensor-reading-table">
            <thead>
              <tr>
                <th>Sensor</th>
                <th>Value</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {readings.map((reading, index) => (
                <tr key={reading.sensorId || index}>
                  <td>
                    <strong>{reading.sensorType || "Unknown Sensor"}</strong>
                  </td>

                  <td>{reading.value}</td>

                  <td>
                    {reading.recordedAt
                      ? new Date(reading.recordedAt).toLocaleString("id-ID")
                      : "-"}
                  </td>

                  <td>
                    <span className="reading-success">
                      {reading.status || "SUCCESS"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SensorReadingTable;
