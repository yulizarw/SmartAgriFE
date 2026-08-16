// import React from "react";
// import { useState, useEffect } from "react";
// import "./css/Home.css";

// import { useNavigate } from "react-router-dom";
// // store
// import { logOut } from "../store/action/userAction";
// import { useDispatch, useSelector } from "react-redux";

// //loader
// import Lottie from "react-lottie";
// import * as loaderData from "../asset/lottieLego.json"
// // import { BsDisplay } from "react-icons/bs";

// export const Home = (props) => {
//   const logOutFunction = props.logOutFunction;
//   const healthScore = 64;
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [loading, setLoading] = useState(true); // State to manage loading status

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false); // Set loading to false after 2 seconds (2000ms)
//     }, 2000); // Adjust the delay as needed

//     return () => clearTimeout(timer); // Clean up the timeout on component unmount
//   }, []);

//   //   loader
//   const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: loaderData,
//     rendererSettings: {
//       preserveAspectRatio: "xMidYMid slice",
//     },
//   };
//   //redux state
//   const userLogin = useSelector((state) => state.userReducers.userLogin);

//   const [showProfile, setShowProfile] = useState(false);

//   const userName = localStorage.getItem("userName") || "User";

//   const handleLogout = () => {
//     localStorage.clear();
//     logOutFunction();
//     // localStorage.removeItem("userName");
//     dispatch(logOut());

//     // window.location.href = "/login";
//     navigate("/", {
//       replace: true,
//     });
//   };
//   console.log(userLogin, "asdsad");

//   if (loading) {
//     return (
//       <Home>
//         <div>
//           {/* <VuiBox> */}
//             <Lottie options={defaultOptions} />
//           {/* </VuiBox> */}
//         </div>
//       </Home>
//     );
//   }

//   return (
//     <div className="smartagri-dashboard">
//       <header className="dashboard-header">
//         <div>
//           <div className="dashboard-eyebrow">SMART AGRICULTURE SYSTEM</div>

//           <h1>Good Morning, {userLogin.fullName}👋</h1>

//           <p>Monitor kondisi tanaman dan IoT farm kamu secara real-time.</p>
//         </div>

//         <div className="header-actions">
//           {/* Notification */}
//           <button className="notification-button" type="button">
//             🔔
//             <span className="notification-dot"></span>
//           </button>

//           {/* Profile */}
//           <div className="profile">
//             <div className="profile-avatar">
//               {userLogin.fullName.slice(0, 1)}
//             </div>

//             <div className="profile-info">
//               <strong>{userLogin.fullName}</strong>
//               <span>{userLogin.Role}</span>
//             </div>
//           </div>

//           {/* Logout */}
//           <button
//             className="logout-button"
//             type="button"
//             onClick={handleLogout}
//           >
//             <span className="logout-icon">↪</span>

//             <span>Logout</span>
//           </button>
//         </div>
//       </header>

//       {/* =====================================================
//                 FARM SELECTOR
//             ===================================================== */}
//       <section className="farm-selector">
//         <div className="farm-icon">🌱</div>

//         <div className="farm-selector-content">
//           <span>ACTIVE FARM</span>

//           <strong>Smart Farm Subang</strong>
//         </div>

//         <select>
//           <option>Farm Subang</option>

//           <option>Farm Jakarta</option>
//         </select>
//       </section>

//       {/* =====================================================
//                 HEALTH OVERVIEW
//             ===================================================== */}
//       <section className="dashboard-grid health-section">
//         {/* Overall Health */}
//         <div className="card overall-card">
//           <div className="card-header">
//             <div>
//               <span className="card-label">CROP HEALTH</span>

//               <h2>Overall Health</h2>
//             </div>

//             <span className="status-pill moderate">MODERATE</span>
//           </div>

//           <div className="health-score-wrapper">
//             <div className="health-circle">
//               <div>
//                 <strong>{healthScore}</strong>

//                 <span>/100</span>
//               </div>
//             </div>

//             <div className="health-description">
//               <strong>Tanaman dalam kondisi cukup baik</strong>

//               <p>Perlu perhatian pada kondisi tanah dan kelembapan tanaman.</p>
//             </div>
//           </div>

//           <div className="last-update">Updated 08 Aug 2026 • 14:32</div>
//         </div>

//         {/* Health Components */}
//         <div className="card health-components">
//           <div className="card-header">
//             <div>
//               <span className="card-label">ANALYSIS</span>

//               <h2>Health Components</h2>
//             </div>
//           </div>

//           <HealthProgress title="Vegetation" value={68} icon="🌿" />

//           <HealthProgress title="Climate" value={72} icon="☀️" />

//           <HealthProgress title="Soil" value={45} icon="🌍" />

//           <HealthProgress title="IoT" value={null} icon="📡" />
//         </div>
//       </section>

