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
  const [showIntro, setShowIntro] = useState(false);
  const [loading, setLoading] = useState(false);
 
  /* ---------------- LOGIN CHECK ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("hlopgToken");
    const role = localStorage.getItem("hlopgRole");
 
    const ownerLoggedIn = !!(token && role === "OWNER");
    setIsOwnerLoggedIn(ownerLoggedIn);
 
    if (ownerLoggedIn && location.pathname === "/") {
      navigate("/owner-dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);
 
  /* ---------------- INTRO VIDEO (ONLY ONCE EVER) ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("hlopgToken");
    const role = localStorage.getItem("hlopgRole");
    const seenIntro = localStorage.getItem("seenIntro");
 
    if (token && role === "OWNER") return;
 
    if (!seenIntro) {
      setShowIntro(true);
    }
  }, []);
 
  const handleIntroFinish = () => {
    localStorage.setItem("seenIntro", "true");
    setShowIntro(false);
  };
 
  /* ---------------- LOADING VIDEO (ONCE PER SESSION) ---------------- */
  useEffect(() => {
    if (isOwnerLoggedIn || showIntro) return;
 
    const hasLoadedOnce = sessionStorage.getItem("hasLoadedOnce");
    if (hasLoadedOnce) return;
 
    setLoading(true);
 
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("hasLoadedOnce", "true");
    }, 1500);
 
    return () => clearTimeout(timer);
  }, [location.pathname, showIntro, isOwnerLoggedIn]);
 
  /* ---------------- HEADER / FOOTER VISIBILITY ---------------- */
  const hideHeaderFooter =
    location.pathname.startsWith("/owner-dashboard") ||
    location.pathname.startsWith("/view") ||
    location.pathname === "/owner-profile";
 
  return (
    <div className="app-container">
      {/* Intro Video */}
      {showIntro && !isOwnerLoggedIn && (
        <IntroVideo onFinish={handleIntroFinish} />
      )}
 
      {/* Loading Video */}
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
