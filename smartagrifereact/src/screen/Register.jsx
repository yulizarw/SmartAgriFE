import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../asset/auth.css";
import logoUPN from "../asset/LOGO_UPNVJ.png";
import logoKemdikti from "../asset/kemdiktii.png"
import logoTutwuri from "../asset/tutwuri.png"
import logoCiasem from "../asset/smkciasem.png"
import logoApp from "../asset/smartAgri1.png"

export function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const handleChange = (e) => {

        const { name, value } =
            e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError(
                "Password dan konfirmasi password tidak sama."
            );

            return;
        }


        if (
            formData.password.length < 6
        ) {

            setError(
                "Password minimal 6 karakter."
            );

            return;
        }


        setLoading(true);


        try {

            /*
             * Nanti sesuaikan dengan endpoint
             * backend kamu.
             */

            const response =
                await fetch(
                    "http://localhost:3001/user/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            name:
                                formData.name,

                            email:
                                formData.email,

                            password:
                                formData.password,
                        }),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Registrasi gagal."
                );

            }


            setSuccess(
                "Registrasi berhasil. Silakan login."
            );


            setTimeout(() => {

                navigate("/login");

            }, 1500);


        } catch (err) {

            setError(
                err.message ||
                "Terjadi kesalahan saat registrasi."
            );

        } finally {

            setLoading(false);

        }

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
                        🌱
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

                        <p>
                            Smart Agriculture Monitoring & Decision Support System
                        </p>

                    </div>

                    <p>
                        Sistem Pintar
                        Pengelolaan Lahan Agrikultur
                    </p>


                    <div className="register-highlight">

                        <div className="highlight-icon">
                            🌾
                        </div>

                        <h3>
                            Kelola Lahan Anda dengan mudah
                        </h3>

                        <p>
                            Pantau kondisi tanaman,
                            sensor IoT, cuaca,
                            hingga sistem irigasi
                            dalam satu platform.
                        </p>


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

                <div className="auth-form-container register-container">


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
                            Get started
                        </span>

                        <h2>
                            Buat Akun Anda
                        </h2>

                        <p>
                            Daftarkan akun untuk mulai
                            mengelola smart farm kamu.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="auth-error">

                            <span>⚠️</span>

                            {error}

                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div className="auth-success">

                            <span>✓</span>

                            {success}

                        </div>

                    )}


                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="auth-form"
                    >


                        {/* NAME */}

                        <div className="form-group">

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Nama Lengkap Anda"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


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
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="password-wrapper">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    id="password"
                                    name="password"
                                    placeholder="Minimum 6 karakter"
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


                        {/* CONFIRM PASSWORD */}

                        <div className="form-group">

                            <label htmlFor="confirmPassword">
                                Konfirmasi Password
                            </label>

                            <div className="password-wrapper">

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Ulangi password anda"
                                    value={
                                        formData.confirmPassword
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
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword
                                        ? "🙈"
                                        : "👁️"}
                                </button>

                            </div>

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating account..."
                                : "Buat Akun"}

                        </button>

                    </form>


                    {/* LOGIN */}

                    <div className="auth-switch">

                        <span>
                            Sudah punya akun?
                        </span>

                        <Link to="/">
                            Sign in
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
