import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // <-- add this line

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      navigate("/inbox");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-root content-surface">
      <div className="login-card">
        <div className="login-logo" aria-hidden="true">
          <img
            src="/favicon.png"
            alt="Gmailish logo"
            width="80"
            height="80"
            className="login-logo-img"
          />
        </div>


        <h1 className="login-title">Sign in</h1>
        <p className="login-subtitle">to continue to Gmailish</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
              autoComplete="email"
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="field">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
              autoComplete="current-password"
            />
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className="field-end action-link"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>

          {error && <div className="login-error" role="alert">{error}</div>}

          <div className="login-actions">
            <button
              type="button"
              className="btn-text"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>

            <button className="btn-primary" type="submit">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
