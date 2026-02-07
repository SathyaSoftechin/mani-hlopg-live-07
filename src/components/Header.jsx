

// // export default Header;
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { FaBars, FaTimes, FaSearch, FaUser } from "react-icons/fa";
// import "./Header.css";
// import logo from "../assets/logo.png";


// const Header = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [searchCity, setSearchCity] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [scrolled, setScrolled] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const cities = [
//     { name: "Hyderabad", path: "/hyderabad" },
//     { name: "Chennai", path: "/chennai" },
//     { name: "Bangalore", path: "/bangalore" },
//     { name: "Mumbai", path: "/mumbai" },
//   ];

//   // Check scroll
//   // useEffect(() => {
//   //   const handleScroll = () => {
//   //     setScrolled(window.scrollY > 50);
//   //   };
//   //   window.addEventListener("scroll", handleScroll);
//   //   return () => window.removeEventListener("scroll", handleScroll);
//   // }, []);

//   // // Check login status - SIMPLE AND RELIABLE
//   // useEffect(() => {
//   //   const checkLogin = () => {
//   //     const token = localStorage.getItem("hlopgToken");
//   //     const hasUser = localStorage.getItem("hlopgUser") !== null;
//   //     const hasOwner = localStorage.getItem("hlopgOwner") !== null;
      
//   //     // Log for debugging
//   //     console.log("Header Check:", {
//   //       token: token ? "Yes" : "No",
//   //       user: hasUser ? "Yes" : "No",
//   //       owner: hasOwner ? "Yes" : "No"
//   //     });
      
//   //     setIsLoggedIn(!!(token && (hasUser || hasOwner)));
//   //   };

//   //   checkLogin();
    
//   //   // Check every second
//   //   const interval = setInterval(checkLogin, 1000);
    
//   //   // Also check when storage changes
//   //   const handleStorageChange = () => checkLogin();
//   //   window.addEventListener('storage', handleStorageChange);
    
//   //   return () => {
//   //     clearInterval(interval);
//   //     window.removeEventListener('storage', handleStorageChange);
//   //   };
//   // }, []);

//   useEffect(() => {
//   const checkLogin = () => {
//     const token = localStorage.getItem("hlopgToken");
//     const role = localStorage.getItem("hlopgRole");

//     console.log("Header auth:", { token, role });

//     setIsLoggedIn(!!(token && role));
//   };

//   checkLogin();
//   window.addEventListener("storage", checkLogin);
//   return () => window.removeEventListener("storage", checkLogin);
// }, []);


//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setSearchCity(value);
//     if (value.trim()) {
//       const matchedCities = cities
//         .map(c => c.name)
//         .filter(city => city.toLowerCase().includes(value.toLowerCase()));
//       setSuggestions(matchedCities);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSearch = () => {
//     if (!searchCity.trim()) {
//       alert("Please enter a city name.");
//       return;
//     }
    
//     const cityName = searchCity.trim().toLowerCase();
//     const matchedCity = cities.find(c => c.name.toLowerCase() === cityName);
    
//     if (matchedCity) {
//       navigate(`/city/${cityName}`);
//     } else {
//       alert("City not found. Please select from Hyderabad, Chennai, Bangalore, Mumbai.");
//     }
//     setSuggestions([]);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleSearch();
//   };

//   const handleSuggestionClick = (cityName) => {
//     setSearchCity(cityName);
//     setSuggestions([]);
//     navigate(`/city/${cityName.toLowerCase()}`);
//   };

//   const handleRoleSelection = () => {
//     navigate("/RoleSelection");
//     setMenuOpen(false);
//   };

//   const handleLoginNavigation = () => {
//   navigate("/login");
//   setMenuOpen(false);
// };



//   // const handleProfileNavigation = () => {
//   //   const token = localStorage.getItem("hlopgToken");
//   //   const userStr = localStorage.getItem("hlopgUser");
//   //   const ownerStr = localStorage.getItem("hlopgOwner");
    
