

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  FaHeart,
  FaStar,
  FaBed,
  FaUtensils,
  FaBroom,
  FaShower,
  FaChevronLeft,
  FaChevronRight,
  FaWifi,
  FaCar,
  FaTv,
  FaSnowflake,
  FaUserFriends,
  FaHome,
  FaKey,
  FaDumbbell,
  FaFan,
  FaLightbulb,
  FaChair,
} from "react-icons/fa";
import api from "../api";
import defaultPGImg from "../assets/pg1.jpg";
import hyderabadBg from "../assets/hyderabad.png";
import chennaiBg from "../assets/chennai.png";
import mumbaiBg from "../assets/mumbai.png";
import bangaloreBg from "../assets/bangalore.png";
import logo from "../assets/logo.png";
import AuthModal from "./AuthModal";

const PLAYSTORE_LINK = "https://play.google.com/";
const APPSTORE_LINK = "https://www.apple.com/app-store/";

function Home() {
  const navigate = useNavigate();
  const pgRefs = useRef([]);
  const [arrowVisibility, setArrowVisibility] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [likedPgIds, setLikedPgIds] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedHostelId, setSelectedHostelId] = useState(null);
  const [authType, setAuthType] = useState("login"); // "login" or "signup"

  const [forceUpdateFlag, setForceUpdateFlag] = useState(false);
