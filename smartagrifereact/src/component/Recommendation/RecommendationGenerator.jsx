import React from "react";

import "./css/RecommendationGenerator.css";

const RecommendationGenerator = ({
  cropHealthId,
  setCropHealthId,
  onGenerate,
  onLoadLatest,
  loading,
}) => {
  return (
    <section className="recommendation-generator">
      <div className="generator-header">
        <div>
          <span>RECOMMENDATION ENGINE</span>

          <h2>Generate Smart Recommendation</h2>

          <p>
            Gunakan hasil Crop Health sebagai input untuk menghasilkan
            rekomendasi tindakan.
          </p>
        </div>

        <div className="generator-icon">✨</div>
      </div>

      <div className="generator-form">
        <div className="generator-input-group">
          <label>Crop Health ID</label>

          <input
            type="number"
            value={cropHealthId}
            onChange={(e) => setCropHealthId(e.target.value)}
            placeholder="Masukkan Crop Health ID"
          />

          <small>Contoh: 12</small>
        </div>

        <div className="generator-actions">
          <button
            type="button"
            className="recommendation-generate-button"
            onClick={onGenerate}
            disabled={loading}
          >
            {loading ? "⏳ Generating..." : "✨ Generate Recommendation"}
          </button>

          <button
            type="button"
            className="recommendation-secondary-button"
            onClick={onLoadLatest}
            disabled={loading}
          >
            ↻ Load Latest
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecommendationGenerator;
