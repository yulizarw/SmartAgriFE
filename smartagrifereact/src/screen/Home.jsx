import React, { useEffect, useState } from "react";
import "./css/Home.css";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logOut } from "../store/action/userAction";

// component
import Sidebar from "../component/Sidebar/SideBar";

// loading
import Lottie from "react-lottie";
import * as loaderData from "../asset/lottieLego.json";

// store
import { fetchFarms } from "../store/action/farmAction";

import {
  cropHealthAnalyzeHome,
  cropHealthHome,
} from "../store/action/cropAction";

export const Home = ({ logOutFunction }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =========================================================
  // REDUX
  // =========================================================

  const userLogin = useSelector((state) => state.userReducers.userLogin);

  const farms = useSelector((state) => state.farmReducers.farms);

  const cropHome = useSelector((state) => state.cropReducers.cropHome);

  const analyzeHome = useSelector((state) => state.cropReducers.analyzeHome);

  // =========================================================
  // STATE
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================================================
  // USER
  // =========================================================

  const fullName = userLogin?.loginUser?.fullName || "User";

  const role = userLogin?.Role?.name || userLogin?.role || "User";

  // =========================================================
  // FETCH FARM
  // =========================================================

  useEffect(() => {
    if (userLogin?.access_token) {
      dispatch(fetchFarms(userLogin.access_token));
    }
  }, [userLogin?.access_token, dispatch]);

  // =========================================================
  // SET DEFAULT FARM
  // =========================================================

  useEffect(() => {
    if (!farms || farms.length === 0) {
      setSelectedFarm(null);
      return;
    }

    // Belum ada farm yang dipilih
    if (!selectedFarm) {
      setSelectedFarm(farms[0]);
      return;
    }

    // Cek apakah farm yang dipilih masih ada
    const currentFarmStillExists = farms.some(
      (farm) => Number(farm.id) === Number(selectedFarm.id),
    );

    if (!currentFarmStillExists) {
      setSelectedFarm(farms[0]);
    }
  }, [farms, selectedFarm]);

  // =========================================================
  // LOAD CROP HEALTH BERDASARKAN FARM
  // =========================================================

  useEffect(() => {
    if (!selectedFarm?.id) {
      return;
    }

    console.log("Load Crop Health Farm:", selectedFarm.id);

    dispatch(cropHealthHome(selectedFarm.id));
  }, [selectedFarm?.id, dispatch]);

  // =========================================================
  // ANALYZE CROP HEALTH
  // =========================================================

  useEffect(() => {
    if (!selectedFarm?.id || !cropHome?.farmId || !cropHome?.cropId) {
      return;
    }

    // Jangan gunakan data crop dari farm sebelumnya
    if (Number(cropHome.farmId) !== Number(selectedFarm.id)) {
      return;
    }

    console.log("Analyze Crop Health:", {
      farmId: cropHome.farmId,
      cropId: cropHome.cropId,
    });

    dispatch(
      cropHealthAnalyzeHome({
        farmId: cropHome.farmId,
        cropId: cropHome.cropId,
      }),
    );
  }, [selectedFarm?.id, cropHome?.farmId, cropHome?.cropId, dispatch]);

  // =========================================================
  // LOADING
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // =========================================================
  // LOTTIE
  // =========================================================

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.clear();

    dispatch(logOut());

    if (logOutFunction) {
      logOutFunction();
    }

    navigate("/", {
      replace: true,
    });
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigation = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDateTime = (date) => {
    if (!date) {
      return "--";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // =========================================================
  // CROP HEALTH
  // =========================================================

  const hasCropHealth =
    cropHome?.overallScore !== null &&
    cropHome?.overallScore !== undefined &&
    !Number.isNaN(Number(cropHome?.overallScore));

  // =========================================================
  // HEALTH DESCRIPTION
  // =========================================================

  const getHealthDescription = (score, type) => {
    if (score === null || score === undefined || Number.isNaN(Number(score))) {
      return {
        title: `${type} belum dianalisis`,
        description: "Belum tersedia data analisis untuk tanaman ini.",
      };
    }

    const numericScore = Number(score);

    if (numericScore <= 25) {
      return {
        title: `${type} dalam kondisi buruk`,
        description: `Perlu perhatian dan penanganan segera pada kondisi ${type.toLowerCase()}.`,
      };
    }

    if (numericScore <= 50) {
      return {
        title: `${type} perlu perhatian`,
        description: `Kondisi ${type.toLowerCase()} masih kurang optimal dan perlu dilakukan pemantauan lebih lanjut.`,
      };
    }

    if (numericScore <= 75) {
      return {
        title: `${type} dalam kondisi cukup baik`,
        description: `Perlu perhatian pada kondisi ${type.toLowerCase()} agar tetap optimal.`,
      };
    }

    return {
      title: `${type} dalam kondisi sangat baik`,
      description: `Kondisi ${type.toLowerCase()} sangat baik dan berada dalam kondisi optimal.`,
    };
  };

  const overallHealth = getHealthDescription(cropHome?.overallScore, "Tanaman");

  // =========================================================
  // HEALTH STATUS
  // =========================================================

  const getHealthStatus = (score) => {
    if (score === null || score === undefined || Number.isNaN(Number(score))) {
      return {
        className: "offline",
        label: "NO DATA",
      };
    }

    const numericScore = Number(score);

    if (numericScore <= 25) {
      return {
        className: "bad",
        label: "BAD",
      };
    }

    if (numericScore <= 50) {
      return {
        className: "poor",
        label: "POOR",
      };
    }

    if (numericScore <= 75) {
      return {
        className: "moderate",
        label: "MODERATE",
      };
    }

    return {
      className: "excellent",
      label: "EXCELLENT",
    };
  };

  const healthStatus = getHealthStatus(cropHome?.overallScore);

  // =========================================================
  // SENSOR DATA
  // =========================================================

  const sensorData = analyzeHome?.sensor || analyzeHome?.sensorData || null;

  // =========================================================
  // SENSOR STATUS
  // =========================================================

  const sensorOnline = sensorData?.sensorStatus === "ONLINE";

  const sensorOffline = sensorData?.sensorStatus === "OFFLINE";

  const hasSensorData = sensorData !== null && sensorData !== undefined;

  // =========================================================
  // SENSOR HAS REAL READING
  // =========================================================

  const hasSensorReading =
    sensorOnline &&
    sensorData?.soilMoisture !== null &&
    sensorData?.soilMoisture !== undefined;

  // =========================================================
  // SENSOR STATUS LABEL
  // =========================================================

  const getSensorStatusLabel = () => {
    if (sensorOnline) {
      return "ESP32 Online";
    }

    if (sensorOffline) {
      return "ESP32 Offline";
    }

    return "Waiting for Sensor";
  };

  // =========================================================
  // RECOMMENDATION
  // =========================================================

  const getRecommendation = () => {
    // Belum ada sensor
    if (!hasSensorReading) {
      return {
        available: false,
        priority: "NO DATA",
        title: "Belum ada rekomendasi",
        description:
          "Rekomendasi akan tersedia setelah sistem menerima pembacaan sensor dari farm ini.",
        id: "--",
        duration: "--",
      };
    }

    const soilMoisture = Number(sensorData.soilMoisture);

    // Kondisi sangat kering
    if (soilMoisture < 40) {
      return {
        available: true,
        priority: "PRIORITY HIGH",
        title: "Penyiraman Tanaman",
        description:
          "Kelembapan tanah berada di bawah kondisi optimal. Sistem menyarankan penyiraman tanaman.",
        id: "#REC-001",
        duration: "5 Minutes",
      };
    }

    // Kondisi cukup
    if (soilMoisture < 60) {
      return {
        available: true,
        priority: "PRIORITY MEDIUM",
        title: "Monitoring Kelembapan Tanah",
        description:
          "Kelembapan tanah cukup tetapi perlu dipantau untuk menjaga kondisi tanaman tetap optimal.",
        id: "#REC-002",
        duration: "Monitoring",
      };
    }

    // Kondisi optimal
    return {
      available: true,
      priority: "PRIORITY LOW",
      title: "Kondisi Tanaman Optimal",
      description:
        "Kelembapan tanah berada dalam kondisi baik. Tidak diperlukan tindakan penyiraman saat ini.",
      id: "#REC-003",
      duration: "Monitoring",
    };
  };

  const recommendation = getRecommendation();

  // =========================================================
  // RELAY STATUS
  // =========================================================

  const getRelayStatus = (type) => {
    // Sensor tidak online
    if (!sensorOnline) {
      return {
        status: "OFFLINE",
        active: false,
      };
    }

    // WATER PUMP
    if (type === "waterPump") {
      if (
        sensorData?.waterPumpStatus !== null &&
        sensorData?.waterPumpStatus !== undefined
      ) {
        const status = String(sensorData.waterPumpStatus).toUpperCase();

        return {
          status,
          active: status === "ON",
        };
      }
    }

    // FERTILIZER PUMP
    if (type === "fertilizerPump") {
      if (
        sensorData?.fertilizerPumpStatus !== null &&
        sensorData?.fertilizerPumpStatus !== undefined
      ) {
        const status = String(sensorData.fertilizerPumpStatus).toUpperCase();

        return {
          status,
          active: status === "ON",
        };
      }
    }

    // Belum ada data relay
    return {
      status: "NO DATA",
      active: false,
    };
  };

  const waterPump = getRelayStatus("waterPump");

  const fertilizerPump = getRelayStatus("fertilizerPump");

  // =========================================================
  // RECENT ACTIVITY
  // =========================================================

  const activityList = [];

  // Sensor activity
  if (sensorOnline && sensorData?.lastReadingAt) {
    activityList.push({
      icon: "📡",
      title: "Sensor Reading Received",
      description: sensorData?.deviceId || sensorData?.sensorId || "Sensor IoT",
      time: formatDateTime(sensorData.lastReadingAt),
    });
  }

  // Crop health activity
  if (hasCropHealth && cropHome?.updatedAt) {
    activityList.push({
      icon: "🌱",
      title: "Crop Health Updated",
      description: `Overall score: ${cropHome.overallScore}`,
      time: formatDateTime(cropHome.updatedAt),
    });
  }

  // Water pump activity
  if (waterPump.status === "ON") {
    activityList.push({
      icon: "💧",
      title: "Water Pump Activated",
      description: "Irrigation System",
      time: sensorData?.lastReadingAt
        ? formatDateTime(sensorData.lastReadingAt)
        : "--",
      success: true,
    });
  }

  // =========================================================
  // DEBUG
  // =========================================================

  console.log("HOME - Selected Farm:", selectedFarm);

  console.log("HOME - Crop Home:", cropHome);

  console.log("HOME - Analyze Home:", analyzeHome);

  console.log("HOME - Sensor:", sensorData);

  console.log("HOME - Recommendation:", recommendation);

  console.log("HOME - Water Pump:", waterPump);

  console.log("HOME - Fertilizer Pump:", fertilizerPump);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="smartagri-layout">
      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="loading-overlay">
          <Lottie options={defaultOptions} height={180} width={180} />
        </div>
      )}

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="sidebar-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logOutFunction={logOutFunction}
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="smartagri-main">
        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="smartagri-topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <div className="topbar-breadcrumb">
            <span>SmartAgri</span>

            <b>/</b>

            <strong>Dashboard</strong>
          </div>

          <div className="topbar-actions">
            <button className="topbar-notification">
              🔔
              <span />
            </button>

            <div className="topbar-user">
              <div className="topbar-avatar">
                {fullName.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{fullName}</strong>

                <span>{role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="smartagri-content">
          {/* =================================================
              WELCOME
          ================================================= */}

          <section className="dashboard-welcome">
            <div>
              <span>SMART AGRICULTURE MONITORING</span>

              <h1>Good Morning, {fullName} 👋</h1>

              <p>
                Monitor kondisi lahan, tanaman, sensor IoT, dan rekomendasi
                pertanian Anda dalam satu dashboard.
              </p>
            </div>

            <div className="system-status">
              <span />
              System Operational
            </div>
          </section>

          {/* =================================================
              FARM SELECTOR
          ================================================= */}

          <section className="farm-selector-new">
            <div className="farm-selector-left">
              <div className="farm-selector-icon">🌱</div>

              <div>
                <span>CURRENT FARM</span>

                <strong>{selectedFarm?.name || "Belum ada farm"}</strong>

                <small>{selectedFarm?.address || "--"}</small>
              </div>
            </div>

            <select
              value={selectedFarm?.id || ""}
              disabled={!farms || farms.length === 0}
              onChange={(e) => {
                const farm = farms.find(
                  (item) => Number(item.id) === Number(e.target.value),
                );

                setSelectedFarm(farm || null);
              }}
            >
              {!farms || farms.length === 0 ? (
                <option value="">Belum ada farm</option>
              ) : (
                farms.map((farm) => (
                  <option key={farm.id} value={farm.id}>
                    {farm.name}
                  </option>
                ))
              )}
            </select>
          </section>

          {/* =================================================
              HEALTH
          ================================================= */}

          <section className="dashboard-grid health-section">
            {/* =================================================
                OVERALL HEALTH
            ================================================= */}

            <div className="card overall-card">
              <div className="card-header">
                <div>
                  <span className="card-label">CROP HEALTH</span>

                  <h2>Overall Health</h2>
                </div>

                <span className={`status-pill ${healthStatus.className}`}>
                  {healthStatus.label}
                </span>
              </div>

              <div className="health-score-wrapper">
                <div className="health-circle">
                  <div>
                    <strong>
                      {hasCropHealth ? cropHome.overallScore : "--"}
                    </strong>

                    {hasCropHealth && <span>/100</span>}
                  </div>
                </div>

                <div className="health-description">
                  <strong>{overallHealth.title}</strong>

                  <p>{overallHealth.description}</p>
                </div>
              </div>

              <div className="last-update">
                {hasCropHealth && cropHome?.updatedAt ? (
                  <>
                    Terakhir diperbarui: {formatDateTime(cropHome.updatedAt)}{" "}
                    WIB
                  </>
                ) : (
                  "Belum ada data analisis"
                )}
              </div>
            </div>

            {/* =================================================
                HEALTH COMPONENTS
            ================================================= */}

            <div className="card health-components">
              <div className="card-header">
                <div>
                  <span className="card-label">ANALYSIS</span>

                  <h2>Health Components</h2>
                </div>
              </div>

              <HealthProgress
                title="Vegetation"
                value={cropHome?.vegetationScore}
                icon="🌿"
              />

              <HealthProgress
                title="Climate"
                value={cropHome?.climateScore}
                icon="☀️"
              />

              <HealthProgress
                title="Soil"
                value={cropHome?.soilScore}
                icon="🌍"
              />

              <HealthProgress
                title="IoT"
                value={cropHome?.iotScore}
                icon="📡"
              />
            </div>
          </section>

          {/* =================================================
              SENSOR MONITORING
          ================================================= */}

          <section>
            <div className="section-title">
              <div>
                <span>REAL-TIME MONITORING</span>

                <h2>Sensor Monitoring</h2>
              </div>

              <div
                className={
                  sensorOnline ? "device-status" : "device-status offline"
                }
              >
                <span className={sensorOnline ? "online-dot" : "offline-dot"} />

                {getSensorStatusLabel()}
              </div>
            </div>

            {/* =================================================
                SENSOR INFO
            ================================================= */}

            <div className="sensor-info-bar">
              {!hasSensorData && (
                <span>📡 Belum ada pembacaan sensor dari farm ini.</span>
              )}

              {sensorOffline && (
                <span>
                  ⚠️ Sensor sedang offline. Belum ada pembacaan terbaru.
                </span>
              )}

              {sensorOnline && (
                <span>🟢 Sensor aktif dan mengirim data secara realtime.</span>
              )}

              {sensorData?.lastReadingAt && (
                <small>
                  Last reading: {formatDateTime(sensorData.lastReadingAt)}
                </small>
              )}
            </div>

            {/* =================================================
                SENSOR GRID
            ================================================= */}

            <div className="sensor-grid">
              <SensorCard
                icon="💧"
                title="Soil Moisture"
                value={sensorData?.soilMoisture}
                unit="%"
                status="Optimal"
                online={sensorOnline}
              />

              <SensorCard
                icon="🌡️"
                title="Temperature"
                value={sensorData?.temperature}
                unit="°C"
                status="Optimal"
                online={sensorOnline}
              />

              <SensorCard
                icon="💦"
                title="Humidity"
                value={sensorData?.humidity}
                unit="%"
                status="Good"
                online={sensorOnline}
              />

              <SensorCard
                icon="☀️"
                title="Light Intensity"
                value={sensorData?.lightIntensity}
                unit="lux"
                status="Good"
                online={sensorOnline}
              />
            </div>
          </section>

          {/* =================================================
              RECOMMENDATION + RELAY
          ================================================= */}

          <section className="dashboard-grid action-section">
            {/* =================================================
                RECOMMENDATION
            ================================================= */}

            <div className="card recommendation-card">
              <div className="card-header">
                <div>
                  <span className="card-label">SMART RECOMMENDATION</span>

                  <h2>Recommended Action</h2>
                </div>

                <span
                  className={
                    recommendation.available
                      ? "recommendation-status"
                      : "recommendation-status offline"
                  }
                >
                  {recommendation.available ? "NEW" : "NO DATA"}
                </span>
              </div>

              <div className="recommendation-main">
                <div
                  className={
                    recommendation.available
                      ? "recommendation-icon"
                      : "recommendation-icon offline"
                  }
                >
                  {recommendation.available ? "💧" : "📡"}
                </div>

                <div>
                  <span>{recommendation.priority}</span>

                  <h3>{recommendation.title}</h3>

                  <p>{recommendation.description}</p>
                </div>
              </div>

              <div className="recommendation-meta">
                <div>
                  <span>Recommendation ID</span>

                  <strong>{recommendation.id}</strong>
                </div>

                <div>
                  <span>Duration</span>

                  <strong>{recommendation.duration}</strong>
                </div>
              </div>

              <button
                className="primary-button"
                disabled={!recommendation.available}
                onClick={() => {
                  if (recommendation.available) {
                    console.log("View Recommendation:", recommendation);
                  }
                }}
              >
                {recommendation.available
                  ? "View Recommendation"
                  : "No Recommendation"}
              </button>
            </div>

            {/* =================================================
                RELAY
            ================================================= */}

            <div className="card relay-card">
              <div className="card-header">
                <div>
                  <span className="card-label">AUTOMATION</span>

                  <h2>Relay Control</h2>
                </div>

                <span className="auto-badge">AUTO</span>
              </div>

              <RelayItem
                title="Water Pump"
                description="Irrigation System"
                status={waterPump.status}
                active={waterPump.active}
              />

              <RelayItem
                title="Fertilizer Pump"
                description="Fertilization System"
                status={fertilizerPump.status}
                active={fertilizerPump.active}
              />

              <div className="relay-info">
                <span>{sensorOnline ? "🤖" : "📡"}</span>

                <p>
                  {sensorOnline
                    ? "Relay dikontrol otomatis berdasarkan kondisi sensor dan recommendation dari sistem."
                    : "Relay belum tersedia karena belum ada pembacaan sensor dari farm ini."}
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              RECENT ACTIVITY
          ================================================= */}

          <section className="card activity-card">
            <div className="section-title">
              <div>
                <span>SYSTEM ACTIVITY</span>

                <h2>Recent Activity</h2>
              </div>

              <button
                className="text-button"
                onClick={() => handleNavigation("/activity")}
              >
                View All
              </button>
            </div>

            <div className="activity-list">
              {activityList.length === 0 ? (
                <div className="activity-empty">
                  <div className="activity-empty-icon">📡</div>

                  <div>
                    <strong>Belum ada aktivitas</strong>

                    <span>
                      Aktivitas akan muncul setelah sistem menerima pembacaan
                      sensor atau melakukan analisis.
                    </span>
                  </div>
                </div>
              ) : (
                activityList.map((activity, index) => (
                  <Activity
                    key={`${activity.title}-${index}`}
                    icon={activity.icon}
                    title={activity.title}
                    description={activity.description}
                    time={activity.time}
                    success={activity.success}
                  />
                ))
              )}
            </div>
          </section>

          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="dashboard-footer">
            <span>SmartAgri © 2026</span>

            <span>
              System Status:
              <strong>Operational</strong>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
};

/* =============================================================
   HEALTH PROGRESS
============================================================= */

const HealthProgress = ({ title, value, icon }) => {
  const hasValue =
    value !== null && value !== undefined && !Number.isNaN(Number(value));

  const numericValue = hasValue ? Number(value) : 0;

  return (
    <div className="health-progress">
      <div className="health-progress-top">
        <div className="health-progress-title">
          <span>{icon}</span>

          {title}
        </div>

        <strong>{hasValue ? numericValue : "--"}</strong>
      </div>

      <div className="progress-track">
        <div
          className="progress-value"
          style={{
            width: hasValue
              ? `${Math.max(0, Math.min(numericValue, 100))}%`
              : "0%",
          }}
        />
      </div>
    </div>
  );
};

/* =============================================================
   SENSOR CARD
============================================================= */

const SensorCard = ({ icon, title, value, unit, status, online }) => {
  const hasValue =
    value !== null && value !== undefined && !Number.isNaN(Number(value));

  const displayValue = hasValue ? Number(value) : "--";

  const displayUnit = hasValue ? unit : "";

  const isLive = online && hasValue;

  return (
    <div className={`sensor-card ${!isLive ? "sensor-offline" : ""}`}>
      <div className="sensor-card-top">
        <div className="sensor-icon">{icon}</div>

        <span className={isLive ? "sensor-live" : "sensor-offline-badge"}>
          {isLive ? "LIVE" : "OFFLINE"}
        </span>
      </div>

      <span className="sensor-title">{title}</span>

      <div className="sensor-value">
        <strong>{displayValue}</strong>

        <span>{displayUnit}</span>
      </div>

      <span className={`sensor-status ${!isLive ? "offline" : ""}`}>
        ● {!online ? "Offline" : !hasValue ? "No Data" : status}
      </span>
    </div>
  );
};

/* =============================================================
   RELAY ITEM
============================================================= */

const RelayItem = ({ title, description, status, active }) => {
  const isOffline = status === "OFFLINE";

  const isNoData = status === "NO DATA";

  return (
    <div className="relay-item">
      <div className="relay-icon">⚡</div>

      <div className="relay-content">
        <strong>{title}</strong>

        <span>{description}</span>
      </div>

      <div className={active ? "relay-status active" : "relay-status"}>
        <span />

        {isOffline ? "OFFLINE" : isNoData ? "NO DATA" : status}
      </div>
    </div>
  );
};

/* =============================================================
   ACTIVITY
============================================================= */

const Activity = ({ icon, title, description, time, success }) => {
  return (
    <div className="activity-item">
      <div className={success ? "activity-icon success" : "activity-icon"}>
        {icon}
      </div>

      <div className="activity-content">
        <strong>{title}</strong>

        <span>{description}</span>
      </div>

      <time>{time || "--"}</time>
    </div>
  );
};
