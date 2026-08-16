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

export const Home = ({ logOutFunction }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const healthScore = 64;

  /*
    |--------------------------------------------------------------------------
    | REDUX USER
    |--------------------------------------------------------------------------
    */

  const userLogin = useSelector((state) => state.userReducers.userLogin);

  const fullName = userLogin?.fullName || "User";

  const role = userLogin?.Role?.name || userLogin?.role || "User";

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

                <strong>Smart Farm Subang</strong>

                <small>Subang, Jawa Barat</small>
              </div>
            </div>

            <select>
              <option>Smart Farm Subang</option>

              <option>Smart Farm Jakarta</option>
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

                <span className="status-pill moderate">MODERATE</span>
              </div>

              <div className="health-score-wrapper">
                <div className="health-circle">
                  <div>
                    <strong>{healthScore}</strong>

                    <span>/100</span>
                  </div>
                </div>

                <div className="health-description">
                  <strong>Tanaman dalam kondisi cukup baik</strong>

                  <p>
                    Perlu perhatian pada kondisi tanah dan kelembapan tanaman.
                  </p>
                </div>
              </div>

              <div className="last-update">Updated 08 Aug 2026 • 14:32</div>
            </div>

            {/* COMPONENTS */}

            <div className="card health-components">
              <div className="card-header">
                <div>
                  <span className="card-label">ANALYSIS</span>

                  <h2>Health Components</h2>
                </div>
              </div>

              <HealthProgress title="Vegetation" value={68} icon="🌿" />

              <HealthProgress title="Climate" value={72} icon="☀️" />

              <HealthProgress title="Soil" value={45} icon="🌍" />

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
