// import React, { useState, useEffect } from "react";
// import { Routes, Route, useLocation } from "react-router-dom";

// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import IntroVideo from "./components/IntroVideo";   // NEW
// import LoadingVideo from "./components/LoadingVideo";

// // Pages
// import Home from "./pages/Home";
// import AboutUs from "./pages/AboutUs";
// import HostelPage from "./pages/HostelPage";

// import RoleSelection from "./components/RoleSelection";

// import StudentLogin from "./components/StudentLogin";
// import StudentSignup from "./components/StudentSignup";
// import StudentForgetPassword from "./components/StudentForgetPassword";

// import OwnerLogin from "./components/OwnerLogin";
// import OwnerSignup from "./components/OwnerSignup";
// import OwnerForgetPassword from "./components/OwnerForgetPassword";

// import AdminPanel from "./pages/AdminPanel";
// import Dashboard from "./pages/Dashboard";
// import UploadPG from "./pages/UploadPG";
// import MyPGs from "./pages/MyPGs";

// import EditPG from "./pages/EditPG";
// // import EditRooms from "./pages/EditRooms";
// import PGMembers from "./pages/PGMembersList";

// import CityHostels from "./pages/cities/CityHostels";
// import UserProfile from "./pages/UserPanel";
// import Contact from "./pages/Contact";
// import ProfilePage from "./pages/ProfilePage";
// import CommonLogin from "./pages/CommonLogin";

// function App() {
//   const location = useLocation();

//   // --------------------------
//   // 1️⃣ INTRO VIDEO (Plays ONLY once)
//   // --------------------------
//   const [showIntro, setShowIntro] = useState(() => {
//     const seen = localStorage.getItem("seenIntro");
//     return !seen; // play only if not seen before
//   });

//   useEffect(() => {
//     if (showIntro === false) {
//       localStorage.setItem("seenIntro", "true");
//     }
//   }, [showIntro]);

//   // --------------------------
//   // 2️⃣ LOADING VIDEO (route-based)
//   // --------------------------
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const path = location.pathname;

//     if (path === "/" && !showIntro) {
//       setLoading(true);
//       setTimeout(() => setLoading(false), 5000);
//       return;
//     }

//     if (path.startsWith("/hostel/")) {
//       setLoading(true);
//       setTimeout(() => setLoading(false), 2000);
//       return;
//     }

//     if (path.startsWith("/city/")) {
//       setLoading(true);
//       setTimeout(() => setLoading(false), 2000);
//       return;
//     }
//   }, [location.pathname, showIntro]);

//   // --------------------------
//   // 3️⃣ SERVER DOWN → loading video
//   // --------------------------
//   useEffect(() => {
//     window.showServerLoader = () => setLoading(true);
//     window.hideServerLoader = () => setLoading(false);
//   }, []);

//   const hideHeaderFooter =
//     location.pathname.startsWith("/owner-dashboard") ||
//     location.pathname.startsWith("/view")||
//     location.pathname === "/owner-profile";

    

//   return (
//     <div className="app-container">

//       {/* 🟣 INTRO VIDEO (5 SEC, ONLY ONCE) */}
//       {showIntro && <IntroVideo onFinish={() => setShowIntro(false)} />}

//       {/* 🔵 LOADING VIDEO (homepage, hostel click, server down) */}
//       {!showIntro && loading && <LoadingVideo />}

//       {/* HEADER */}
//       {!hideHeaderFooter && !showIntro && !loading && <Header />}

//       <main className="content">
//         {!showIntro && (
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/about" element={<AboutUs />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/hostel/:hostelId" element={<HostelPage />} />

            
//             <Route path="/RoleSelection" element={<RoleSelection />} />

//             <Route path="/city/:cityName" element={<CityHostels />} />

//             <Route path="/StudentLogin" element={<StudentLogin />} />
//             <Route path="/student-signup" element={<StudentSignup />} />
//             <Route path="/student-forgot-password" element={<StudentForgetPassword />} />

//             <Route path="/ownerLogin" element={<OwnerLogin />} />
//             <Route path="/ownersignup" element={<OwnerSignup />} />
//             <Route path="/owner-forgot-password" element={<OwnerForgetPassword />} />

//              <Route path="/login" element={<CommonLogin />} />
//             <Route path="/user-dashboard" element={<UserProfile />} />
//             <Route path="/owner-dashboard" element={<AdminPanel />} />
//             <Route path="/dashboard" element={<Dashboard />} />

