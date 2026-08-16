import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logOut } from "../../store/action/userAction";

import "./css/SideBar.css";

const Sidebar = ({ sidebarOpen, setSidebarOpen, logOutFunction }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userReducers.userLogin);

  const fullName = userLogin?.fullName || "User";

  const role = userLogin?.Role?.name || userLogin?.role || "User";

  /*
    |--------------------------------------------------------------------------
    | NAVIGATION
    |--------------------------------------------------------------------------
    */

  const handleNavigation = (path) => {
    navigate(path);

    // Mobile: tutup sidebar setelah memilih menu
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

  const handleLogout = () => {
    localStorage.clear();

    if (logOutFunction) {
      logOutFunction();
    }

    dispatch(logOut());

    navigate("/", {
      replace: true,
    });
  };

  /*
    |--------------------------------------------------------------------------
    | ACTIVE MENU
    |--------------------------------------------------------------------------
    */

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={sidebarOpen ? "smartagri-sidebar open" : "smartagri-sidebar"}
    >
      {/* =====================================================
                BRAND
            ===================================================== */}

      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🌱</div>

        <div>
          <strong>
            Smart<span>Agri</span>
          </strong>

          <small>Smart Agriculture</small>
        </div>
      </div>

      {/* =====================================================
                ACTIVE FARM
            ===================================================== */}

      <div className="sidebar-farm">
        <div className="sidebar-farm-icon">🌾</div>

        <div>
          <span>ACTIVE FARM</span>

          <strong>Smart Farm Subang</strong>
        </div>

        <span className="farm-online-dot" />
      </div>

      {/* =====================================================
                NAVIGATION
            ===================================================== */}

      <nav className="sidebar-navigation">
        {/* MAIN */}

        <SidebarSection title="MAIN">
          <SidebarItem
            icon="⌂"
            label="Dashboard"
            active={isActive("/home")}
            onClick={() => handleNavigation("/home")}
          />

          <SidebarItem
            icon="🌱"
            label="Farm Overview"
            active={isActive("/farm")}
            onClick={() => handleNavigation("/farm")}
          />
        </SidebarSection>

        {/* MONITORING */}

        <SidebarSection title="MONITORING">
          <SidebarItem
            icon="🌿"
            label="Crop Health"
            active={isActive("/crop-health")}
            onClick={() => handleNavigation("/crop-health")}
          />

          <SidebarItem
            icon="📡"
            label="Sensor Monitoring"
            badge="LIVE"
            active={isActive("/sensors")}
            onClick={() => handleNavigation("/sensors")}
          />

          <SidebarItem
            icon="☁️"
            label="Climate & Soil"
            active={isActive("/climate")}
            onClick={() => handleNavigation("/climate")}
          />
        </SidebarSection>

        {/* SMART SYSTEM */}

        <SidebarSection title="SMART SYSTEM">
          <SidebarItem
            icon="💡"
            label="Recommendations"
            badge="2"
            active={isActive("/recommendations")}
            onClick={() => handleNavigation("/recommendations")}
          />

          <SidebarItem
            icon="💧"
            label="Irrigation"
            active={isActive("/irrigation")}
            onClick={() => handleNavigation("/irrigation")}
          />

          <SidebarItem
            icon="⚡"
            label="Devices / IoT"
            active={isActive("/devices")}
            onClick={() => handleNavigation("/devices")}
          />
        </SidebarSection>

        {/* ANALYTICS */}

        <SidebarSection title="ANALYTICS">
          <SidebarItem
            icon="🗺️"
            label="GIS & Map"
            active={isActive("/gis")}
            onClick={() => handleNavigation("/gis")}
          />

          <SidebarItem
            icon="📊"
            label="History"
            active={isActive("/history")}
            onClick={() => handleNavigation("/history")}
          />
        </SidebarSection>
      </nav>

      {/* =====================================================
                BOTTOM
            ===================================================== */}

      <div className="sidebar-bottom">
        <SidebarItem
          icon="⚙️"
          label="Settings"
          active={isActive("/settings")}
          onClick={() => handleNavigation("/settings")}
        />

        <button className="sidebar-logout" onClick={handleLogout} type="button">
          <span>↪</span>

          <span>Logout</span>
        </button>

        {/* USER */}

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {fullName.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{fullName}</strong>

            <span>{role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

/*
|--------------------------------------------------------------------------
| SIDEBAR SECTION
|--------------------------------------------------------------------------
*/

const SidebarSection = ({ title, children }) => {
  return (
    <div className="sidebar-section">
      <div className="sidebar-section-title">{title}</div>

      <div className="sidebar-section-items">{children}</div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| SIDEBAR ITEM
|--------------------------------------------------------------------------
*/

const SidebarItem = ({ icon, label, badge, active, onClick }) => {
  return (
    <button
      type="button"
      className={active ? "sidebar-item active" : "sidebar-item"}
      onClick={onClick}
    >
      <span className="sidebar-item-icon">{icon}</span>

      <span className="sidebar-item-label">{label}</span>

      {badge && <span className="sidebar-item-badge">{badge}</span>}
    </button>
  );
};

export default Sidebar;
