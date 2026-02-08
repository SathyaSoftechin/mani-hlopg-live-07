import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import IntroVideo from "./components/IntroVideo";
import LoadingVideo from "./components/LoadingVideo";

// Pages
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import HostelPage from "./pages/HostelPage";
import RoleSelection from "./components/RoleSelection";
import StudentLogin from "./components/StudentLogin";
import StudentSignup from "./components/StudentSignup";
import StudentForgetPassword from "./components/StudentForgetPassword";
import OwnerLogin from "./components/OwnerLogin";
import OwnerSignup from "./components/OwnerSignup";
import OwnerForgetPassword from "./components/OwnerForgetPassword";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import UploadPG from "./pages/UploadPG";
import MyPGs from "./pages/MyPGs";
import EditPG from "./pages/EditPG";
import PGMembers from "./pages/PGMembersList";
import CityHostels from "./pages/cities/CityHostels";
import UserProfile from "./pages/UserPanel";
import Contact from "./pages/Contact";
import ProfilePage from "./pages/ProfilePage";
import CommonLogin from "./pages/CommonLogin";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("hlopgToken");
      const role = localStorage.getItem("hlopgRole");

      const ownerLoggedIn = !!(token && role === "OWNER");
      setIsOwnerLoggedIn(ownerLoggedIn);

      console.log("🔍 Login check:", {
        token: token ? "Yes" : "No",
        role,
        isOwner: ownerLoggedIn,
        currentPath: location.pathname,
      });

      // Redirect owner to dashboard if tries to open homepage
      if (ownerLoggedIn && location.pathname === "/") {
        console.log("🚀 Owner logged in - redirecting to dashboard");
        navigate("/owner-dashboard", { replace: true });
      }
    };

    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location.pathname, navigate]);

  // Intro video skip if owner logged in
  const [showIntro, setShowIntro] = useState(() => {
    const token = localStorage.getItem("hlopgToken");
    const role = localStorage.getItem("hlopgRole");

    if (token && role === "OWNER") {
      return false;
    }

    const seen = localStorage.getItem("seenIntro");
    return !seen;
  });

  useEffect(() => {
    if (showIntro === false) {
      localStorage.setItem("seenIntro", "true");
    }
  }, [showIntro]);

  // Loading video skip if owner logged in
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOwnerLoggedIn) {
      return;
    }

    const path = location.pathname;

    if (path === "/" && !showIntro) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 5000);
      return () => clearTimeout(timer);
    }

    if (path.startsWith("/hostel/")) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }

    if (path.startsWith("/city/")) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, showIntro, isOwnerLoggedIn]);

  // Global loader functions
  useEffect(() => {
    window.showServerLoader = () => setLoading(true);
    window.hideServerLoader = () => setLoading(false);
  }, []);

  const hideHeaderFooter =
    location.pathname.startsWith("/owner-dashboard") ||
    location.pathname.startsWith("/view") ||
    location.pathname === "/owner-profile";

  return (
    <div className="app-container">
      {/* INTRO VIDEO */}
      {showIntro && !isOwnerLoggedIn && (
        <IntroVideo onFinish={() => setShowIntro(false)} />
      )}

      {/* LOADING VIDEO */}
      {!showIntro && loading && !isOwnerLoggedIn && <LoadingVideo />}

      {/* HEADER */}
      {!hideHeaderFooter && !showIntro && !loading && <Header />}

      <main className="content">
        {!showIntro && (
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Public Pages */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/hostel/:hostelId" element={<HostelPage />} />
            <Route path="/RoleSelection" element={<RoleSelection />} />
            <Route path="/city/:cityName" element={<CityHostels />} />

            {/* Student */}
            <Route path="/StudentLogin" element={<StudentLogin />} />
            <Route path="/student-signup" element={<StudentSignup />} />
            <Route
              path="/student-forgot-password"
              element={<StudentForgetPassword />}
            />

            {/* Owner */}
            <Route path="/ownerLogin" element={<OwnerLogin />} />
            <Route path="/ownersignup" element={<OwnerSignup />} />
            <Route
              path="/owner-forgot-password"
              element={<OwnerForgetPassword />}
            />

            {/* Common Login */}
            <Route path="/login" element={<CommonLogin />} />

            {/* User Dashboard */}
            <Route path="/user-dashboard" element={<UserProfile />} />

            {/* ✅ OWNER DASHBOARD FIXED */}
            <Route
              path="/owner-dashboard"
              element={isOwnerLoggedIn ? <Dashboard /> : <OwnerLogin />}
            />

            {/* Owner Pages */}
            <Route path="/upload-pg" element={<UploadPG />} />
            <Route path="/my-pgs" element={<MyPGs />} />
            <Route path="/edit-pg/:hostel_id" element={<EditPG />} />
            <Route path="/pg-members/:hostel_id" element={<PGMembers />} />
            <Route path="/owner-profile" element={<ProfilePage />} />

            {/* Admin Panel */}
            <Route path="/admin-panel" element={<AdminPanel />} />

            {/* Backup */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        )}
      </main>

      {/* FOOTER */}
      {!hideHeaderFooter && !showIntro && !loading && <Footer />}
    </div>
  );
}

export default App;