//             <Route path="/upload-pg" element={<UploadPG />} />
//             <Route path="/my-pgs" element={<MyPGs />} />
//             <Route path="/edit-pg/:hostel_id" element={<EditPG />} />
//             {/* <Route path="/edit-rooms/:hostel_id" element={<EditRooms />} /> */}
//             <Route path="/pg-members/:hostel_id" element={<PGMembers />} />
            
// <Route path="/owner-profile" element={<ProfilePage />} />


//           </Routes>
//         )}
//       </main>

//       {/* FOOTER */}
//       {!hideHeaderFooter && !showIntro && !loading && <Footer />}
//     </div>
//   );
// }

// export default App;
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
import ScrollToTop from "./components/ScrollToTop";
 
 
function App() {
  const location = useLocation();
  const navigate = useNavigate();
 
  // State to track if owner is logged in
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
 
  // Check login status on mount and when location changes
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
        currentPath: location.pathname
      });
     
      // If owner is logged in AND trying to access homepage, redirect to dashboard
      if (ownerLoggedIn && location.pathname === "/") {
        console.log("🚀 Owner logged in - redirecting to dashboard");
        navigate("/owner-dashboard", { replace: true });
      }
    };
   
    checkLoginStatus();
   
    // Listen for storage changes (logout/login)
    const handleStorageChange = () => {
      checkLoginStatus();
    };
   
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname, navigate]);
 
  // --------------------------
  // INTRO VIDEO (Skip if owner is logged in)
  // --------------------------
  const [showIntro, setShowIntro] = useState(() => {
    // Skip intro for logged-in owners
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
 
  // --------------------------
  // LOADING VIDEO (Skip if owner is logged in)
  // --------------------------
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    // Skip loading for logged-in owners
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
 
  // Server loader functions
  useEffect(() => {
    window.showServerLoader = () => setLoading(true);
    window.hideServerLoader = () => setLoading(false);
  }, []);
 
  const hideHeaderFooter =
    location.pathname.startsWith("/owner-dashboard") ||
    location.pathname.startsWith("/view") ||
    location.pathname === "/owner-profile";
 
  // If owner is logged in and trying to access homepage, show nothing
  if (isOwnerLoggedIn && location.pathname === "/") {
    return (
      <div className="app-container" style={{ display: 'none' }}>
        {/* Empty while redirecting to dashboard */}
      </div>
    );
  }
 
  return (
    <div className="app-container">
      {/* INTRO VIDEO (skip for owners) */}
      {showIntro && !isOwnerLoggedIn && <IntroVideo onFinish={() => setShowIntro(false)} />}
 
      {/* LOADING VIDEO (skip for owners) */}
      {!showIntro && loading && !isOwnerLoggedIn && <LoadingVideo />}
 
      {/* HEADER */}
      {!hideHeaderFooter && !showIntro && !loading && <Header />}
 
      <main className="content">
        <ScrollToTop />
        {!showIntro && (
          <Routes>
            {/* Home route - only accessible if NOT logged in as owner */}
            <Route
              path="/"
              element={!isOwnerLoggedIn ? <Home /> : null}
            />
           
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/hostel/:hostelId" element={<HostelPage />} />
            <Route path="/RoleSelection" element={<RoleSelection />} />
            <Route path="/city/:cityName" element={<CityHostels />} />
            <Route path="/StudentLogin" element={<StudentLogin />} />
            <Route path="/student-signup" element={<StudentSignup />} />
            <Route path="/student-forgot-password" element={<StudentForgetPassword />} />
            <Route path="/ownerLogin" element={<OwnerLogin />} />
            <Route path="/ownersignup" element={<OwnerSignup />} />
            <Route path="/owner-forgot-password" element={<OwnerForgetPassword />} />
            <Route path="/login" element={<CommonLogin />} />
            <Route path="/user-dashboard" element={<UserProfile />} />
           
            {/* Owner dashboard - only accessible if logged in as owner */}
            <Route
              path="/owner-dashboard"
              element={isOwnerLoggedIn ? <AdminPanel /> : <RoleSelection />}
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
 
      {/* FOOTER */}
      {!hideHeaderFooter && !showIntro && !loading && <Footer />}
    </div>
  );
}
 
export default App;