const forceUpdate = () => setForceUpdateFlag(!forceUpdateFlag);

  /* ---------------- Fix Image URL Helper ---------------- */
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return defaultPGImg;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads')) {
      return `https://hlopg.com${imagePath}`;
    }
    
    if (imagePath) {
      return `https://hlopg.com/uploads/${imagePath}`;
    }
    
    return defaultPGImg;
  };

  /* ---------------- Fetch Hostels ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/hostel/gethostels");
        console.log("Hostels response:", res.data);
        
        if (res.data.success && Array.isArray(res.data.hostels)) {
          const processedHostels = res.data.hostels.map(hostel => {
            let images = [];
            if (hostel.images && Array.isArray(hostel.images)) {
              images = hostel.images.map(img => getFullImageUrl(img));
            } else if (hostel.img) {
              images = [getFullImageUrl(hostel.img)];
            } else {
              images = [defaultPGImg];
            }
            
            return {
              ...hostel,
              images: images,
              displayImage: images[0],
              id: hostel.hostel_id || hostel.id
            };
          });
          
          setHostels(processedHostels);
        } else {
          setHostels([]);
        }
      } catch (err) {
        console.error("Error fetching hostels:", err);
        setHostels([]);
      }
    };
    fetchData();
  }, []);

  /* ---------------- Fetch Liked Hostels ---------------- */
  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");
        if (!token) {
          setLikedPgIds([]);
          return;
        }

        const res = await api.get("/hostel/liked-hostels", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success && Array.isArray(res.data.data)) {
          const likedIds = res.data.data.map(pg => pg.hostel_id || pg.id);
          setLikedPgIds(likedIds);
        } else {
          setLikedPgIds([]);
        }
      } catch (err) {
        console.error("Error fetching liked hostels:", err);
        setLikedPgIds([]);
      }
    };
    fetchLiked();
  }, []);

  /* ---------------- Cities ---------------- */
  const [cities, setCities] = useState([
    { name: "Hostel's in Hyderabad", bg: hyderabadBg, pgList: [] },
    { name: "Hostel's in Chennai", bg: chennaiBg, pgList: [] },
    { name: "Hostel's in Mumbai", bg: mumbaiBg, pgList: [] },
    { name: "Hostel's in Bangalore", bg: bangaloreBg, pgList: [] },
    { name: "Hostel's in Vizag", bg: bangaloreBg, pgList: [] },
  ]);

  useEffect(() => {
    if (hostels.length > 0) {
      setCities((prevCities) =>
        prevCities.map((city) => {
          const cityName = city.name.match(/in (\w+)/i)?.[1]?.toLowerCase() || "";
          
          const filtered = hostels.filter((h) => {
            if (!h.city) return false;
            return h.city.toLowerCase().includes(cityName) || 
                   cityName.includes(h.city.toLowerCase());
          });
          
          return {
            ...city,
            pgList: filtered.map((h) => ({
              // Basic Info
              id: h.hostel_id || h.id,
              img: h.displayImage || defaultPGImg,
              name: h.hostel_name || h.name || "Unnamed Hostel",
              location: h.area || h.city || h.address || "Unknown Location",
              rating: h.rating || 4.5,
              price: h.price ? `₹${h.price}` : h.rent ? `₹${h.rent}` : "₹5000",
              
              // Full data for details
              fullHostelData: h,
              
              // Sharing Information
              sharing: getSharingDisplay(h.sharing_data),
              
              // Facilities (extracted from JSON)
              facilities: getFacilitiesList(h.facilities),
              
              // Additional Details
              description: h.description || "",
              pg_type: h.pg_type || "Hostel",
              status: h.status || "ACTIVE",
              city: h.city,
              pincode: h.pincode,
              state: h.state,
              rules: h.rules ? parseRules(h.rules) : [],
              food_menu: h.food_menu || {}
            })),
          };
        })
      );
    }
  }, [hostels]);

  /* ---------------- Helper: Get Sharing Display ---------------- */
  const getSharingDisplay = (sharingData) => {
    if (!sharingData) return "Not specified";
    
    try {
      const sharing = typeof sharingData === 'string' 
        ? JSON.parse(sharingData) 
        : sharingData;
      
      if (typeof sharing === 'object' && sharing !== null) {
        const entries = Object.entries(sharing);
        if (entries.length > 0) {
          return entries.map(([type, price]) => {
            const typeText = type === 'single' ? '1-Sharing' : 
                            type === 'double' ? '2-Sharing' : 
                            type === 'triple' ? '3-Sharing' : 
                            type === 'four' ? '4-Sharing' : 
                            type === 'five' ? '5-Sharing' : 
                            type === 'six' ? '6-Sharing' : 
                            `${type}-Sharing`;
            return `${typeText} - ₹${price}`;
          }).join(', ');
        }
      }
    } catch (e) {
      console.log("Error parsing sharing data:", e);
    }
    return "Multiple Sharing Options";
  };

  /* ---------------- Helper: Get Facilities List ---------------- */
  const getFacilitiesList = (facilitiesData) => {
    const facilities = [];
    
    if (facilitiesData) {
      try {
        const facilitiesObj = typeof facilitiesData === 'string' 
          ? JSON.parse(facilitiesData) 
          : facilitiesData;
        
        // Map backend keys to display names
        const facilityMap = {
          wifi: { name: "WiFi", icon: <FaWifi /> },
          parking: { name: "Parking", icon: <FaCar /> },
          ac: { name: "AC", icon: <FaSnowflake /> },
          tv: { name: "TV", icon: <FaTv /> },
          gym: { name: "Gym", icon: <FaDumbbell /> },
          geyser: { name: "Hot Water", icon: <FaShower /> },
          fan: { name: "Fan", icon: <FaFan /> },
          bed: { name: "Bed", icon: <FaBed /> },
          lights: { name: "Lights", icon: <FaLightbulb /> },
          cupboard: { name: "Cupboard", icon: <FaChair /> },
          food: { name: "Food", icon: <FaUtensils /> },
          water: { name: "24/7 Water", icon: <FaShower /> },
          clean: { name: "Cleaning", icon: <FaBroom /> }
        };
        
        Object.entries(facilitiesObj).forEach(([key, value]) => {
          if (value && facilityMap[key]) {
            facilities.push(facilityMap[key]);
          }
        });
      } catch (e) {
        console.log("Error parsing facilities:", e);
      }
    }
    
    // Add default facilities if none found
    if (facilities.length === 0) {
      facilities.push(
        { name: "Beds", icon: <FaBed /> },
        { name: "Food", icon: <FaUtensils /> },
        { name: "Clean", icon: <FaBroom /> },
        { name: "Wash", icon: <FaShower /> }
      );
    }
    
    return facilities.slice(0, 6); // Max 6 facilities for display
  };

  /* ---------------- Helper: Parse Rules ---------------- */
  const parseRules = (rulesData) => {
    if (!rulesData) return [];
    
    try {
      if (typeof rulesData === 'string') {
        return JSON.parse(rulesData);
      }
      return rulesData;
    } catch (e) {
      return [];
    }
  };

  /* ---------------- Helper: Get Facility Icon ---------------- */
  const getFacilityIcon = (facility) => {
    const iconMap = {
      WiFi: <FaWifi />,
      Parking: <FaCar />,
      AC: <FaSnowflake />,
      TV: <FaTv />,
      Gym: <FaDumbbell />,
      "Hot Water": <FaShower />,
      Fan: <FaFan />,
      Bed: <FaBed />,
      Beds: <FaBed />,
      Lights: <FaLightbulb />,
      Cupboard: <FaChair />,
      Food: <FaUtensils />,
      "24/7 Water": <FaShower />,
      Cleaning: <FaBroom />,
      Clean: <FaBroom />,
      Wash: <FaShower />,
    };
    return iconMap[facility.name || facility] || <FaHome />;
  };

  /* ---------------- Hero Background Rotation ---------------- */
  const [currentBg, setCurrentBg] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % cities.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [cities.length]);

  /* ---------------- Scroll Arrows ---------------- */
  const updateArrowVisibility = (cityIndex) => {
    const container = pgRefs.current[cityIndex];
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setArrowVisibility((prev) => {
      const next = [...prev];
      next[cityIndex] = {
        left: scrollLeft > 0,
        right: scrollLeft + clientWidth < scrollWidth - 1,
      };
      return next;
    });
  };

  const scrollPG = (cityIndex, direction) => {
    const container = pgRefs.current[cityIndex];
    if (!container) return;

    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });

    setTimeout(() => updateArrowVisibility(cityIndex), 300);
  };

  useEffect(() => {
    cities.forEach((_, i) => updateArrowVisibility(i));
  }, [cities]);

  /* ---------------- Like/Unlike Hostel ---------------- */
