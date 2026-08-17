import React from "react";

import "./css/GeeHistoryPanel.css";

const GeeHistoryPanel = ({ loading, onSave }) => {
  return (
    <section className="gee-history-panel">
      <div className="gee-history-icon">🗂️</div>

      <div className="gee-history-content">
        <span>DATA MANAGEMENT</span>

        <h3>GEE Analysis History</h3>

        <p>
          Simpan hasil analisis Earth Engine ke database untuk digunakan pada
          monitoring dan analisis berikutnya.
        </p>
      </div>

      <button type="button" onClick={onSave} disabled={loading}>
        {loading ? "Saving..." : "Save GEE History"}
      </button>
    </section>
  );
};

export default GeeHistoryPanel;
