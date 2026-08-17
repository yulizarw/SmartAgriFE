import React from "react";

const GISAnalysis = ({
  selectedFarm,

  startDate,
  endDate,

  analysisDate,

  setStartDate,
  setEndDate,
  setAnalysisDate,

  ndvi,
  satellite,
  weather,

  loading,
  error,

  onGetNDVI,
  onAnalyzeSatellite,
  onAnalyzeWeather,
}) => {
  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return "-";
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  };

  return (
    <section className="gis-analysis-card">
      <div className="gis-card-header">
        <div>
          <span>GEE ANALYTICS</span>

          <h3>Environmental Analysis</h3>
        </div>
      </div>

      {!selectedFarm && (
        <div className="gis-analysis-empty">
          <span>🌱</span>

          <strong>Pilih farm terlebih dahulu</strong>

          <p>Data Google Earth Engine akan tersedia setelah farm dipilih.</p>
        </div>
      )}

      {selectedFarm && (
        <>
          {/* =====================================================
              NDVI
          ====================================================== */}

          <div className="gis-analysis-block">
            <div className="gis-analysis-title">
              <div>
                <span className="gis-analysis-icon">🌿</span>

                <div>
                  <strong>NDVI Analysis</strong>

                  <small>Vegetation health</small>
                </div>
              </div>
            </div>

            <div className="gis-date-grid">
              <div>
                <label>Start Date</label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label>End Date</label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              className="gis-analysis-button"
              onClick={onGetNDVI}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze NDVI"}
            </button>

            {ndvi && (
              <div className="gis-result">
                <div className="gis-result-header">NDVI RESULT</div>

                <pre>{renderValue(ndvi)}</pre>
              </div>
            )}
          </div>

          {/* =====================================================
              SATELLITE
          ====================================================== */}

          <div className="gis-analysis-block">
            <div className="gis-analysis-title">
              <div>
                <span className="gis-analysis-icon">🛰️</span>

                <div>
                  <strong>Satellite Analysis</strong>

                  <small>Satellite vegetation analysis</small>
                </div>
              </div>
            </div>

            <div>
              <label>Analysis Date</label>

              <input
                type="date"
                value={analysisDate}
                onChange={(e) => setAnalysisDate(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="gis-analysis-button"
              onClick={onAnalyzeSatellite}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Satellite"}
            </button>

            {satellite && (
              <div className="gis-result">
                <div className="gis-result-header">SATELLITE RESULT</div>

                <pre>{renderValue(satellite)}</pre>
              </div>
            )}
          </div>

          {/* =====================================================
              WEATHER
          ====================================================== */}

          <div className="gis-analysis-block">
            <div className="gis-analysis-title">
              <div>
                <span className="gis-analysis-icon">🌦️</span>

                <div>
                  <strong>Weather Analysis</strong>

                  <small>Weather data from GEE</small>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="gis-analysis-button secondary"
              onClick={onAnalyzeWeather}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Weather"}
            </button>

            {weather && (
              <div className="gis-result">
                <div className="gis-result-header">WEATHER RESULT</div>

                <pre>{renderValue(weather)}</pre>
              </div>
            )}
          </div>
        </>
      )}

      {error && <div className="gis-analysis-error">⚠ {error}</div>}
    </section>
  );
};

export default GISAnalysis;
