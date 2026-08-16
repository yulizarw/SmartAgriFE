import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../asset/auth.css";
import logoUPN from "../asset/LOGO_UPNVJ.png";
import logoKemdikti from "../asset/kemdiktii.png"
import logoTutwuri from "../asset/tutwuri.png"
import logoCiasem from "../asset/smkciasem.png"
import logoApp from "../asset/smartAgri1.png"

// action
import { fetchLogin } from "../store/action/userAction";
import { useDispatch } from "react-redux";

export function Login(props) {
    const { loginFunction } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

  
    const handleSubmit = async (e) => {
      e.preventDefault();

      setError("");
      setLoading(true);

      const result = await dispatch(fetchLogin(formData));

      if (result.success) {
        loginFunction();
        navigate("/home");
      } else {
        setError(result.message);
      }

      setLoading(false);
    };

    return (
        <div className="auth-page">

            {/* =========================================
                LEFT SIDE
            ========================================= */}

            <div className="auth-visual">

                <div className="auth-overlay"></div>

                <div className="auth-visual-content">

                    {/* <div className="brand-logo">
                        <img src={logoApp.src} className="logo-wide"></img>

                    </div>


                    <h1>
                        Smart<span>Agri</span>
                    </h1> */}
                    <div className="brand-center-header">

                        {/* Logo ditaruh di atas, bersih tanpa kotak glassmorphism */}
                        <img src={logoApp} className="main-app-logo-large" alt="Logo SmartAgri" />

                        <h1>
                            Smart<span>Agri</span>
                        </h1>

                        {/* <p>
                            Smart Agriculture Monitoring & Decision Support System
                        </p> */}

                    </div>

                    <p>
                        Smart Agriculture Monitoring
                        & Decision Support System
                    </p>

                    <div className="feature-list">

                        <div className="feature-item">
                            <span>🌱</span>
                            <div>
                                <strong>
                                    Crop Health Monitoring
                                </strong>
                                <small>
                                    Monitor kesehatan tanaman
                                    secara real-time.
                                </small>
                            </div>
                        </div>

                        <div className="feature-item">
                            <span>📡</span>
                            <div>
                                <strong>
                                    IoT Sensor Integration
                                </strong>
                                <small>
                                    Terhubung dengan sensor
                                    dan ESP32.
                                </small>
                            </div>
                        </div>

                        <div className="feature-item">
                            <span>💧</span>
                            <div>
                                <strong>
                                    Smart Irrigation
                                </strong>
                                <small>
                                    Kendalikan relay dan
                                    sistem penyiraman otomatis.
                                </small>
                            </div>
                        </div>

                    </div>
                    <hr className="logo-divider" />
                    <div className="brand-logo-container">
                        <div className="brand-logo1">
                            <img src={logoTutwuri} className="logo-small"></img>
                        </div>
                        <div className="brand-logo1">
                            <img src={logoCiasem} className="logo-ciasem"></img>
                        </div>

                        <div className="brand-logo1">
                            <img src={logoUPN} className="logo-round"></img>
                        </div>

                        <div className="brand-logo1">
                            <img src={logoKemdikti} className="logo-wide"></img>
                        </div>

                    </div>
                </div>

            </div>


            {/* =========================================
                RIGHT SIDE
            ========================================= */}

            <div className="auth-form-wrapper">

                <div className="auth-form-container">

                    <div className="mobile-brand">
                        <div className="mobile-logo">
                            🌱
                        </div>

                        <h2>
                            Smart<span>Agri</span>
                        </h2>
                    </div>


                    <div className="auth-header">

                        <span className="welcome-text">
                            SELAMAT DATANG
                        </span>

                        <h2>
                            Masukkan detil akun anda
                        </h2>

                        <p>
                            Monitor Lahan Anda dan
                            kelola ekosistem agrikultur anda
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="auth-error">
                            <span>⚠️</span>
                            {error}
                        </div>
                    )}


                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="auth-form"
                    >

                        {/* EMAIL */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <div className="password-label">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <a
                                    href="#forgot"
                                    className="forgot-password"
                                    onClick={(e) =>
                                        e.preventDefault()
                                    }
                                >
                                    Lupa password?
                                </a>

                            </div>

                            <div className="password-wrapper">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    id="password"
                                    name="password"
                                    placeholder="Masukkan password Anda"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "🙈"
                                        : "👁️"}
                                </button>

                            </div>

                        </div>


                        {/* REMEMBER */}

                        <div className="remember-row">

                            <label className="remember-check">

                                <input
                                    type="checkbox"
                                    id="remember"
                                />

                                <span>
                                    Ingat Saya
                                </span>

                            </label>

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Signing in..."
                                : "Masuk"}

                        </button>

                    </form>


                    {/* REGISTER */}

                    <div className="auth-switch">

                        <span>
                            Belum ada akun?
                        </span>

                        <Link to="/register">
                            Buat Akun
                        </Link>

                    </div>


                    <div className="auth-footer">
                        © 2026 SmartAgri : Universitas Pembangunan Nasional Veteran Jakarta
                    </div>

                </div>

            </div>

        </div>

    );
};