//   //   if (!token) {
//   //     navigate("/RoleSelection");
//   //     return;
//   //   }
    
//   //   if (ownerStr) {
//   //     navigate("/owner-dashboard");
//   //   } else if (userStr) {
//   //     navigate("/user-dashboard");
//   //   } else {
//   //     navigate("/RoleSelection");
//   //   }
//   // };

//   const handleProfileNavigation = () => {
//   const role = localStorage.getItem("hlopgRole");

//   if (role === "OWNER") navigate("/owner-dashboard");
//   else if (role === "USER") navigate("/user-dashboard");
//   else navigate("/login");
// };



//   return (
//     <header className={`header ${scrolled ? "scrolled" : ""} ${location.pathname === "/" ? "home-animation" : ""}`}>
//       {/* Logo */}
//       <div className="brand" onClick={() => navigate("/")}>
//         <img src={logo} alt="Logo" className="logo" />
//       </div>

//       {/* Search for desktop */}
//       {window.innerWidth > 768 && (
//         <div className="search-container">
//           <div className="search-box">
//             <FaSearch className="search-icon" />
//             <input
//               type="text"
//               placeholder="Search City"
//               className="search-input"
//               value={searchCity}
//               onChange={handleInputChange}
//               onKeyDown={handleKeyDown}
//             />
//             {suggestions.length > 0 && (
//               <ul className="suggestions-dropdown">
//                 {suggestions.map((city, index) => (
//                   <li key={index} onClick={() => handleSuggestionClick(city)}>
//                     {city}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//           <button className="search-btn" onClick={handleSearch}>
//             Search
//           </button>
//         </div>
//       )}

//       {/* Hamburger for mobile */}
//       {window.innerWidth <= 768 && (
//         <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
//           {menuOpen ? <FaTimes /> : <FaBars />}
//         </div>
//       )}

//       {/* Navigation */}
//       <nav className={`nav ${menuOpen ? "open" : ""}`}>
//         {/* Mobile search */}
//         {window.innerWidth <= 768 && (
//           <div className="mobile-search">
//             <div className="search-container">
//               <div className="search-box">
//                 <FaSearch className="search-icon" />
//                 <input
//                   type="text"
//                   placeholder="Search City"
//                   className="search-input"
//                   value={searchCity}
//                   onChange={handleInputChange}
//                   onKeyDown={handleKeyDown}
//                 />
//               </div>
//               <button className="search-btn" onClick={handleSearch}>
//                 Search
//               </button>
//             </div>
//           </div>
//         )}

//         <ul>
//           <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
//           <li><Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link></li>
//           <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          
//           {/* AUTH SECTION */}
//   <li className="auth-section">
//     {!isLoggedIn && (
//       <div className="auth-buttons">
//         <button
//           className="login-btn"
//           onClick={handleLoginNavigation}
//         >
//           Login
//         </button>

//         <button
//           className="signup-btn"
//           onClick={handleRoleSelection}
//         >
//           Signup
//         </button>
//       </div>
//     )}

//     {isLoggedIn && (
//       <div
//         className="profile-icon-container"
//         onClick={handleProfileNavigation}
//       >
//         <FaUser
//           style={{
//             fontSize: "22px",
//             color: "#7556ff",
//             background: "white",
//             padding: "10px",
//             borderRadius: "50%",
//             boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
//           }}
//         />
//       </div>
//     )}
//   </li>
// </ul>
//       </nav>
//     </header>
//   );
// };

// export default Header;

