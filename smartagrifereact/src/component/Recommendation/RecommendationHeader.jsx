import React from "react";

import "./css/RecommendationHeader.css";

const RecommendationHeader = () => {
  return (
    <header className="recommendation-header">
      <div>
        <div className="recommendation-eyebrow">SMART DECISION SYSTEM</div>

        <h1>Recommendations</h1>

        <p>
          Gabungkan hasil analisis crop health, sensor, dan Google Earth Engine
          untuk menghasilkan rekomendasi tindakan pertanian.
        </p>
      </div>

      <div className="recommendation-header-status">
        <span className="recommendation-status-dot" />

        <span>SMART SYSTEM</span>
      </div>
    </header>
  );
};

export default RecommendationHeader;