//       {/* =====================================================
//                 SENSOR MONITORING
//             ===================================================== */}
//       <section>
//         <div className="section-title">
//           <div>
//             <span>REAL-TIME MONITORING</span>

//             <h2>Sensor Monitoring</h2>
//           </div>

//           <div className="device-status">
//             <span className="online-dot"></span>
//             ESP32 Online
//           </div>
//         </div>

//         <div className="sensor-grid">
//           <SensorCard
//             icon="💧"
//             title="Soil Moisture"
//             value="32"
//             unit="%"
//             status="Optimal"
//           />

//           <SensorCard
//             icon="🌡️"
//             title="Temperature"
//             value="28.4"
//             unit="°C"
//             status="Optimal"
//           />

//           <SensorCard
//             icon="💦"
//             title="Humidity"
//             value="67"
//             unit="%"
//             status="Good"
//           />

//           <SensorCard
//             icon="☀️"
//             title="Light Intensity"
//             value="8,420"
//             unit="lux"
//             status="Good"
//           />
//         </div>
//       </section>

//       {/* =====================================================
//                 RECOMMENDATION + RELAY
//             ===================================================== */}
//       <section className="dashboard-grid action-section">
//         {/* Recommendation */}
//         <div className="card recommendation-card">
//           <div className="card-header">
//             <div>
//               <span className="card-label">SMART RECOMMENDATION</span>

//               <h2>Recommended Action</h2>
//             </div>

//             <span className="recommendation-status">NEW</span>
//           </div>

//           <div className="recommendation-main">
//             <div className="recommendation-icon">💧</div>

//             <div>
//               <span>PRIORITY HIGH</span>

//               <h3>Penyiraman Tanaman</h3>

//               <p>
//                 Kelembapan tanah berada di bawah kondisi optimal. Sistem
//                 menyarankan penyiraman tanaman.
//               </p>
//             </div>
//           </div>

//           <div className="recommendation-meta">
//             <div>
//               <span>Recommendation ID</span>
//               <strong>#REC-001</strong>
//             </div>

//             <div>
//               <span>Duration</span>
//               <strong>5 Minutes</strong>
//             </div>
//           </div>

//           <button className="primary-button">View Recommendation</button>
//         </div>

//         {/* Relay */}
//         <div className="card relay-card">
//           <div className="card-header">
//             <div>
//               <span className="card-label">AUTOMATION</span>

//               <h2>Relay Control</h2>
//             </div>

//             <span className="auto-badge">AUTO</span>
//           </div>

//           <RelayItem
//             title="Water Pump"
//             description="Irrigation System"
//             status="ON"
//             active
//           />

//           <RelayItem
//             title="Fertilizer Pump"
//             description="Fertilization System"
//             status="OFF"
//           />

//           <div className="relay-info">
//             <span>🤖</span>

//             <p>
//               Relay dikontrol otomatis berdasarkan recommendation dari sistem.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* =====================================================
//                 ACTIVITY
//             ===================================================== */}
//       <section className="card activity-card">
//         <div className="section-title">
//           <div>
//             <span>SYSTEM ACTIVITY</span>

//             <h2>Recent Activity</h2>
//           </div>

//           <button className="text-button">View All</button>
//         </div>

//         <div className="activity-list">
//           <Activity
//             icon="💧"
//             title="Water Pump Activated"
//             description="Recommendation #REC-001"
//             time="2 minutes ago"
//             success
//           />

//           <Activity
//             icon="📡"
//             title="Sensor Reading Received"
//             description="ESP32-001"
//             time="8 minutes ago"
//           />

//           <Activity
//             icon="🌱"
//             title="Crop Health Updated"
//             description="Overall score: 64"
//             time="15 minutes ago"
//           />
//         </div>
//       </section>

//       {/* =====================================================
//                 FOOTER
//             ===================================================== */}
//       <footer className="dashboard-footer">
//         <span>SmartAgri © 2026</span>

//         <span>
//           System Status: <strong>Operational</strong>
//         </span>
//       </footer>
//     </div>
//   );
// };

// /* =============================================================
//    HEALTH PROGRESS
// ============================================================= */

// const HealthProgress = ({ title, value, icon }) => {
//   return (
//     <div className="health-progress">
//       <div className="health-progress-top">
//         <div className="health-progress-title">
//           <span>{icon}</span>

//           {title}
//         </div>

//         <strong>{value !== null ? value : "--"}</strong>
//       </div>

//       <div className="progress-track">
//         <div
//           className="progress-value"
//           style={{
//             width: value !== null ? `${value}%` : "0%",
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// /* =============================================================
//    SENSOR CARD
// ============================================================= */

// const SensorCard = ({ icon, title, value, unit, status }) => {
//   return (
//     <div className="sensor-card">
//       <div className="sensor-card-top">
//         <div className="sensor-icon">{icon}</div>

//         <span className="sensor-live">LIVE</span>
//       </div>

//       <span className="sensor-title">{title}</span>

//       <div className="sensor-value">
//         <strong>{value}</strong>