/* ---------------- Like/Unlike Hostel ---------------- */
const toggleLike = async (pg, e) => {
  e.stopPropagation();
  
  try {
    const token = localStorage.getItem("hlopgToken");
    if (!token) {
      // Open auth modal instead of redirecting immediately
      setSelectedHostelId(pg.id);
      setAuthType("login");
      setShowAuthModal(true);
      return;
    }

    console.log("🎯 Toggling like for hostel ID:", pg.id);
    console.log("💖 Current liked IDs before:", likedPgIds);
    
    const res = await api.post("/hostel/like-hostel", {
      hostel_id: pg.id,
    }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("📥 API response:", res.data);
    
    if (res.data.success) {
      // Update liked list immediately for responsive UI
      if (res.data.liked === true) {
        // Add to liked list
        setLikedPgIds(prev => {
          if (!prev.includes(pg.id)) {
            const newLiked = [...prev, pg.id];
            console.log("✅ Added to liked list:", newLiked);
            
            // Update localStorage for UserPanel sync
            updateLocalStorageLiked(pg.id, true);
            
            return newLiked;
          }
          return prev;
        });
      } else {
        // Remove from liked list
        setLikedPgIds(prev => {
          const newLiked = prev.filter(id => id !== pg.id);
          console.log("✅ Removed from liked list:", newLiked);
          
          // Update localStorage for UserPanel sync
          updateLocalStorageLiked(pg.id, false);
          
          return newLiked;
        });
      }
      
      // No alert message - just update the UI silently
      // You can optionally show a small toast notification instead
    }
  } catch (err) {
    console.error("❌ Error liking hostel:", err);
    // Optional: Show error toast instead of alert
    // alert("Failed to update like status. Please try again.");
  }
};

// Helper function to update localStorage for UserPanel sync
const updateLocalStorageLiked = (hostelId, liked) => {
  try {
    // Get current liked hostels from localStorage
    const likedStr = localStorage.getItem('hlopgLikedHostels');
    let likedHostels = likedStr ? JSON.parse(likedStr) : [];
    
    if (liked) {
      // Add if not already in list
      if (!likedHostels.includes(hostelId)) {
        likedHostels.push(hostelId);
      }
    } else {
      // Remove from list
      likedHostels = likedHostels.filter(id => id !== hostelId);
    }
    
    // Save back to localStorage
    localStorage.setItem('hlopgLikedHostels', JSON.stringify(likedHostels));
    console.log("💾 Updated localStorage liked hostels:", likedHostels);
  } catch (error) {
    console.error("Error updating localStorage:", error);
  }
};

  /* ---------------- APP DOWNLOAD POPUP ---------------- */
  const [showPopup, setShowPopup] = useState(false);
  const scrollPosRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollPosRef.current = window.scrollY;
      document.body.classList.add("no-scroll");
      setShowPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    document.body.classList.remove("no-scroll");
    window.scrollTo(0, scrollPosRef.current);
  };

  const handleLikeToggle = async (hostelId, isCurrentlyLiked) => {
  try {
    const token = localStorage.getItem("hlopgToken");
    if (!token) {
      navigate("/StudentLogin");
      return;
    }

    console.log("🎯 Toggling like for hostel ID:", hostelId);
    console.log("💖 Current liked IDs before:", likedHostelIds);

    const res = await api.post(
      "/hostel/like-hostel",
      { hostelId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("📥 API response:", res.data);

    if (res.data.success) {
      let updatedLikedIds;
      
      if (res.data.liked === false) {
        // Unlike
        updatedLikedIds = likedHostelIds.filter(id => id !== hostelId);
        console.log("👎 Removed from liked list:", updatedLikedIds);
      } else {
        // Like
        updatedLikedIds = [...likedHostelIds, hostelId];
        console.log("👍 Added to liked list:", updatedLikedIds);
      }

      setLikedHostelIds(updatedLikedIds);
      localStorage.setItem("hlopgLikedHostels", JSON.stringify(updatedLikedIds));
      
      // Force re-render to update heart colors immediately
      forceUpdate();
    }
  } catch (err) {
    console.error("❌ Error toggling like:", err);
  }
};

  const handlePgCardClick = (pg) => {
    // Check if user is logged in
    const token = localStorage.getItem("hlopgToken");
    
    if (!token) {
      // Show auth modal instead of navigating directly
      setSelectedHostelId(pg.id);
      setAuthType("login"); // Default to login
      setShowAuthModal(true);
    } else {
      // User is logged in, navigate directly
      navigate(`/hostel/${pg.id}`);
    }
  };

  // Handle successful login
  // Handle successful login
const handleAuthSuccess = () => {
  // If user logged in to like a hostel
  if (selectedHostelId) {
    // Try to like the hostel automatically after login
    const likeHostelAfterLogin = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");
        if (token) {
          const res = await api.post("/hostel/like-hostel", {
            hostel_id: selectedHostelId,
          }, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (res.data.success && res.data.liked) {
            // Add to liked list
            setLikedPgIds(prev => {
              if (!prev.includes(selectedHostelId)) {
                return [...prev, selectedHostelId];
              }
              return prev;
            });
            updateLocalStorageLiked(selectedHostelId, true);
          }
        }
      } catch (error) {
        console.error("Error liking after login:", error);
      }
    };
    
    likeHostelAfterLogin();
    
    // Navigate to the hostel page after successful login
    navigate(`/hostel/${selectedHostelId}`);
  }
  
  // Reset states
  setSelectedHostelId(null);
  setShowAuthModal(false);
};

  /* ---------------- Render ---------------- */
  return (
    
    <div className="home">
      {/* ===== App Download Popup ===== */}
      {showPopup && (
        <div className="app-popup-overlay">
          <div className="app-popup-card">
            <button className="popup-close" onClick={closePopup}>
              ✕
            </button>

            <img src={logo} alt="logo" className="popup-app-img" />

            <h2>
              Download Our <span className="brand-text">HLOPG</span> Mobile App
            </h2>

            <p>Find hostels faster, easier & smarter with our app.</p>

            <div className="popup-buttons">
              <a href={PLAYSTORE_LINK} target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
              </a>

              <a href={APPSTORE_LINK} target="_blank" rel="noopener noreferrer">
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ===== Hero Section ===== */}
      <div className="hero">
        <div className="overlay">
          <h1 className="title">HloPG</h1>
          <p className="subtitle">
            Because finding a PG shouldn't feel like a struggle.
          </p>
        </div>
      </div>

      {/* ===== City Sections ===== */}
      {cities.map((city, index) => {
        const cityRouteName = city.name.match(/in (\w+)/i)?.[1]?.toLowerCase() || "unknown";

        return (
          <div key={index} className="city-section">
            <div className="city-header">
             <h2>{city.name.replace("Hostel's in ", "")}</h2>
              {city.pgList.length > 0 && (
                <div
                  className="know-more-btn"
                  onClick={() => navigate(`/city/${cityRouteName}`)}
                >
                  See More...
                </div>
              )}
            </div>

            {city.pgList.length > 0 ? (
              <div className="pg-container">
                {/* Arrows */}
                <button
                  className={`arrow left ${
                    arrowVisibility[index]?.left ? "show" : "hide"
                  }`}
                  onClick={() => scrollPG(index, "prev")}
                >
                  <FaChevronLeft />
                </button>

                <button
                  className={`arrow right ${
                    arrowVisibility[index]?.right ? "show" : "hide"
                  }`}
                  onClick={() => scrollPG(index, "next")}
                >
                  <FaChevronRight />
                </button>

                {/* Scroll */}
                {/* Scroll - Add wrapper for fixed width cards */}
<div className="pg-scroll-wrapper">
  <div
    className="pg-scroll"
    ref={(el) => (pgRefs.current[index] = el)}
    onScroll={() => updateArrowVisibility(index)}
  >
                  <div className="pg-track">
                    {city.pgList.map((pg) => (
                      <div key={pg.id} className="home-pg-card fixed-width-card">
                        <div
                          className="pg-card-click"
                          onClick={() => handlePgCardClick(pg)}
                        >
                          <div className=" pg-image ">
                            <img 
                              src={pg.img} 
                              alt={pg.name} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultPGImg;
                              }} 
                            />

                            {/* ❤️ Heart Icon */}
                            <FaHeart
                              className={`wishlists ${
                                likedPgIds.includes(pg.id) ? "liked" : "unliked"
                              }`}
                              onClick={(e) => toggleLike(pg, e)}
                            />
                          </div>

                          <div className="pg-details new-details">
                            {/* Hostel Name & Rating */}
                            <div className="pg-header new-header">
                              <h3 className="pg-name new-name">{pg.name}</h3>
                              <div className="pg-rating new-rating">
                                <FaStar className="star" />
                                <span>{pg.rating}</span>
                              </div>
                            </div>

                            {/* Location */}
                            <p className="pg-location new-location">
                              {/* <span className="gridicons--location"></span> */}
                              {pg.location}, {pg.city || ""}
                            </p>

                            {/* PG Type */}
                            {pg.pg_type && (
                              <div className="pg-type-badge">
                                <FaHome />
                                <span>{pg.pg_type} PG</span>
                              </div>
                            )}

                            {/* Sharing Type & Price */}
                            <div className="sharing-price-section">
                              <div className="sharing-info">
                                <FaUserFriends />
                                <span className="sharing-text">{pg.sharing}</span>
                              </div>
                              {/* <div className="price-tag">
                                <span className="price-label">Starts From:</span>
                                <h4 className="price">{pg.price}</h4>
                                <span className="per-month">/month</span>
                              </div> */}
                            </div>

                            {/* Facilities */}
                            <div className="facilities-section">
                              <h4 className="facilities-title">Facilities:</h4>
                              <div className="facilities-grid">
                                {pg.facilities.map((facility, i) => (
                                  <div key={i} className="facility-item">
                                    <span className="facility-icon">
                                      {facility.icon || getFacilityIcon(facility)}
                                    </span>
                                    <span className="facility-name">
                                      {facility.name || facility}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Additional Info */}
                            {/* <div className="additional-info">
                              {pg.description && (
                                <div className="description-preview">
                                  <p className="desc-text">{pg.description.substring(0, 80)}...</p>
                                </div>
                              )} */}
                              
                              {/* Status Badge */}
                              {/* {pg.status && (
                                <div className={`status-badge ${pg.status.toLowerCase()}`}>
                                  {pg.status}
                                </div>
                              )} */}
                            {/* </div> */}

                            {/* View Details Button */}
                            {/* <button 
                              className="view-details-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/hostel/${pg.id}`);
                              }}
                            >
                              View Full Details
                            </button> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              </div>
            ) : (
              <div className="no-hostels-message">
                <p>No hostels found in {city.name.match(/in (\w+)/i)?.[1] || "this city"}. Check back soon!</p>
              </div>
            )}
          </div>
        );
      })}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        authType={authType}
      />
    </div>
  );
}

export default Home;