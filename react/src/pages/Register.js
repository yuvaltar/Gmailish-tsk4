import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture") {
      setForm({ ...form, picture: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!form.firstName || !form.lastName || !form.username || !form.gender || !form.birthdate || !form.picture) {
      setError("Please fill in all fields and upload a picture.");
      return;
    }

    const res = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        gender: form.gender,
        password: form.password,
        birthdate: form.birthdate
      }),
    });

    if (res.ok) {
      const user = await res.json();
      // user.id is the unique id
      localStorage.setItem("userId", user.id);
      // Optionally, store other user fields as needed
      // localStorage.setItem("username", user.username);
      // localStorage.setItem("profileImage", ...);
      window.location.href = "/inbox";
      navigate('/login');
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register for Gmailish</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="form-control mb-2"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="form-control mb-2"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="form-control mb-2"
          value={form.username}
          onChange={handleChange}
          required
        />
        <select
          name="gender"
          className="form-control mb-2"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          {genders.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <input
          type="date"
          name="birthdate"
          className="form-control mb-2"
          value={form.birthdate}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-2"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirm"
          placeholder="Confirm Password"
          className="form-control mb-2"
          value={form.confirm}
          onChange={handleChange}
          required
        />
        <label className="form-label">Profile Picture</label>
        <input
          type="file"
          name="picture"
          accept="image/*"
          className="form-control mb-2"
          onChange={handleChange}
          required
        />
        {preview && (
          <div className="mb-2">
            <img src={preview} alt="Preview" style={{ width: 80, height: 80, borderRadius: "50%" }} />
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        <button className="btn btn-success w-100" type="submit">Register</button>
      </form>
      <button className="btn btn-link mt-2" onClick={() => navigate("/")}>
        Already have an account? Login
      </button>
    </div>
  );
};

export default Register;
