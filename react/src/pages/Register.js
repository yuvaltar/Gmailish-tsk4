import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // reuse the same styles

const initialState = {
  firstName: "",
  lastName: "",
  username: "",
  gender: "",
  password: "",
  confirm: "",
  birthdate: "",
  picture: null,
};

const genders = ["Male", "Female", "Other"];

const Register = () => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture") {
      const file = files && files[0];
      setForm({ ...form, picture: file || null });
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const isStrongPassword = (password) => {
    const errors = [];
    if (password.length < 8 || password.length > 100) errors.push("Between 8 to 100 characters");
    if (!/[a-z]/.test(password)) errors.push("1 lowercase");
    if (!/[A-Z]/.test(password)) errors.push("1 uppercase");
    if (!/\d/.test(password)) errors.push("1 digit");
    if (!/[!@#$%^&*()_\-+=[\]{};':\"\\|,.<>/?]/.test(password)) errors.push("1 special character");
    return errors.length === 0 ? null : `Password must include: ${errors.join(", ")}`;
  };

  const validUsername = (username) => {
    const errors = [];
    if (/^[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]/.test(username)) errors.push("Not begin with a special character");
    if (username.length < 6 || username.length > 30) errors.push("Be between 6 to 30 characters");
    return errors.length === 0 ? null : `Username must : ${errors.join(", ")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];

    if (form.password !== form.confirm) errors.push("Passwords do not match");
    const passwordError = isStrongPassword(form.password);
    if (passwordError) errors.push(passwordError);
    const userError = validUsername(form.username);
    if (userError) errors.push(userError);

    if (!form.firstName || !form.lastName || !form.username || !form.gender || !form.birthdate || !form.picture) {
      errors.push("Please fill in all fields and upload a picture.");
    }

    const selectedDate = new Date(form.birthdate);
    const today = new Date();
    if (selectedDate > today) {
      errors.push("Birthdate cannot be in the future.");
    }


    if (errors.length > 0) {
      setError(errors);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k !== "confirm") formData.append(k, v);
    });

    try {
      const res = await fetch("/api/users", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      alert(`Registration successful! Your email is: ${data.email}`);
      navigate("/login");
    } catch (err) {
      setError([err.message]);
    }
  };

  return (
    <div className="login-root content-surface">
      <div className="login-card">
        <div className="login-logo" aria-hidden="true">
          <img src="/favicon.png" alt="Gmailish logo" width="48" height="48" className="login-logo-img" />
        </div>

        <h1 className="login-title">Create your account</h1>
        <p className="login-subtitle">for Gmailish</p>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="login-form">
          {/* Names in two columns (responsive) */}
          <div className="two-col">
            <div className="field">
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder=" "
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <label htmlFor="firstName">First name</label>
            </div>

            <div className="field">
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder=" "
                value={form.lastName}
                onChange={handleChange}
                required
              />
              <label htmlFor="lastName">Last name</label>
            </div>
          </div>

          <div className="field">
            <input
              id="username"
              name="username"
              type="text"
              placeholder=" "
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
            <label htmlFor="username">Username</label>
          </div>

          {/* Static-label blocks for select and date (floats don't work well here) */}
          <div className="field-static">
            <label className="static-label" htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              className="select-control"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              {genders.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="field-static">
            <label className="static-label" htmlFor="birthdate">Birthdate</label>
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              className="select-control"
              value={form.birthdate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="field">
            <input
              id="password"
              name="password"
              type={showPw ? "text" : "password"}
              placeholder=" "
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className="field-end action-link"
              onClick={() => setShowPw((s) => !s)}
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>

          <div className="field">
            <input
              id="confirm"
              name="confirm"
              type={showConfirm ? "text" : "password"}
              placeholder=" "
              value={form.confirm}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <label htmlFor="confirm">Confirm password</label>
            <button
              type="button"
              className="field-end action-link"
              onClick={() => setShowConfirm((s) => !s)}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>

          {/* Avatar upload */}
          <div className="avatar-row">
            <div className="avatar">
              {preview ? (
                <img src={preview} alt="Preview" />
              ) : (
                <div className="avatar-placeholder" aria-hidden="true">👤</div>
              )}
            </div>

            <div className="avatar-actions">
              <label htmlFor="picture" className="btn-text">Upload Profile Picture</label>
              <input
                id="picture"
                type="file"
                name="picture"
                accept="image/*"
                onChange={handleChange}
                className="file-input"
                required
              />
            </div>
          </div>

          {error && Array.isArray(error) && (
            <div className="login-error" role="alert">
              <ul className="mb-0">
                {error.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </div>
          )}

          {/* Actions row: left link + right primary (with the same 6px right margin rule you set) */}
          <div className="login-actions">
            <button type="button" className="btn-text" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="btn-primary" type="submit">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
