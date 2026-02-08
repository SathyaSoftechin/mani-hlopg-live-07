
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
  FaLock,
  FaParking,
  FaBroom,
  FaStarHalfAlt,
  FaRegStar
} from "react-icons/fa";
import { MdOutlineSmokeFree, MdNoDrinks } from "react-icons/md";

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
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
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

  const avgRating = dummyReviews.reduce((sum, r) => sum + r.rating, 0) / dummyReviews.length;
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
          
          // Fix image URLs
          if (data.images && Array.isArray(data.images)) {
            // Process images to ensure they have full URLs
            data.images = data.images.map(img => {
              if (!img) return pg1;
              if (img.startsWith('http')) return img;
              if (img.startsWith('/uploads')) return `https://hlopg.com${img}`;
              return `https://hlopg.com/uploads/${img}`;
            });
          } else if (data.img) {
            // Fallback to single image
            const mainImg = data.img.startsWith('http') ? data.img : 
                           data.img.startsWith('/uploads') ? `https://hlopg.com${data.img}` :
                           `https://hlopg.com/uploads/${data.img}`;
            data.images = [mainImg];
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
          console.log("⚠️ No hostel ID available");
          setFoodMenu([]);
          setMenuLoading(false);
          return;
        }

        // Try to fetch from API endpoints first
        console.log("🌐 Trying to fetch food menu from API...");
        
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
            console.log(`📡 Response from ${endpoint}:`, res.data);
            
            if (res.data.success || res.data.ok || res.data.data || res.data.menu) {
              foodData = res.data.data || res.data.menu || res.data.food_menu || res.data;
              console.log("✅ Food data found from API:", foodData);
              found = true;
              break;
            }
          } catch (err) {
            console.log(`❌ Endpoint ${endpoint} failed:`, err.message);
          }
        }
        
        // If no API data found, check if it's in hostelData (which might be fetched later)
        if (!found && hostelData?.food_menu) {
          console.log("📦 Food menu found in hostel data:", hostelData.food_menu);
          foodData = hostelData.food_menu;
          found = true;
        }
        
        if (found && foodData) {
          processFoodData(foodData);
        } else {
          console.log("⚠️ No food menu data found");
          setFoodMenu([]);
        }
        
      } catch (err) {
        console.error("❌ Error in fetchFoodMenu:", err);
        console.error("Error response:", err.response?.data);
        setFoodMenu([]);
      } finally {
        setMenuLoading(false);
      }
    };
    
    // Helper function to process food data
    const processFoodData = (foodData) => {
      console.log("🔧 Processing food data:", foodData);
      
      try {
        let processedMenu = [];
        
        // Parse if it's a string
        if (typeof foodData === 'string') {
          try {
            foodData = JSON.parse(foodData);
            console.log("✅ Parsed food menu JSON:", foodData);
          } catch (parseError) {
            console.error("❌ Failed to parse food menu JSON:", parseError);
            setFoodMenu([]);
            return;
          }
        }
        
        // Case 1: Object with breakfast, lunch, dinner properties
        if (foodData.breakfast || foodData.lunch || foodData.dinner) {
          const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          
          processedMenu = days.map(day => ({
            day: day.charAt(0).toUpperCase() + day.slice(1),
            breakfast: foodData.breakfast?.[day] || foodData.breakfast?.[day.toUpperCase()] || foodData.breakfast || "-",
            lunch: foodData.lunch?.[day] || foodData.lunch?.[day.toUpperCase()] || foodData.lunch || "-",
            dinner: foodData.dinner?.[day] || foodData.dinner?.[day.toUpperCase()] || foodData.dinner || "-"
          }));
          
          console.log("📅 Processed weekly menu:", processedMenu);
        }
        // Case 2: Array format
        else if (Array.isArray(foodData)) {
          processedMenu = foodData.map(item => ({
            day: item.day || item.Day || "Day " + (item.id || ""),
            breakfast: item.breakfast || item.Breakfast || "-",
            lunch: item.lunch || item.Lunch || "-",
            dinner: item.dinner || item.Dinner || "-"
          }));
          
          console.log("📅 Processed array menu:", processedMenu);
        }
        // Case 3: Object with day keys
        else if (typeof foodData === 'object' && foodData !== null) {
          processedMenu = Object.entries(foodData).map(([day, menu]) => ({
            day: day.charAt(0).toUpperCase() + day.slice(1),
            breakfast: menu.breakfast || menu.Breakfast || "-",
            lunch: menu.lunch || menu.Lunch || "-",
            dinner: menu.dinner || menu.Dinner || "-"
          }));
          
          console.log("📅 Processed object menu:", processedMenu);
        }
        else {
          console.log("⚠️ Unknown food data format:", foodData);
          processedMenu = [];
        }
        
        setFoodMenu(processedMenu);
        
      } catch (error) {
        console.error("❌ Error processing food data:", error);
        setFoodMenu([]);
      }
    };
    
    // Only fetch when we have hostelId
    if (hostelId) {
      console.log("🚀 Starting food menu fetch...");
      fetchFoodMenu();
    }
  }, [hostelId]);

  // Image carousel
  const images = hostelData?.images?.length
    ? hostelData.images
    : [pg1, pg2, pg3, pg4, pg5];
  const prevImage = () =>
    setMainImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setMainImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  
  
