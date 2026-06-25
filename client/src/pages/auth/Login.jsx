// src/pages/auth/Login.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../redux/features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import toast from "react-hot-toast";
import axios from "../../config/axios";
import { Eye, EyeOff, ArrowLeft, KeyRound } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ue-login-page {
    min-height: 100vh;
    background: #f0f4f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Roboto', sans-serif;
    padding: 16px;
  }

  /* ── Card ── */
  .ue-card {
    background: #ffffff;
    border: 1px solid #dadce0;
    border-radius: 28px;
    padding: 48px 40px 36px;
    width: 100%;
    max-width: 448px;
    box-shadow: none;
    transition: box-shadow 0.3s ease;
  }
  .ue-card:hover {
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  }

  /* ── Logo area ── */
  .ue-logo-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 8px;
  }
  .ue-logo-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    box-shadow: 0 4px 14px rgba(26,115,232,0.30);
    flex-shrink: 0;
  }
  .ue-brand-name {
    font-family: 'Google Sans', 'Roboto', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #202124;
    letter-spacing: -0.2px;
  }

  /* ── Title ── */
  .ue-title {
    font-family: 'Google Sans', 'Roboto', sans-serif;
    font-size: 24px;
    font-weight: 400;
    color: #202124;
    text-align: center;
    margin-bottom: 8px;
    letter-spacing: -0.2px;
  }
  .ue-subtitle {
    font-size: 14px;
    color: #5f6368;
    text-align: center;
    font-weight: 400;
    margin-bottom: 32px;
    line-height: 1.5;
  }

  /* ── Input ── */
  .ue-field {
    position: relative;
    margin-bottom: 24px;
  }
  .ue-input {
    width: 100%;
    height: 56px;
    padding: 0 52px 0 16px;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    font-weight: 400;
    color: #202124;
    background: #fff;
    border: 1.5px solid #dadce0;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    caret-color: #1a73e8;
  }
  .ue-input::placeholder {
    color: transparent;
  }
  .ue-input:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26,115,232,0.10);
  }
  .ue-input:focus + .ue-label,
  .ue-input:not(:placeholder-shown) + .ue-label {
    top: -9px;
    left: 12px;
    font-size: 11px;
    color: #5f6368;
    background: #fff;
    padding: 0 4px;
  }
  .ue-input:focus + .ue-label {
    color: #1a73e8;
  }
  .ue-label {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    color: #5f6368;
    pointer-events: none;
    transition: all 0.18s ease;
    background: transparent;
    font-weight: 400;
    line-height: 1;
  }
  .ue-eye-btn {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #5f6368;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
    transition: background 0.2s, color 0.2s;
  }
  .ue-eye-btn:hover {
    background: #f1f3f4;
    color: #202124;
  }

  /* ── Error box ── */
  .ue-error {
    background: #fce8e6;
    border: 1px solid #f5c6c2;
    border-radius: 4px;
    padding: 12px 16px;
    font-size: 13px;
    color: #c5221f;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    line-height: 1.4;
  }

  /* ── Links ── */
  .ue-link {
    color: #1a73e8;
    font-size: 14px;
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
    padding: 8px 12px;
    border-radius: 4px;
    transition: background 0.18s ease;
    text-decoration: none;
    display: inline-block;
  }
  .ue-link:hover {
    background: rgba(26,115,232,0.08);
  }

  /* ── Buttons ── */
  .ue-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
  }
  .ue-btn-primary {
    height: 40px;
    padding: 0 24px;
    background: #1a73e8;
    color: #fff;
    font-family: 'Google Sans', 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.18s ease, box-shadow 0.18s ease;
    box-shadow: 0 1px 2px rgba(0,0,0,0.10);
    letter-spacing: 0.15px;
    min-width: 80px;
  }
  .ue-btn-primary:hover {
    background: #1765cc;
    box-shadow: 0 2px 6px rgba(26,115,232,0.35);
  }
  .ue-btn-primary:active {
    background: #155ab5;
  }
  .ue-btn-primary:disabled {
    background: #1a73e8;
    opacity: 0.65;
    cursor: not-allowed;
  }

  .ue-btn-primary-full {
    width: 100%;
    height: 48px;
    background: #1a73e8;
    color: #fff;
    font-family: 'Google Sans', 'Roboto', sans-serif;
    font-size: 15px;
    font-weight: 500;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.18s ease, box-shadow 0.18s ease;
    box-shadow: 0 1px 2px rgba(0,0,0,0.10);
    letter-spacing: 0.15px;
    margin-top: 8px;
  }
  .ue-btn-primary-full:hover {
    background: #1765cc;
    box-shadow: 0 2px 8px rgba(26,115,232,0.35);
  }
  .ue-btn-primary-full:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  /* ── Divider ── */
  .ue-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0 24px;
  }
  .ue-divider-line {
    flex: 1;
    height: 1px;
    background: #e0e0e0;
  }
  .ue-divider-text {
    font-size: 12px;
    color: #5f6368;
    font-weight: 500;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* ── Social buttons ── */
  .ue-socials {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ue-social-btn {
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: #fff;
    border: 1px solid #dadce0;
    border-radius: 4px;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #3c4043;
    cursor: pointer;
    transition: background 0.18s ease, box-shadow 0.18s ease;
    text-align: center;
  }
  .ue-social-btn:hover {
    background: #f7f8f9;
    box-shadow: 0 1px 4px rgba(0,0,0,0.10);
  }
  .ue-social-btn:active {
    background: #f1f3f4;
  }

  /* ── Footer ── */
  .ue-footer {
    margin-top: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .ue-footer-link {
    font-size: 12px;
    color: #5f6368;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
    padding: 4px 8px;
    border-radius: 4px;
    text-decoration: none;
  }
  .ue-footer-link:hover { background: #f1f3f4; }
  .ue-footer-dot {
    font-size: 12px;
    color: #bdc1c6;
  }

  /* ── Reset view icon ── */
  .ue-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #1a73e8;
    padding: 6px 10px;
    border-radius: 4px;
    margin-bottom: 24px;
    transition: background 0.18s;
  }
  .ue-back-btn:hover { background: rgba(26,115,232,0.08); }

  /* ── Slide animation ── */
  @keyframes ue-slide-in {
    from { opacity: 0; transform: translateY(16px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .ue-animate {
    animation: ue-slide-in 0.35s cubic-bezier(0.2, 0, 0, 1) forwards;
  }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .ue-card {
      border: none;
      border-radius: 0;
      padding: 40px 24px 32px;
      box-shadow: none !important;
    }
    .ue-card:hover { box-shadow: none !important; }
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   UE LOGO SVG  (layers icon)
───────────────────────────────────────────────────────────────────────────── */
const UELogo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <path d="M16 4L4 10l12 6 12-6-12-6z" fill="rgba(255,255,255,0.95)" />
    <path d="M4 16l12 6 12-6" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M4 22l12 6 12-6" stroke="rgba(255,255,255,0.50)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const Login = () => {
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [view, setView]               = useState("login"); // "login" | "reset"
  const [showPassword, setShowPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  /* login */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginThunk({ email, password }));
      if (loginThunk.fulfilled.match(result)) {
        const role = result.payload.user.role;
        toast.success("Signed in successfully");
        if (role === "Admin")              navigate("/");
        else if (role === "FieldOfficer")  navigate("/field/dashboard");
        else if (role === "Coordinator")   navigate("/coordinator/dashboard");
        else if (role === "TechnicalManager") navigate("/tm/dashboard");
        else if (role === "RegionalManager")  navigate("/rtm/dashboard");
        else if (role === "Accountant")    navigate("/accountant/dashboard");
        else navigate("/");
      }
    } catch (_) {}
  };

  /* reset */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || !oldPassword || !newPassword) { toast.error("Fill all fields"); return; }
    setResetLoading(true);
    try {
      const res = await axios.post("/auth/reset-password", { email, oldPassword, newPassword });
      toast.success(res.data.message || "Password updated");
      setView("login");
      setPassword("");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setResetLoading(false);
    }
  };

  const switchView = (v) => {
    setShowPassword(false);
    setView(v);
    setOldPassword("");
  };

  return (
    <div className="ue-login-page">
      <style>{STYLES}</style>

      {/* ── CARD ── */}
      <div className="ue-card ue-animate" key={view}>

        {/* Logo */}
        <div className="ue-logo-wrap">
          <div className="ue-logo-icon">
            <UELogo />
          </div>
          <span className="ue-brand-name">Unique Engineering</span>
        </div>

        {/* ─── LOGIN VIEW ─── */}
        {view === "login" && (
          <>
            <h1 className="ue-title" style={{ marginTop: 24 }}>Sign in</h1>
            <p className="ue-subtitle">
              Use your Unique Engineering account
            </p>

            {/* Error */}
            {error && (
              <div className="ue-error">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#c5221f" style={{ flexShrink: 0 }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="ue-field">
                <input
                  id="ue-email"
                  type="email"
                  className="ue-input"
                  placeholder=" "
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                <label className="ue-label" htmlFor="ue-email">Email or phone</label>
              </div>

              {/* Password */}
              <div className="ue-field">
                <input
                  id="ue-password"
                  type={showPassword ? "text" : "password"}
                  className="ue-input"
                  placeholder=" "
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <label className="ue-label" htmlFor="ue-password">Enter your password</label>
                <button
                  type="button"
                  className="ue-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Forgot */}
              <div style={{ marginBottom: 8 }}>
                <button
                  type="button"
                  className="ue-link"
                  onClick={() => switchView("reset")}
                  style={{ padding: "8px 0" }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Actions */}
              <div className="ue-actions">
                <span style={{ fontSize: 13, color: "#5f6368", display: "none" }} />
                <button
                  type="submit"
                  className="ue-btn-primary"
                  disabled={loading}
                  style={{ marginLeft: "auto" }}
                >
                  {loading ? <Spin size="small" /> : "Sign in"}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="ue-divider">
              <div className="ue-divider-line" />
              <span className="ue-divider-text">or continue with</span>
              <div className="ue-divider-line" />
            </div>

            {/* Social */}
            <div className="ue-socials">
              <button type="button" className="ue-social-btn">
                {/* Google */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <button type="button" className="ue-social-btn">
                {/* Microsoft */}
                <svg width="18" height="18" viewBox="0 0 23 23">
                  <rect x="1"  y="1"  width="10" height="10" fill="#f25022"/>
                  <rect x="12" y="1"  width="10" height="10" fill="#7fba00"/>
                  <rect x="1"  y="12" width="10" height="10" fill="#00a4ef"/>
                  <rect x="12" y="12" width="10" height="10" fill="#ffb900"/>
                </svg>
                Continue with Microsoft
              </button>
            </div>
          </>
        )}

        {/* ─── RESET VIEW ─── */}
        {view === "reset" && (
          <>
            <div style={{ marginTop: 20 }}>
              <button className="ue-back-btn" type="button" onClick={() => switchView("login")}>
                <ArrowLeft size={16} />
                Back to sign in
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "#fef3c7",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <KeyRound size={22} color="#d97706" />
              </div>
              <div>
                <h1 className="ue-title" style={{ textAlign: "left", margin: 0, fontSize: 20 }}>
                  Reset password
                </h1>
                <p style={{ fontSize: 13, color: "#5f6368", marginTop: 2 }}>
                  Enter your email and new password
                </p>
              </div>
            </div>

            <form onSubmit={handleResetPassword}>
              {/* Email */}
              <div className="ue-field">
                <input
                  id="reset-email"
                  type="email"
                  className="ue-input"
                  placeholder=" "
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                <label className="ue-label" htmlFor="reset-email">Email address</label>
              </div>

              {/* Old Password */}
              <div className="ue-field">
                <input
                  id="reset-old-password"
                  type={showPassword ? "text" : "password"}
                  className="ue-input"
                  placeholder=" "
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  required
                />
                <label className="ue-label" htmlFor="reset-old-password">Old password</label>
                <button
                  type="button"
                  className="ue-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* New Password */}
              <div className="ue-field">
                <input
                  id="reset-new-password"
                  type={showPassword ? "text" : "password"}
                  className="ue-input"
                  placeholder=" "
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
                <label className="ue-label" htmlFor="reset-new-password">New password</label>
                <button
                  type="button"
                  className="ue-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password hint */}
              <p style={{ fontSize: 12, color: "#5f6368", marginBottom: 20, lineHeight: 1.5 }}>
                Use 8 or more characters with a mix of letters, numbers &amp; symbols.
              </p>

              <div className="ue-actions">
                <button
                  type="button"
                  className="ue-link"
                  onClick={() => switchView("login")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ue-btn-primary"
                  disabled={resetLoading}
                >
                  {resetLoading ? <Spin size="small" /> : "Update password"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* ── PAGE FOOTER ── */}
      <div className="ue-footer" style={{ marginTop: 16 }}>
        <a href="#" className="ue-footer-link">Privacy Policy</a>
        <span className="ue-footer-dot">·</span>
        <a href="#" className="ue-footer-link">Terms of Service</a>
        <span className="ue-footer-dot">·</span>
        <a href="#" className="ue-footer-link">Help</a>
      </div>
    </div>
  );
};

export default Login;
