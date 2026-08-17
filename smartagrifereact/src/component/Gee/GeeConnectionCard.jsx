import React from "react";

import "./css/GeeConnectionCard.css";

const GeeConnectionCard = ({ connectionStatus, loading, onTestConnection }) => {
  const connected = connectionStatus?.success === true;

  return (
    <section className="gee-connection-card">
      <div className="gee-connection-icon">🌍</div>

      <div className="gee-connection-content">
        <span className="gee-section-label">EARTH ENGINE CONNECTION</span>

        <h3>Google Earth Engine</h3>

        <p>
          Periksa koneksi aplikasi dengan Google Earth Engine sebelum melakukan
          analisis satellite.
        </p>

        {connectionStatus && (
          <div
            className={
              connected
                ? "gee-connection-result success"
                : "gee-connection-result failed"
            }
          >
            <span>{connected ? "●" : "●"}</span>

            {connectionStatus.message ||
              (connected ? "Connected" : "Connection failed")}
          </div>
        )}
      </div>

      <button
        type="button"
        className="gee-connect-button"
        onClick={onTestConnection}
        disabled={loading}
      >
        {loading ? "Checking..." : "Test Connection"}
      </button>
    </section>
  );
};

export default GeeConnectionCard;