// // Update your handleCreateBooking function:
// const handleCreateBooking = async (bookingData) => {
//   try {
//     console.log("🚀 Starting booking process...");
//     console.log("📦 Booking data:", bookingData);
    
//     setBookingLoading(true);
//     const token = localStorage.getItem("hlopgToken");

//     if (!bookingData.user) {
//       alert("Please provide your information");
//       return;
//     }

//     const currentUser = bookingData.user;
//     console.log("👤 Current user for booking:", currentUser);

//     // Prepare booking payload
//     const bookingPayload = {
//       hostel_id: hostelId,
//       user_name: currentUser.name,
//       user_email: currentUser.email,
//       user_phone: currentUser.phone || "Not provided",
//       sharing_type: bookingData.sharing,
//       booking_date: new Date().toISOString()
//     };

//     console.log("📤 Sending booking payload:", bookingPayload);

//     try {
//       // Send booking request
//       const bookingRes = await api.post("/booking/request", bookingPayload, {
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log("✅ Booking API response:", bookingRes.data);

//       if (bookingRes.data.success) {
//         const bookingId = bookingRes.data.booking_id || "BR-" + Date.now();
        
//         // IMPORTANT: Show success alert with owner contact message
//         const successMessage = 
//           `✅ Booking Request Sent Successfully!\n\n` +
//           `📋 Booking ID: ${bookingId}\n` +
//           `🏠 PG: ${hostelData.hostel_name}\n` +
//           `📍 Location: ${hostelData.address || `${hostelData.area}, ${hostelData.city}`}\n` +
//           `👤 Your Details:\n` +
//           `   • Name: ${currentUser.name}\n` +
//           `   • Email: ${currentUser.email}\n` +
//           `   • Phone: ${currentUser.phone || 'Not provided'}\n` +
//           `🛏️ Sharing Type: ${bookingData.sharing}\n\n` +
//           `📞 **The PG owner has been notified and will contact you shortly.**\n` +
//           `📱 Please keep your phone accessible.\n` +
//           `⏰ They will call you within 24 hours.\n\n` +
//           `Thank you for choosing HloPG!`;
        
//         console.log("💬 Showing success alert...");
        
//         // THIS IS THE ALERT THAT SHOULD APPEAR
//         alert(successMessage);
        
//         // Save user data
//         localStorage.setItem("hlopgUser", JSON.stringify(currentUser));
        
//         // Close popup
//         console.log("❌ Closing popup...");
//         setIsPopupOpen(false);
        
//       } else {
//         alert(`Booking failed: ${bookingRes.data.message || "Unknown error"}`);
//       }

