import React from "react";

import "./css/DecisionLogPanel.css";

const DecisionLogPanel = ({
  recommendation,
  decisionLog,
  loading,
  onCreate,
  onLoadLatest,
}) => {
  return (
    <section className="decision-log-panel">
      <div className="decision-log-header">
        <div>
          <span>DECISION AUTOMATION</span>

          <h2>Decision Log</h2>

          <p>
            Membuat keputusan berdasarkan recommendation sebelum diteruskan ke
            sistem relay.
          </p>
        </div>

        <div className="decision-log-icon">⚙️</div>
      </div>

      <div className="decision-log-actions">
        <button
          type="button"
          className="decision-create-button"
          onClick={onCreate}
          disabled={loading}
        >
          {loading ? "⏳ Processing..." : "⚡ Create Decision"}
        </button>

        <button
          type="button"
          className="decision-load-button"
          onClick={onLoadLatest}
          disabled={loading}
        >
          ↻ Load Latest Decision
        </button>
      </div>

      {decisionLog ? (
        <div className="decision-log-result">
          <div className="decision-result-status">
            <span />
            Decision log tersedia
          </div>

          <pre>{JSON.stringify(decisionLog, null, 2)}</pre>
        </div>
      ) : (
        <div className="decision-empty">
          <div>⚙️</div>

          <strong>No Decision Log</strong>

          <p>
            Belum ada keputusan yang dibuat untuk Recommendation #
            {recommendation?.id}.
          </p>
        </div>
      )}
    </section>
  );
};

export default DecisionLogPanel;