//         <span>{unit}</span>
//       </div>

//       <span className="sensor-status">● {status}</span>
//     </div>
//   );
// };

// /* =============================================================
//    RELAY ITEM
// ============================================================= */

// const RelayItem = ({ title, description, status, active }) => {
//   return (
//     <div className="relay-item">
//       <div className="relay-icon">⚡</div>

//       <div className="relay-content">
//         <strong>{title}</strong>

//         <span>{description}</span>
//       </div>

//       <div className={active ? "relay-status active" : "relay-status"}>
//         <span></span>

//         {status}
//       </div>
//     </div>
//   );
// };

// /* =============================================================
//    ACTIVITY
// ============================================================= */

// const Activity = ({ icon, title, description, time, success }) => {
//   return (
//     <div className="activity-item">
//       <div className={success ? "activity-icon success" : "activity-icon"}>
//         {icon}
//       </div>

//       <div className="activity-content">
//         <strong>{title}</strong>

//         <span>{description}</span>
//       </div>

//       <time>{time}</time>
//     </div>
//   );
// };

// // export default Home;
import React, { useState, useEffect } from "react";
import "./css/Home.css";

import { useNavigate } from "react-router-dom";

// store
import { logOut } from "../store/action/userAction";
import { useDispatch, useSelector } from "react-redux";

// loader
import Lottie from "react-lottie";
import * as loaderData from "../asset/lottieLego.json";

export const Home = ({ logOutFunction }) => {
  const healthScore = 64;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

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
    | REDUX USER
    |--------------------------------------------------------------------------
    */

  const userLogin = useSelector((state) => state.userReducers.userLogin);
  console.log(userLogin.loginUser, "asdasdasdsad");
  /*
    |--------------------------------------------------------------------------
    | USER DATA
    |--------------------------------------------------------------------------
    */

  const fullName = userLogin?.fullName || "User";

  const role = userLogin?.Role.name || userLogin?.role || "User";

  /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

  const handleLogout = () => {
    // Hapus authentication
    localStorage.clear();
    logOutFunction();
    // Reset redux
    dispatch(logOut());
    // Beritahu App bahwa user sudah logout
    // Kembali ke login
    navigate("/", {
      replace: true,
    });
  };

  /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

  return (
    <div className="smartagri-dashboard">
      {loading && (
        <div className="loading-overlay">
          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
      )}
      {/* =====================================================
                HEADER
            ===================================================== */}

      <header className="dashboard-header">
        <div>
          <div className="dashboard-eyebrow">SMART AGRICULTURE SYSTEM</div>

          <h1>Good Morning, {fullName} 👋</h1>

          <p>Monitor kondisi tanaman dan IoT farm kamu secara real-time.</p>
        </div>

        <div className="header-actions">
          {/* Notification */}

          <button className="notification-button" type="button">
            🔔
            <span className="notification-dot"></span>
          </button>

          {/* Profile */}

          <div className="profile">
            <div className="profile-avatar">
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div className="profile-info">
              <strong>{fullName}</strong>

              <span>{role}</span>
            </div>
          </div>

          {/* Logout */}

          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
          >
            <span className="logout-icon">↪</span>

            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* =====================================================
                FARM SELECTOR
            ===================================================== */}

      <section className="farm-selector">
        <div className="farm-icon">🌱</div>

        <div className="farm-selector-content">
          <span>ACTIVE FARM</span>

          <strong>Smart Farm Subang</strong>
        </div>

        <select>
          <option>Farm Subang</option>

          <option>Farm Jakarta</option>
        </select>
      </section>

      {/* =====================================================
                HEALTH OVERVIEW
            ===================================================== */}

      <section className="dashboard-grid health-section">
        {/* Overall Health */}

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

              <p>Perlu perhatian pada kondisi tanah dan kelembapan tanaman.</p>
            </div>
          </div>

          <div className="last-update">Updated 08 Aug 2026 • 14:32</div>
        </div>

        {/* Health Components */}

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

      {/* =====================================================
                SENSOR MONITORING
            ===================================================== */}

      <section>
        <div className="section-title">
          <div>
            <span>REAL-TIME MONITORING</span>

            <h2>Sensor Monitoring</h2>
          </div>

          <div className="device-status">
            <span className="online-dot"></span>
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

      {/* =====================================================
                RECOMMENDATION + RELAY
            ===================================================== */}

      <section className="dashboard-grid action-section">
        {/* Recommendation */}

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

        {/* Relay */}

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
              Relay dikontrol otomatis berdasarkan recommendation dari sistem.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
                ACTIVITY
            ===================================================== */}

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

      {/* =====================================================
                FOOTER
            ===================================================== */}

      <footer className="dashboard-footer">
        <span>SmartAgri © 2026</span>

        <span>
          System Status:
          <strong>Operational</strong>
        </span>
      </footer>
    </div>
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
        <span></span>

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
