import React, { useEffect, useState } from "react";

import Sidebar from "../component/Sidebar/SideBar";

import CropHealthHeader from "../component/CropHealth/CropHealthHeader";
import CropHealthForm from "../component/CropHealth/CropHealthForm";
import CropHealthResult from "../component/CropHealth/CropHealthResult";
import CropHealthSensor from "../component/CropHealth/CropHealthSensor";

import "./css/CropHealth.css";

export const CropHealth = ({
  getFarms,
  getCrops,
  analyzeCropHealth,
  logOutFunction,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);

  const [loadingFarms, setLoadingFarms] = useState(false);
  const [loadingCrops, setLoadingCrops] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");

  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    farmId: "",
    cropId: "",
    date: new Date().toISOString().split("T")[0],
  });

  /*
  |--------------------------------------------------------------------------
  | GET FARMS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadFarms = async () => {
      try {
        setLoadingFarms(true);
        setError("");

        if (!getFarms) {
          return;
        }

        const response = await getFarms();

        const data = response?.data || response?.farms || response || [];

        setFarms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);

        setError(error?.message || "Gagal mengambil data farm.");
      } finally {
        setLoadingFarms(false);
      }
    };

    loadFarms();
  }, [getFarms]);

  /*
  |--------------------------------------------------------------------------
  | GET CROPS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadCrops = async () => {
      if (!form.farmId || !getCrops) {
        setCrops([]);
        return;
      }

      try {
        setLoadingCrops(true);
        setError("");

        const response = await getCrops(form.farmId);

        const data = response?.data || response?.crops || response || [];

        setCrops(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);

        setError(error?.message || "Gagal mengambil data crop.");
      } finally {
        setLoadingCrops(false);
      }
    };

    loadCrops();
  }, [form.farmId, getCrops]);

  /*
  |--------------------------------------------------------------------------
  | INPUT
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "farmId") {
      setForm((prev) => ({
        ...prev,
        farmId: value,
        cropId: "",
      }));

      setResult(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | ANALYZE
  |--------------------------------------------------------------------------
  */

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!form.farmId) {
      setError("Silakan pilih farm terlebih dahulu.");
      return;
    }

    if (!form.cropId) {
      setError("Silakan pilih crop terlebih dahulu.");
      return;
    }

    if (!form.date) {
      setError("Silakan pilih tanggal analisis.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setResult(null);

      if (!analyzeCropHealth) {
        throw new Error("analyzeCropHealth belum dihubungkan.");
      }

      const response = await analyzeCropHealth({
        farmId: Number(form.farmId),
        cropId: Number(form.cropId),
        date: form.date,
      });

      setResult(
        response?.data
          ? response
          : response?.data?.data
            ? response.data
            : response,
      );
    } catch (error) {
      console.error(error);

      setError(error?.message || "Gagal melakukan analisis crop health.");
    } finally {
      setAnalyzing(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const handleReset = () => {
    setForm({
      farmId: "",
      cropId: "",
      date: new Date().toISOString().split("T")[0],
    });

    setCrops([]);
    setResult(null);
    setError("");
  };

  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logOutFunction={logOutFunction}
      />

      <main className="crop-health-page">
        <CropHealthHeader />

        {error && (
          <div className="crop-health-alert">
            <span>⚠</span>

            <div>
              <strong>Analysis Error</strong>
              <p>{error}</p>
            </div>

            <button type="button" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        <section className="crop-health-layout">
          <CropHealthForm
            form={form}
            farms={farms}
            crops={crops}
            loadingFarms={loadingFarms}
            loadingCrops={loadingCrops}
            analyzing={analyzing}
            onChange={handleChange}
            onSubmit={handleAnalyze}
            onReset={handleReset}
          />

          <div className="crop-health-result-column">
            {!result ? (
              <div className="crop-health-empty">
                <div className="crop-health-empty-icon">🌿</div>

                <h3>Ready for Analysis</h3>

                <p>
                  Pilih farm, crop, dan tanggal kemudian jalankan analisis untuk
                  melihat kondisi kesehatan tanaman.
                </p>
              </div>
            ) : (
              <>
                <CropHealthResult result={result} />

                <CropHealthSensor sensor={result.sensor} />
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

