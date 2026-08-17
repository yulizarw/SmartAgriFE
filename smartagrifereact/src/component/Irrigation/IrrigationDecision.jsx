import React from "react";

import "./css/IrrigationDecision.css";

const IrrigationDecision = ({ recommendation, decision, relay }) => {
  const command =
    relay?.command || decision?.relayCommand || decision?.command || "-";

  return (
    <section className="irrigation-decision-card">
      <div className="irrigation-decision-header">
        <div>
          <span>AUTOMATED DECISION</span>

          <h2>Latest Decision</h2>
        </div>

        <div className="decision-ai">🤖 AI</div>
      </div>

      <div className="decision-content">
        <div className="decision-command">
          <span>RELAY COMMAND</span>

          <strong>{command}</strong>
        </div>

        <div className="decision-row">
          <span>Recommendation</span>

          <strong>
            {recommendation
              ? recommendation.recommendation ||
                recommendation.action ||
                recommendation.status ||
                "-"
              : "-"}
          </strong>
        </div>

        <div className="decision-row">
          <span>Decision Source</span>

          <strong>
            {decision?.source || decision?.decisionSource || "AUTOMATED"}
          </strong>
        </div>

        <div className="decision-row">
          <span>Decision Status</span>

          <strong>{decision?.status || "ACTIVE"}</strong>
        </div>
      </div>
    </section>
  );
};

export default IrrigationDecision;
