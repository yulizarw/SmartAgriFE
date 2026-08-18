import React from "react";

import "./css/GeeAnalysisPanel.css";

const GeeAnalysisPanel = ({
  farmId,
  farms,
  listCrop,
  date,
  setFarmId,
  setDate,
  loading,
  onGetNDVI,
  onAnalyzeSatellite,
  onAnalyzeWeather,
  onSaveWeather,
  ndviData,
  satelliteData,
  weatherData,
}) => {
  return (
    <section className="gee-analysis-panel">
      <div className="gee-panel-header">
        <div>
          <span className="gee-section-label">ANALYSIS WORKSPACE</span>

          <h2>Earth Observation Analysis</h2>
         
          <p>
            Jalankan analisis berdasarkan lokasi farm dan periode pengamatan.
          </p>
        </div>
      </div>

      <div className="gee-analysis-filter">
        {/* <div className="gee-input-group">
          <label>Farm ID</label>

          <input
            type="number"
            value={farmId}
            onChange={(e) => setFarmId(e.target.value)}
            placeholder="Contoh: 1"
          />
        </div> */}
        <div className="gee-input-group">
          <label>Farm</label>

          <select value={farmId} onChange={(e) => setFarmId(e.target.value)}>
            <option value="">-- Pilih Farm --</option>

            {listCrop.map((crop) => (
              <option key={crop.farmId} value={crop.farmId}>
                {crop.Farm.name} - {crop?.cropName}
              </option>
            ))}
          </select>
        </div>

        <div className="gee-input-group">
          <label>Analysis Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="gee-analysis-grid">
        {/* NDVI */}

        <div className="gee-analysis-card">
          <div className="gee-card-icon ndvi">🌿</div>

          <span>VEGETATION</span>

          <h3>NDVI Analysis</h3>

          <p>Analisis indeks vegetasi berdasarkan satellite imagery.</p>

          <button type="button" onClick={onGetNDVI} disabled={loading}>
            {loading ? "Processing..." : "Analyze NDVI"}
          </button>

          {ndviData && (
            <div className="gee-result-box">
              <strong>Result</strong>

              <pre>{JSON.stringify(ndviData, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* SATELLITE */}

        <div className="gee-analysis-card">
          <div className="gee-card-icon satellite">🛰️</div>

          <span>SATELLITE</span>

          <h3>Satellite Analysis</h3>

          <p>Analisis kondisi lahan menggunakan data satellite.</p>

          <button type="button" onClick={onAnalyzeSatellite} disabled={loading}>
            {loading ? "Processing..." : "Analyze Satellite"}
          </button>

          {satelliteData && (
            <div className="gee-result-box">
              <strong>Result</strong>

              <pre>{JSON.stringify(satelliteData, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* WEATHER */}

        <div className="gee-analysis-card">
          <div className="gee-card-icon weather">☁️</div>

          <span>CLIMATE</span>

          <h3>Weather Analysis</h3>

          <p>Analisis kondisi cuaca berdasarkan lokasi farm.</p>

          <div className="gee-card-actions">
            <button type="button" onClick={onAnalyzeWeather} disabled={loading}>
              Analyze
            </button>

            <button
              type="button"
              className="secondary"
              onClick={onSaveWeather}
              disabled={loading}
            >
              Save
            </button>
          </div>

          {weatherData && (
            <div className="gee-result-box">
              <strong>Result</strong>

              <pre>{JSON.stringify(weatherData, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GeeAnalysisPanel;