// export default Header;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaBars, FaTimes, FaSearch, FaUser } from "react-icons/fa";
import "./Header.css";
import logo from "../assets/logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cities = [
    { name: "Hyderabad", path: "/hyderabad" },
    { name: "Chennai", path: "/chennai" },
    { name: "Bangalore", path: "/bangalore" },
    { name: "Mumbai", path: "/mumbai" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("hlopgToken");
      const role = localStorage.getItem("hlopgRole");
      console.log("Header auth:", { token, role });
      setIsLoggedIn(!!(token && role));
    };
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchCity(value);
    if (value.trim()) {
      const matchedCities = cities
        .map(c => c.name)
        .filter(city => city.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(matchedCities);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    if (!searchCity.trim()) {
      alert("Please enter a city name.");
      return;
    }
    
    const cityName = searchCity.trim().toLowerCase();
    const matchedCity = cities.find(c => c.name.toLowerCase() === cityName);
    
    if (matchedCity) {
      navigate(`/city/${cityName}`);
    } else {
      alert("City not found. Please select from Hyderabad, Chennai, Bangalore, Mumbai.");
    }
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSuggestionClick = (cityName) => {
    setSearchCity(cityName);
    setSuggestions([]);
    navigate(`/city/${cityName.toLowerCase()}`);
  };

  const handleRoleSelection = () => {
    navigate("/RoleSelection");
    setMenuOpen(false);
  };

  const handleLoginNavigation = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  const handleProfileNavigation = () => {
    const role = localStorage.getItem("hlopgRole");
    if (role === "OWNER") navigate("/owner-dashboard");
    else if (role === "USER") navigate("/user-dashboard");
    else navigate("/login");

    setMenuOpen(false);
  };

  // Close mobile menu when clicking on overlay
  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""} ${location.pathname === "/" ? "home-animation" : ""}`}>
      {/* Logo */}
      <div className="brand" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {/* Desktop Search */}
      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search City"
            className="search-input"
            value={searchCity}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((city, index) => (
                <li key={index} onClick={() => handleSuggestionClick(city)}>
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          
          {/* Desktop Auth Section */}
          <li className="auth-section">
            {!isLoggedIn ? (
              <div className="auth-buttons">
                <button className="login-btn" onClick={handleLoginNavigation}>
                  Login
                </button>
                <button className="signup-btn" onClick={handleRoleSelection}>
                  Signup
                </button>
              </div>
            ) : (
              <div className="profile-icon-container" onClick={handleProfileNavigation}>
                <FaUser className="profile-icon" />
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* Mobile Hamburger */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`} onClick={handleCloseMenu}></div>

      {/* Mobile Navigation Container */}
      <div className={`mobile-nav-container ${menuOpen ? "open" : ""}`}>
        {/* Mobile Close Button */}
        <button className="mobile-close-btn" onClick={handleCloseMenu}>
          <FaTimes />
        </button>
        
        {/* Mobile Search */}
        <div className="mobile-search-container">
          <div className="mobile-search-box">
            <FaSearch className="mobile-search-icon" />
            <input
              type="text"
              placeholder="Search City"
              className="mobile-search-input"
              value={searchCity}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          {suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((city, index) => (
                <li key={index} onClick={() => handleSuggestionClick(city)}>
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mobile Navigation Items */}
        <ul className="mobile-nav-items">
          <li><Link to="/" onClick={handleCloseMenu}>Home</Link></li>
          <li><Link to="/about" onClick={handleCloseMenu}>About Us</Link></li>
          <li><Link to="/contact" onClick={handleCloseMenu}>Contact</Link></li>
        </ul>

        {/* Mobile Auth Section */}
        <div className="mobile-auth-section">
          {!isLoggedIn ? (
            <>
              <button className="mobile-login-btn" onClick={handleLoginNavigation}>
                Login
              </button>
              <button className="mobile-signup-btn" onClick={handleRoleSelection}>
                Signup
              </button>
            </>
          ) : (
            <div className="mobile-profile-section" onClick={handleProfileNavigation}>
              <div className="mobile-profile-icon">
                <FaUser />
              </div>
              <div className="mobile-profile-info">
                <h4>My Profile</h4>
                {/* <p>View dashboard</p> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;