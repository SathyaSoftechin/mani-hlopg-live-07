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

    // Redirect owner to dashboard if accessing home
    if (ownerLoggedIn && location.pathname === "/") {
      navigate("/owner-dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  // INTRO VIDEO (skip for owners)
  const [showIntro, setShowIntro] = useState(() => {
    const token = localStorage.getItem("hlopgToken");
    const role = localStorage.getItem("hlopgRole");

    if (token && role === "OWNER") return false;

    const seen = localStorage.getItem("seenIntro");
    return !seen;
  });

  useEffect(() => {
    if (!showIntro) {
      localStorage.setItem("seenIntro", "true");
    }
  }, [showIntro]);

  // LOADING VIDEO
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOwnerLoggedIn) {
      setLoading(false);
      return;
    }

    const path = location.pathname;

    if (path === "/" && !showIntro) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }

    if (path.startsWith("/hostel/") || path.startsWith("/city/")) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, showIntro, isOwnerLoggedIn]);

  const hideHeaderFooter =
    location.pathname.startsWith("/owner-dashboard") ||
    location.pathname.startsWith("/view") ||
    location.pathname === "/owner-profile";

  return (
    <div className="app-container">
      {/* Intro */}
      {showIntro && !isOwnerLoggedIn && (
        <IntroVideo onFinish={() => setShowIntro(false)} />
      )}

      {/* Loading */}
      {!showIntro && loading && !isOwnerLoggedIn && <LoadingVideo />}

      {/* Header */}
      {!hideHeaderFooter && !showIntro && !loading && <Header />}

      <main className="content">
        {!showIntro && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/hostel/:hostelId" element={<HostelPage />} />
            <Route path="/RoleSelection" element={<RoleSelection />} />
            <Route path="/city/:cityName" element={<CityHostels />} />
            <Route path="/StudentLogin" element={<StudentLogin />} />
            <Route path="/student-signup" element={<StudentSignup />} />
            <Route
              path="/student-forgot-password"
              element={<StudentForgetPassword />}
            />
            <Route path="/ownerLogin" element={<OwnerLogin />} />
            <Route path="/ownersignup" element={<OwnerSignup />} />
            <Route
              path="/owner-forgot-password"
              element={<OwnerForgetPassword />}
            />
            <Route path="/login" element={<CommonLogin />} />
            <Route path="/user-dashboard" element={<UserProfile />} />

            {/* Owner Dashboard */}
            <Route
              path="/owner-dashboard"
              element={isOwnerLoggedIn ? <AdminPanel /> : <OwnerLogin />}
            />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload-pg" element={<UploadPG />} />
            <Route path="/my-pgs" element={<MyPGs />} />
            <Route path="/edit-pg/:hostel_id" element={<EditPG />} />
            <Route path="/pg-members/:hostel_id" element={<PGMembers />} />
            <Route path="/owner-profile" element={<ProfilePage />} />
          </Routes>
        )}
      </main>

      {/* Footer */}
      {!hideHeaderFooter && !showIntro && !loading && <Footer />}
    </div>
  );
}

export default App;
