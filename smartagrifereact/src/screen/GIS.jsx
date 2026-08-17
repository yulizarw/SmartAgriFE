import React, { useEffect, useState } from "react";

import Sidebar from "../component/Sidebar/SideBar";

import GISHeader from "../component/GIS/GISHeader";
import GISFarmSelector from "../component/GIS/GISFarmSelector";
import GISMap from "../component/GIS/GISMap";
import GISFarmInfo from "../component/GIS/GISFarmInfo";
import GISAnalysis from "../component/GIS/GISAnalysis";

import "./css/GIS.css";

export const GIS = ({
  logOutFunction,

  getFarms,

  getNDVI,
  analyzeSatellite,
  analyzeWeather,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [farms, setFarms] = useState([]);

  const [selectedFarm, setSelectedFarm] = useState(null);

  const [loadingFarms, setLoadingFarms] = useState(true);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | ANALYSIS STATE
  |--------------------------------------------------------------------------
  */

  const [ndvi, setNdvi] = useState(null);

  const [satellite, setSatellite] = useState(null);

  const [weather, setWeather] = useState(null);

  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [analysisError, setAnalysisError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | DATE
  |--------------------------------------------------------------------------
  */

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [analysisDate, setAnalysisDate] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD FARM
  |--------------------------------------------------------------------------
  */

  const loadFarms = async () => {
    try {
      setLoadingFarms(true);

      setError("");

      if (!getFarms) {
        setFarms([]);

        return;
      }

      const result = await getFarms();

      const data = result?.data || result?.farms || result || [];

      const farmData = Array.isArray(data) ? data : [];

      setFarms(farmData);

      /*
      |----------------------------------------------------------
      | AUTO SELECT FARM PERTAMA
      |----------------------------------------------------------
      */

      if (farmData.length > 0) {
        setSelectedFarm(farmData[0]);
      }
    } catch (err) {
      console.error("Load GIS farms error:", err);

      setError(err?.message || "Gagal mengambil data farm.");
    } finally {
      setLoadingFarms(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SELECT FARM
  |--------------------------------------------------------------------------
  */

  const handleFarmChange = (farmId) => {
    const farm = farms.find((item) => Number(item.id) === Number(farmId));

    setSelectedFarm(farm || null);

    /*
    | Reset analysis ketika pindah farm
    */

    setNdvi(null);

    setSatellite(null);

    setWeather(null);

    setAnalysisError("");
  };

  /*
  |--------------------------------------------------------------------------
  | NDVI
  |--------------------------------------------------------------------------
  */

  const handleGetNDVI = async () => {
    if (!selectedFarm) {
      setAnalysisError("Silakan pilih farm terlebih dahulu.");

      return;
    }

    try {
      setAnalysisLoading(true);

      setAnalysisError("");

      if (!getNDVI) {
        throw new Error("getNDVI belum dihubungkan.");
      }

      const result = await getNDVI({
        farmId: selectedFarm.id,

        startDate: startDate || undefined,

        endDate: endDate || undefined,
      });

      setNdvi(result?.data || result || null);
    } catch (err) {
      console.error(err);

      setAnalysisError(err?.message || "Gagal mengambil data NDVI.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SATELLITE ANALYSIS
  |--------------------------------------------------------------------------
  */

  const handleAnalyzeSatellite = async () => {
    if (!selectedFarm) {
      setAnalysisError("Silakan pilih farm terlebih dahulu.");

      return;
    }

    if (!analysisDate) {
      setAnalysisError("Tanggal analisis wajib dipilih.");

      return;
    }

    try {
      setAnalysisLoading(true);

      setAnalysisError("");

      if (!analyzeSatellite) {
        throw new Error("analyzeSatellite belum dihubungkan.");
      }

      const result = await analyzeSatellite({
        farmId: selectedFarm.id,

        date: analysisDate,
      });

      setSatellite(result?.data || result || null);
    } catch (err) {
      console.error(err);

      setAnalysisError(err?.message || "Gagal menganalisis satellite.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | WEATHER ANALYSIS
  |--------------------------------------------------------------------------
  */

  const handleAnalyzeWeather = async () => {
    if (!selectedFarm) {
      setAnalysisError("Silakan pilih farm terlebih dahulu.");

      return;
    }

    if (!analysisDate) {
      setAnalysisError("Tanggal analisis wajib dipilih.");

      return;
    }

    try {
      setAnalysisLoading(true);

      setAnalysisError("");

      if (!analyzeWeather) {
        throw new Error("analyzeWeather belum dihubungkan.");
      }

      const result = await analyzeWeather({
        farmId: selectedFarm.id,

        date: analysisDate,
      });

      setWeather(result?.data || result || null);
    } catch (err) {
      console.error(err);

      setAnalysisError(err?.message || "Gagal menganalisis weather.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logOutFunction={logOutFunction}
      />

      <main className="gis-page">
        <GISHeader />

        {error && (
          <div className="gis-alert">
            <span>⚠</span>

            <div>
              <strong>Terjadi kesalahan</strong>

              <p>{error}</p>
            </div>

            <button type="button" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        <GISFarmSelector
          farms={farms}
          selectedFarm={selectedFarm}
          loading={loadingFarms}
          onChange={handleFarmChange}
        />

        <div className="gis-main-grid">
          <div className="gis-map-column">
            <GISMap farm={selectedFarm} />

            <GISFarmInfo farm={selectedFarm} />
          </div>

          <div className="gis-analysis-column">
            <GISAnalysis
              selectedFarm={selectedFarm}

              startDate={startDate}
              endDate={endDate}

              analysisDate={analysisDate}

              setStartDate={setStartDate}
              setEndDate={setEndDate}
              setAnalysisDate={setAnalysisDate}

              ndvi={ndvi}
              satellite={satellite}
              weather={weather}

              loading={analysisLoading}

              error={analysisError}

              onGetNDVI={handleGetNDVI}

              onAnalyzeSatellite={handleAnalyzeSatellite}

              onAnalyzeWeather={handleAnalyzeWeather}
            />
          </div>
        </div>
      </main>
    </>
  );
};
