import React from "react";

import "./css/RecommendationDetail.css";

const RecommendationDetail = ({ recommendation, analysis }) => {
  if (!recommendation) {
    return null;
  }

  const ignoredFields = ["id", "createdAt", "updatedAt"];

  const fields = Object.entries(recommendation).filter(
    ([key]) => !ignoredFields.includes(key),
  );

  return (
    <section className="recommendation-detail">
      <div className="recommendation-section-heading">
        <div>
          <span>RECOMMENDATION RESULT</span>

          <h2>Recommended Action</h2>
        </div>

        <div className="recommendation-id">ID #{recommendation.id}</div>
      </div>

      <div className="recommendation-detail-grid">
        {fields.map(([key, value]) => (
          <div className="recommendation-field" key={key}>
            <span>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</span>

            <strong>
              {typeof value === "object"
                ? JSON.stringify(value, null, 2)
                : String(value ?? "-")}
            </strong>
          </div>
        ))}
      </div>

      {analysis && (
        <div className="recommendation-analysis">
          <div>
            <span>ANALYSIS</span>

            <h3>System Analysis</h3>
          </div>

          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}
    </section>
  );
};

export default RecommendationDetail;
