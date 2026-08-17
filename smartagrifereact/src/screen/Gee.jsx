import React, { useState } from "react";

import Sidebar from "../../src/component/Sidebar/SideBar";

import GeeHeader from "../../src/component/Gee/GeeHeader";
import GeeConnectionCard from "../../src/component/Gee/GeeConnectionCard";
import GeeAnalysisPanel from "../../src/component/Gee/GeeAnalysisPanel";
import GeeHistoryPanel from "../../src/component/Gee/GeeHistoryPanel";

import "./css/Gee.css";

export const Gee = ({
  testGeeConnection,
  getNDVI,
  analyzeSatellite,
  analyzeWeather,
  saveWeather,
  saveGeeHistory,
  logOutFunction,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [connectionStatus, setConnectionStatus] = useState(null);

  const [ndviData, setNdviData] = useState(null);
  const [satelliteData, setSatelliteData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  /*
  |--------------------------------------------------------------------------
  | TEST CONNECTION
  |--------------------------------------------------------------------------
  */

  const handleTestConnection = async () => {
    if (!testGeeConnection) {
      setConnectionStatus({
        success: true,
        message: "GEE connection handler belum dihubungkan.",
      });

      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await testGeeConnection();

      setConnectionStatus(result);
    } catch (err) {
      console.error(err);

      setConnectionStatus({
        success: false,
        message: err?.message || "Google Earth Engine gagal terhubung.",
      });

      setError(err?.message || "Gagal melakukan koneksi ke GEE.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | NDVI
  |--------------------------------------------------------------------------
  */

  const handleGetNDVI = async () => {
    if (!selectedFarmId) {
      setError("Silakan pilih farm terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (!getNDVI) {
        setNdviData({
          demo: true,
          message: "getNDVI belum dihubungkan ke backend.",
        });

        return;
      }

      const result = await getNDVI({
        farmId: selectedFarmId,
        startDate: selectedDate,
        endDate: selectedDate,
      });

      setNdviData(result);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Gagal mengambil NDVI.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SATELLITE
  |--------------------------------------------------------------------------
  */

  const handleAnalyzeSatellite = async () => {
    if (!selectedFarmId || !selectedDate) {
      setError("Farm dan tanggal wajib dipilih.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (!analyzeSatellite) {
        setSatelliteData({
          demo: true,
          message: "analyzeSatellite belum dihubungkan.",
        });

        return;
      }

      const result = await analyzeSatellite({
        farmId: selectedFarmId,
        date: selectedDate,
      });

      setSatelliteData(result);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Gagal menganalisis data satellite.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | WEATHER
  |--------------------------------------------------------------------------
  */

  const handleAnalyzeWeather = async () => {
    if (!selectedFarmId || !selectedDate) {
      setError("Farm dan tanggal wajib dipilih.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (!analyzeWeather) {
        setWeatherData({
          demo: true,
          message: "analyzeWeather belum dihubungkan.",
        });

        return;
      }

      const result = await analyzeWeather({
        farmId: selectedFarmId,
        date: selectedDate,
      });

      setWeatherData(result);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Gagal mengambil data weather.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE WEATHER
  |--------------------------------------------------------------------------
  */

  const handleSaveWeather = async () => {
    if (!selectedFarmId || !selectedDate) {
      setError("Farm dan tanggal wajib dipilih.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (!saveWeather) {
        setError("saveWeather belum dihubungkan.");
        return;
      }

      await saveWeather({
        farmId: selectedFarmId,
        date: selectedDate,
      });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Gagal menyimpan weather.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE GEE HISTORY
  |--------------------------------------------------------------------------
  */

  const handleSaveGeeHistory = async () => {
    if (!selectedFarmId || !selectedDate) {
      setError("Farm dan tanggal wajib dipilih.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (!saveGeeHistory) {
        setError("saveGeeHistory belum dihubungkan.");
        return;
      }

      await saveGeeHistory({
        farmId: selectedFarmId,
        date: selectedDate,
        cropId: null,
      });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Gagal menyimpan GEE history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logOutFunction={logOutFunction}
      />

      <main className="gee-page">
        <GeeHeader />

        {error && (
          <div className="gee-alert">
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

        <GeeConnectionCard
          connectionStatus={connectionStatus}
          loading={loading}
          onTestConnection={handleTestConnection}
        />

        <GeeAnalysisPanel
          farmId={selectedFarmId}
          date={selectedDate}
          setFarmId={setSelectedFarmId}
          setDate={setSelectedDate}
          loading={loading}
          onGetNDVI={handleGetNDVI}
          onAnalyzeSatellite={handleAnalyzeSatellite}
          onAnalyzeWeather={handleAnalyzeWeather}
          ndviData={ndviData}
          satelliteData={satelliteData}
          weatherData={weatherData}
          onSaveWeather={handleSaveWeather}
        />

        <GeeHistoryPanel loading={loading} onSave={handleSaveGeeHistory} />
      </main>
    </>
  );
};


