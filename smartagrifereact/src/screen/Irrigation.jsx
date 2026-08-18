import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../component/Sidebar/SideBar";
import IrrigationHeader from "../component/Irrigation/IrrigationHeader";
import IrrigationStatus from "../component/Irrigation/IrrigationStatus";
import IrrigationControl from "../component/Irrigation/IrrigationControl";
import IrrigationDecision from "../component/Irrigation/IrrigationDecision";
import IrrigationHistory from "../component/Irrigation/IrrigationHistory";

/*
 * SESUAIKAN PATH INI dengan lokasi irrigationAction.js di project kamu.
 * Contoh lain:
 * ../redux/actions/irrigationAction
 * ../store/actions/irrigationAction
 */
import {
  getIrrigationStatus,
  getIrrigationHistory,
  overrideIrrigation,
  resumeAutoIrrigation,
} from "../store/action/irrigationAction";

import "./css/Irrigation.css";

export const Irrigation = ({
  logOutFunction,
  refreshInterval = 60000,
  historyLimit = 20,
}) => {
  const dispatch = useDispatch();

  // ============================================================
  // REDUX - LIST CROP
  // ============================================================
  // Mendukung beberapa kemungkinan nama slice Redux agar lebih aman.
  // Jika kamu sudah tahu pasti slice-nya, boleh sederhanakan selector ini.
  const listCrop = useSelector((state) => {
    if (Array.isArray(state?.crop?.listCrop)) return state.crop.listCrop;
    if (Array.isArray(state?.crops?.listCrop)) return state.crops.listCrop;
    if (Array.isArray(state?.cropReducer?.listCrop)) {
      return state.cropReducer.listCrop;
    }

    const slice = Object.values(state || {}).find(
      (item) => item && Array.isArray(item.listCrop),
    );

    return slice?.listCrop || [];
  });

  // ============================================================
  // REDUX - IRRIGATION (OPSIONAL UNTUK DEBUG / GLOBAL STATE)
  // ============================================================
  const irrigationRedux = useSelector((state) => state?.irrigation || null);

  // ============================================================
  // SIDEBAR
  // ============================================================
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ============================================================
  // SELECTED CROP
  // ============================================================
  const [selectedCropId, setSelectedCropId] = useState("");

  useEffect(() => {
    if (!Array.isArray(listCrop) || listCrop.length === 0) {
      setSelectedCropId("");
      return;
    }

    const selectedStillExists = listCrop.some(
      (item) => String(item.id) === String(selectedCropId),
    );

    if (!selectedStillExists) {
      setSelectedCropId(String(listCrop[0].id));
    }
  }, [listCrop, selectedCropId]);

  const selectedCrop = useMemo(() => {
    if (!Array.isArray(listCrop) || listCrop.length === 0) {
      return null;
    }

    return (
      listCrop.find((item) => String(item.id) === String(selectedCropId)) ||
      null
    );
  }, [listCrop, selectedCropId]);

  const cropId = selectedCrop?.id || null;

  const farmId =
    selectedCrop?.farmId ||
    selectedCrop?.Farm?.id ||
    selectedCrop?.farm?.id ||
    null;

  const selectedFarm = selectedCrop?.Farm || selectedCrop?.farm || null;

  useEffect(() => {
    // ============================================================
    // RESET STATE SAAT CROP BERUBAH
    // ============================================================

    setFarm(null);

    setCrop(null);

    setCropHealth(null);

    setRecommendation(null);

    setDecision(null);

    setRelay({
      command: "WATERING_OFF",
    });

    setControlMode("AUTO");

    setHistory([]);

    setHistoryPage(1);

    setHistoryPagination({
      page: 1,
      limit: historyLimit,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    });

    setLastUpdated(null);
  }, [farmId, cropId, historyLimit]);

  // ============================================================
  // MAIN DATA
  // ============================================================
  const [farm, setFarm] = useState(null);
  const [crop, setCrop] = useState(null);
  const [cropHealth, setCropHealth] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [decision, setDecision] = useState(null);
  const [relay, setRelay] = useState(null);

  // ============================================================
  // HISTORY
  // ============================================================
  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPagination, setHistoryPagination] = useState({
    page: 1,
    limit: historyLimit,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // ============================================================
  // UI STATE
  // ============================================================
  const [loading, setLoading] = useState(true);
  const [controlLoading, setControlLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [controlMode, setControlMode] = useState("AUTO");

  // ============================================================
  // HELPERS API RESPONSE
  // ============================================================
  const extractData = useCallback((result) => {
    if (!result) return null;

    if (result?.data?.data !== undefined) {
      return result.data.data;
    }

    if (result?.data !== undefined) {
      return result.data;
    }

    return result;
  }, []);

  const extractPagination = useCallback((result) => {
    if (!result) return null;

    if (result?.data?.pagination) {
      return result.data.pagination;
    }

    if (result?.pagination) {
      return result.pagination;
    }

    if (result?.data?.data?.pagination) {
      return result.data.data.pagination;
    }

    return null;
  }, []);

  // ============================================================
  // RESET DATA KETIKA CROP BERUBAH
  // ============================================================
  useEffect(() => {
    setFarm(selectedFarm || null);
    setCrop(selectedCrop || null);
    setCropHealth(null);
    setRecommendation(null);
    setDecision(null);
    setRelay(null);
    setControlMode("AUTO");
    setHistory([]);
    setHistoryPage(1);
    setHistoryPagination({
      page: 1,
      limit: historyLimit,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    });
    setError("");
  }, [selectedCropId, selectedCrop, selectedFarm, historyLimit]);

  // ============================================================
  // LOAD STATUS
  // ============================================================
  const loadIrrigationStatus = useCallback(
    async (showLoading = true) => {
      if (!farmId || !cropId) {
        if (showLoading) setLoading(false);
        return;
      }

      try {
        if (showLoading) setLoading(true);
        setError("");

        const result = await dispatch(
          getIrrigationStatus({
            farmId,
            cropId,
          }),
        );

        const statusData = extractData(result);

        if (!statusData) {
          throw new Error("Status irrigation tidak ditemukan.");
        }

        setFarm(statusData.farm || selectedFarm || null);
        setCrop(statusData.crop || selectedCrop || null);
        setCropHealth(statusData.cropHealth || null);
        setRecommendation(statusData.recommendation || null);
        setDecision(statusData.decision || null);
        setRelay(
          statusData.relay || {
            command: "WATERING_OFF",
          },
        );

        setControlMode(
          statusData.controlMode ||
            detectControlMode(statusData.relay, statusData.decision) ||
            "AUTO",
        );

        setLastUpdated(new Date());
      } catch (err) {
        console.error("Irrigation load error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Gagal mengambil status irrigation.",
        );
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [dispatch, farmId, cropId, extractData, selectedCrop, selectedFarm],
  );

  // ============================================================
  // LOAD HISTORY
  // ============================================================
  const loadIrrigationHistory = useCallback(
    async (page = 1) => {
      if (!farmId || !cropId) return;

      try {
        setHistoryLoading(true);

        const result = await dispatch(
          getIrrigationHistory({
            farmId,
            cropId,
            page,
            limit: historyLimit,
          }),
        );

        const historyData = extractData(result);
        const pagination = extractPagination(result);

        setHistory(Array.isArray(historyData) ? historyData : []);

        if (pagination) {
          setHistoryPagination({
            page: Number(pagination.page) || page,
            limit: Number(pagination.limit) || historyLimit,
            totalItems: Number(pagination.totalItems) || 0,
            totalPages: Number(pagination.totalPages) || 0,
            hasNextPage: Boolean(pagination.hasNextPage),
            hasPrevPage: Boolean(pagination.hasPrevPage),
          });
        } else {
          const itemCount = Array.isArray(historyData) ? historyData.length : 0;

          setHistoryPagination({
            page,
            limit: historyLimit,
            totalItems: itemCount,
            totalPages: itemCount > 0 ? 1 : 0,
            hasNextPage: false,
            hasPrevPage: false,
          });
        }
      } catch (err) {
        console.error("Irrigation history error:", err);
        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    },
    [dispatch, farmId, cropId, historyLimit, extractData, extractPagination],
  );

  // ============================================================
  // INITIAL / CROP CHANGE LOAD
  // ============================================================
  useEffect(() => {
    if (!farmId || !cropId) {
      setLoading(false);
      return;
    }

    loadIrrigationStatus(true);
  }, [farmId, cropId, loadIrrigationStatus]);

  useEffect(() => {
    if (!farmId || !cropId) return;

    loadIrrigationHistory(historyPage);
  }, [farmId, cropId, historyPage, loadIrrigationHistory]);

  // ============================================================
  // AUTO REFRESH STATUS
  // ============================================================
  useEffect(() => {
    if (!farmId || !cropId || !refreshInterval || refreshInterval <= 0) {
      return undefined;
    }

    const interval = setInterval(() => {
      loadIrrigationStatus(false);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [farmId, cropId, loadIrrigationStatus, refreshInterval]);

  // ============================================================
  // PUMP STATUS
  // ============================================================
  const pumpStatus = useMemo(() => {
    const command =
      relay?.command ||
      relay?.relayCommand ||
      decision?.decision ||
      decision?.relayCommand ||
      decision?.command ||
      "";

    const normalized = String(command).trim().toUpperCase();

    if (
      normalized === "ON" ||
      normalized === "WATERING_ON" ||
      normalized === "PUMP_ON" ||
      normalized === "RELAY_ON"
    ) {
      return "ON";
    }

    return "OFF";
  }, [relay, decision]);

  // ============================================================
  // HEALTH STATUS
  // ============================================================
  const healthStatus = useMemo(() => {
    if (!cropHealth) return "NO DATA";

    const value = cropHealth.overallScore;

    if (value === null || value === undefined || value === "") {
      return cropHealth.status || "UNKNOWN";
    }

    const overall = Number(value);

    if (Number.isNaN(overall)) return "UNKNOWN";
    if (overall < 40) return "POOR";
    if (overall < 60) return "WARNING";
    if (overall < 80) return "GOOD";

    return "EXCELLENT";
  }, [cropHealth]);

  const recommendationStatus = useMemo(() => {
    if (!recommendation) return "NO DATA";

    return recommendation.priority || recommendation.status || "ACTIVE";
  }, [recommendation]);

  // ============================================================
  // EMERGENCY OFF
  // ============================================================
  //   const handleEmergencyOff = async () => {
  //     const confirmed = window.confirm(
  //       "Matikan pompa secara manual?\n\n" +
  //         "Pompa akan dihentikan dan sistem akan masuk mode OVERRIDE.",
  //     );

  //     if (!confirmed) return;

  //     if (!recommendation?.id) {
  //       setError(
  //         "Recommendation belum tersedia sehingga override tidak dapat dilakukan.",
  //       );
  //       return;
  //     }

  //     try {
  //       setControlLoading(true);
  //       setError("");

  //       setControlMode("OVERRIDE");
  //       setRelay((previous) => ({
  //         ...(previous || {}),
  //         command: "WATERING_OFF",
  //         source: "MANUAL_OVERRIDE",
  //         controlMode: "OVERRIDE",
  //       }));

  //       await dispatch(
  //         overrideIrrigation({
  //           recommendationId: recommendation.id,
  //           command: "WATERING_OFF",
  //         }),
  //       );

  //       await Promise.all([
  //         loadIrrigationStatus(false),
  //         loadIrrigationHistory(historyPage),
  //       ]);
  //     } catch (err) {
  //       console.error("Override irrigation error:", err);

  //       setError(
  //         err?.response?.data?.message ||
  //           err?.message ||
  //           "Gagal melakukan override pompa.",
  //       );

  //       await loadIrrigationStatus(false).catch(() => {});
  //     } finally {
  //       setControlLoading(false);
  //     }
  //   };

  // ============================================================
  // RESUME AUTO
  // ============================================================
  const handleResumeAuto = async () => {
    if (!recommendation?.id) {
      setError(
        "Recommendation belum tersedia sehingga mode AUTO belum dapat dilanjutkan.",
      );
      return;
    }

    try {
      setControlLoading(true);
      setError("");

      await dispatch(
        resumeAutoIrrigation({
          recommendationId: recommendation.id,
        }),
      );

      await Promise.all([
        loadIrrigationStatus(false),
        loadIrrigationHistory(historyPage),
      ]);
    } catch (err) {
      console.error("Resume auto irrigation error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal mengembalikan kontrol otomatis.",
      );
    } finally {
      setControlLoading(false);
    }
  };

  // ============================================================
  // MANUAL OVERRIDE
  // ============================================================

  const handleManualOverride = async (command) => {
    // ==========================================================
    // VALIDASI COMMAND
    // ==========================================================

    if (command !== "WATERING_ON" && command !== "WATERING_OFF") {
      setError("Command irrigation tidak valid.");

      return;
    }

    // ==========================================================
    // RECOMMENDATION HARUS ADA
    // ==========================================================

    if (!recommendation?.id) {
      setError(
        "Recommendation belum tersedia sehingga manual override tidak dapat dilakukan.",
      );

      return;
    }

    // ==========================================================
    // CONFIRMATION
    // ==========================================================

    const isTurningOn = command === "WATERING_ON";

    const confirmed = window.confirm(
      isTurningOn
        ? "Nyalakan pompa secara manual?\n\nSistem akan masuk ke mode OVERRIDE."
        : "Matikan pompa secara manual?\n\nSistem akan masuk ke mode OVERRIDE.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setControlLoading(true);

      setError("");

      // ========================================================
      // OPTIMISTIC UI
      // ========================================================

      setControlMode("OVERRIDE");

      setRelay((previous) => ({
        ...(previous || {}),

        command,

        source: "MANUAL_OVERRIDE",

        controlMode: "OVERRIDE",
      }));

      // ========================================================
      // REDUX ACTION
      // ========================================================

      await dispatch(
        overrideIrrigation({
          recommendationId: recommendation.id,

          command,
        }),
      );

      // ========================================================
      // REFRESH STATUS + HISTORY
      // ========================================================

      await Promise.all([
        loadIrrigationStatus(false),

        loadIrrigationHistory(historyPage),
      ]);
    } catch (err) {
      console.error("Manual irrigation override error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal melakukan manual override.",
      );

      // Ambil kembali state sebenarnya
      await loadIrrigationStatus(false).catch(() => {});
    } finally {
      setControlLoading(false);
    }
  };

  // ============================================================
  // MANUAL REFRESH
  // ============================================================
  const handleRefresh = async () => {
    if (!farmId || !cropId) return;

    await Promise.all([
      loadIrrigationStatus(true),
      loadIrrigationHistory(historyPage),
    ]);
  };

  // ============================================================
  // HISTORY PAGINATION
  // ============================================================
  const handleHistoryPrevious = () => {
    if (historyLoading || !historyPagination.hasPrevPage) return;

    setHistoryPage((previous) => Math.max(previous - 1, 1));
  };

  const handleHistoryNext = () => {
    if (historyLoading || !historyPagination.hasNextPage) return;

    setHistoryPage((previous) => previous + 1);
  };

  const handleHistoryPageChange = (page) => {
    const targetPage = Number(page);

    if (
      !targetPage ||
      targetPage < 1 ||
      targetPage > historyPagination.totalPages ||
      targetPage === historyPage
    ) {
      return;
    }

    setHistoryPage(targetPage);
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logOutFunction={logOutFunction}
      />

      <main className="irrigation-page">
        <IrrigationHeader pumpStatus={pumpStatus} loading={loading} />

        {/* ==================================================== */}
        {/* CROP SELECTOR                                        */}
        {/* ==================================================== */}
        <section className="irrigation-section">
          <div className="irrigation-section-header">
            <div>
              <h2>Pilih Tanaman</h2>
              <p>Pilih crop yang akan dimonitor dan dikontrol.</p>
            </div>

            <select
              className="irrigation-crop-select"
              value={selectedCropId}
              onChange={(event) => {
                setSelectedCropId(event.target.value);
              }}
              disabled={listCrop.length === 0}
            >
              {listCrop.length === 0 ? (
                <option value="">Belum ada crop</option>
              ) : (
                listCrop.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.cropName || `Crop ${item.id}`} -{" "}
                    {item.Farm?.name ||
                      item.farm?.name ||
                      `Farm ${item.farmId || "-"}`}
                  </option>
                ))
              )}
            </select>
          </div>
        </section>

        {/* ==================================================== */}
        {/* FARM / CROP / CONTROL                                */}
        {/* ==================================================== */}
        <section className="irrigation-control-bar">
          <div className="irrigation-control-info">
            <span className="irrigation-label">FARM</span>
            <strong>
              {farm?.name ||
                farm?.farmName ||
                selectedFarm?.name ||
                `Farm ${farmId || "-"}`}
            </strong>
          </div>

          <div className="irrigation-control-info">
            <span className="irrigation-label">CROP</span>
            <strong>
              {crop?.cropName ||
                crop?.name ||
                selectedCrop?.cropName ||
                `Crop ${cropId || "-"}`}
            </strong>
          </div>

          <div className="irrigation-control-info">
            <span className="irrigation-label">CONTROL MODE</span>
            <strong
              className={`irrigation-mode irrigation-mode-${controlMode.toLowerCase()}`}
            >
              {controlMode === "AUTO" ? "🤖 AUTO" : "🛑 OVERRIDE"}
            </strong>
          </div>

          <div className="irrigation-control-info">
            <span className="irrigation-label">PUMP</span>
            <strong
              className={`irrigation-pump irrigation-pump-${pumpStatus.toLowerCase()}`}
            >
              {pumpStatus === "ON" ? "🟢 ON" : "⚫ OFF"}
            </strong>
          </div>

          <button
            type="button"
            className="irrigation-refresh-button"
            onClick={handleRefresh}
            disabled={loading || historyLoading || !farmId || !cropId}
          >
            {loading || historyLoading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </section>

        {/* ==================================================== */}
        {/* SECONDARY STATUS                                    */}
        {/* ==================================================== */}
        <section className="irrigation-control-bar">
          <div className="irrigation-control-info">
            <span className="irrigation-label">HEALTH</span>
            <strong>{healthStatus}</strong>
          </div>

          <div className="irrigation-control-info">
            <span className="irrigation-label">RECOMMENDATION</span>
            <strong>{recommendationStatus}</strong>
          </div>

          <div className="irrigation-control-info">
            <span className="irrigation-label">DECISION</span>
            <strong>{decision?.decision || "-"}</strong>
          </div>

          <div className="irrigation-control-info">
            <span className="irrigation-label">SOURCE</span>
            <strong>{decision?.source || "-"}</strong>
          </div>
        </section>

        {/* ==================================================== */}
        {/* ERROR                                               */}
        {/* ==================================================== */}
        {error && (
          <div className="irrigation-alert">
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

        {/* ==================================================== */}
        {/* NO CROP                                             */}
        {/* ==================================================== */}
        {listCrop.length === 0 && (
          <div className="irrigation-empty-card">
            Belum ada data crop pada Redux. Pastikan action listCrop sudah
            dijalankan sebelum membuka halaman Irrigation.
          </div>
        )}

        {/* ==================================================== */}
        {/* CROP HEALTH                                         */}
        {/* ==================================================== */}
        <section className="irrigation-section">
          <div className="irrigation-section-header">
            <div>
              <h2>Crop Health</h2>
              <p>
                Kondisi tanaman berdasarkan analisis vegetasi, iklim, tanah, dan
                sensor IoT.
              </p>
            </div>
          </div>

          {loading && !cropHealth ? (
            <div className="irrigation-loading-card">
              Membaca kondisi tanaman...
            </div>
          ) : cropHealth ? (
            <div className="crop-health-grid">
              <CropScore
                title="Vegetation"
                value={cropHealth.vegetationScore}
              />
              <CropScore title="Climate" value={cropHealth.climateScore} />
              <CropScore title="Soil" value={cropHealth.soilScore} />
              <CropScore title="IoT" value={cropHealth.iotScore} />

              <div className="crop-health-card crop-health-overall">
                <span>Overall</span>
                <strong>{formatScore(cropHealth.overallScore)}</strong>
                <small>{healthStatus}</small>
              </div>
            </div>
          ) : (
            <div className="irrigation-empty-card">
              Belum ada data Crop Health.
            </div>
          )}
        </section>

        {/* ==================================================== */}
        {/* IRRIGATION STATUS                                   */}
        {/* ==================================================== */}
        <IrrigationStatus
          loading={loading}
          pumpStatus={pumpStatus}
          recommendation={recommendation}
          decision={decision}
          relay={relay}
          cropHealth={cropHealth}
          controlMode={controlMode}
        />

        {/* ==================================================== */}
        {/* RECOMMENDATION                                      */}
        {/* ==================================================== */}
        <section className="irrigation-recommendation-card">
          <div className="irrigation-section-header">
            <div>
              <h2>🤖 AI Recommendation</h2>
              <p>
                Recommendation yang dihasilkan berdasarkan CropHealth terbaru.
              </p>
            </div>

            <div
              className={`recommendation-priority priority-${String(
                recommendation?.priority || "LOW",
              ).toLowerCase()}`}
            >
              {recommendation?.priority || "LOW"}
            </div>
          </div>

          {recommendation ? (
            <div className="recommendation-content">
              <div className="recommendation-message">
                <strong>
                  {recommendation.recommendation ||
                    recommendation.message ||
                    "Tidak ada tindakan"}
                </strong>
              </div>

              <div className="recommendation-actions">
                <div>
                  <span>💧 Watering</span>
                  <strong>
                    {toBoolean(recommendation.watering) ? "YES" : "NO"}
                  </strong>
                </div>

                <div>
                  <span>🌱 Fertilize</span>
                  <strong>
                    {toBoolean(recommendation.fertilize) ? "YES" : "NO"}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>{recommendation.status || "ACTIVE"}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="irrigation-empty-card">
              Belum ada recommendation.
            </div>
          )}
        </section>

        {/* ==================================================== */}
        {/* CONTROL + DECISION                                  */}
        {/* ==================================================== */}
        <div className="irrigation-main-grid">
          <IrrigationControl
            pumpStatus={pumpStatus}
            loading={controlLoading}
            controlMode={controlMode}
            onManualOverride={handleManualOverride}
            onResumeAuto={handleResumeAuto}
          />

          <IrrigationDecision
            recommendation={recommendation}
            decision={decision}
            relay={relay}
            cropHealth={cropHealth}
            controlMode={controlMode}
          />
        </div>

        {/* ==================================================== */}
        {/* AUTOMATION FLOW                                     */}
        {/* ==================================================== */}
        <section className="irrigation-flow-card">
          <div className="irrigation-section-header">
            <div>
              <h2>Automation Flow</h2>
              <p>Alur pengambilan keputusan sistem SmartAgri.</p>
            </div>
          </div>

          <div className="irrigation-flow">
            <div className="flow-step">
              <span className="flow-icon">📡</span>
              <strong>Sensor</strong>
              <small>{decision?.sensorValue ?? "IoT Reading"}</small>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-step">
              <span className="flow-icon">🌱</span>
              <strong>Crop Health</strong>
              <small>ID {cropHealth?.id || "-"}</small>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-step">
              <span className="flow-icon">🤖</span>
              <strong>Recommendation</strong>
              <small>{recommendation?.priority || "-"}</small>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-step">
              <span className="flow-icon">🧠</span>
              <strong>Decision</strong>
              <small>{decision?.decision || "-"}</small>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-step">
              <span className="flow-icon">💧</span>
              <strong>Relay</strong>
              <small>{relay?.command || "WATERING_OFF"}</small>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-step">
              <span className="flow-icon">🚰</span>
              <strong>Pump</strong>
              <small>{pumpStatus}</small>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HISTORY                                             */}
        {/* ==================================================== */}
        <IrrigationHistory
          history={history}
          loading={historyLoading}
          pagination={historyPagination}
          currentPage={historyPage}
          onPrevious={handleHistoryPrevious}
          onNext={handleHistoryNext}
          onPageChange={handleHistoryPageChange}
          recommendation={recommendation}
          decision={decision}
          cropHealth={cropHealth}
          relay={relay}
        />

        {/* ==================================================== */}
        {/* DEBUG REDUX - hapus jika sudah tidak dibutuhkan      */}
        {/* ==================================================== */}
        {process.env.NODE_ENV !== "production" && (
          <div style={{ display: "none" }}>
            {JSON.stringify(irrigationRedux)}
          </div>
        )}

        {/* ==================================================== */}
        {/* LAST UPDATED                                        */}
        {/* ==================================================== */}
        <div className="irrigation-last-update">
          Last update:{" "}
          {lastUpdated ? lastUpdated.toLocaleTimeString("id-ID") : "-"}
          {" • "}
          Status refresh setiap {refreshInterval / 1000} detik
        </div>
      </main>
    </>
  );
};

// ============================================================
// COMPONENT SCORE
// ============================================================
const CropScore = ({ title, value }) => {
  return (
    <div className="crop-health-card">
      <span>{title}</span>
      <strong>{formatScore(value)}</strong>
    </div>
  );
};

// ============================================================
// HELPER - CONTROL MODE
// ============================================================
function detectControlMode(relay, decision) {
  const explicitMode =
    relay?.controlMode ||
    relay?.mode ||
    decision?.controlMode ||
    decision?.mode;

  if (explicitMode) {
    const normalized = String(explicitMode).trim().toUpperCase();

    if (normalized.includes("OVERRIDE") || normalized.includes("MANUAL")) {
      return "OVERRIDE";
    }

    if (normalized.includes("AUTO")) {
      return "AUTO";
    }
  }

  const source =
    relay?.source || relay?.decisionLog?.source || decision?.source;

  if (!source) return null;

  const normalized = String(source).trim().toUpperCase();

  if (
    normalized.includes("OVERRIDE") ||
    normalized.includes("MANUAL") ||
    normalized.includes("USER")
  ) {
    return "OVERRIDE";
  }

  if (normalized.includes("AUTO") || normalized.includes("AUTOMATIC")) {
    return "AUTO";
  }

  return null;
}

// ============================================================
// FORMAT SCORE
// ============================================================
function formatScore(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return number.toFixed(1);
}

// ============================================================
// BOOLEAN HELPER
// ============================================================
function toBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  if (typeof value === "string") {
    return ["true", "1", "yes", "on", "active"].includes(
      value.trim().toLowerCase(),
    );
  }

  return false;
}

export default Irrigation;
