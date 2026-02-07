

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";



const CommonLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    localStorage.clear();

    try {
      // ✅ OWNER FIRST
      const ownerRes = await api.post("/auth/login/owner", formData);
      if (ownerRes.data?.success) {
        const { token, owner } = ownerRes.data.data;
        localStorage.setItem("hlopgToken", token);
        localStorage.setItem("hlopgRole", "OWNER");
        localStorage.setItem("hlopgOwner", JSON.stringify(owner));
        navigate("/owner-dashboard");
        return;
      }
    } catch {}

    try {
      // ✅ USER
      const userRes = await api.post("/auth/login/user", formData);
      if (userRes.data?.success) {
        const { token, user } = userRes.data.data;
        localStorage.setItem("hlopgToken", token);
        localStorage.setItem("hlopgRole", "USER");
        localStorage.setItem("hlopgUser", JSON.stringify(user));
        navigate("/");
        return;
      }
    } catch {
      setError("Invalid email / phone or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔹 INTERNAL CSS */}
      <style>
        {`
          body {
            background: linear-gradient(135deg, #f3f4ff, #eef2ff);
          }

          .login-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            
          }

          .login-card {
            background: #fff;
            width: 100%;
            max-width: 400px;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.12);
            animation: fadeIn 0.4s ease;
            border:1px solid rgba(0, 0, 0, 0.16);
            
          }
           .login-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
}

.login-logo img {
  width: 90px;
  height: auto;
  object-fit: contain;
}

          .login-card h1 {
            text-align: center;
            margin-bottom: 22px;
            font-size: 26px;
            color: #222;
          }

          .login-card input {
            width: 95%;
            padding: 13px 15px;
            margin-bottom: 14px;
            border-radius: 8px;
            border: 1px solid #0e0c0c23;
            font-size: 14px;
          }

          .login-card input:focus {
            outline: none;
            border-color: #7556ff;
          }

          .forgot-password {
            text-align: right;
            margin-bottom: 18px;
          }

          .forgot-password a {
            font-size: 13px;
            color: #7556ff;
            text-decoration: none;
            font-weight: 500;
          }

          .forgot-password a:hover {
            text-decoration: underline;
          }

          .login-card button {
            width: 100%;
            padding: 13px;
            background: #7556ff;
            color: #fff;
            font-size: 15px;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }

          .login-card button:hover {
            background: #5f3fff;
          }

          .login-card button:disabled {
            background: #aaa;
            cursor: not-allowed;
          }

          .error-text {
            margin-top: 14px;
            text-align: center;
            color: #e63946;
            font-size: 14px;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
            @media (max-width: 768px) {

  .login-card {
    padding: 26px 22px;
    border-radius: 14px;
    margin-top: 40px;
  }

  .login-logo img {
    width: 75px;
  }

  .login-card h1 {
    font-size: 22px;
    margin-bottom: 18px;
  }

  .login-card input {
    padding: 12px 1opx;
    font-size: 14px;
    
    
  }

  .login-card button {
    padding: 12px;
    font-size: 14.5px;
  }
}
  .password-field {
  position: relative;
}

.password-field input {
  width: 88%;
  padding-right: 42px; /* space for eye icon */
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 40%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
  font-size: 16px;
}

.toggle-password:hover {
  color: #7556ff;
}

/* Mobile fine-tune */
@media (max-width: 768px) {
  .toggle-password {
    right: 1px;
    font-size: 15px;
  }
}

        `}
        
      </style>

      


      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-logo">
  <img src="/logo.png" alt="App Logo" />
</div>
          <h1>Login</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="identifier"
              placeholder="Email or Phone"
              value={formData.identifier}
              onChange={handleChange}
              required
            />

            <div className="password-field">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    required
  />

  <span
    className="toggle-password"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>


            <div className="forgot-password">
              <a onClick={() => navigate("/forgot-password")}>
                Forgot password?
              </a>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && <div className="error-text">{error}</div>}
        </div>
      </div>
    </>
  );
};

export default CommonLogin;
