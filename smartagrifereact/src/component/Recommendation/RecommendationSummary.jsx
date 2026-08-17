import React from "react";

import "./css/RecommendationSummary.css";

const RecommendationSummary = ({ recommendation, analysis, decisionLog }) => {
  const hasRecommendation = !!recommendation;

  const hasDecision = !!decisionLog;

  return (
    <div className="recommendation-summary-grid">
      <div className="recommendation-summary-card">
        <div className="summary-icon">💡</div>

        <div>
          <span>RECOMMENDATION</span>

          <strong>{hasRecommendation ? "Available" : "Not Generated"}</strong>
        </div>
      </div>

      <div className="recommendation-summary-card">
        <div className="summary-icon analysis">🧠</div>

        <div>
          <span>ANALYSIS</span>

          <strong>{analysis ? "Completed" : "Waiting"}</strong>
        </div>
      </div>

      <div className="recommendation-summary-card">
        <div className="summary-icon decision">⚙️</div>

        <div>
          <span>DECISION LOG</span>

          <strong>{hasDecision ? "Created" : "Not Created"}</strong>
        </div>
      </div>

      <div className="recommendation-summary-card">
        <div className="summary-icon relay">⚡</div>

        <div>
          <span>AUTOMATION</span>

          <strong>{hasDecision ? "Ready" : "Standby"}</strong>
        </div>
      </div>
    </div>
  );
};

export default RecommendationSummary;
