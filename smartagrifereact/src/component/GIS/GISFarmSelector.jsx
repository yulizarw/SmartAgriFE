import React from "react";

const GISFarmSelector = ({ farms, selectedFarm, loading, onChange }) => {
  return (
    <section className="gis-farm-selector">
      <div>
        <span className="gis-section-label">ACTIVE FARM</span>

        <h2>Farm Analysis</h2>

        <p>Pilih farm yang ingin dianalisis menggunakan data geospasial.</p>
      </div>

      <div className="gis-farm-select-wrapper">
        <label htmlFor="gis-farm">Select Farm</label>

        <select
          id="gis-farm"
          value={selectedFarm?.id || ""}
          disabled={loading || farms.length === 0}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">
            {loading
              ? "Loading farm..."
              : farms.length === 0
                ? "Belum ada farm"
                : "Pilih Farm"}
          </option>

          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default GISFarmSelector;
