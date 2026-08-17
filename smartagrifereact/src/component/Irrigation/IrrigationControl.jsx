import React from "react";

import "./css/IrrigationControl.css";

const IrrigationControl = ({
  pumpStatus,
  loading,
  onEmergencyOff,
  onResumeAuto,
}) => {
  const isOn = pumpStatus === "ON";

  return (
    <section className="irrigation-control-card">
      <div className="irrigation-control-header">
        <div>
          <span>MANUAL CONTROL</span>

          <h2>Pump Control</h2>
        </div>

        <div className={isOn ? "pump-indicator on" : "pump-indicator"}>
          <span />

          {isOn ? "RUNNING" : "STOPPED"}
        </div>
      </div>

      <div className="irrigation-control-body">
        <div className="pump-visual">
          <div className={isOn ? "pump-circle running" : "pump-circle"}>💧</div>

          <strong>{isOn ? "Irrigation Active" : "Irrigation Stopped"}</strong>

          <small>
            {isOn
              ? "Pompa sedang menerima perintah ON."
              : "Pompa saat ini dalam kondisi OFF."}
          </small>
        </div>

        <div className="irrigation-control-actions">
          {isOn && (
            <button
              type="button"
              className="irrigation-stop-button"
              onClick={onEmergencyOff}
              disabled={loading}
            >
              {loading ? "Processing..." : "⛔ Turn OFF Pump"}
            </button>
          )}

          {!isOn && (
            <button
              type="button"
              className="irrigation-auto-button"
              onClick={onResumeAuto}
              disabled={loading}
            >
              {loading ? "Processing..." : "↻ Resume Auto Control"}
            </button>
          )}
        </div>
      </div>

      <div className="irrigation-warning">
        <span>⚠️</span>

        <div>
          <strong>Manual Override</strong>

          <p>
            Gunakan tombol ini apabila pompa tidak berhenti secara otomatis
            akibat keterlambatan pembacaan sensor soil moisture.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IrrigationControl;
