import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const user = await login(email, password);

      if (user.role !== "admin") {
        setError("Access denied. Admins only.");
        return;
      }

      navigate("/admin");
    } catch (err) {
      setError(err || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .admin-login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a1628 0%, #0d2145 40%, #0f2d5e 70%, #0a1e45 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Decorative background circles */
        .admin-login-page::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(29, 78, 216, 0.15) 0%, transparent 70%);
          top: -100px;
          right: -100px;
          pointer-events: none;
        }

        .admin-login-page::after {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          bottom: -80px;
          left: -80px;
          pointer-events: none;
        }

        .admin-login-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 48px 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.05);
          position: relative;
          z-index: 1;
          animation: slideUp 0.5s ease forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .admin-login-brand {
          text-align: center;
          margin-bottom: 32px;
        }

        .admin-login-brand .brand-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #0d2145, #1d4ed8);
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .admin-login-brand .brand-icon svg {
          width: 28px;
          height: 28px;
          fill: white;
        }

        .admin-login-brand h1 {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          color: #0a1628;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }

        .admin-login-brand p {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 300;
          letter-spacing: 0.3px;
        }

        .admin-login-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin-bottom: 28px;
        }

        .admin-input-group {
          margin-bottom: 18px;
        }

        .admin-input-group label {
          display: block;
          font-size: 0.78rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 7px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .admin-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .admin-input-wrapper svg {
          position: absolute;
          left: 14px;
          width: 17px;
          height: 17px;
          color: #9ca3af;
          pointer-events: none;
        }

        .admin-input-wrapper input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          color: #1f2937;
          background: #f9fafb;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .admin-input-wrapper input:focus {
          border-color: #1d4ed8;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.08);
        }

        .admin-input-wrapper input::placeholder {
          color: #d1d5db;
        }

        .toggle-pw-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #9ca3af;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .toggle-pw-btn:hover { color: #374151; }
        .toggle-pw-btn svg { width: 17px; height: 17px; }

        .admin-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-submit-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #0d2145, #1d4ed8);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 8px;
        }

        .admin-submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .admin-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-login-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 0.78rem;
          color: #9ca3af;
          letter-spacing: 0.2px;
        }
      `}</style>

      <div className="admin-login-page">
        <div className="admin-login-card">

          {/* Brand */}
          <div className="admin-login-brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <h1>KCEE Admin</h1>
            <p>Sign in to access your dashboard</p>
          </div>

          <div className="admin-login-divider" />

          {/* Error */}
          {error && (
            <div className="admin-error">
              <svg viewBox="0 0 20 20" fill="currentColor" style={{width:16,height:16,flexShrink:0}}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="admin-input-group">
              <label>Email Address</label>
              <div className="admin-input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="admin-input-group">
              <label>Password</label>
              <div className="admin-input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-pw-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="admin-login-footer">
            KCEE Collection Admin Portal &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </>
  );
}
