import React, { useState } from "react";
import "./AuthModal.css";
import api from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState("signup"); // signup -> otp -> login
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [tempPhone, setTempPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  // ================= GOOGLE LOGIN =================
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setMessage("Fetching Google Account...");

        // Get user details from google
        const googleUser = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        console.log("Google User:", googleUser.data);

        const email = googleUser.data.email;
        const name = googleUser.data.name;

        setMessage("Logging in with Google...");

        // Send to backend (you must create API for this)
        const res = await api.post("/auth/google-login", {
          email: email,
          name: name,
        });

        if (res.data.success) {
          localStorage.setItem("hlopgToken", res.data.data.token);
          localStorage.setItem("hlopgUser", JSON.stringify(res.data.data.user));

          setMessage("✅ Google Login Success!");

          setTimeout(() => {
            onSuccess();
            onClose();
          }, 1000);
        } else {
          setMessage(res.data.message || "Google login failed");
        }
      } catch (err) {
        console.error("Google login error:", err);
        setMessage("Google login failed");
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      setMessage("Google login cancelled");
    },
  });

  // ================= SIGNUP SUBMIT =================
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        setMessage("❌ Passwords do not match");
        setLoading(false);
        return;
      }

      const res = await api.post("/auth/register/user", formData);

      if (res.data.success) {
        setTempPhone(formData.phone);
        setStep("otp");
        setMessage("✅ OTP sent to your phone!");
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup Error");
    } finally {
      setLoading(false);
    }
  };

  // ================= OTP VERIFY =================
  const verifyOTP = async () => {
    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 4) {
      setMessage("Enter 4-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", {
        identifier: tempPhone,
        otpCode: enteredOTP,
        purpose: "REGISTRATION",
      });

      if (res.data.success) {
        setStep("login");
        setMessage("✅ Registration complete. Please login.");

        setOtp(["", "", "", ""]);
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setMessage(res.data.message || "OTP failed");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN SUBMIT =================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login/user", loginData);

      if (res.data.success) {
        localStorage.setItem("hlopgToken", res.data.data.token);
        localStorage.setItem("hlopgUser", JSON.stringify(res.data.data.user));

        setMessage("✅ Login successful!");

        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Logo */}
        <div className="auth-logo">
          <img src="/logo.png" alt="Logo" />
        </div>

        {/* Message */}
        {message && <div className="auth-message">{message}</div>}

        {/* ================= SIGNUP ================= */}
        {step === "signup" && (
          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <h2>Signup</h2>

            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <input
              type="text"
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />

            <input
              type="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <div className="auth-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <span
                className="auth-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>

            <div className="auth-password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
              <span
                className="auth-eye"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <FaEye size={20} />
                )}
              </span>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Signing up..." : "Verify"}
            </button>

            <div className="auth-switch">
              Do you have an Account?{" "}
              <span onClick={() => setStep("login")}>Login</span>
            </div>

            <div className="auth-or">Or</div>

            <button
              type="button"
              className="auth-google-btn"
              onClick={() => googleLogin()}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Sign in with Google"}
            </button>
          </form>
        )}

        {/* ================= OTP ================= */}
        {step === "otp" && (
          <div className="auth-otp-section">
            <h2>Verify OTP</h2>
            <p>Enter OTP sent to {tempPhone}</p>

            <div className="auth-otp-inputs">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength="1"
                  value={otp[idx]}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, "");
                    const newOtp = [...otp];
                    newOtp[idx] = val[0] || "";
                    setOtp(newOtp);

                    if (val && idx < 3) {
                      document.getElementById(`otp-${idx + 1}`)?.focus();
                    }
                  }}
                />
              ))}
            </div>

            <button onClick={verifyOTP} className="auth-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        )}

        {/* ================= LOGIN ================= */}
        {step === "login" && (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <h2>Login</h2>

            <input
              type="text"
              placeholder="Email / Phone Number"
              value={loginData.identifier}
              onChange={(e) =>
                setLoginData({ ...loginData, identifier: e.target.value })
              }
              required
            />

            <div className="auth-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
              <span
                className="auth-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="auth-switch">
              New User <span onClick={() => setStep("signup")}>Signup</span>
            </div>

            <div className="auth-or">Or</div>

            <button
              type="button"
              className="auth-google-btn"
              onClick={() => googleLogin()}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Sign in with Google"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
