import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./HostelPage.css";
import {
  FaWifi,
  FaFan,
  FaBed,
  FaTv,
  FaLightbulb,
  FaDoorClosed,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaShower,
  FaParking,
  FaBroom,
  FaStarHalfAlt,
  FaRegStar
} from "react-icons/fa";

import api from "../api";

// Fallback images
import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";
import pg4 from "../assets/pg4.jpg";
import pg5 from "../assets/pg5.png";

/* ⭐ Render Star Ratings */
const renderStars = (rating = 0) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="review-star" />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" className="review-star" />);
  }

  while (stars.length < 5) {
    stars.push(
      <FaRegStar key={`empty-${stars.length}`} className="review-star" />
    );
  }

  return <div className="stars-container">{stars}</div>;
};

// ✅ FIX IMAGE URL FUNCTION
const fixImageUrl = (img) => {
  const BASE_URL = "https://www.hlopg.com";

  if (!img) return pg1;

  // Already full URL
  if (img.startsWith("http")) return img;

  // If backend gives /uploads/filename.jpg
  if (img.startsWith("/uploads")) return `${BASE_URL}${img}`;

  // If backend gives only filename.jpg
  return `${BASE_URL}/uploads/${img}`;
};

const HostelPage = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [hostelData, setHostelData] = useState(null);
  const [foodMenu, setFoodMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const dummyReviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 4.5,
      comment: "Great PG, clean facilities and friendly staff. Food quality is excellent!",
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Priya Patel",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 4.0,
      comment: "Good location and well-maintained rooms. WiFi could be better though.",
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Amit Kumar",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 5.0,
      comment: "Best PG in the area! Owner is very cooperative and helpful.",
      date: "3 days ago"
    },
    {
      id: 4,
      name: "Sneha Reddy",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 3.5,
      comment: "Affordable price but need more parking space.",
      date: "2 months ago"
    },
    {
      id: 5,
      name: "Vikram Singh",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 4.0,
      comment: "Clean rooms and good food. Would recommend!",
      date: "1 week ago"
    }
  ];

  const avgRating =
    dummyReviews.reduce((sum, r) => sum + r.rating, 0) / dummyReviews.length;
  const totalReviews = dummyReviews.length;

  // Fetch hostel data
  useEffect(() => {
    const fetchHostel = async () => {
      try {
        console.log("Fetching hostel with ID:", hostelId);

        const res = await api.get(`/hostel/${hostelId}`);
        console.log("Full API Response:", res.data);
        console.log("Hostel Data:", res.data.data);

        if (res.data.success) {
          const data = res.data.data;

          // ✅ Fix image URLs properly
          if (data.images && Array.isArray(data.images)) {
            data.images = data.images.map((img) => fixImageUrl(img));
          } else if (data.img) {
            data.images = [fixImageUrl(data.img)];
          } else {
            data.images = [pg1, pg2, pg3, pg4, pg5];
          }

          setHostelData(data);
        } else {
          console.error("API returned error:", res.data.message);
        }
      } catch (err) {
        console.error("Error fetching hostel:", err);
        console.error("Error details:", err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
  }, [hostelId]);

  // Fetch food menu
  useEffect(() => {
    const fetchFoodMenu = async () => {
      try {
        console.log("🔄 Fetching food menu for hostel:", hostelId);

        if (!hostelId) {
          setFoodMenu([]);
          setMenuLoading(false);
          return;
        }

        const endpoints = [
          `/food_menu/${hostelId}`,
          `/hostel/food_menu/${hostelId}`,
          `/hostel/${hostelId}/food_menu`,
          `/hostel/${hostelId}/menu`,
          `/menu/${hostelId}`
        ];

        let foodData = null;
        let found = false;

        for (const endpoint of endpoints) {
          try {
            console.log(`🔍 Trying endpoint: ${endpoint}`);
            const res = await api.get(endpoint);

            if (res.data.success || res.data.ok || res.data.data || res.data.menu) {
              foodData = res.data.data || res.data.menu || res.data.food_menu || res.data;
              found = true;
              break;
            }
          } catch (err) {
            console.log(`❌ Endpoint ${endpoint} failed:`, err.message);
          }
        }

        if (!found && hostelData?.food_menu) {
          foodData = hostelData.food_menu;
          found = true;
        }

        if (found && foodData) {
          processFoodData(foodData);
        } else {
          setFoodMenu([]);
        }
      } catch (err) {
        console.error("❌ Error in fetchFoodMenu:", err);
        setFoodMenu([]);
      } finally {
        setMenuLoading(false);
      }
    };

    const processFoodData = (foodData) => {
      try {
        let processedMenu = [];

        if (typeof foodData === "string") {
          foodData = JSON.parse(foodData);
        }

        if (foodData.breakfast || foodData.lunch || foodData.dinner) {
          const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

          processedMenu = days.map((day) => ({
            day: day.charAt(0).toUpperCase() + day.slice(1),
            breakfast: foodData.breakfast?.[day] || foodData.breakfast || "-",
            lunch: foodData.lunch?.[day] || foodData.lunch || "-",
            dinner: foodData.dinner?.[day] || foodData.dinner || "-"
          }));
        } else if (Array.isArray(foodData)) {
          processedMenu = foodData.map((item) => ({
            day: item.day || "Day",
            breakfast: item.breakfast || "-",
            lunch: item.lunch || "-",
            dinner: item.dinner || "-"
          }));
        } else if (typeof foodData === "object" && foodData !== null) {
          processedMenu = Object.entries(foodData).map(([day, menu]) => ({
            day: day.charAt(0).toUpperCase() + day.slice(1),
            breakfast: menu.breakfast || "-",
            lunch: menu.lunch || "-",
            dinner: menu.dinner || "-"
          }));
        }

        setFoodMenu(processedMenu);
      } catch (error) {
        console.error("❌ Error processing food data:", error);
        setFoodMenu([]);
      }
    };

    if (hostelId) fetchFoodMenu();
  }, [hostelId, hostelData]);

  // Image carousel
  const images =
    hostelData?.images?.length ? hostelData.images : [pg1, pg2, pg3, pg4, pg5];

  const prevImage = () =>
    setMainImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const nextImage = () =>
    setMainImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const handleCreateBooking = async (bookingData) => {
    try {
      setBookingLoading(true);

      if (!bookingData.user) {
        alert("Please provide your information");
        return;
      }

      const currentUser = bookingData.user;

      const bookingPayload = {
        hostel_id: parseInt(hostelId),
        user_name: currentUser.name || "Guest",
        user_email: currentUser.email || "",
        user_phone: currentUser.phone || "",
        sharing_type: bookingData.sharing || "single",
        booking_date: new Date().toISOString().split("T")[0]
      };

      const token = localStorage.getItem("hlopgToken");

      const bookingRes = await api.post("/booking/request", bookingPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (bookingRes.data.success) {
        alert("✅ Booking Request Sent Successfully! Owner will contact you soon.");
        localStorage.setItem("hlopgUser", JSON.stringify(currentUser));
        setIsPopupOpen(false);
      } else {
        alert(`Booking failed: ${bookingRes.data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Booking Error:", err);
      alert("❌ Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBookNow = async () => {
    const token = localStorage.getItem("hlopgToken");
    const owner = localStorage.getItem("hlopgOwner");

    if (owner) {
      alert("You are logged in as Hostel Owner. Not authorized to book.");
      return;
    }

    if (!token) {
      alert("Please log in to send booking request.");
      navigate("/StudentLogin", { state: { from: location.pathname } });
      return;
    }

    setIsPopupOpen(true);
  };

  const BookingPopup = ({ onClose, onSubmit }) => {
    const [selectedSharing, setSelectedSharing] = useState("single");
    const [userPhone, setUserPhone] = useState(user?.phone || "");
    const [userName, setUserName] = useState(user?.name || "");
    const [userEmail, setUserEmail] = useState(user?.email || "");

    if (!isPopupOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!userName.trim()) return alert("Enter name");
      if (!userEmail.trim()) return alert("Enter email");
      if (!userPhone.trim() || userPhone.length < 10) return alert("Enter valid phone");

      const bookingUser = {
        id: user?.id || Date.now(),
        name: userName,
        email: userEmail,
        phone: userPhone
      };

      const bookingData = {
        sharing: selectedSharing,
        user: bookingUser
      };

      setUser(bookingUser);
      onSubmit(bookingData);
    };

    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="booking-popup" onClick={(e) => e.stopPropagation()}>
          <div className="popup-header">
            <h3>Book {hostelData?.hostel_name || "PG"}</h3>
            <button className="close-popup" onClick={onClose}>
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Name" />
            <input value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Email" />
            <input value={userPhone} onChange={(e) => setUserPhone(e.target.value)} placeholder="Phone" />

            <button type="submit" disabled={bookingLoading}>
              {bookingLoading ? "Sending..." : "Send Booking Request"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">Loading hostel details...</div>;
  if (!hostelData) return <div className="error">No hostel found.</div>;

  return (
    <div className="hostel-page">
      <div className="hostel-main">
        <div className="hostel-images">
          <div className="main-img">
            <button className="arrow-left" onClick={prevImage}>
              <FaChevronLeft />
            </button>

            {/* ✅ onError fallback */}
            <img
              src={images[mainImageIndex]}
              alt="Room"
              onError={(e) => {
                e.target.src = pg1;
              }}
            />

            <button className="arrow-right" onClick={nextImage}>
              <FaChevronRight />
            </button>
          </div>

          <div className="thumbnail-container">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumb ${idx}`}
                className={mainImageIndex === idx ? "active-thumb" : ""}
                onClick={() => setMainImageIndex(idx)}
                onError={(e) => {
                  e.target.src = pg1;
                }}
              />
            ))}
          </div>
        </div>

        <div className="hostel-details">
          <h2 className="black-text">{hostelData.hostel_name}</h2>
          <p className="black-text">{hostelData.address}</p>

          <h3 className="black-text">Amenities</h3>
          <div className="furnished-icons">
            {hostelData.facilities?.wifi && (
              <span>
                <FaWifi /> Free WiFi
              </span>
            )}
            {hostelData.facilities?.parking && (
              <span>
                <FaParking /> Parking
              </span>
            )}
            {hostelData.facilities?.fan && (
              <span>
                <FaFan /> Fan
              </span>
            )}
            {hostelData.facilities?.bed && (
              <span>
                <FaBed /> Bed
              </span>
            )}
            {hostelData.facilities?.geyser && (
              <span>
                <FaShower /> Hot Water
              </span>
            )}
            {hostelData.facilities?.clean && (
              <span>
                <FaBroom /> Cleaning
              </span>
            )}
          </div>

          <div className="reviews-section">
            <h2 className="black-text">PG Reviews</h2>
            <div className="rating-overviews">
              <div className="avg-rating">
                <span className="rating-number">{avgRating.toFixed(1)}</span>
                {renderStars(avgRating)}
                <span className="total-reviews">({totalReviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Now Button */}
      <div className="book-now">
        <button className="book-now-btn" onClick={handleBookNow}>
          Book Now
        </button>
        <p className="booking-note-small">
          No payment required. Owner will contact you directly.
        </p>
      </div>

      {/* Booking Popup */}
      {isPopupOpen && (
        <BookingPopup onClose={() => setIsPopupOpen(false)} onSubmit={handleCreateBooking} />
      )}
    </div>
  );
};

export default HostelPage;
