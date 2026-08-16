import React from "react";

import "./css/CropHealthForm.css";

const CropHealthForm = ({
  form,
  farms,
  crops,
  loadingFarms,
  loadingCrops,
  analyzing,
  onChange,
  onSubmit,
  onReset,
}) => {
  return (
    <form className="crop-health-form" onSubmit={onSubmit}>
      <div className="crop-health-form-header">
        <div className="crop-health-form-icon">🔬</div>

        <div>
          <span>ANALYSIS CONFIGURATION</span>

          <h2>Crop Health Analysis</h2>
        </div>
      </div>

      {/* FARM */}

      <div className="crop-health-field">
        <label htmlFor="farmId">Farm</label>

        <select
          id="farmId"
          name="farmId"
          value={form.farmId}
          onChange={onChange}
          disabled={loadingFarms || analyzing}
        >
          <option value="">
            {loadingFarms ? "Loading farms..." : "Select farm"}
          </option>

          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>

        <small>Pilih lokasi farm yang akan dianalisis.</small>
      </div>

      {/* CROP */}

      <div className="crop-health-field">
        <label htmlFor="cropId">Crop</label>

        <select
          id="cropId"
          name="cropId"
          value={form.cropId}
          onChange={onChange}
          disabled={!form.farmId || loadingCrops || analyzing}
        >
          <option value="">
            {!form.farmId
              ? "Select farm first"
              : loadingCrops
                ? "Loading crops..."
                : "Select crop"}
          </option>

          {crops.map((crop) => (
            <option key={crop.id} value={crop.id}>
              {crop.name || crop.cropName || `Crop #${crop.id}`}
            </option>
          ))}
        </select>

        <small>Crop harus berada pada farm yang dipilih.</small>
      </div>

      {/* DATE */}

      <div className="crop-health-field">
        <label htmlFor="date">Analysis Date</label>

        <input
          id="date"
          name="date"
          type="date"
          value={form.date}
          onChange={onChange}
          disabled={analyzing}
        />

        <small>Tentukan tanggal data yang akan dianalisis.</small>
      </div>

      {/* INFO */}

      <div className="crop-health-analysis-info">
        <span>💡</span>

        <div>
          <strong>Analysis Process</strong>

          <p>
            Sistem akan mengambil data yang diperlukan berdasarkan farm, crop,
            dan tanggal yang dipilih.
          </p>
        </div>
      </div>

      {/* ACTION */}

      <div className="crop-health-form-actions">
        <button
          type="button"
          className="crop-health-reset-button"
          onClick={onReset}
          disabled={analyzing}
        >
          Reset
        </button>

        <button
          type="submit"
          className="crop-health-analyze-button"
          disabled={analyzing}
        >
          {analyzing ? (
            <>
              <span className="crop-health-spinner" />
              Analyzing...
            </>
          ) : (
            <>🌿 Analyze Crop</>
          )}
        </button>
      </div>
    </form>
  );
};

export default CropHealthForm;