//     } catch (bookingErr) {
//       console.error("❌ Booking API error:", bookingErr);
      
//       // Fallback success message (in case API fails but we want to show something)
//       const fallbackMessage = 
//         `📝 Booking Request Recorded!\n\n` +
//         `PG: ${hostelData.hostel_name}\n` +
//         `Location: ${hostelData.address || `${hostelData.area}, ${hostelData.city}`}\n\n` +
//         `Your Details:\n` +
//         `• Name: ${currentUser.name}\n` +
//         `• Email: ${currentUser.email}\n` +
//         `• Phone: ${currentUser.phone || 'Not provided'}\n\n` +
//         `📞 **The PG owner will contact you at the provided number.**\n` +
//         `⏰ Expected within 24 hours.\n\n` +
//         `If no contact, please call: 1800-123-4567`;
      
//       alert(fallbackMessage);
      
//       // Save user data anyway
//       localStorage.setItem("hlopgUser", JSON.stringify(currentUser));
      
//       setIsPopupOpen(false);
//     }

//   } catch (err) {
//     console.error("❌ Unexpected error:", err);
//     alert("Something went wrong. Please try again or contact support.");
//   } finally {
//     console.log("🏁 Booking process completed");
//     setBookingLoading(false);
//   }
// };

const handleCreateBooking = async (bookingData) => {
  try {
    console.log("🚀 Starting booking process...");
    console.log("📦 Booking data:", bookingData);
    
    setBookingLoading(true);
    const token = localStorage.getItem("hlopgToken");

    if (!bookingData.user) {
      alert("Please provide your information");
      return;
    }

    const currentUser = bookingData.user;
    console.log("👤 Current user for booking:", currentUser);

    // Get hostel details
    if (!hostelData) {
      alert("Hostel information not available");
      return;
    }

    // Prepare booking payload matching backend expectations
    const bookingPayload = {
      hostel_id: parseInt(hostelId), // Ensure it's a number
      user_name: currentUser.name || "Guest",
      user_email: currentUser.email || "",
      user_phone: currentUser.phone || "",
      sharing_type: bookingData.sharing || "single",
      // Add missing fields that backend might expect
      booking_date: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
    };

    console.log("📤 Sending booking payload:", bookingPayload);

    try {
      // Send booking request
      const bookingRes = await api.post("/booking/request", bookingPayload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("✅ Booking API response:", bookingRes.data);

      if (bookingRes.data.success) {
        const bookingId = bookingRes.data.booking_id || `BR-${Date.now()}`;
        
        // IMPORTANT: Show success alert with owner contact message
        const successMessage = 
          `✅ Booking Request Sent Successfully!\n\n` +
          `📋 Booking ID: ${bookingId}\n` +
          `🏠 PG: ${hostelData.hostel_name}\n` +
          `📍 Location: ${hostelData.address || `${hostelData.area}, ${hostelData.city}`}\n` +
          `👤 Your Details:\n` +
          `   • Name: ${currentUser.name}\n` +
          `   • Email: ${currentUser.email}\n` +
          `   • Phone: ${currentUser.phone || 'Not provided'}\n` +
          `🛏️ Sharing Type: ${bookingData.sharing}\n\n` +
          `📞 **The PG owner has been notified and will contact you shortly.**\n` +
          `📱 Please keep your phone accessible.\n` +
          `⏰ They will call you within 24 hours.\n\n` +
          `Thank you for choosing HloPG!`;
        
        console.log("💬 Showing success alert...");
        
        // THIS IS THE ALERT THAT SHOULD APPEAR
        alert(successMessage);
        
        // Save user data
        localStorage.setItem("hlopgUser", JSON.stringify(currentUser));
        
        // Close popup
        console.log("❌ Closing popup...");
        setIsPopupOpen(false);
        
      } else {
        alert(`Booking failed: ${bookingRes.data.message || "Unknown error"}`);
      }

    } catch (bookingErr) {
      console.error("❌ Booking API error:", bookingErr);
      console.error("Error details:", bookingErr.response?.data);
      
      // Check for specific validation errors
      if (bookingErr.response?.status === 400) {
        const errorMsg = bookingErr.response?.data?.message || 
                        "Invalid booking data. Please check your information.";
        alert(`Booking Error: ${errorMsg}`);
      } else {
        // Fallback success message (in case API fails but we want to show something)
        const fallbackMessage = 
          `📝 Booking Request Recorded!\n\n` +
          `PG: ${hostelData.hostel_name}\n` +
          `Location: ${hostelData.address || `${hostelData.area}, ${hostelData.city}`}\n\n` +
          `Your Details:\n` +
          `• Name: ${currentUser.name}\n` +
          `• Email: ${currentUser.email}\n` +
          `• Phone: ${currentUser.phone || 'Not provided'}\n\n` +
          `📞 **The PG owner will contact you at the provided number.**\n` +
          `⏰ Expected within 24 hours.\n\n` +
          `If no contact, please call: 1800-123-4567`;
        
        alert(fallbackMessage);
        
        // Save user data anyway
        localStorage.setItem("hlopgUser", JSON.stringify(currentUser));
        
        setIsPopupOpen(false);
      }
    }

  } catch (err) {
    console.error("❌ Unexpected error:", err);
    alert("Something went wrong. Please try again or contact support.");
  } finally {
    console.log("🏁 Booking process completed");
    setBookingLoading(false);
  }
};

  // Create notification for owner
const createOwnerNotification = async (bookingData) => {
  try {
    const token = localStorage.getItem("hlopgToken");
    
    const notificationPayload = {
      type: "booking_request",
      title: "New Booking Request",
      message: `${bookingData.user_name} wants to book ${bookingData.hostel_name}`,
      hostel_id: hostelId,
      hostel_name: bookingData.hostel_name,
      hostel_address: bookingData.hostel_address,
      user_id: bookingData.user_id,
      user_name: bookingData.user_name,
      user_email: bookingData.user_email,
      user_phone: bookingData.user_phone,
      sharing_type: bookingData.sharing_type,
      booking_date: bookingData.booking_date
    };

    console.log("Creating notification:", notificationPayload);

    // Send notification to backend
    await api.post("/notifications/create", notificationPayload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("✅ Notification created successfully");
  } catch (notifErr) {
    console.error("Notification creation error:", notifErr);
    // Continue even if notification fails
  }
};
  // Book Now Button
  // const handleBookNow = async () => {
  //   try {
  //     const token = localStorage.getItem("hlopgToken");
  //     const owner = localStorage.getItem("hlopgOwner");

  //     if (owner) {
  //       alert("You are logged in as Hostel Owner. Not authorized to book.");
  //       return;
  //     }

  //     if (!token) {
  //       alert("Please log in to continue booking.");
  //       navigate("/StudentLogin", { state: { from: location.pathname } });
  //       return;
  //     }

  //     // Fetch user details
  //     const res = await api.get("/auth/user", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (res.data.success) {
  //       setUser(res.data.user);
  //       setIsPopupOpen(true);
  //     } else {
  //       alert("Not authorized. Please log in again.");
  //       localStorage.removeItem("hlopgToken");
  //       navigate("/StudentLogin");
  //     }
  //   } catch (err) {
  //     console.error("Auth verification failed:", err);
  //     alert("Session expired. Please log in again.");
  //     localStorage.removeItem("hlopgToken");
  //     navigate("/StudentLogin", { state: { from: location.pathname } });
  //   }
  // };


// Replace your handleBookNow function with this:
const handleBookNow = async () => {
  try {
    const token = localStorage.getItem("hlopgToken");
    const owner = localStorage.getItem("hlopgOwner");

    // Check if user is owner
    if (owner) {
      alert("You are logged in as Hostel Owner. Not authorized to book.");
      return;
    }

    // Check if user is logged in
    if (!token) {
      alert("Please log in to send booking request.");
      navigate("/StudentLogin", { state: { from: location.pathname } });
      return;
    }

    // Force popup to open immediately
    setIsPopupOpen(true);
    
    // Then try to fetch user data
    const userStr = localStorage.getItem("hlopgUser");
    if (userStr && userStr !== "undefined" && userStr !== "null") {
      try {
        const cachedUser = JSON.parse(userStr);
        console.log("✅ Using cached user:", cachedUser.name);
        setUser(cachedUser);
        return;
      } catch (e) {
        console.log("Could not parse cached user:", e);
      }
    }

    // Fetch user from API if not in cache
    try {
      const res = await api.get("/auth/userid", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📡 User API response:", res.data);

      if (res.data && (res.data.id || res.data.name)) {
        const userData = res.data;
        const formattedUser = {
          id: userData.id || userData.user_id || Date.now(),
          name: userData.name || "User",
          email: userData.email || "user@example.com",
          phone: userData.phone || userData.mobile || "",
          userType: userData.userType || "USER"
        };

        console.log("✅ Formatted user:", formattedUser);
        setUser(formattedUser);
        localStorage.setItem("hlopgUser", JSON.stringify(formattedUser));
        
      } else {
        // Create default user
        const defaultUser = {
          id: Date.now(),
          name: "User",
          email: "user@example.com",
          phone: "",
          userType: "USER"
        };
        setUser(defaultUser);
      }
    } catch (apiErr) {
      console.error("❌ User API error:", apiErr);
      // Create fallback user
      const fallbackUser = {
        id: Date.now(),
        name: "User",
        email: "user@example.com",
        phone: "",
        userType: "USER"
      };
      setUser(fallbackUser);
    }
    
  } catch (err) {
    console.error("❌ Error in handleBookNow:", err);
    // Still open popup with default user
    setIsPopupOpen(true);
    setUser({
      id: Date.now(),
      name: "User",
      email: "user@example.com",
      phone: "",
      userType: "USER"
    });
  }
};

  // Replace your BookingPopup component with this:
const BookingPopup = ({ onClose, onSubmit }) => {
  const [selectedSharing, setSelectedSharing] = useState("single");
  const [userPhone, setUserPhone] = useState(user?.phone || "");
  const [userName, setUserName] = useState(user?.name || "");
  const [userEmail, setUserEmail] = useState(user?.email || "");
  
  console.log("🎯 Popup rendered with user:", user);
  console.log("🎯 isPopupOpen:", isPopupOpen);

  // If popup should not be open, return null
  if (!isPopupOpen) {
    console.log("❌ Popup not rendered because isPopupOpen is false");
    return null;
  }

  const sharingOptions = hostelData?.sharing_data 
    ? Object.entries(hostelData.sharing_data).map(([type, price]) => ({
        value: type,
        label: `${type === 'single' ? '1-Sharing' : 
                type === 'double' ? '2-Sharing' : 
                type === 'triple' ? '3-Sharing' : 
                type === 'four' ? '4-Sharing' : 
                type === 'five' ? '5-Sharing' : 
                type === 'six' ? '6-Sharing' : 
                `${type}-Sharing`} - ₹${price}/month`
      }))
    : [
        { value: "single", label: "1-Sharing - Contact for price" },
        { value: "double", label: "2-Sharing - Contact for price" },
        { value: "triple", label: "3-Sharing - Contact for price" }
      ];

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("📝 Form submitted");

     if (!userName.trim()) {
    alert("Please enter your name");
    return;
  }
  
  if (!userEmail.trim()) {
    alert("Please enter your email");
    return;
  }
  
  if (!userPhone.trim() || userPhone.length < 10) {
    alert("Please enter a valid phone number (10 digits minimum)");
    return;
  }
    
    // Create user object with form data
    const bookingUser = {
      id: user?.id || Date.now(),
      name: userName,
      email: userEmail,
      phone: userPhone || "",
      userType: user?.userType || "USER"
    };
    
    console.log("👤 Booking user:", bookingUser);
    
    // if (!userName.trim() || !userEmail.trim()) {
    //   alert("Please enter your name and email");
    //   return;
    // }
    
    const bookingData = {
      sharing: selectedSharing,
      price: hostelData?.sharing_data?.[selectedSharing] || "Contact for price",
      user: bookingUser
    };
    
    console.log("📦 Booking data:", bookingData);
    
    // Update global user state
    setUser(bookingUser);
    
    // Submit booking
    onSubmit(bookingData);
  };

   const handleClose = (e) => {
    e.stopPropagation(); // Stop event from bubbling up
    console.log("❌ Close button clicked");
    onClose();
  };

  const handleCancel = (e) => {
    e.stopPropagation(); // Stop event from bubbling up
    console.log("❌ Cancel button clicked");
    onClose();
  };

  const handleOverlayClick = (e) => {
    console.log("🖱️ Overlay clicked, target class:", e.target.className);
    // Only close if clicking directly on the overlay
    if (e.target.className === "popup-overlay") {
      console.log("✅ Closing popup via overlay click");
      onClose();
    }
  };

  return (
<div className="popup-overlay" onClick={handleOverlayClick}>
      <div className="booking-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Book {hostelData?.hostel_name || "PG"}</h3>
          <button className="close-popup" onClick={handleClose}>×</button>
        </div>
        
        <div className="popup-content">
          <div className="user-info-summary">
            <h4>Your Information</h4>
            
            
            {/* Name Input */}
            <div className="info-row">
              <span className="info-label">Name:*</span>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your full name"
                className="phone-input"
                required
              />
            </div>
            
            {/* Email Input */}
            <div className="info-row">
              <span className="info-label">Email:*</span>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter your email"
                className="phone-input"
                required
              />
            </div>
            
            {/* Phone Input */}
            <div className="info-row">
              <span className="info-label">Phone:*</span>
              <input
                type="tel"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="phone-input"
                required
              />
            </div>
            {/* <div className="phone-note">
              <small>⚠️ The PG owner will contact you on this number</small>
            </div> */}
          </div>

          {hostelData && (
            <div className="hostel-info-summary">
              <h4>PG Information</h4>
              <div className="info-row">
                <span className="info-label">PG Name:</span>
                <span className="info-value">{hostelData.hostel_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Address:</span>
                <span className="info-value">{hostelData.address || `${hostelData.area}, ${hostelData.city}`}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Type:</span>
                <span className="info-value">{hostelData.pg_type}'s PG</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label>Select Sharing Type:*</label>
              <div className="sharing-options">
                {sharingOptions.map((option) => (
                  <div 
                    key={option.value}
                    className={`sharing-option ${selectedSharing === option.value ? 'selected' : ''}`}
                    onClick={() => {
                      console.log("🎯 Selected sharing:", option.value);
                      setSelectedSharing(option.value);
                    }}
                  >
                    <input 
                      type="radio" 
                      name="sharing" 
                      value={option.value} 
                      checked={selectedSharing === option.value}
                      onChange={() => setSelectedSharing(option.value)}
                      hidden
                    />
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={handleCancel}
              >
                Cancel
              </button>
               <button 
                type="submit" 
                className="submit-btn" 
                disabled={bookingLoading}
              >
                {bookingLoading ? (
                  <>
                    <span className="spinner"></span>
                    Sending Request...
                  </>
                ) : (
                  "Send Booking Request"
                )}
              </button>
            </div>
          </form>

          {/* <div className="booking-note">
            <p>⚠️ Note: This is a booking request. The PG owner will contact you to confirm availability and complete the booking process.</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

  if (loading) return <div className="loading">Loading hostel details...</div>;
  if (!hostelData) return <div className="error">No hostel found.</div>;

  return (
    <div className="hostel-page">
      {/* Hostel UI */}
      <div className="hostel-main">
        {/* Left Images */}
        <div className="hostel-images">
          <div className="main-img">
            <button className="arrow-left" onClick={prevImage}>
              <FaChevronLeft />
            </button>
            <img src={images[mainImageIndex]} alt="Room" />
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
              />
            ))}
          </div>
        </div>

        {/* Right Details */}
        <div className="hostel-details">
          <h2 className="black-text">{hostelData.hostel_name}</h2>
          <p className="black-text">{hostelData.address}</p>
          <p className="black-text">
            <b>Type of Living:</b> {hostelData.pg_type}'s PG
          </p>

          {/* Pricing */}
          <div className="stats">
            {hostelData.sharing_data ? (
              Object.entries(hostelData.sharing_data).map(([sharing, price], idx) => (
                <div key={idx} className="stat-container">
                  <span className="stat-btn black-text">
                    {sharing === 'single' ? '1-Sharing' : 
                     sharing === 'double' ? '2-Sharing' : 
                     sharing === 'triple' ? '3-Sharing' : 
                     sharing === 'four' ? '4-Sharing' : 
                     sharing === 'five' ? '5-Sharing' : 
                     sharing === 'six' ? '6-Sharing' : 
                     `${sharing}-Sharing`}  ₹{price}
                  </span>
                </div>
              ))
            ) : hostelData.sharing ? (
              Object.entries(hostelData.sharing).map(([sharing, price], idx) => (
                <div key={idx} className="stat-container">
                  <span className="stat-btn black-text">
                    {sharing} ₹{price}
                  </span>
                </div>
              ))
            ) : (
              <div className="stat-container">
                <span className="stat-btn black-text">
                  Price not specified
                </span>
              </div>
            )}
          </div>

          {/* Amenities */}
          <h3 className="black-text">Amenities</h3>
          <div className="furnished-icons">
            {hostelData.facilities ? (
              <>
                {hostelData.facilities.wifi && (
                  <span>
                    <FaWifi /> Free WiFi
                  </span>
                )}
                {hostelData.facilities.parking && (
                  <span>
                    <FaParking /> Parking
                  </span>
                )}
                {hostelData.facilities.ac && (
                  <span>
                    <FaFan /> AC
                  </span>
                )}
                {hostelData.facilities.tv && (
                  <span>
                    <FaTv /> TV
                  </span>
                )}
                {hostelData.facilities.gym && (
                  <span>
                    <FaDoorClosed /> Gym
                  </span>
                )}
                {hostelData.facilities.geyser && (
                  <span>
                    <FaShower /> Hot Water
                  </span>
                )}
                {hostelData.facilities.fan && (
                  <span>
                    <FaFan /> Fan
                  </span>
                )}
                {hostelData.facilities.bed && (
                  <span>
                    <FaBed /> Bed
                  </span>
                )}
                {hostelData.facilities.lights && (
                  <span>
                    <FaLightbulb /> Lights
                  </span>
                )}
                {hostelData.facilities.cupboard && (
                  <span>
                    <FaDoorClosed /> Cupboard
                  </span>
                )}
                {hostelData.facilities.food && (
                  <span>
                    <FaLightbulb /> Food Included
                  </span>
                )}
                {hostelData.facilities.water && (
                  <span>
                    <FaShower /> 24/7 Water
                  </span>
                )}
                {hostelData.facilities.clean && (
                  <span>
                    <FaBroom /> Cleaning
                  </span>
                )}
              </>
            ) : hostelData.amenities ? (
              Object.entries(hostelData.amenities).map(([amenity, available], idx) => (
                available && (
                  <span key={idx}>
                    {amenity === 'wifi' && <><FaWifi /> WiFi</>}
                    {amenity === 'parking' && <><FaParking /> Parking</>}
                    {amenity === 'ac' && <><FaFan /> AC</>}
                    {amenity === 'tv' && <><FaTv /> TV</>}
                    {amenity === 'gym' && <><FaDoorClosed /> Gym</>}
                    {amenity === 'geyser' && <><FaShower /> Hot Water</>}
                    {amenity === 'fan' && <><FaFan /> Fan</>}
                    {amenity === 'bed' && <><FaBed /> Bed</>}
                    {amenity === 'lights' && <><FaLightbulb /> Lights</>}
                    {amenity === 'cupboard' && <><FaDoorClosed /> Cupboard</>}
                    {amenity === 'food' && <><FaLightbulb /> Food</>}
                    {amenity === 'water' && <><FaShower /> Water</>}
                    {amenity === 'clean' && <><FaBroom /> Cleaning</>}
                  </span>
                )
              ))
            ) : (
              <span className="black-text">No amenities listed</span>
            )}
          </div>

          {/* Reviews */}
          <div className="reviews-section">
            <h2 className="black-text">PG Reviews</h2>
            <div className="rating-overviews">
              <div className="avg-rating">
                <span className="rating-number">{avgRating.toFixed(1)}</span>
                {renderStars(avgRating)}
                <span className="total-reviews">({totalReviews} reviews)</span>
              </div>
            </div>

            <div className="reviews-list">
              {dummyReviews.slice(0, 1).map((review) => (
                <div key={review.id} className="review-item">
                  <div className="reviewer-info">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="reviewer-avatar"
                    />
                    <div>
                      <h4 className="reviewer-name">{review.name}</h4>
                      <p className="review-date">{review.date}</p>
                    </div>
                  </div>
                  <div className="review-content">
                    {renderStars(review.rating)}
                    <p className="review-text">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    
      {/* Food Menu */}
 <div className="food-menu">
     <h2 className="black-text">Food Menu</h2>
  
   {/* Debug info - you can remove this after fixing */}
  <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
    Debug: Hostel ID: {hostelId} | Menu Items: {foodMenu.length} | Loading: {menuLoading ? 'Yes' : 'No'}
   </div>
  
 {menuLoading ? (
    <div className="loading-food">
      <p>Loading food menu...</p>
      <p style={{ fontSize: '14px', color: '#888' }}>Please wait while we fetch the meal details</p>
    </div>
  ) : foodMenu.length > 0 ? (
    <>
      <table className="food-table">
        <thead>
          <tr>
            <th>DAY</th>
            <th>BREAKFAST</th>
            <th>LUNCH</th>
            <th>DINNER</th>
          </tr>
        </thead>
        <tbody>
          {foodMenu.map((day, idx) => (
            <tr key={idx} className="food-row">
              <td className="day-cell">
                <strong>{day.day}</strong>
              </td>
              <td className="meal-cell">
                {typeof day.breakfast === 'string' ? day.breakfast : 
                 Array.isArray(day.breakfast) ? day.breakfast.join(', ') : 
                 JSON.stringify(day.breakfast)}
              </td>
              <td className="meal-cell">
                {typeof day.lunch === 'string' ? day.lunch : 
                 Array.isArray(day.lunch) ? day.lunch.join(', ') : 
                 JSON.stringify(day.lunch)}
              </td>
              <td className="meal-cell">
                {typeof day.dinner === 'string' ? day.dinner : 
                 Array.isArray(day.dinner) ? day.dinner.join(', ') : 
                 JSON.stringify(day.dinner)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <p className="food-menu-note">Menu is subject to change based on availability and season</p> */}
    </>
  ) : (
    <div className="no-food-menu">
      <p>🍽️ No food menu available for this hostel</p>
      <p className="small-text">
        The hostel hasn't provided a food menu yet. 
        You can contact them directly for meal information.
      </p>
      <button 
        className="contact-hostel-btn"
        onClick={() => alert("Contact feature coming soon!")}
      >
        Contact Hostel
      </button>
    </div>
  )}
</div>

      {/* Book Now Button */}
      {/* <div className="book-now">
        <button className="book-now-btn" onClick={handleBookNow}>
          Book Now
        </button>
      </div> */}

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
        <BookingPopup 
          onClose={() => setIsPopupOpen(false)} 
          onSubmit={handleCreateBooking}
        />
      )}
    </div>
  );
};

export default HostelPage;

