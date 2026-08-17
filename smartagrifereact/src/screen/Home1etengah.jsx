import React, { useEffect, useState } from "react";
import "./css/Home.css";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logOut } from "../store/action/userAction";
// asset
import logoApp from "../asset/smartAgri1.png";

// component
import Sidebar from "../component/Sidebar/SideBar";

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
  // store
  const userLogin = useSelector((state) => state.userReducers.userLogin);
  const farms = useSelector((state) => state.farmReducers.farms);
  const cropHome = useSelector((state) => state.cropReducers.cropHome);
  const analyzeHome = useSelector((state) => state.cropReducers.analyzeHome);

  const [loading, setLoading] = useState(true);
  const [selectedFarm, setSelectedFarm] = useState(farms[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const healthScore = 64;

  /*
    |--------------------------------------------------------------------------
    | REDUX USER
    |--------------------------------------------------------------------------
    */

  const fullName = userLogin?.loginUser.fullName || "User";
  const role = userLogin?.Role?.name || userLogin?.role || "User";

  useEffect(() => {
    if (userLogin?.access_token) {
      //  dispatch(fetchDataPribadi(userLogin.access_token));

      // dispatch(cropHealthHome(selectedFarm.id))
      dispatch(fetchFarms(userLogin.access_token));
    }
  }, [userLogin]);

  useEffect(() => {
    if (farms) {
      console.log(cropHealthAnalyzeHome, "useEffect");
      dispatch(cropHealthHome(selectedFarm.id));
      dispatch(
        cropHealthAnalyzeHome({
          farmId: cropHome.farmId,
          cropId: cropHome.cropId,
        }),
      );
    }
  }, [farms]);

  /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  /*
    |--------------------------------------------------------------------------
    | LOTTIE
    |--------------------------------------------------------------------------
    */

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

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

  /*
    |--------------------------------------------------------------------------
    | NAVIGATION
    |--------------------------------------------------------------------------
    */

  const handleNavigation = (path) => {
    setSidebarOpen(false);

    navigate(path);
  };

  // untuk cropHome
  const getHealthDescription = (score, type) => {
    if (score <= 25) {
      return {
        title: `${type} dalam kondisi buruk`,
        description: `Perlu perhatian dan penanganan segera pada kondisi ${type.toLowerCase()}.`,
      };
    }

    if (score <= 50) {
      return {
        title: `${type} perlu perhatian`,
        description: `Kondisi ${type.toLowerCase()} masih kurang optimal dan perlu dilakukan pemantauan lebih lanjut.`,
      };
    }

    if (score <= 75) {
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

  console.log(analyzeHome);

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
                MAIN AREA
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
          {/* WELCOME */}

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

          {/* FARM SELECTOR */}

          <section className="farm-selector-new">
            <div className="farm-selector-left">
              <div className="farm-selector-icon">🌱</div>
              <div>
                <span>CURRENT FARM</span>
                {/* <strong>Smart Farm Subang</strong> */}
                <strong>{selectedFarm?.name}</strong>
                <small>{selectedFarm?.address}</small>
              </div>
            </div>

            <select
              value={selectedFarm?.id}
              onChange={(e) => {
                const farm = farms.find(
                  (farm) => farm.id === Number(e.target.value),
                );
                setSelectedFarm(farm);
              }}
            >
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
          </section>

          {/* =================================================
                        HEALTH
                    ================================================= */}

          <section className="dashboard-grid health-section">
            {/* OVERALL */}

            <div className="card overall-card">
              <div className="card-header">
                <div>
                  <span className="card-label">CROP HEALTH</span>
                  <h2>Overall Health</h2>
                </div>

                {/* <span className="status-pill moderate">MODERATE</span> */}
                <span
                  className={`status-pill ${
                    cropHome.overallScore <= 25
                      ? "bad"
                      : cropHome.overallScore <= 50
                        ? "poor"
                        : cropHome.overallScore <= 75
                          ? "moderate"
                          : "excellent"
                  }`}
                >
                  {cropHome.overallScore <= 25
                    ? "BAD"
                    : cropHome.overallScore <= 50
                      ? "POOR"
                      : cropHome.overallScore <= 75
                        ? "MODERATE"
                        : "EXCELLENT"}
                </span>
              </div>
              <div className="health-score-wrapper">
                <div className="health-circle">
                  <div>
                    <strong>{cropHome.overallScore}</strong>
                    <span>/100</span>
                  </div>
                </div>

                <div className="health-description">
                  <strong>{overallHealth.title}</strong>
                  <p>{overallHealth.description}</p>
                </div>
              </div>

              <div className="last-update">
                Terakhir diperbarui:{" "}
                {new Date(cropHome.updatedAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}{" "}
                •{" "}
                {new Date(cropHome.updatedAt).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}{" "}
                WIB
              </div>
            </div>

            {/* COMPONENTS */}

            <div className="card health-components">
              <div className="card-header">
                <div>
                  <span className="card-label">ANALYSIS</span>
                  <h2>Health Components</h2>
                </div>
              </div>

              <HealthProgress
                title="Vegetation"
                value={cropHome.vegetationScore}
                icon="🌿"
              />

              <HealthProgress
                title="Climate"
                value={cropHome.climateScore}
                icon="☀️"
              />

              <HealthProgress
                title="Soil"
                value={cropHome.soilScore}
                icon="🌍"
              />

              <HealthProgress title="IoT" value={null} icon="📡" />
            </div>
          </section>

          {/* =================================================
                        SENSOR
                    ================================================= */}

          <section>
            <div className="section-title">
              <div>
                <span>REAL-TIME MONITORING</span>

                <h2>Sensor Monitoring</h2>
              </div>

              <div className="device-status">
                <span className="online-dot" />
                ESP32 Online
              </div>
            </div>

            <div className="sensor-grid">
              <SensorCard
                icon="💧"
                title="Soil Moisture"
                value="32"
                unit="%"
                status="Optimal"
              />

              <SensorCard
                icon="🌡️"
                title="Temperature"
                value="28.4"
                unit="°C"
                status="Optimal"
              />

              <SensorCard
                icon="💦"
                title="Humidity"
                value="67"
                unit="%"
                status="Good"
              />

              <SensorCard
                icon="☀️"
                title="Light Intensity"
                value="8,420"
                unit="lux"
                status="Good"
              />
            </div>
          </section>

          {/* =================================================
                        RECOMMENDATION + RELAY
                    ================================================= */}

          <section className="dashboard-grid action-section">
            {/* RECOMMENDATION */}

            <div className="card recommendation-card">
              <div className="card-header">
                <div>
                  <span className="card-label">SMART RECOMMENDATION</span>

                  <h2>Recommended Action</h2>
                </div>

                <span className="recommendation-status">NEW</span>
              </div>

              <div className="recommendation-main">
                <div className="recommendation-icon">💧</div>

                <div>
                  <span>PRIORITY HIGH</span>

                  <h3>Penyiraman Tanaman</h3>

                  <p>
                    Kelembapan tanah berada di bawah kondisi optimal. Sistem
                    menyarankan penyiraman tanaman.
                  </p>
                </div>
              </div>

              <div className="recommendation-meta">
                <div>
                  <span>Recommendation ID</span>

                  <strong>#REC-001</strong>
                </div>

                <div>
                  <span>Duration</span>

                  <strong>5 Minutes</strong>
                </div>
              </div>

              <button className="primary-button">View Recommendation</button>
            </div>

            {/* RELAY */}

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
                status="ON"
                active
              />

              <RelayItem
                title="Fertilizer Pump"
                description="Fertilization System"
                status="OFF"
              />

              <div className="relay-info">
                <span>🤖</span>

                <p>
                  Relay dikontrol otomatis berdasarkan recommendation dari
                  sistem.
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
                        ACTIVITY
                    ================================================= */}

          <section className="card activity-card">
            <div className="section-title">
              <div>
                <span>SYSTEM ACTIVITY</span>

                <h2>Recent Activity</h2>
              </div>

              <button className="text-button">View All</button>
            </div>

            <div className="activity-list">
              <Activity
                icon="💧"
                title="Water Pump Activated"
                description="Recommendation #REC-001"
                time="2 minutes ago"
                success
              />

              <Activity
                icon="📡"
                title="Sensor Reading Received"
                description="ESP32-001"
                time="8 minutes ago"
              />

              <Activity
                icon="🌱"
                title="Crop Health Updated"
                description="Overall score: 64"
                time="15 minutes ago"
              />
            </div>
          </section>

          {/* FOOTER */}

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
   SIDEBAR SECTION
============================================================= */

const SidebarSection = ({ title, children }) => {
  return (
    <div className="sidebar-section">
      <div className="sidebar-section-title">{title}</div>

      {children}
    </div>
  );
};

/* =============================================================
   SIDEBAR ITEM
============================================================= */

const SidebarItem = ({ icon, label, active, badge, onClick }) => {
  return (
    <button
      className={active ? "sidebar-item active" : "sidebar-item"}
      onClick={onClick}
    >
      <span className="sidebar-item-icon">{icon}</span>

      <span className="sidebar-item-label">{label}</span>

      {badge && <span className="sidebar-item-badge">{badge}</span>}
    </button>
  );
};

/* =============================================================
   HEALTH PROGRESS
============================================================= */

const HealthProgress = ({ title, value, icon }) => {
  return (
    <div className="health-progress">
      <div className="health-progress-top">
        <div className="health-progress-title">
          <span>{icon}</span>

          {title}
        </div>

        <strong>{value !== null ? value : "--"}</strong>
      </div>

      <div className="progress-track">
        <div
          className="progress-value"
          style={{
            width: value !== null ? `${value}%` : "0%",
          }}
        />
      </div>
    </div>
  );
};

/* =============================================================
   SENSOR CARD
============================================================= */

const SensorCard = ({ icon, title, value, unit, status }) => {
  return (
    <div className="sensor-card">
      <div className="sensor-card-top">
        <div className="sensor-icon">{icon}</div>

        <span className="sensor-live">LIVE</span>
      </div>

      <span className="sensor-title">{title}</span>

      <div className="sensor-value">
        <strong>{value}</strong>

        <span>{unit}</span>
      </div>

      <span className="sensor-status">● {status}</span>
    </div>
  );
};

/* =============================================================
   RELAY ITEM
============================================================= */

const RelayItem = ({ title, description, status, active }) => {
  return (
    <div className="relay-item">
      <div className="relay-icon">⚡</div>

      <div className="relay-content">
        <strong>{title}</strong>

        <span>{description}</span>
      </div>

      <div className={active ? "relay-status active" : "relay-status"}>
        <span />

        {status}
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

      <time>{time}</time>
    </div>
  );
};
