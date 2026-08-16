import React from "react";

import "./css/CropHealthResult.css";

const formatValue = (value) => {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
};

const CropHealthResult = ({ result }) => {
  const analysis = result?.analysis;
  const data = result?.data;

  return (
    <section className="crop-health-result">
      <div className="crop-health-result-header">
        <div>
          <span>ANALYSIS RESULT</span>

          <h2>Crop Health Assessment</h2>
        </div>

        <div className="crop-health-result-status">
          <span />
          Completed
        </div>
      </div>

      {/* ANALYSIS */}

      <div className="crop-health-analysis-card">
        <div className="crop-health-card-title">
          <span>🌿</span>

          <div>
            <span>HEALTH ANALYSIS</span>
            <strong>Analysis Summary</strong>
          </div>
        </div>

        {analysis && typeof analysis === "object" ? (
          <div className="crop-health-analysis-grid">
            {Object.entries(analysis).map(([key, value]) => (
              <div className="crop-health-analysis-item" key={key}>
                <span>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (char) => char.toUpperCase())}
                </span>

                <strong>{formatValue(value)}</strong>
              </div>
            ))}
          </div>
        ) : (
          <div className="crop-health-analysis-text">
            {formatValue(analysis)}
          </div>
        )}
      </div>

      {/* SAVED DATA */}

      {data && (
        <div className="crop-health-data-card">
          <div className="crop-health-card-title">
            <span>💾</span>

            <div>
              <span>DATABASE RECORD</span>
              <strong>Crop Health Data</strong>
            </div>
          </div>

          <div className="crop-health-data-grid">
            {typeof data === "object" &&
              Object.entries(data)
                .filter(([key]) => !["createdAt", "updatedAt"].includes(key))
                .map(([key, value]) => (
                  <div className="crop-health-data-item" key={key}>
                    <span>
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (char) => char.toUpperCase())}
                    </span>

                    <strong>{formatValue(value)}</strong>
                  </div>
                ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default CropHealthResult;
