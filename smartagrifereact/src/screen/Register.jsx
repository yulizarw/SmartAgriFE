import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import { registerUser } from "../store/action/userAction";

import "../asset/auth.css";

import logoUPN from "../asset/LOGO_UPNVJ.png";
import logoKemdikti from "../asset/kemdiktii.png";
import logoTutwuri from "../asset/tutwuri.png";
import logoCiasem from "../asset/smkciasem.png";
import logoApp from "../asset/smartAgri1.png";

// ============================================================
// REGISTER PAGE
// ============================================================

export function Register() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  // ==========================================================
  // PASSWORD STATE
  // ==========================================================

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ==========================================================
  // UI STATE
  // ==========================================================

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // ==========================================================
  // HANDLE CHANGE
  // ==========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  // ==========================================================
  // HANDLE SUBMIT
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ========================================================
    // VALIDASI FULL NAME
    // ========================================================

    if (!formData.fullName.trim()) {
      setError("Nama lengkap wajib diisi.");

      return;
    }

    // ========================================================
    // VALIDASI EMAIL
    // ========================================================

    if (!formData.email.trim()) {
      setError("Email wajib diisi.");

      return;
    }

    // ========================================================
    // VALIDASI PASSWORD
    // ========================================================

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter.");

      return;
    }

    // ========================================================
    // VALIDASI CONFIRM PASSWORD
    // ========================================================

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");

      return;
    }

    // ========================================================
    // REGISTER
    // ========================================================

    try {
      setLoading(true);

      const result = await dispatch(
        registerUser({
          fullName: formData.fullName.trim(),

          email: formData.email.trim().toLowerCase(),

          phone: formData.phone.trim(),

          address: formData.address.trim(),

          password: formData.password,
        }),
      );

      console.log("REGISTER RESULT:", result);

      // ======================================================
      // SUCCESS
      // ======================================================

      setSuccess(result?.message || "Registrasi berhasil. Silakan login.");

      // ======================================================
      // RESET FORM
      // ======================================================

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
      });

      // ======================================================
      // REDIRECT LOGIN
      // ======================================================

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Terjadi kesalahan saat registrasi.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="auth-page">
      {/* ==================================================== */}
      {/* LEFT SIDE                                           */}
      {/* ==================================================== */}

      <div className="auth-visual">
        <div className="auth-overlay"></div>

        <div className="auth-visual-content">
          {/* ================================================== */}
          {/* BRAND                                             */}
          {/* ================================================== */}

          <div className="brand-center-header">
            <img
              src={logoApp}
              className="main-app-logo-large"
              alt="Logo SmartAgri"
            />

            <h1>
              Smart
              <span>Agri</span>
            </h1>

            <p>Smart Agriculture Monitoring & Decision Support System</p>
          </div>

          <p>Sistem Pintar Pengelolaan Lahan Agrikultur</p>

          {/* ================================================== */}
          {/* HIGHLIGHT                                         */}
          {/* ================================================== */}

          <div className="register-highlight">
            <div className="highlight-icon">🌾</div>

            <h3>Kelola Lahan Anda dengan mudah</h3>

            <p>
              Pantau kondisi tanaman, sensor IoT, cuaca, hingga sistem irigasi
              dalam satu platform.
            </p>
          </div>

          {/* ================================================== */}
          {/* LOGO INSTITUSI                                    */}
          {/* ================================================== */}

          <hr className="logo-divider" />

          <div className="brand-logo-container">
            <div className="brand-logo1">
              <img
                src={logoTutwuri}
                className="logo-small"
                alt="Tut Wuri Handayani"
              />
            </div>

            <div className="brand-logo1">
              <img src={logoCiasem} className="logo-ciasem" alt="SMK Ciasem" />
            </div>

            <div className="brand-logo1">
              <img
                src={logoUPN}
                className="logo-round"
                alt="UPN Veteran Jakarta"
              />
            </div>

            <div className="brand-logo1">
              <img src={logoKemdikti} className="logo-wide" alt="Kemdikti" />
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* RIGHT SIDE                                          */}
      {/* ==================================================== */}

      <div className="auth-form-wrapper">
        <div className="auth-form-container register-container">
          {/* ================================================== */}
          {/* MOBILE BRAND                                      */}
          {/* ================================================== */}

          <div className="mobile-brand">
            <div className="mobile-logo">🌱</div>

            <h2>
              Smart
              <span>Agri</span>
            </h2>
          </div>

          {/* ================================================== */}
          {/* HEADER                                            */}
          {/* ================================================== */}

          <div className="auth-header">
            <span className="welcome-text">Get started</span>

            <h2>Buat Akun Anda</h2>

            <p>Daftarkan akun untuk mulai mengelola smart farm kamu.</p>
          </div>

          {/* ================================================== */}
          {/* ERROR                                             */}
          {/* ================================================== */}

          {error && (
            <div className="auth-error">
              <span>⚠️</span>

              {error}
            </div>
          )}

          {/* ================================================== */}
          {/* SUCCESS                                           */}
          {/* ================================================== */}

          {success && (
            <div className="auth-success">
              <span>✓</span>

              {success}
            </div>
          )}

          {/* ================================================== */}
          {/* FORM                                              */}
          {/* ================================================== */}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* ================================================= */}
            {/* FULL NAME                                         */}
            {/* ================================================= */}

            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>

              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Nama Lengkap Anda"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            {/* ================================================= */}
            {/* EMAIL                                             */}
            {/* ================================================= */}

            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            {/* ================================================= */}
            {/* PHONE                                             */}
            {/* ================================================= */}

            <div className="form-group">
              <label htmlFor="phone">Nomor Telepon</label>

              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="08xxxxxxxxxx"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>

            {/* ================================================= */}
            {/* ADDRESS                                           */}
            {/* ================================================= */}

            <div className="form-group">
              <label htmlFor="address">Alamat</label>

              <textarea
                id="address"
                name="address"
                placeholder="Alamat lengkap"
                value={formData.address}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* ================================================= */}
            {/* PASSWORD                                          */}
            {/* ================================================= */}

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Minimum 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* ================================================= */}
            {/* CONFIRM PASSWORD                                  */}
            {/* ================================================= */}

            <div className="form-group">
              <label htmlFor="confirmPassword">Konfirmasi Password</label>

              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Ulangi password anda"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Sembunyikan konfirmasi password"
                      : "Tampilkan konfirmasi password"
                  }
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* ================================================= */}
            {/* SUBMIT BUTTON                                     */}
            {/* ================================================= */}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Creating account..." : "Buat Akun"}
            </button>
          </form>

          {/* ================================================== */}
          {/* LOGIN LINK                                        */}
          {/* ================================================== */}

          <div className="auth-switch">
            <span>Sudah punya akun?</span>

            <Link to="/">Sign in</Link>
          </div>

          {/* ================================================== */}
          {/* FOOTER                                            */}
          {/* ================================================== */}

          <div className="auth-footer">
            © 2026 SmartAgri : Universitas Pembangunan Nasional Veteran Jakarta
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
