import React from "react";

import "./css/IrrigationStatus.css";

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleString("id-ID");
};

const IrrigationStatus = ({
  loading,
  pumpStatus,
  recommendation,
  decision,
  relay,
}) => {
  const isOn = pumpStatus === "ON";

  const recommendationDate =
    recommendation?.updatedAt || recommendation?.createdAt;

  const decisionDate = decision?.updatedAt || decision?.createdAt;

  const relayCommand =
    relay?.command || decision?.relayCommand || decision?.command || "-";

  return (
    <section className="irrigation-status-section">
      <div className="irrigation-status-grid">
        {/* PUMP */}

        <div
          className={
            isOn
              ? "irrigation-status-card pump on"
              : "irrigation-status-card pump"
          }
        >
          <div className="irrigation-card-icon">💧</div>

          <div>
            <span>PUMP</span>

            <strong>{loading ? "..." : isOn ? "RUNNING" : "STOPPED"}</strong>

            <small>{isOn ? "Pompa sedang aktif" : "Pompa tidak aktif"}</small>
          </div>
        </div>

        {/* COMMAND */}

        <div className="irrigation-status-card">
          <div className="irrigation-card-icon">⚡</div>

          <div>
            <span>RELAY COMMAND</span>

            <strong>{relayCommand}</strong>

            <small>Last command dari decision system</small>
          </div>
        </div>

        {/* RECOMMENDATION */}

        <div className="irrigation-status-card">
          <div className="irrigation-card-icon">🤖</div>

          <div>
            <span>RECOMMENDATION</span>

            <strong>{recommendation ? "AVAILABLE" : "NOT AVAILABLE"}</strong>

            <small>{formatDate(recommendationDate)}</small>
          </div>
        </div>

        {/* DECISION */}

        <div className="irrigation-status-card">
          <div className="irrigation-card-icon">🧠</div>

          <div>
            <span>DECISION LOG</span>

            <strong>{decision ? "UPDATED" : "NO DATA"}</strong>

            <small>{formatDate(decisionDate)}</small>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IrrigationStatus;
