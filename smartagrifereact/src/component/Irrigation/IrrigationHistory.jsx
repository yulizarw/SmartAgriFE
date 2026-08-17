import React from "react";

import "./css/IrrigationHistory.css";

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

const IrrigationHistory = ({ recommendation, decision }) => {
  return (
    <section className="irrigation-history-card">
      <div className="irrigation-history-header">
        <div>
          <span>ACTIVITY</span>

          <h2>Latest Irrigation Activity</h2>
        </div>
      </div>

      <div className="irrigation-history-list">
        <div className="irrigation-history-item">
          <div className="history-icon">🤖</div>

          <div className="history-content">
            <strong>Recommendation updated</strong>

            <span>
              Sistem menghasilkan recommendation terbaru untuk irrigation.
            </span>
          </div>

          <time>
            {formatDate(recommendation?.updatedAt || recommendation?.createdAt)}
          </time>
        </div>

        <div className="irrigation-history-item">
          <div className="history-icon">⚡</div>

          <div className="history-content">
            <strong>Decision log updated</strong>

            <span>Decision system menghasilkan perintah relay.</span>
          </div>

          <time>{formatDate(decision?.updatedAt || decision?.createdAt)}</time>
        </div>
      </div>
    </section>
  );
};

export default IrrigationHistory;
