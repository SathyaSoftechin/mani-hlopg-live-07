// // // // src/pages/MyRooms.jsx
// // // import React, { useState, useEffect } from "react";
// // // import "./MyRooms.css";
// // // import api from "../api";

// // // const MyRooms = ({ user }) => {
// // //   const [pgs, setPGs] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [selectedPG, setSelectedPG] = useState(null);
// // //   const [rooms, setRooms] = useState([]);
// // //   const [roomLoading, setRoomLoading] = useState(false);
// // //   const [filteredRooms, setFilteredRooms] = useState([]);
// // //   const [refreshKey, setRefreshKey] = useState(0);
  
// // //   // NEW: Floor & room configuration from PG data
// // //   const [pgConfig, setPgConfig] = useState({
// // //     numFloors: 0,
// // //     roomsPerFloor: 0,
// // //     startingRoomNumber: "",
// // //     advanceAmount: 0
// // //   });

// // //   // Fetch owner's PGs
// // //   useEffect(() => {
// // //     const fetchPGs = async () => {
// // //       try {
// // //         setLoading(true);
// // //         const token = localStorage.getItem("hlopgToken");
        
// // //         let pgsData = [];
        
// // //         try {
// // //           // First try: /owner/pg
// // //           const response = await api.get(`/owner/pg`, {
// // //             headers: { Authorization: `Bearer ${token}` }
// // //           });
// // //           pgsData = response.data || [];
// // //         } catch (error) {
// // //           console.log("First endpoint failed, trying alternative...");
          
// // //           try {
// // //             // Try: /hostel/owner/pgs (your working endpoint)
// // //             const response = await api.get(`/hostel/owner/pgs`, {
// // //               headers: { Authorization: `Bearer ${token}` }
// // //             });
// // //             if (response.data.success) {
// // //               pgsData = response.data.data || [];
// // //             }
// // //           } catch (error2) {
// // //             console.log("Alternative endpoint also failed:", error2);
// // //           }
// // //         }
        
// // //         console.log("PGs fetched:", pgsData);
        
// // //         if (pgsData && pgsData.length > 0) {
// // //           const formattedPGs = pgsData.map(pg => ({
// // //             hostel_id: pg.hostel_id || pg.id || pg._id,
// // //             hostel_name: pg.hostel_name || pg.name || "Unnamed PG",
// // //             area: pg.area || pg.location?.area || "Unknown Area",
// // //             city: pg.city || pg.location?.city || "Unknown City",
// // //             state: pg.state || pg.location?.state || "",
// // //             total_rooms: pg.total_rooms || pg.rooms_count || 0,
// // //             occupied_rooms: pg.occupied_rooms || 0,
// // //             vacant_rooms: pg.vacant_rooms || 0,
// // //             img: pg.img || pg.images?.[0] || "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=PG",
// // //             // Store raw PG data for configuration
// // //             rawData: pg
// // //           }));
          
// // //           setPGs(formattedPGs);
// // //           localStorage.setItem("hlopgOwnerPGs", JSON.stringify(formattedPGs));
          
// // //           if (!selectedPG && formattedPGs.length > 0) {
// // //             setSelectedPG(formattedPGs[0]);
// // //           }
// // //         } else {
// // //           setPGs([]);
// // //           localStorage.removeItem("hlopgOwnerPGs");
// // //         }
// // //       } catch (error) {
// // //         console.error("Error fetching PGs:", error);
// // //         setPGs([]);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     if (user?.owner_id) {
// // //       fetchPGs();
// // //     } else {
// // //       const cachedUser = localStorage.getItem("hlopgOwner");
// // //       if (cachedUser) {
// // //         try {
// // //           const parsedUser = JSON.parse(cachedUser);
// // //           if (parsedUser.owner_id || parsedUser.id) {
// // //             fetchPGs();
// // //           }
// // //         } catch (e) {
// // //           console.error("Error parsing cached user:", e);
// // //         }
// // //       }
// // //     }
// // //   }, [user, refreshKey]);

// // //   // Fetch rooms AND PG configuration for selected PG
// // //   useEffect(() => {
// // //     const fetchRoomsAndConfig = async () => {
// // //       if (!selectedPG) return;
      
// // //       try {
// // //         setRoomLoading(true);
// // //         const token = localStorage.getItem("hlopgToken");
        
// // //         console.log("Fetching rooms and config for PG:", selectedPG.hostel_id);
        
// // //         let roomsData = [];
        
// // //         // Fetch rooms
// // //         try {
// // //           const response = await api.get(`/rooms/pg/${selectedPG.hostel_id}`, {
// // //             headers: { Authorization: `Bearer ${token}` }
// // //           });
// // //           roomsData = response.data || [];
// // //         } catch (error) {
// // //           console.log("Rooms endpoint failed, trying alternative...");
// // //           try {
// // //             const response = await api.get(`/owner/rooms/${selectedPG.hostel_id}`, {
// // //               headers: { Authorization: `Bearer ${token}` }
// // //             });
// // //             roomsData = response.data || [];
// // //           } catch (error2) {
// // //             console.log("All rooms endpoints failed, using sample data");
// // //             roomsData = createSampleRooms();
// // //           }
// // //         }
        
// // //         setRooms(roomsData);
        
// // //         // Process floor/room configuration from PG data
// // //         processPgConfiguration(selectedPG.rawData);
        
// // //         // Group rooms by floor
// // //         processRoomsByFloor(roomsData);
        
// // //       } catch (error) {
// // //         console.error("Error fetching data:", error);
// // //         const sampleData = createSampleRooms();
// // //         setRooms(sampleData);
// // //         processRoomsByFloor(sampleData);
// // //         processPgConfiguration(selectedPG.rawData);
// // //       } finally {
// // //         setRoomLoading(false);
// // //       }
// // //     };

// // //     fetchRoomsAndConfig();
// // //   }, [selectedPG]);

// // //   // Process PG configuration (numFloors, roomsPerFloor, etc.)
// // //   const processPgConfiguration = (pgData) => {
// // //     if (!pgData) return;
    
// // //     const config = {
// // //       numFloors: 0,
// // //       roomsPerFloor: 0,
// // //       startingRoomNumber: "",
// // //       advanceAmount: 0
// // //     };
    
// // //     // Try to extract from raw PG data
// // //     if (pgData.numFloors) {
// // //       config.numFloors = parseInt(pgData.numFloors) || 0;
// // //     }
    
// // //     if (pgData.roomsPerFloor) {
// // //       config.roomsPerFloor = parseInt(pgData.roomsPerFloor) || 0;
// // //     }
    
// // //     if (pgData.startingRoomNumber) {
// // //       config.startingRoomNumber = pgData.startingRoomNumber;
// // //     }
    
// // //     if (pgData.advanceAmount) {
// // //       config.advanceAmount = parseInt(pgData.advanceAmount) || 0;
// // //     }
    
// // //     // If not found in direct fields, try to parse from JSON fields
// // //     if (!config.numFloors && pgData.room_config) {
// // //       try {
// // //         const roomConfig = typeof pgData.room_config === 'string' 
// // //           ? JSON.parse(pgData.room_config) 
// // //           : pgData.room_config;
// // //         config.numFloors = parseInt(roomConfig.numFloors) || 0;
// // //         config.roomsPerFloor = parseInt(roomConfig.roomsPerFloor) || 0;
// // //         config.startingRoomNumber = roomConfig.startingRoomNumber || "";
// // //       } catch (e) {
// // //         console.log("Could not parse room_config");
// // //       }
// // //     }
    
// // //     // If still not found, use defaults
// // //     if (!config.numFloors) config.numFloors = 3;
// // //     if (!config.roomsPerFloor) config.roomsPerFloor = 5;
// // //     if (!config.startingRoomNumber) config.startingRoomNumber = "101";
    
// // //     setPgConfig(config);
// // //   };

// // //   // Process rooms and group by floor
// // //   const processRoomsByFloor = (roomsData) => {
// // //     const floors = {};
    
// // //     roomsData.forEach(room => {
// // //       let floor = 1;
// // //       if (room.room_number) {
// // //         const firstChar = room.room_number.charAt(0);
// // //         if (!isNaN(firstChar)) {
// // //           floor = parseInt(firstChar);
// // //         }
// // //       } else if (room.floor) {
// // //         floor = parseInt(room.floor);
// // //       }
      
// // //       if (floor < 1) floor = 1;
// // //       if (floor > 10) floor = 10;
      
// // //       if (!floors[floor]) {
// // //         floors[floor] = [];
// // //       }
      
// // //       floors[floor].push({
// // //         id: room.id || room._id || Date.now() + Math.random(),
// // //         room_number: room.room_number || `F${floor}R${floors[floor].length + 1}`,
// // //         floor: floor,
// // //         sharing_type: room.sharing_type || room.sharing || "2-Sharing",
// // //         rent: room.rent || room.price || 5000,
// // //         status: room.status || "vacant",
// // //         tenant_name: room.tenant_name || room.tenant?.name || null,
// // //         tenant_phone: room.tenant_phone || room.tenant?.phone || null,
// // //         amenities: room.amenities || ["WiFi", "Attached Bathroom"]
// // //       });
// // //     });
    
// // //     // Create expected floors based on configuration
// // //     const expectedFloors = pgConfig.numFloors || 3;
// // //     for (let floor = 1; floor <= expectedFloors; floor++) {
// // //       if (!floors[floor]) {
// // //         floors[floor] = [];
// // //       }
// // //     }
    
// // //     const filtered = Object.keys(floors)
// // //       .map(floor => ({
// // //         floor: parseInt(floor),
// // //         rooms: floors[floor].sort((a, b) => a.room_number.localeCompare(b.room_number))
// // //       }))
// // //       .sort((a, b) => a.floor - b.floor);
    
// // //     setFilteredRooms(filtered);
// // //   };

// // //   // Create sample room data
// // //   const createSampleRooms = () => {
// // //     if (!selectedPG) return [];
    
// // //     const sampleRooms = [];
// // //     const totalFloors = pgConfig.numFloors || 3;
// // //     const roomsPerFloor = pgConfig.roomsPerFloor || 5;
// // //     const startNumber = parseInt(pgConfig.startingRoomNumber?.replace(/\D/g, '')) || 100;
    
// // //     for (let floor = 1; floor <= totalFloors; floor++) {
// // //       for (let roomNum = 1; roomNum <= roomsPerFloor; roomNum++) {
// // //         const roomId = `${floor}0${roomNum}`;
// // //         sampleRooms.push({
// // //           id: roomId,
// // //           room_number: roomId,
// // //           floor: floor,
// // //           sharing_type: ["2-Sharing", "3-Sharing", "4-Sharing"][Math.floor(Math.random() * 3)],
// // //           rent: 5000 + (floor * 500) + (roomNum * 100),
// // //           status: roomNum % 2 === 0 ? "occupied" : "vacant",
// // //           tenant_name: roomNum % 2 === 0 ? ["John Doe", "Jane Smith", "Robert Johnson"][Math.floor(Math.random() * 3)] : null,
// // //           tenant_phone: roomNum % 2 === 0 ? "9876543210" : null,
// // //           amenities: ["WiFi", "Attached Bathroom", "AC", "TV"],
// // //           pg_id: selectedPG.hostel_id
// // //         });
// // //       }
// // //     }
    
// // //     return sampleRooms;
// // //   };

// // //   // Get floor name
// // //   const getFloorName = (floor) => {
// // //     if (floor === 1) return "1st Floor";
// // //     if (floor === 2) return "2nd Floor";
// // //     if (floor === 3) return "3rd Floor";
// // //     return `${floor}th Floor`;
// // //   };

// // //   // Update room status
// // //   const updateRoomStatus = async (roomId, newStatus) => {
// // //     try {
// // //       const updatedRooms = rooms.map(room => 
// // //         room.id === roomId ? { ...room, status: newStatus } : room
// // //       );
      
// // //       setRooms(updatedRooms);
// // //       processRoomsByFloor(updatedRooms);
      
// // //       const token = localStorage.getItem("hlopgToken");
// // //       await api.put(`/rooms/${roomId}/status`, 
// // //         { status: newStatus },
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
      
// // //       alert(`Room status updated to ${newStatus}`);
// // //     } catch (error) {
// // //       console.error("Error updating room status:", error);
// // //       alert("Failed to update room status. Please try again.");
// // //     }
// // //   };

// // //   // Add new room
// // //   const handleAddRoom = () => {
// // //     if (!selectedPG) {
// // //       alert("Please select a PG first");
// // //       return;
// // //     }
    
// // //     const floor = prompt("Enter floor number (1-10):", "1");
// // //     if (!floor || isNaN(floor) || floor < 1 || floor > 10) {
// // //       alert("Please enter a valid floor number between 1-10");
// // //       return;
// // //     }
    
// // //     const roomNumber = prompt("Enter room number (e.g., 101, 201):", `${floor}01`);
// // //     if (!roomNumber) {
// // //       alert("Room number is required");
// // //       return;
// // //     }
    
// // //     const sharingType = prompt("Enter sharing type (e.g., 2-Sharing, 3-Sharing):", "2-Sharing");
// // //     if (!sharingType) {
// // //       alert("Sharing type is required");
// // //       return;
// // //     }
    
// // //     const rent = prompt("Enter monthly rent:", "5000");
// // //     if (!rent || isNaN(rent)) {
// // //       alert("Please enter a valid rent amount");
// // //       return;
// // //     }
    
// // //     const newRoom = {
// // //       id: Date.now().toString(),
// // //       room_number: roomNumber,
// // //       floor: parseInt(floor),
// // //       sharing_type: sharingType,
// // //       rent: parseInt(rent),
// // //       status: "vacant",
// // //       tenant_name: null,
// // //       tenant_phone: null,
// // //       amenities: ["Basic"],
// // //       pg_id: selectedPG.hostel_id
// // //     };
    
// // //     setRooms(prev => [...prev, newRoom]);
// // //     processRoomsByFloor([...rooms, newRoom]);
    
// // //     alert("Room added successfully!");
// // //   };

// // //   // Refresh data
// // //   const handleRefresh = () => {
// // //     setRefreshKey(prev => prev + 1);
// // //     setRoomLoading(true);
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="myrooms-loading">
// // //         <div className="spinner"></div>
// // //         <p>Loading your PGs...</p>
// // //       </div>
// // //     );
// // //   }

// // //   if (pgs.length === 0) {
// // //     return (
// // //       <div className="myrooms-empty">
// // //         <div className="empty-icon">🏠</div>
// // //         <h3>No PGs Found</h3>
// // //         <p>You haven't uploaded any PGs yet.</p>
// // //         <p>Go to "Upload PG" to add your first property.</p>
// // //         <button 
// // //           className="go-to-upload-btn"
// // //           onClick={() => window.location.href = "/owner-dashboard?tab=Upload PG"}
// // //         >
// // //           Upload PG
// // //         </button>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="myrooms-container">
// // //       {/* PG Selection Header */}
// // //       <div className="myrooms-header">
// // //         <div className="pg-selector">
// // //           <h2>Select PG:</h2>
// // //           <select 
// // //             value={selectedPG?.hostel_id || ""}
// // //             onChange={(e) => {
// // //               const pg = pgs.find(p => p.hostel_id == e.target.value);
// // //               if (pg) {
// // //                 setSelectedPG(pg);
// // //                 setRooms([]);
// // //                 setFilteredRooms([]);
// // //               }
// // //             }}
// // //             className="pg-dropdown"
// // //           >
// // //             {pgs.map(pg => (
// // //               <option key={pg.hostel_id} value={pg.hostel_id}>
// // //                 {pg.hostel_name} - {pg.area}, {pg.city}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>
        
// // //         <div className="header-actions">
// // //           <button className="refresh-btn" onClick={handleRefresh}>
// // //             🔄 Refresh
// // //           </button>
// // //           <button className="add-room-btn" onClick={handleAddRoom}>
// // //             + Add New Room
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* PG Info Summary with Configuration */}
// // //       {selectedPG && (
// // //         <div className="pg-info-summary">
// // //           <div className="summary-card">
// // //             <div className="summary-header">
// // //               <h3>{selectedPG.hostel_name}</h3>
// // //               <p className="pg-location">📍 {selectedPG.area}, {selectedPG.city}, {selectedPG.state}</p>
// // //             </div>
            
// // //             {/* Floor/Room Configuration Display */}
// // //             <div className="config-display">
// // //               <div className="config-item">
// // //                 <span className="config-label">Floors:</span>
// // //                 <span className="config-value">{pgConfig.numFloors}</span>
// // //               </div>
// // //               <div className="config-item">
// // //                 <span className="config-label">Rooms per Floor:</span>
// // //                 <span className="config-value">{pgConfig.roomsPerFloor}</span>
// // //               </div>
// // //               <div className="config-item">
// // //                 <span className="config-label">Starting Room:</span>
// // //                 <span className="config-value">{pgConfig.startingRoomNumber}</span>
// // //               </div>
// // //               <div className="config-item">
// // //                 <span className="config-label">Advance Amount:</span>
// // //                 <span className="config-value">₹{pgConfig.advanceAmount}</span>
// // //               </div>
// // //             </div>
            
// // //             <div className="summary-stats">
// // //               <div className="stat">
// // //                 <span className="stat-label">Total Rooms</span>
// // //                 <span className="stat-value">{rooms.length}</span>
// // //               </div>
// // //               <div className="stat">
// // //                 <span className="stat-label">Occupied</span>
// // //                 <span className="stat-value occupied-count">
// // //                   {rooms.filter(r => r.status === 'occupied').length}
// // //                 </span>
// // //               </div>
// // //               <div className="stat">
// // //                 <span className="stat-label">Vacant</span>
// // //                 <span className="stat-value vacant-count">
// // //                   {rooms.filter(r => r.status === 'vacant').length}
// // //                 </span>
// // //               </div>
// // //               <div className="stat">
// // //                 <span className="stat-label">Revenue</span>
// // //                 <span className="stat-value revenue-count">
// // //                   ₹{rooms.filter(r => r.status === 'occupied').reduce((sum, room) => sum + room.rent, 0)}
// // //                 </span>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Room Management - Floors */}
// // //       {roomLoading ? (
// // //         <div className="rooms-loading">
// // //           <div className="spinner small"></div>
// // //           <p>Loading rooms...</p>
// // //         </div>
// // //       ) : filteredRooms.length === 0 ? (
// // //         <div className="no-rooms-found">
// // //           <div className="no-rooms-icon">🚪</div>
// // //           <h3>No Rooms Found</h3>
// // //           <p>This PG doesn't have any rooms yet.</p>
// // //           <button className="add-first-room-btn" onClick={handleAddRoom}>
// // //             + Add First Room
// // //           </button>
// // //         </div>
// // //       ) : (
// // //         <div className="rooms-management">
// // //           {filteredRooms.map(({ floor, rooms: floorRooms }) => (
// // //             <div key={floor} className="floor-section">
// // //               <div className="floor-header">
// // //                 <h3 className="floor-title">
// // //                   {getFloorName(floor)}
// // //                   <span className="floor-room-count">({floorRooms.length} rooms)</span>
// // //                 </h3>
// // //                 <div className="floor-stats">
// // //                   <span className="floor-stat-item">
// // //                     <span className="stat-dot vacant-dot"></span>
// // //                     Vacant: {floorRooms.filter(r => r.status === 'vacant').length}
// // //                   </span>
// // //                   <span className="floor-stat-item">
// // //                     <span className="stat-dot occupied-dot"></span>
// // //                     Occupied: {floorRooms.filter(r => r.status === 'occupied').length}
// // //                   </span>
// // //                   <span className="floor-stat-item">
// // //                     <span className="stat-dot maintenance-dot"></span>
// // //                     Maintenance: {floorRooms.filter(r => r.status === 'maintenance').length}
// // //                   </span>
// // //                 </div>
// // //               </div>
              
// // //               <div className="rooms-grid">
// // //                 {floorRooms.map(room => (
// // //                   <div 
// // //                     key={room.id} 
// // //                     className={`room-card ${room.status}`}
// // //                     onClick={() => handleRoomClick(room)}
// // //                   >
// // //                     <div className="room-header">
// // //                       <div className="room-number-section">
// // //                         <span className="room-number">{room.room_number}</span>
// // //                         <span className="room-sharing">{room.sharing_type}</span>
// // //                       </div>
// // //                       <div className="room-status-container">
// // //                         <select 
// // //                           value={room.status}
// // //                           onChange={(e) => updateRoomStatus(room.id, e.target.value)}
// // //                           className="status-select"
// // //                           onClick={(e) => e.stopPropagation()}
// // //                         >
// // //                           <option value="vacant">Vacant</option>
// // //                           <option value="occupied">Occupied</option>
// // //                           <option value="maintenance">Maintenance</option>
// // //                         </select>
// // //                       </div>
// // //                     </div>
                    
// // //                     <div className="room-details">
// // //                       <div className="room-rent-section">
// // //                         <span className="rent-label">Monthly Rent</span>
// // //                         <span className="room-rent">₹{room.rent}</span>
// // //                       </div>
                      
// // //                       {room.status === 'occupied' && room.tenant_name && (
// // //                         <div className="tenant-info">
// // //                           <p className="tenant-name">
// // //                             <span className="tenant-icon">👤</span>
// // //                             {room.tenant_name}
// // //                           </p>
// // //                           {room.tenant_phone && (
// // //                             <p className="tenant-phone">
// // //                               <span className="phone-icon">📞</span>
// // //                               {room.tenant_phone}
// // //                             </p>
// // //                           )}
// // //                         </div>
// // //                       )}
                      
// // //                       {room.status === 'vacant' && (
// // //                         <div className="vacant-info">
// // //                           <div className="vacant-badge">Available</div>
// // //                           <p className="vacant-text">Ready to move in</p>
// // //                         </div>
// // //                       )}
                      
// // //                       {room.status === 'maintenance' && (
// // //                         <div className="maintenance-info">
// // //                           <div className="maintenance-badge">Under Maintenance</div>
// // //                           <p className="maintenance-text">Not available for rent</p>
// // //                         </div>
// // //                       )}
// // //                     </div>
                    
// // //                     <div className="room-actions">
// // //                       <button 
// // //                         className="edit-btn"
// // //                         onClick={(e) => {
// // //                           e.stopPropagation();
// // //                           handleRoomClick(room);
// // //                         }}
// // //                       >
// // //                         Edit
// // //                       </button>
// // //                       <button 
// // //                         className="details-btn"
// // //                         onClick={(e) => {
// // //                           e.stopPropagation();
// // //                           handleRoomClick(room);
// // //                         }}
// // //                       >
// // //                         View Details
// // //                       </button>
// // //                     </div>
// // //                   </div>
// // //                 ))}
                
// // //                 {/* Add Room Card for this floor */}
// // //                 <div 
// // //                   className="add-room-card"
// // //                   onClick={() => {
// // //                     const roomNumber = prompt(`Enter room number for ${getFloorName(floor)}:`, `${floor}${floorRooms.length + 1}`);
// // //                     if (roomNumber) {
// // //                       handleAddRoom();
// // //                     }
// // //                   }}
// // //                 >
// // //                   <div className="add-room-content">
// // //                     <span className="add-icon">+</span>
// // //                     <span className="add-text">Add Room</span>
// // //                     <span className="add-subtext">to {getFloorName(floor)}</span>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // // Keep the handleRoomClick function as is
// // // const handleRoomClick = (room) => {
// // //   console.log("Room clicked:", room);
  
// // //   const roomInfo = `
// // // Room Details:
// // // -------------
// // // Room Number: ${room.room_number}
// // // Floor: ${room.floor === 1 ? "1st Floor" : room.floor === 2 ? "2nd Floor" : room.floor === 3 ? "3rd Floor" : `${room.floor}th Floor`}
// // // Sharing Type: ${room.sharing_type}
// // // Rent: ₹${room.rent}/month
// // // Status: ${room.status.toUpperCase()}
// // // ${room.tenant_name ? `\nTenant: ${room.tenant_name}\nPhone: ${room.tenant_phone}` : 'Status: VACANT'}
// // //   `.trim();
  
// // //   alert(roomInfo);
// // // };

// // // export default MyRooms;

// // // src/pages/MyRooms.jsx
// // import React, { useState, useEffect } from "react";
// // import "./MyRooms.css";
// // import api from "../api";

// // const MyRooms = ({ user }) => {
// //   const [pgs, setPGs] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedPG, setSelectedPG] = useState(null);
// //   const [rooms, setRooms] = useState([]);
// //   const [roomLoading, setRoomLoading] = useState(false);
// //   const [filteredRooms, setFilteredRooms] = useState([]);
// //   const [refreshKey, setRefreshKey] = useState(0);
  
// //   // Floor & room configuration from PG data
// //   const [pgConfig, setPgConfig] = useState({
// //     numFloors: 0,
// //     roomsPerFloor: 0,
// //     startingRoomNumber: "",
// //     advanceAmount: 0,
// //     sharingData: {}
// //   });

// //   // Fetch owner's PGs
// //   useEffect(() => {
// //     const fetchPGs = async () => {
// //       try {
// //         setLoading(true);
// //         const token = localStorage.getItem("hlopgToken");
        
// //         let pgsData = [];
        
// //         try {
// //           // Try the primary endpoint: /hostel/owner/pgs
// //           const response = await api.get(`/hostel/owner/pgs`, {
// //             headers: { Authorization: `Bearer ${token}` }
// //           });
// //           if (response.data && response.data.success) {
// //             pgsData = response.data.data || [];
// //           }
// //         } catch (error) {
// //           console.log("Primary endpoint failed, trying alternatives...");
          
// //           try {
// //             // Try: /owner/pg
// //             const response = await api.get(`/owner/pg`, {
// //               headers: { Authorization: `Bearer ${token}` }
// //             });
// //             pgsData = response.data || [];
// //           } catch (error2) {
// //             console.log("Alternative endpoint also failed:", error2);
// //           }
// //         }
        
// //         console.log("PGs fetched:", pgsData);
        
// //         if (pgsData && pgsData.length > 0) {
// //           const formattedPGs = pgsData.map(pg => {
// //             // Parse sharing data
// //             let sharingData = {};
// //             if (pg.sharing_data) {
// //               try {
// //                 sharingData = typeof pg.sharing_data === 'string' 
// //                   ? JSON.parse(pg.sharing_data) 
// //                   : pg.sharing_data;
// //               } catch (e) {
// //                 console.log("Could not parse sharing_data");
// //               }
// //             } else if (pg.sharing) {
// //               try {
// //                 sharingData = typeof pg.sharing === 'string' 
// //                   ? JSON.parse(pg.sharing) 
// //                   : pg.sharing;
// //               } catch (e) {
// //                 console.log("Could not parse sharing");
// //               }
// //             }
            
// //             return {
// //               hostel_id: pg.hostel_id || pg.id || pg._id,
// //               hostel_name: pg.hostel_name || pg.name || "Unnamed PG",
// //               area: pg.area || pg.location?.area || "Unknown Area",
// //               city: pg.city || pg.location?.city || "Unknown City",
// //               state: pg.state || pg.location?.state || "",
// //               total_rooms: pg.total_rooms || pg.rooms_count || 0,
// //               occupied_rooms: pg.occupied_rooms || 0,
// //               vacant_rooms: pg.vacant_rooms || 0,
// //               img: pg.img || pg.images?.[0] || "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=PG",
// //               // Store configuration data
// //               sharing_data: sharingData,
// //               numFloors: pg.numFloors,
// //               roomsPerFloor: pg.roomsPerFloor,
// //               startingRoomNumber: pg.startingRoomNumber,
// //               advanceAmount: pg.advanceAmount,
// //               rawData: pg
// //             };
// //           });
          
// //           setPGs(formattedPGs);
// //           localStorage.setItem("hlopgOwnerPGs", JSON.stringify(formattedPGs));
          
// //           if (!selectedPG && formattedPGs.length > 0) {
// //             setSelectedPG(formattedPGs[0]);
// //           }
// //         } else {
// //           setPGs([]);
// //           localStorage.removeItem("hlopgOwnerPGs");
// //         }
// //       } catch (error) {
// //         console.error("Error fetching PGs:", error);
// //         setPGs([]);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (user?.owner_id) {
// //       fetchPGs();
// //     } else {
// //       const cachedUser = localStorage.getItem("hlopgOwner");
// //       if (cachedUser) {
// //         try {
// //           const parsedUser = JSON.parse(cachedUser);
// //           if (parsedUser.owner_id || parsedUser.id) {
// //             fetchPGs();
// //           }
// //         } catch (e) {
// //           console.error("Error parsing cached user:", e);
// //         }
// //       }
// //     }
// //   }, [user, refreshKey]);

// //   // Fetch rooms AND PG configuration for selected PG
// //   useEffect(() => {
// //     const fetchRoomsAndConfig = async () => {
// //       if (!selectedPG) return;
      
// //       try {
// //         setRoomLoading(true);
// //         const token = localStorage.getItem("hlopgToken");
        
// //         console.log("Fetching rooms and config for PG:", selectedPG.hostel_id);
        
// //         let roomsData = [];
        
// //         // Fetch rooms
// //         try {
// //           // Try the new endpoint first: /api/hostel/rooms/pg/{hostelId}
// //           const response = await api.get(`/hostel/rooms/pg/${selectedPG.hostel_id}`, {
// //             headers: { Authorization: `Bearer ${token}` }
// //           });
          
// //           // Handle the response format from new endpoint
// //           if (response.data && response.data.data) {
// //             roomsData = response.data.data;
// //           } else if (response.data && response.data.rooms) {
// //             roomsData = response.data.rooms;
// //           } else {
// //             roomsData = response.data || [];
// //           }
// //         } catch (error) {
// //           console.log("New rooms endpoint failed, trying alternatives...");
          
// //           try {
// //             // Try: /api/hostel/{hostelId}/rooms (alternative new endpoint)
// //             const response = await api.get(`/hostel/${selectedPG.hostel_id}/rooms`, {
// //               headers: { Authorization: `Bearer ${token}` }
// //             });
            
// //             if (response.data && response.data.data) {
// //               roomsData = response.data.data;
// //             } else if (response.data && response.data.rooms) {
// //               roomsData = response.data.rooms;
// //             } else {
// //               roomsData = response.data || [];
// //             }
// //           } catch (error2) {
// //             console.log("Alternative endpoint failed, trying old endpoints...");
            
// //             try {
// //               // Try: /rooms/pg/${selectedPG.hostel_id} (old endpoint)
// //               const response = await api.get(`/rooms/pg/${selectedPG.hostel_id}`, {
// //                 headers: { Authorization: `Bearer ${token}` }
// //               });
// //               roomsData = response.data || [];
// //             } catch (error3) {
// //               console.log("Old rooms endpoint failed, trying owner endpoint...");
              
// //               try {
// //                 // Try: /owner/rooms/${selectedPG.hostel_id}
// //                 const response = await api.get(`/owner/rooms/${selectedPG.hostel_id}`, {
// //                   headers: { Authorization: `Bearer ${token}` }
// //                 });
// //                 roomsData = response.data || [];
// //               } catch (error4) {
// //                 console.log("All rooms endpoints failed, using sample data");
// //                 roomsData = createSampleRooms();
// //               }
// //             }
// //           }
// //         }
        
// //         setRooms(roomsData);
        
// //         // Process floor/room configuration from PG data
// //         processPgConfiguration(selectedPG.rawData || selectedPG);
        
// //         // Group rooms by floor
// //         processRoomsByFloor(roomsData);
        
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //         const sampleData = createSampleRooms();
// //         setRooms(sampleData);
// //         processRoomsByFloor(sampleData);
// //         processPgConfiguration(selectedPG.rawData || selectedPG);
// //       } finally {
// //         setRoomLoading(false);
// //       }
// //     };

// //     fetchRoomsAndConfig();
// //   }, [selectedPG]);

// //   // Process PG configuration (numFloors, roomsPerFloor, etc.)
// //   const processPgConfiguration = (pgData) => {
// //     if (!pgData) return;
    
// //     const config = {
// //       numFloors: 0,
// //       roomsPerFloor: 0,
// //       startingRoomNumber: "",
// //       advanceAmount: 0,
// //       sharingData: {}
// //     };
    
// //     // Try to extract from raw PG data
// //     if (pgData.numFloors) {
// //       config.numFloors = parseInt(pgData.numFloors) || 0;
// //     }
    
// //     if (pgData.roomsPerFloor) {
// //       config.roomsPerFloor = parseInt(pgData.roomsPerFloor) || 0;
// //     }
    
// //     if (pgData.startingRoomNumber) {
// //       config.startingRoomNumber = pgData.startingRoomNumber;
// //     }
    
// //     if (pgData.advanceAmount) {
// //       config.advanceAmount = parseInt(pgData.advanceAmount) || 0;
// //     }
    
// //     // Extract sharing data
// //     if (pgData.sharing_data) {
// //       try {
// //         config.sharingData = typeof pgData.sharing_data === 'string' 
// //           ? JSON.parse(pgData.sharing_data) 
// //           : pgData.sharing_data;
// //       } catch (e) {
// //         console.log("Could not parse sharing_data");
// //       }
// //     } else if (pgData.sharing) {
// //       try {
// //         config.sharingData = typeof pgData.sharing === 'string' 
// //           ? JSON.parse(pgData.sharing) 
// //           : pgData.sharing;
// //       } catch (e) {
// //         console.log("Could not parse sharing");
// //       }
// //     }
    
// //     // If not found in direct fields, try to parse from JSON fields
// //     if (!config.numFloors && pgData.room_config) {
// //       try {
// //         const roomConfig = typeof pgData.room_config === 'string' 
// //           ? JSON.parse(pgData.room_config) 
// //           : pgData.room_config;
// //         config.numFloors = parseInt(roomConfig.numFloors) || 0;
// //         config.roomsPerFloor = parseInt(roomConfig.roomsPerFloor) || 0;
// //         config.startingRoomNumber = roomConfig.startingRoomNumber || "";
// //         if (roomConfig.advanceAmount) {
// //           config.advanceAmount = parseInt(roomConfig.advanceAmount) || 0;
// //         }
// //       } catch (e) {
// //         console.log("Could not parse room_config");
// //       }
// //     }
    
// //     // If still not found, try to extract from facilities
// //     if (!config.numFloors && pgData.facilities) {
// //       try {
// //         const facilities = typeof pgData.facilities === 'string' 
// //           ? JSON.parse(pgData.facilities) 
// //           : pgData.facilities;
// //         if (facilities.numFloors) {
// //           config.numFloors = parseInt(facilities.numFloors) || 0;
// //         }
// //         if (facilities.roomsPerFloor) {
// //           config.roomsPerFloor = parseInt(facilities.roomsPerFloor) || 0;
// //         }
// //       } catch (e) {
// //         console.log("Could not parse facilities for room config");
// //       }
// //     }
    
// //     // If still not found, use defaults
// //     if (!config.numFloors) config.numFloors = 3;
// //     if (!config.roomsPerFloor) config.roomsPerFloor = 5;
// //     if (!config.startingRoomNumber) config.startingRoomNumber = "101";
// //     if (!config.advanceAmount) config.advanceAmount = 5000;
// //     if (Object.keys(config.sharingData).length === 0) {
// //       config.sharingData = {
// //         "2-Sharing": 5000,
// //         "3-Sharing": 4000,
// //         "4-Sharing": 3500
// //       };
// //     }
    
// //     console.log("Processed PG config:", config);
// //     setPgConfig(config);
// //   };

// //   // Process rooms and group by floor
// //   const processRoomsByFloor = (roomsData) => {
// //     const floors = {};
    
// //     roomsData.forEach(room => {
// //       let floor = 1;
// //       if (room.room_number) {
// //         const firstChar = room.room_number.charAt(0);
// //         if (!isNaN(firstChar)) {
// //           floor = parseInt(firstChar);
// //         }
// //       } else if (room.floor) {
// //         floor = parseInt(room.floor);
// //       }
      
// //       if (floor < 1) floor = 1;
// //       if (floor > 10) floor = 10;
      
// //       if (!floors[floor]) {
// //         floors[floor] = [];
// //       }
      
// //       floors[floor].push({
// //         id: room.id || room._id || Date.now() + Math.random(),
// //         room_number: room.room_number || `F${floor}R${floors[floor].length + 1}`,
// //         floor: floor,
// //         sharing_type: room.sharing_type || room.sharing || "2-Sharing",
// //         rent: room.rent || room.price || 5000,
// //         status: room.status || "vacant",
// //         tenant_name: room.tenant_name || room.tenant?.name || null,
// //         tenant_phone: room.tenant_phone || room.tenant?.phone || null,
// //         amenities: room.amenities || ["WiFi", "Attached Bathroom"]
// //       });
// //     });
    
// //     // Create expected floors based on configuration
// //     const expectedFloors = pgConfig.numFloors || 3;
// //     for (let floor = 1; floor <= expectedFloors; floor++) {
// //       if (!floors[floor]) {
// //         floors[floor] = [];
// //       }
// //     }
    
// //     const filtered = Object.keys(floors)
// //       .map(floor => ({
// //         floor: parseInt(floor),
// //         rooms: floors[floor].sort((a, b) => a.room_number.localeCompare(b.room_number))
// //       }))
// //       .sort((a, b) => a.floor - b.floor);
    
// //     setFilteredRooms(filtered);
// //   };

// //   // Create sample room data
// //   const createSampleRooms = () => {
// //     if (!selectedPG) return [];
    
// //     const sampleRooms = [];
// //     const totalFloors = pgConfig.numFloors || 3;
// //     const roomsPerFloor = pgConfig.roomsPerFloor || 5;
    
// //     // Get sharing types and prices from PG configuration
// //     const sharingTypes = Object.keys(pgConfig.sharingData || {});
// //     const defaultSharingTypes = ["2-Sharing", "3-Sharing", "4-Sharing"];
// //     const availableSharingTypes = sharingTypes.length > 0 ? sharingTypes : defaultSharingTypes;
    
// //     for (let floor = 1; floor <= totalFloors; floor++) {
// //       for (let roomNum = 1; roomNum <= roomsPerFloor; roomNum++) {
// //         const roomId = `${selectedPG.hostel_id}_${floor}${String(roomNum).padStart(2, '0')}`;
// //         const roomNumber = `${floor}${String(roomNum).padStart(2, '0')}`;
// //         const sharingType = availableSharingTypes[(roomNum - 1) % availableSharingTypes.length];
        
// //         // Get rent from sharing data or use default calculation
// //         let rent = pgConfig.sharingData?.[sharingType] || (5000 + (floor * 500) + (roomNum * 100));
        
// //         sampleRooms.push({
// //           id: roomId,
// //           room_number: roomNumber,
// //           floor: floor,
// //           sharing_type: sharingType,
// //           rent: rent,
// //           status: roomNum <= 2 ? "occupied" : "vacant", // First 2 rooms occupied
// //           tenant_name: roomNum <= 2 ? ["John Doe", "Jane Smith"][roomNum - 1] : null,
// //           tenant_phone: roomNum <= 2 ? "9876543210" : null,
// //           amenities: ["WiFi", "Attached Bathroom", "Bed", "Wardrobe"],
// //           pg_id: selectedPG.hostel_id
// //         });
// //       }
// //     }
    
// //     console.log("Created sample rooms:", sampleRooms.length);
// //     return sampleRooms;
// //   };

// //   // Get floor name
// //   const getFloorName = (floor) => {
// //     if (floor === 1) return "1st Floor";
// //     if (floor === 2) return "2nd Floor";
// //     if (floor === 3) return "3rd Floor";
// //     return `${floor}th Floor`;
// //   };

// //   // Update room status
// //   const updateRoomStatus = async (roomId, newStatus) => {
// //     try {
// //       const updatedRooms = rooms.map(room => 
// //         room.id === roomId ? { ...room, status: newStatus } : room
// //       );
      
// //       setRooms(updatedRooms);
// //       processRoomsByFloor(updatedRooms);
      
// //       const token = localStorage.getItem("hlopgToken");
      
// //       try {
// //         // Try new endpoint first: /api/hostel/room/{roomId}/status
// //         await api.put(`/hostel/room/${roomId}/status`, 
// //           { status: newStatus },
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         );
// //         console.log("Status updated via new endpoint");
// //       } catch (error) {
// //         console.log("New endpoint failed, trying old endpoint...");
// //         // Fallback to old endpoint
// //         try {
// //           await api.put(`/rooms/${roomId}/status`, 
// //             { status: newStatus },
// //             { headers: { Authorization: `Bearer ${token}` } }
// //           );
// //           console.log("Status updated via old endpoint");
// //         } catch (error2) {
// //           console.log("All endpoints failed, updating locally only");
// //           // Update locally even if API fails
// //         }
// //       }
      
// //       alert(`Room status updated to ${newStatus}`);
// //     } catch (error) {
// //       console.error("Error updating room status:", error);
// //       alert("Failed to update room status. Please try again.");
// //     }
// //   };

// //   // Add new room
// //   const handleAddRoom = () => {
// //     if (!selectedPG) {
// //       alert("Please select a PG first");
// //       return;
// //     }
    
// //     const floor = prompt("Enter floor number (1-10):", "1");
// //     if (!floor || isNaN(floor) || floor < 1 || floor > 10) {
// //       alert("Please enter a valid floor number between 1-10");
// //       return;
// //     }
    
// //     const roomNumber = prompt("Enter room number (e.g., 101, 201):", `${floor}01`);
// //     if (!roomNumber) {
// //       alert("Room number is required");
// //       return;
// //     }
    
// //     // Get available sharing types from PG config
// //     const sharingTypes = Object.keys(pgConfig.sharingData || {});
// //     let sharingType = "2-Sharing";
// //     if (sharingTypes.length > 0) {
// //       sharingType = prompt(`Enter sharing type (available: ${sharingTypes.join(', ')}):`, sharingTypes[0]);
// //       if (!sharingType || !sharingTypes.includes(sharingType)) {
// //         sharingType = sharingTypes[0];
// //       }
// //     } else {
// //       sharingType = prompt("Enter sharing type (e.g., 2-Sharing, 3-Sharing):", "2-Sharing");
// //     }
    
// //     // Get default rent from sharing data
// //     const defaultRent = pgConfig.sharingData?.[sharingType] || 5000;
// //     const rent = prompt("Enter monthly rent:", defaultRent.toString());
// //     if (!rent || isNaN(rent)) {
// //       alert("Please enter a valid rent amount");
// //       return;
// //     }
    
// //     const newRoom = {
// //       id: Date.now().toString(),
// //       room_number: roomNumber,
// //       floor: parseInt(floor),
// //       sharing_type: sharingType,
// //       rent: parseInt(rent),
// //       status: "vacant",
// //       tenant_name: null,
// //       tenant_phone: null,
// //       amenities: ["WiFi", "Attached Bathroom"],
// //       pg_id: selectedPG.hostel_id
// //     };
    
// //     setRooms(prev => [...prev, newRoom]);
// //     processRoomsByFloor([...rooms, newRoom]);
    
// //     alert("Room added successfully!");
// //   };

// //   // Refresh data
// //   const handleRefresh = () => {
// //     setRefreshKey(prev => prev + 1);
// //     setRoomLoading(true);
// //   };

// //   // Handle room click
// //   const handleRoomClick = (room) => {
// //     console.log("Room clicked:", room);
    
// //     const roomInfo = `
// // Room Details:
// // -------------
// // Room Number: ${room.room_number}
// // Floor: ${getFloorName(room.floor)}
// // Sharing Type: ${room.sharing_type}
// // Rent: ₹${room.rent}/month
// // Status: ${room.status.toUpperCase()}
// // ${room.tenant_name ? `\nTenant: ${room.tenant_name}\nPhone: ${room.tenant_phone}` : 'Status: VACANT'}
// // ${room.amenities ? `\nAmenities: ${Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities}` : ''}
// //     `.trim();
    
// //     alert(roomInfo);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="myrooms-loading">
// //         <div className="spinner"></div>
// //         <p>Loading your PGs...</p>
// //       </div>
// //     );
// //   }

// //   if (pgs.length === 0) {
// //     return (
// //       <div className="myrooms-empty">
// //         <div className="empty-icon">🏠</div>
// //         <h3>No PGs Found</h3>
// //         <p>You haven't uploaded any PGs yet.</p>
// //         <p>Go to "Upload PG" to add your first property.</p>
// //         <button 
// //           className="go-to-upload-btn"
// //           onClick={() => window.location.href = "/owner-dashboard?tab=Upload PG"}
// //         >
// //           Upload PG
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="myrooms-container">
// //       {/* PG Selection Header */}
// //       <div className="myrooms-header">
// //         <div className="pg-selector">
// //           <h2>Select PG:</h2>
// //           <select 
// //             value={selectedPG?.hostel_id || ""}
// //             onChange={(e) => {
// //               const pg = pgs.find(p => p.hostel_id == e.target.value);
// //               if (pg) {
// //                 setSelectedPG(pg);
// //                 setRooms([]);
// //                 setFilteredRooms([]);
// //               }
// //             }}
// //             className="pg-dropdown"
// //           >
// //             {pgs.map(pg => (
// //               <option key={pg.hostel_id} value={pg.hostel_id}>
// //                 {pg.hostel_name} - {pg.area}, {pg.city}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
        
// //         <div className="header-actions">
// //           <button className="refresh-btn" onClick={handleRefresh}>
// //             🔄 Refresh
// //           </button>
// //           <button className="add-room-btn" onClick={handleAddRoom}>
// //             + Add New Room
// //           </button>
// //         </div>
// //       </div>

// //       {/* PG Info Summary with Configuration */}
// //       {selectedPG && (
// //         <div className="pg-info-summary">
// //           <div className="summary-card">
// //             <div className="summary-header">
// //               <h3>{selectedPG.hostel_name}</h3>
// //               <p className="pg-location">📍 {selectedPG.area}, {selectedPG.city}, {selectedPG.state}</p>
// //             </div>
            
// //             {/* Floor/Room Configuration Display */}
// //             <div className="config-display">
// //               <div className="config-item">
// //                 <span className="config-label">Floors:</span>
// //                 <span className="config-value">{pgConfig.numFloors}</span>
// //               </div>
// //               <div className="config-item">
// //                 <span className="config-label">Rooms per Floor:</span>
// //                 <span className="config-value">{pgConfig.roomsPerFloor}</span>
// //               </div>
// //               <div className="config-item">
// //                 <span className="config-label">Starting Room:</span>
// //                 <span className="config-value">{pgConfig.startingRoomNumber}</span>
// //               </div>
// //               <div className="config-item">
// //                 <span className="config-label">Advance Amount:</span>
// //                 <span className="config-value">₹{pgConfig.advanceAmount}</span>
// //               </div>
// //             </div>
            
// //             {/* Sharing Types Display */}
// //             {pgConfig.sharingData && Object.keys(pgConfig.sharingData).length > 0 && (
// //               <div className="sharing-display">
// //                 <div className="sharing-types">
// //                   {Object.entries(pgConfig.sharingData).map(([type, price]) => (
// //                     <div key={type} className="sharing-type">
// //                       <span className="type-name">{type}</span>
// //                       <span className="type-price">₹{price}/month</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}
            
// //             <div className="summary-stats">
// //               <div className="stat">
// //                 <span className="stat-label">Total Rooms</span>
// //                 <span className="stat-value">{rooms.length}</span>
// //               </div>
// //               <div className="stat">
// //                 <span className="stat-label">Occupied</span>
// //                 <span className="stat-value occupied-count">
// //                   {rooms.filter(r => r.status === 'occupied').length}
// //                 </span>
// //               </div>
// //               <div className="stat">
// //                 <span className="stat-label">Vacant</span>
// //                 <span className="stat-value vacant-count">
// //                   {rooms.filter(r => r.status === 'vacant').length}
// //                 </span>
// //               </div>
// //               <div className="stat">
// //                 <span className="stat-label">Revenue</span>
// //                 <span className="stat-value revenue-count">
// //                   ₹{rooms.filter(r => r.status === 'occupied').reduce((sum, room) => sum + room.rent, 0)}
// //                 </span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Room Management - Floors */}
// //       {roomLoading ? (
// //         <div className="rooms-loading">
// //           <div className="spinner small"></div>
// //           <p>Loading rooms...</p>
// //         </div>
// //       ) : filteredRooms.length === 0 ? (
// //         <div className="no-rooms-found">
// //           <div className="no-rooms-icon">🚪</div>
// //           <h3>No Rooms Found</h3>
// //           <p>This PG doesn't have any rooms yet.</p>
// //           <button className="add-first-room-btn" onClick={handleAddRoom}>
// //             + Add First Room
// //           </button>
// //         </div>
// //       ) : (
// //         <div className="rooms-management">
// //           {filteredRooms.map(({ floor, rooms: floorRooms }) => (
// //             <div key={floor} className="floor-section">
// //               <div className="floor-header">
// //                 <h3 className="floor-title">
// //                   {getFloorName(floor)}
// //                   <span className="floor-room-count">({floorRooms.length} rooms)</span>
// //                 </h3>
// //                 <div className="floor-stats">
// //                   <span className="floor-stat-item">
// //                     <span className="stat-dot vacant-dot"></span>
// //                     Vacant: {floorRooms.filter(r => r.status === 'vacant').length}
// //                   </span>
// //                   <span className="floor-stat-item">
// //                     <span className="stat-dot occupied-dot"></span>
// //                     Occupied: {floorRooms.filter(r => r.status === 'occupied').length}
// //                   </span>
// //                   <span className="floor-stat-item">
// //                     <span className="stat-dot maintenance-dot"></span>
// //                     Maintenance: {floorRooms.filter(r => r.status === 'maintenance').length}
// //                   </span>
// //                 </div>
// //               </div>
              
// //               <div className="rooms-grid">
// //                 {floorRooms.map(room => (
// //                   <div 
// //                     key={room.id} 
// //                     className={`room-card ${room.status}`}
// //                     onClick={() => handleRoomClick(room)}
// //                   >
// //                     <div className="room-header">
// //                       <div className="room-number-section">
// //                         <span className="room-number">{room.room_number}</span>
// //                         <span className="room-sharing">{room.sharing_type}</span>
// //                       </div>
// //                       <div className="room-status-container">
// //                         <select 
// //                           value={room.status}
// //                           onChange={(e) => updateRoomStatus(room.id, e.target.value)}
// //                           className="status-select"
// //                           onClick={(e) => e.stopPropagation()}
// //                         >
// //                           <option value="vacant">Vacant</option>
// //                           <option value="occupied">Occupied</option>
// //                           <option value="maintenance">Maintenance</option>
// //                         </select>
// //                       </div>
// //                     </div>
                    
// //                     <div className="room-details">
// //                       <div className="room-rent-section">
// //                         <span className="rent-label">Monthly Rent</span>
// //                         <span className="room-rent">₹{room.rent}</span>
// //                       </div>
                      
// //                       {room.status === 'occupied' && room.tenant_name && (
// //                         <div className="tenant-info">
// //                           <p className="tenant-name">
// //                             <span className="tenant-icon">👤</span>
// //                             {room.tenant_name}
// //                           </p>
// //                           {room.tenant_phone && (
// //                             <p className="tenant-phone">
// //                               <span className="phone-icon">📞</span>
// //                               {room.tenant_phone}
// //                             </p>
// //                           )}
// //                         </div>
// //                       )}
                      
// //                       {room.status === 'vacant' && (
// //                         <div className="vacant-info">
// //                           <div className="vacant-badge">Available</div>
// //                           <p className="vacant-text">Ready to move in</p>
// //                         </div>
// //                       )}
                      
// //                       {room.status === 'maintenance' && (
// //                         <div className="maintenance-info">
// //                           <div className="maintenance-badge">Under Maintenance</div>
// //                           <p className="maintenance-text">Not available for rent</p>
// //                         </div>
// //                       )}
// //                     </div>
                    
// //                     <div className="room-actions">
// //                       <button 
// //                         className="edit-btn"
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           handleRoomClick(room);
// //                         }}
// //                       >
// //                         Edit
// //                       </button>
// //                       <button 
// //                         className="details-btn"
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           handleRoomClick(room);
// //                         }}
// //                       >
// //                         View Details
// //                       </button>
// //                     </div>
// //                   </div>
// //                 ))}
                
// //                 {/* Add Room Card for this floor */}
// //                 <div 
// //                   className="add-room-card"
// //                   onClick={() => {
// //                     const confirmAdd = window.confirm(`Add room to ${getFloorName(floor)}?`);
// //                     if (confirmAdd) {
// //                       handleAddRoom();
// //                     }
// //                   }}
// //                 >
// //                   <div className="add-room-content">
// //                     <span className="add-icon">+</span>
// //                     <span className="add-text">Add Room</span>
// //                     <span className="add-subtext">to {getFloorName(floor)}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default MyRooms;

// // src/pages/MyRooms.jsx
// import React, { useState, useEffect } from "react";
// import "./MyRooms.css";
// import api from "../api";

// const MyRooms = ({ user }) => {
//   const [pgs, setPGs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPG, setSelectedPG] = useState(null);
//   const [rooms, setRooms] = useState([]);
//   const [roomLoading, setRoomLoading] = useState(false);
//   const [filteredRooms, setFilteredRooms] = useState([]);
//   const [refreshKey, setRefreshKey] = useState(0);
  
//   // Floor & room configuration from PG data
//   const [pgConfig, setPgConfig] = useState({
//     numFloors: 0,
//     roomsPerFloor: 0,
//     startingRoomNumber: "",
//     advanceAmount: 0,
//     sharingData: {}
//   });

//   // Fetch owner's PGs
//   useEffect(() => {
//     const fetchPGs = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("hlopgToken");
        
//         let pgsData = [];
        
//         try {
//           // Try the primary endpoint: /hostel/owner/pgs
//           const response = await api.get(`/hostel/owner/pgs`, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           if (response.data && response.data.success) {
//             pgsData = response.data.data || [];
//           }
//         } catch (error) {
//           console.log("Primary endpoint failed, trying alternatives...");
          
//           try {
//             // Try: /owner/pg
//             const response = await api.get(`/owner/pg`, {
//               headers: { Authorization: `Bearer ${token}` }
//             });
//             pgsData = response.data || [];
//           } catch (error2) {
//             console.log("Alternative endpoint also failed:", error2);
//           }
//         }
        
//         console.log("PGs fetched:", pgsData);
        
//         if (pgsData && pgsData.length > 0) {
//           const formattedPGs = pgsData.map(pg => {
//             // Parse sharing data
//             let sharingData = {};
//             if (pg.sharing_data) {
//               try {
//                 sharingData = typeof pg.sharing_data === 'string' 
//                   ? JSON.parse(pg.sharing_data) 
//                   : pg.sharing_data;
//               } catch (e) {
//                 console.log("Could not parse sharing_data");
//               }
//             } else if (pg.sharing) {
//               try {
//                 sharingData = typeof pg.sharing === 'string' 
//                   ? JSON.parse(pg.sharing) 
//                   : pg.sharing;
//               } catch (e) {
//                 console.log("Could not parse sharing");
//               }
//             }
            
//             // Parse floor configuration
//             let numFloors = 0;
//             let roomsPerFloor = 0;
//             let startingRoomNumber = "";
//             let advanceAmount = 0;
            
//             // Check direct fields
//             if (pg.numFloors) numFloors = parseInt(pg.numFloors);
//             if (pg.roomsPerFloor) roomsPerFloor = parseInt(pg.roomsPerFloor);
//             if (pg.startingRoomNumber) startingRoomNumber = pg.startingRoomNumber;
//             if (pg.advanceAmount) advanceAmount = parseInt(pg.advanceAmount);
            
//             // Check facilities or room_config
//             if (pg.facilities) {
//               try {
//                 const facilities = typeof pg.facilities === 'string' 
//                   ? JSON.parse(pg.facilities) 
//                   : pg.facilities;
//                 if (facilities.numFloors) numFloors = parseInt(facilities.numFloors);
//                 if (facilities.roomsPerFloor) roomsPerFloor = parseInt(facilities.roomsPerFloor);
//                 if (facilities.startingRoomNumber) startingRoomNumber = facilities.startingRoomNumber;
//                 if (facilities.advanceAmount) advanceAmount = parseInt(facilities.advanceAmount);
//               } catch (e) {
//                 console.log("Could not parse facilities");
//               }
//             }
            
//             if (pg.room_config) {
//               try {
//                 const roomConfig = typeof pg.room_config === 'string' 
//                   ? JSON.parse(pg.room_config) 
//                   : pg.room_config;
//                 if (roomConfig.numFloors) numFloors = parseInt(roomConfig.numFloors);
//                 if (roomConfig.roomsPerFloor) roomsPerFloor = parseInt(roomConfig.roomsPerFloor);
//                 if (roomConfig.startingRoomNumber) startingRoomNumber = roomConfig.startingRoomNumber;
//                 if (roomConfig.advanceAmount) advanceAmount = parseInt(roomConfig.advanceAmount);
//               } catch (e) {
//                 console.log("Could not parse room_config");
//               }
//             }
            
//             return {
//               hostel_id: pg.hostel_id || pg.id || pg._id,
//               hostel_name: pg.hostel_name || pg.name || "Unnamed PG",
//               area: pg.area || pg.location?.area || "Unknown Area",
//               city: pg.city || pg.location?.city || "Unknown City",
//               state: pg.state || pg.location?.state || "",
//               total_rooms: pg.total_rooms || pg.rooms_count || 0,
//               occupied_rooms: pg.occupied_rooms || 0,
//               vacant_rooms: pg.vacant_rooms || 0,
//               img: pg.img || pg.images?.[0] || "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=PG",
//               // Store configuration data
//               sharing_data: sharingData,
//               numFloors,
//               roomsPerFloor,
//               startingRoomNumber,
//               advanceAmount,
//               rawData: pg
//             };
//           });
          
//           setPGs(formattedPGs);
//           localStorage.setItem("hlopgOwnerPGs", JSON.stringify(formattedPGs));
          
//           if (!selectedPG && formattedPGs.length > 0) {
//             setSelectedPG(formattedPGs[0]);
//           }
//         } else {
//           setPGs([]);
//           localStorage.removeItem("hlopgOwnerPGs");
//         }
//       } catch (error) {
//         console.error("Error fetching PGs:", error);
//         setPGs([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.owner_id) {
//       fetchPGs();
//     } else {
//       const cachedUser = localStorage.getItem("hlopgOwner");
//       if (cachedUser) {
//         try {
//           const parsedUser = JSON.parse(cachedUser);
//           if (parsedUser.owner_id || parsedUser.id) {
//             fetchPGs();
//           }
//         } catch (e) {
//           console.error("Error parsing cached user:", e);
//         }
//       }
//     }
//   }, [user, refreshKey]);

//   // Fetch rooms AND PG configuration for selected PG
//   useEffect(() => {
//     const fetchRoomsAndConfig = async () => {
//       if (!selectedPG) return;
      
//       try {
//         setRoomLoading(true);
//         const token = localStorage.getItem("hlopgToken");
        
//         console.log("Fetching rooms and config for PG:", selectedPG.hostel_id);
        
//         let roomsData = [];
        
//         // Fetch rooms
//         try {
//           // Try the new endpoint first: /api/hostel/rooms/pg/{hostelId}
//           const response = await api.get(`/hostel/rooms/pg/${selectedPG.hostel_id}`, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
          
//           // Handle the response format from new endpoint
//           if (response.data && response.data.data) {
//             roomsData = response.data.data;
//           } else if (response.data && response.data.rooms) {
//             roomsData = response.data.rooms;
//           } else {
//             roomsData = response.data || [];
//           }
//         } catch (error) {
//           console.log("New rooms endpoint failed, trying alternatives...");
          
//           try {
//             // Try: /api/hostel/{hostelId}/rooms (alternative new endpoint)
//             const response = await api.get(`/hostel/${selectedPG.hostel_id}/rooms`, {
//               headers: { Authorization: `Bearer ${token}` }
//             });
            
//             if (response.data && response.data.data) {
//               roomsData = response.data.data;
//             } else if (response.data && response.data.rooms) {
//               roomsData = response.data.rooms;
//             } else {
//               roomsData = response.data || [];
//             }
//           } catch (error2) {
//             console.log("Alternative endpoint failed, trying old endpoints...");
            
//             try {
//               // Try: /rooms/pg/${selectedPG.hostel_id} (old endpoint)
//               const response = await api.get(`/rooms/pg/${selectedPG.hostel_id}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//               });
//               roomsData = response.data || [];
//             } catch (error3) {
//               console.log("Old rooms endpoint failed, trying owner endpoint...");
              
//               try {
//                 // Try: /owner/rooms/${selectedPG.hostel_id}
//                 const response = await api.get(`/owner/rooms/${selectedPG.hostel_id}`, {
//                   headers: { Authorization: `Bearer ${token}` }
//                 });
//                 roomsData = response.data || [];
//               } catch (error4) {
//                 console.log("All rooms endpoints failed, using sample data");
//                 roomsData = createSampleRooms();
//               }
//             }
//           }
//         }
        
//         setRooms(roomsData);
        
//         // Process floor/room configuration from PG data
//         processPgConfiguration(selectedPG);
        
//         // Group rooms by floor
//         processRoomsByFloor(roomsData);
        
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         const sampleData = createSampleRooms();
//         setRooms(sampleData);
//         processRoomsByFloor(sampleData);
//         processPgConfiguration(selectedPG);
//       } finally {
//         setRoomLoading(false);
//       }
//     };

//     fetchRoomsAndConfig();
//   }, [selectedPG]);

//   // Process PG configuration (numFloors, roomsPerFloor, etc.)
//   const processPgConfiguration = (pgData) => {
//     if (!pgData) return;
    
//     const config = {
//       numFloors: pgData.numFloors || 0,
//       roomsPerFloor: pgData.roomsPerFloor || 0,
//       startingRoomNumber: pgData.startingRoomNumber || "",
//       advanceAmount: pgData.advanceAmount || 0,
//       sharingData: pgData.sharing_data || {}
//     };
    
//     console.log("Processed PG config:", config);
//     setPgConfig(config);
//   };

//   // Process rooms and group by floor
//   const processRoomsByFloor = (roomsData) => {
//     const floors = {};
    
//     roomsData.forEach(room => {
//       let floor = 1;
//       if (room.room_number) {
//         const firstChar = room.room_number.charAt(0);
//         if (!isNaN(firstChar)) {
//           floor = parseInt(firstChar);
//         }
//       } else if (room.floor) {
//         floor = parseInt(room.floor);
//       }
      
//       if (floor < 1) floor = 1;
//       if (floor > 10) floor = 10;
      
//       if (!floors[floor]) {
//         floors[floor] = [];
//       }
      
//       floors[floor].push({
//         id: room.id || room._id || Date.now() + Math.random(),
//         room_number: room.room_number || `F${floor}R${floors[floor].length + 1}`,
//         floor: floor,
//         sharing_type: room.sharing_type || room.sharing || "2-Sharing",
//         rent: room.rent || room.price || 5000,
//         status: room.status || "vacant",
//         tenant_name: room.tenant_name || room.tenant?.name || null,
//         tenant_phone: room.tenant_phone || room.tenant?.phone || null,
//         amenities: room.amenities || ["WiFi", "Attached Bathroom"]
//       });
//     });
    
//     // Create expected floors based on configuration
//     const expectedFloors = pgConfig.numFloors || 3;
//     for (let floor = 1; floor <= expectedFloors; floor++) {
//       if (!floors[floor]) {
//         floors[floor] = [];
//       }
//     }
    
//     const filtered = Object.keys(floors)
//       .map(floor => ({
//         floor: parseInt(floor),
//         rooms: floors[floor].sort((a, b) => a.room_number.localeCompare(b.room_number))
//       }))
//       .sort((a, b) => a.floor - b.floor);
    
//     setFilteredRooms(filtered);
//   };

//   // Create sample room data
//   const createSampleRooms = () => {
//     if (!selectedPG) return [];
    
//     const sampleRooms = [];
//     const totalFloors = pgConfig.numFloors || 3;
//     const roomsPerFloor = pgConfig.roomsPerFloor || 5;
    
//     // Get sharing types and prices from PG configuration
//     const sharingTypes = Object.keys(pgConfig.sharingData || {});
//     const defaultSharingTypes = ["2-Sharing", "3-Sharing", "4-Sharing"];
//     const availableSharingTypes = sharingTypes.length > 0 ? sharingTypes : defaultSharingTypes;
    
//     for (let floor = 1; floor <= totalFloors; floor++) {
//       for (let roomNum = 1; roomNum <= roomsPerFloor; roomNum++) {
//         const roomId = `${selectedPG.hostel_id}_${floor}${String(roomNum).padStart(2, '0')}`;
//         const roomNumber = `${floor}${String(roomNum).padStart(2, '0')}`;
//         const sharingType = availableSharingTypes[(roomNum - 1) % availableSharingTypes.length];
        
//         // Get rent from sharing data or use default calculation
//         let rent = pgConfig.sharingData?.[sharingType] || (5000 + (floor * 500) + (roomNum * 100));
        
//         sampleRooms.push({
//           id: roomId,
//           room_number: roomNumber,
//           floor: floor,
//           sharing_type: sharingType,
//           rent: rent,
//           status: roomNum <= 2 ? "occupied" : "vacant", // First 2 rooms occupied
//           tenant_name: roomNum <= 2 ? ["John Doe", "Jane Smith"][roomNum - 1] : null,
//           tenant_phone: roomNum <= 2 ? "9876543210" : null,
//           amenities: ["WiFi", "Attached Bathroom", "Bed", "Wardrobe"],
//           pg_id: selectedPG.hostel_id
//         });
//       }
//     }
    
//     console.log("Created sample rooms:", sampleRooms.length);
//     return sampleRooms;
//   };

//   // Get floor name
//   const getFloorName = (floor) => {
//     if (floor === 1) return "1st Floor";
//     if (floor === 2) return "2nd Floor";
//     if (floor === 3) return "3rd Floor";
//     return `${floor}th Floor`;
//   };

//   // Update room status
//   const updateRoomStatus = async (roomId, newStatus) => {
//     try {
//       const updatedRooms = rooms.map(room => 
//         room.id === roomId ? { ...room, status: newStatus } : room
//       );
      
//       setRooms(updatedRooms);
//       processRoomsByFloor(updatedRooms);
      
//       const token = localStorage.getItem("hlopgToken");
      
//       try {
//         // Try new endpoint first: /api/hostel/room/{roomId}/status
//         await api.put(`/hostel/room/${roomId}/status`, 
//           { status: newStatus },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         console.log("Status updated via new endpoint");
//       } catch (error) {
//         console.log("New endpoint failed, trying old endpoint...");
//         // Fallback to old endpoint
//         try {
//           await api.put(`/rooms/${roomId}/status`, 
//             { status: newStatus },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           console.log("Status updated via old endpoint");
//         } catch (error2) {
//           console.log("All endpoints failed, updating locally only");
//           // Update locally even if API fails
//         }
//       }
      
//       alert(`Room status updated to ${newStatus}`);
//     } catch (error) {
//       console.error("Error updating room status:", error);
//       alert("Failed to update room status. Please try again.");
//     }
//   };

//   // Add new room to specific floor
//   const handleAddRoomToFloor = (floor) => {
//     if (!selectedPG) {
//       alert("Please select a PG first");
//       return;
//     }
    
//     const roomNumber = prompt(`Enter room number for ${getFloorName(floor)} (e.g., ${floor}01, ${floor}02):`, `${floor}01`);
//     if (!roomNumber) {
//       alert("Room number is required");
//       return;
//     }
    
//     // Get available sharing types from PG config
//     const sharingTypes = Object.keys(pgConfig.sharingData || {});
//     let sharingType = "2-Sharing";
//     if (sharingTypes.length > 0) {
//       sharingType = prompt(`Enter sharing type (available: ${sharingTypes.join(', ')}):`, sharingTypes[0]);
//       if (!sharingType || !sharingTypes.includes(sharingType)) {
//         sharingType = sharingTypes[0];
//       }
//     } else {
//       sharingType = prompt("Enter sharing type (e.g., 2-Sharing, 3-Sharing):", "2-Sharing");
//     }
    
//     // Get default rent from sharing data
//     const defaultRent = pgConfig.sharingData?.[sharingType] || 5000;
//     const rent = prompt("Enter monthly rent:", defaultRent.toString());
//     if (!rent || isNaN(rent)) {
//       alert("Please enter a valid rent amount");
//       return;
//     }
    
//     const newRoom = {
//       id: Date.now().toString(),
//       room_number: roomNumber,
//       floor: parseInt(floor),
//       sharing_type: sharingType,
//       rent: parseInt(rent),
//       status: "vacant",
//       tenant_name: null,
//       tenant_phone: null,
//       amenities: ["WiFi", "Attached Bathroom"],
//       pg_id: selectedPG.hostel_id
//     };
    
//     setRooms(prev => [...prev, newRoom]);
//     processRoomsByFloor([...rooms, newRoom]);
    
//     alert(`Room ${roomNumber} added to ${getFloorName(floor)} successfully!`);
//   };

//   // Add new room (general)
//   const handleAddRoom = () => {
//     if (!selectedPG) {
//       alert("Please select a PG first");
//       return;
//     }
    
//     const floor = prompt("Enter floor number (1-10):", "1");
//     if (!floor || isNaN(floor) || floor < 1 || floor > 10) {
//       alert("Please enter a valid floor number between 1-10");
//       return;
//     }
    
//     const roomNumber = prompt("Enter room number (e.g., 101, 201):", `${floor}01`);
//     if (!roomNumber) {
//       alert("Room number is required");
//       return;
//     }
    
//     // Get available sharing types from PG config
//     const sharingTypes = Object.keys(pgConfig.sharingData || {});
//     let sharingType = "2-Sharing";
//     if (sharingTypes.length > 0) {
//       sharingType = prompt(`Enter sharing type (available: ${sharingTypes.join(', ')}):`, sharingTypes[0]);
//       if (!sharingType || !sharingTypes.includes(sharingType)) {
//         sharingType = sharingTypes[0];
//       }
//     } else {
//       sharingType = prompt("Enter sharing type (e.g., 2-Sharing, 3-Sharing):", "2-Sharing");
//     }
    
//     // Get default rent from sharing data
//     const defaultRent = pgConfig.sharingData?.[sharingType] || 5000;
//     const rent = prompt("Enter monthly rent:", defaultRent.toString());
//     if (!rent || isNaN(rent)) {
//       alert("Please enter a valid rent amount");
//       return;
//     }
    
//     const newRoom = {
//       id: Date.now().toString(),
//       room_number: roomNumber,
//       floor: parseInt(floor),
//       sharing_type: sharingType,
//       rent: parseInt(rent),
//       status: "vacant",
//       tenant_name: null,
//       tenant_phone: null,
//       amenities: ["WiFi", "Attached Bathroom"],
//       pg_id: selectedPG.hostel_id
//     };
    
//     setRooms(prev => [...prev, newRoom]);
//     processRoomsByFloor([...rooms, newRoom]);
    
//     alert("Room added successfully!");
//   };

//   // Refresh data
//   const handleRefresh = () => {
//     setRefreshKey(prev => prev + 1);
//     setRoomLoading(true);
//   };

//   // Handle room click
//   const handleRoomClick = (room) => {
//     console.log("Room clicked:", room);
    
//     const roomInfo = `
// Room Details:
// -------------
// Room Number: ${room.room_number}
// Floor: ${getFloorName(room.floor)}
// Sharing Type: ${room.sharing_type}
// Rent: ₹${room.rent}/month
// Status: ${room.status.toUpperCase()}
// ${room.tenant_name ? `\nTenant: ${room.tenant_name}\nPhone: ${room.tenant_phone}` : 'Status: VACANT'}
// ${room.amenities ? `\nAmenities: ${Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities}` : ''}
//     `.trim();
    
//     alert(roomInfo);
//   };

//   if (loading) {
//     return (
//       <div className="myrooms-loading">
//         <div className="spinner"></div>
//         <p>Loading your PGs...</p>
//       </div>
//     );
//   }

//   if (pgs.length === 0) {
//     return (
//       <div className="myrooms-empty">
//         <div className="empty-icon">🏠</div>
//         <h3>No PGs Found</h3>
//         <p>You haven't uploaded any PGs yet.</p>
//         <p>Go to "Upload PG" to add your first property.</p>
//         <button 
//           className="go-to-upload-btn"
//           onClick={() => window.location.href = "/owner-dashboard?tab=Upload PG"}
//         >
//           Upload PG
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="myrooms-container">
//       {/* PG Selection Header */}
//       <div className="myrooms-header">
//         <div className="pg-selector">
//           <h2>Select PG:</h2>
//           <select 
//             value={selectedPG?.hostel_id || ""}
//             onChange={(e) => {
//               const pg = pgs.find(p => p.hostel_id == e.target.value);
//               if (pg) {
//                 setSelectedPG(pg);
//                 setRooms([]);
//                 setFilteredRooms([]);
//               }
//             }}
//             className="pg-dropdown"
//           >
//             {pgs.map(pg => (
//               <option key={pg.hostel_id} value={pg.hostel_id}>
//                 {pg.hostel_name} - {pg.area}, {pg.city}
//               </option>
//             ))}
//           </select>
//         </div>
        
//         <div className="header-actions">
//           <button className="refresh-btn" onClick={handleRefresh}>
//             🔄 Refresh
//           </button>
//           <button className="add-room-btn" onClick={handleAddRoom}>
//             + Add New Room
//           </button>
//         </div>
//       </div>

//       {/* PG Info Summary with Configuration */}
//       {selectedPG && (
//         <div className="pg-info-summary">
//           <div className="summary-card">
//             <div className="summary-header">
//               <h3>{selectedPG.hostel_name}</h3>
//               <p className="pg-location">📍 {selectedPG.area}, {selectedPG.city}, {selectedPG.state}</p>
//             </div>
            
//             {/* Floor/Room Configuration Display */}
//             <div className="config-display">
//               <div className="config-item">
//                 <span className="config-label">Floors:</span>
//                 <span className="config-value">{pgConfig.numFloors || "Not set"}</span>
//               </div>
//               <div className="config-item">
//                 <span className="config-label">Rooms per Floor:</span>
//                 <span className="config-value">{pgConfig.roomsPerFloor || "Not set"}</span>
//               </div>
//               <div className="config-item">
//                 <span className="config-label">Starting Room:</span>
//                 <span className="config-value">{pgConfig.startingRoomNumber || "Not set"}</span>
//               </div>
//               <div className="config-item">
//                 <span className="config-label">Advance Amount:</span>
//                 <span className="config-value">₹{pgConfig.advanceAmount || "Not set"}</span>
//               </div>
//             </div>
            
//             {/* Sharing Types Display */}
//             {pgConfig.sharingData && Object.keys(pgConfig.sharingData).length > 0 && (
//               <div className="sharing-display">
//                 <h4 style={{color: 'white', marginBottom: '10px', fontSize: '14px'}}>Sharing Types & Prices:</h4>
//                 <div className="sharing-types">
//                   {Object.entries(pgConfig.sharingData).map(([type, price]) => (
//                     <div key={type} className="sharing-type">
//                       <span className="type-name">{type}</span>
//                       <span className="type-price">₹{price}/month</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
            
//             <div className="summary-stats">
//               <div className="stat">
//                 <span className="stat-label">Total Rooms</span>
//                 <span className="stat-value">{rooms.length}</span>
//               </div>
//               <div className="stat">
//                 <span className="stat-label">Occupied</span>
//                 <span className="stat-value occupied-count">
//                   {rooms.filter(r => r.status === 'occupied').length}
//                 </span>
//               </div>
//               <div className="stat">
//                 <span className="stat-label">Vacant</span>
//                 <span className="stat-value vacant-count">
//                   {rooms.filter(r => r.status === 'vacant').length}
//                 </span>
//               </div>
//               <div className="stat">
//                 <span className="stat-label">Revenue</span>
//                 <span className="stat-value revenue-count">
//                   ₹{rooms.filter(r => r.status === 'occupied').reduce((sum, room) => sum + room.rent, 0)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Room Management - Floors */}
//       {roomLoading ? (
//         <div className="rooms-loading">
//           <div className="spinner small"></div>
//           <p>Loading rooms...</p>
//         </div>
//       ) : filteredRooms.length === 0 ? (
//         <div className="no-rooms-found">
//           <div className="no-rooms-icon">🚪</div>
//           <h3>No Rooms Found</h3>
//           <p>This PG doesn't have any rooms yet.</p>
//           <button className="add-first-room-btn" onClick={handleAddRoom}>
//             + Add First Room
//           </button>
//         </div>
//       ) : (
//         <div className="rooms-management">
//           {filteredRooms.map(({ floor, rooms: floorRooms }) => (
//             <div key={floor} className="floor-section">
//               <div className="floor-header">
//                 <h3 className="floor-title">
//                   {getFloorName(floor)}
//                   <span className="floor-room-count">({floorRooms.length} rooms)</span>
//                 </h3>
//                 <div className="floor-stats">
//                   <span className="floor-stat-item">
//                     <span className="stat-dot vacant-dot"></span>
//                     Vacant: {floorRooms.filter(r => r.status === 'vacant').length}
//                   </span>
//                   <span className="floor-stat-item">
//                     <span className="stat-dot occupied-dot"></span>
//                     Occupied: {floorRooms.filter(r => r.status === 'occupied').length}
//                   </span>
//                   <span className="floor-stat-item">
//                     <span className="stat-dot maintenance-dot"></span>
//                     Maintenance: {floorRooms.filter(r => r.status === 'maintenance').length}
//                   </span>
//                 </div>
//               </div>
              
//               <div className="rooms-grid">
//                 {floorRooms.map(room => (
//                   <div 
//                     key={room.id} 
//                     className={`room-card ${room.status}`}
//                     onClick={() => handleRoomClick(room)}
//                   >
//                     <div className="room-header">
//                       <div className="room-number-section">
//                         <span className="room-number">{room.room_number}</span>
//                         <span className="room-sharing">{room.sharing_type}</span>
//                       </div>
//                       <div className="room-status-container">
//                         <select 
//                           value={room.status}
//                           onChange={(e) => updateRoomStatus(room.id, e.target.value)}
//                           className="status-select"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <option value="vacant">Vacant</option>
//                           <option value="occupied">Occupied</option>
//                           <option value="maintenance">Maintenance</option>
//                         </select>
//                       </div>
//                     </div>
                    
//                     <div className="room-details">
//                       <div className="room-rent-section">
//                         <span className="rent-label">Monthly Rent</span>
//                         <span className="room-rent">₹{room.rent}</span>
//                       </div>
                      
//                       {room.status === 'occupied' && room.tenant_name && (
//                         <div className="tenant-info">
//                           <p className="tenant-name">
//                             <span className="tenant-icon">👤</span>
//                             {room.tenant_name}
//                           </p>
//                           {room.tenant_phone && (
//                             <p className="tenant-phone">
//                               <span className="phone-icon">📞</span>
//                               {room.tenant_phone}
//                             </p>
//                           )}
//                         </div>
//                       )}
                      
//                       {room.status === 'vacant' && (
//                         <div className="vacant-info">
//                           <div className="vacant-badge">Available</div>
//                           <p className="vacant-text">Ready to move in</p>
//                         </div>
//                       )}
                      
//                       {room.status === 'maintenance' && (
//                         <div className="maintenance-info">
//                           <div className="maintenance-badge">Under Maintenance</div>
//                           <p className="maintenance-text">Not available for rent</p>
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className="room-actions">
//                       <button 
//                         className="edit-btn"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleRoomClick(room);
//                         }}
//                       >
//                         Edit
//                       </button>
//                       <button 
//                         className="details-btn"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleRoomClick(room);
//                         }}
//                       >
//                         View Details
//                       </button>
//                     </div>
//                   </div>
//                 ))}
                
//                 {/* Add Room Card for this floor */}
//                 <div 
//                   className="add-room-card"
//                   onClick={() => handleAddRoomToFloor(floor)}
//                 >
//                   <div className="add-room-content">
//                     <span className="add-icon">+</span>
//                     <span className="add-text">Add Room</span>
//                     <span className="add-subtext">to {getFloorName(floor)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyRooms;

// src/pages/MyRooms.jsx
import React, { useState, useEffect } from "react";
import "./MyRooms.css";
import api from "../api";

const MyRooms = ({ user }) => {
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPG, setSelectedPG] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomLoading, setRoomLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Floor & room configuration from PG data
  const [pgConfig, setPgConfig] = useState({
    numFloors: 0,
    roomsPerFloor: 0,
    startingRoomNumber: "",
    advanceAmount: 0,
    sharingData: {}
  });

  // Fetch owner's PGs
  useEffect(() => {
    const fetchPGs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("hlopgToken");
        
        let pgsData = [];
        
        try {
          // Try the primary endpoint: /hostel/owner/pgs
          const response = await api.get(`/hostel/owner/pgs`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data && response.data.success) {
            pgsData = response.data.data || [];
          }
        } catch (error) {
          console.log("Primary endpoint failed, trying alternatives...");
          
          try {
            // Try: /owner/pg
            const response = await api.get(`/owner/pg`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            pgsData = response.data || [];
          } catch (error2) {
            console.log("Alternative endpoint also failed:", error2);
          }
        }
        
        console.log("PGs fetched:", pgsData);
        
        if (pgsData && pgsData.length > 0) {
          const formattedPGs = pgsData.map(pg => {
            // Parse sharing data
            let sharingData = {};
            if (pg.sharing_data) {
              try {
                sharingData = typeof pg.sharing_data === 'string' 
                  ? JSON.parse(pg.sharing_data) 
                  : pg.sharing_data;
              } catch (e) {
                console.log("Could not parse sharing_data");
              }
            } else if (pg.sharing) {
              try {
                sharingData = typeof pg.sharing === 'string' 
                  ? JSON.parse(pg.sharing) 
                  : pg.sharing;
              } catch (e) {
                console.log("Could not parse sharing");
              }
            }
            
            // Parse floor configuration
            let numFloors = 0;
            let roomsPerFloor = 0;
            let startingRoomNumber = "";
            let advanceAmount = 0;
            
            // Check direct fields
            if (pg.numFloors) numFloors = parseInt(pg.numFloors);
            if (pg.roomsPerFloor) roomsPerFloor = parseInt(pg.roomsPerFloor);
            if (pg.startingRoomNumber) startingRoomNumber = pg.startingRoomNumber;
            if (pg.advanceAmount) advanceAmount = parseInt(pg.advanceAmount);
            
            // Check facilities or room_config
            if (pg.facilities) {
              try {
                const facilities = typeof pg.facilities === 'string' 
                  ? JSON.parse(pg.facilities) 
                  : pg.facilities;
                if (facilities.numFloors) numFloors = parseInt(facilities.numFloors);
                if (facilities.roomsPerFloor) roomsPerFloor = parseInt(facilities.roomsPerFloor);
                if (facilities.startingRoomNumber) startingRoomNumber = facilities.startingRoomNumber;
                if (facilities.advanceAmount) advanceAmount = parseInt(facilities.advanceAmount);
              } catch (e) {
                console.log("Could not parse facilities");
              }
            }
            
            if (pg.room_config) {
              try {
                const roomConfig = typeof pg.room_config === 'string' 
                  ? JSON.parse(pg.room_config) 
                  : pg.room_config;
                if (roomConfig.numFloors) numFloors = parseInt(roomConfig.numFloors);
                if (roomConfig.roomsPerFloor) roomsPerFloor = parseInt(roomConfig.roomsPerFloor);
                if (roomConfig.startingRoomNumber) startingRoomNumber = roomConfig.startingRoomNumber;
                if (roomConfig.advanceAmount) advanceAmount = parseInt(roomConfig.advanceAmount);
              } catch (e) {
                console.log("Could not parse room_config");
              }
            }
            
            return {
              hostel_id: pg.hostel_id || pg.id || pg._id,
              hostel_name: pg.hostel_name || pg.name || "Unnamed PG",
              area: pg.area || pg.location?.area || "Unknown Area",
              city: pg.city || pg.location?.city || "Unknown City",
              state: pg.state || pg.location?.state || "",
              total_rooms: pg.total_rooms || pg.rooms_count || 0,
              occupied_rooms: pg.occupied_rooms || 0,
              vacant_rooms: pg.vacant_rooms || 0,
              img: pg.img || pg.images?.[0] || "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=PG",
              // Store configuration data
              sharing_data: sharingData,
              numFloors,
              roomsPerFloor,
              startingRoomNumber,
              advanceAmount,
              rawData: pg
            };
          });
          
          setPGs(formattedPGs);
          localStorage.setItem("hlopgOwnerPGs", JSON.stringify(formattedPGs));
          
          if (!selectedPG && formattedPGs.length > 0) {
            setSelectedPG(formattedPGs[0]);
          }
        } else {
          setPGs([]);
          localStorage.removeItem("hlopgOwnerPGs");
        }
      } catch (error) {
        console.error("Error fetching PGs:", error);
        setPGs([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.owner_id) {
      fetchPGs();
    } else {
      const cachedUser = localStorage.getItem("hlopgOwner");
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          if (parsedUser.owner_id || parsedUser.id) {
            fetchPGs();
          }
        } catch (e) {
          console.error("Error parsing cached user:", e);
        }
      }
    }
  }, [user, refreshKey]);

  // Fetch rooms AND PG configuration for selected PG
  useEffect(() => {
    const fetchRoomsAndConfig = async () => {
      if (!selectedPG) return;
      
      try {
        setRoomLoading(true);
        const token = localStorage.getItem("hlopgToken");
        
        console.log("Fetching rooms and config for PG:", selectedPG.hostel_id);
        
        let roomsData = [];
        
        // Fetch rooms
        try {
          // Try the new endpoint first: /api/hostel/rooms/pg/{hostelId}
          const response = await api.get(`/hostel/rooms/pg/${selectedPG.hostel_id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Handle the response format from new endpoint
          if (response.data && response.data.data) {
            roomsData = response.data.data;
          } else if (response.data && response.data.rooms) {
            roomsData = response.data.rooms;
          } else {
            roomsData = response.data || [];
          }
        } catch (error) {
          console.log("New rooms endpoint failed, trying alternatives...");
          
          try {
            // Try: /api/hostel/{hostelId}/rooms (alternative new endpoint)
            const response = await api.get(`/hostel/${selectedPG.hostel_id}/rooms`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data && response.data.data) {
              roomsData = response.data.data;
            } else if (response.data && response.data.rooms) {
              roomsData = response.data.rooms;
            } else {
              roomsData = response.data || [];
            }
          } catch (error2) {
            console.log("Alternative endpoint failed, trying old endpoints...");
            
            try {
              // Try: /rooms/pg/${selectedPG.hostel_id} (old endpoint)
              const response = await api.get(`/rooms/pg/${selectedPG.hostel_id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              roomsData = response.data || [];
            } catch (error3) {
              console.log("Old rooms endpoint failed, trying owner endpoint...");
              
              try {
                // Try: /owner/rooms/${selectedPG.hostel_id}
                const response = await api.get(`/owner/rooms/${selectedPG.hostel_id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                roomsData = response.data || [];
              } catch (error4) {
                console.log("All rooms endpoints failed, using sample data");
                roomsData = createSampleRooms();
              }
            }
          }
        }
        
        setRooms(roomsData);
        
        // Process floor/room configuration from PG data
        processPgConfiguration(selectedPG);
        
        // Group rooms by floor
        processRoomsByFloor(roomsData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        const sampleData = createSampleRooms();
        setRooms(sampleData);
        processRoomsByFloor(sampleData);
        processPgConfiguration(selectedPG);
      } finally {
        setRoomLoading(false);
      }
    };

    fetchRoomsAndConfig();
  }, [selectedPG]);

  // Process PG configuration (numFloors, roomsPerFloor, etc.)
  const processPgConfiguration = (pgData) => {
    if (!pgData) return;
    
    const config = {
      numFloors: pgData.numFloors || 0,
      roomsPerFloor: pgData.roomsPerFloor || 0,
      startingRoomNumber: pgData.startingRoomNumber || "",
      advanceAmount: pgData.advanceAmount || 0,
      sharingData: pgData.sharing_data || {}
    };
    
    console.log("Processed PG config:", config);
    setPgConfig(config);
  };

  // Process rooms and group by floor
  const processRoomsByFloor = (roomsData) => {
    const floors = {};
    
    roomsData.forEach(room => {
      let floor = 1;
      if (room.room_number) {
        const firstChar = room.room_number.charAt(0);
        if (!isNaN(firstChar)) {
          floor = parseInt(firstChar);
        }
      } else if (room.floor) {
        floor = parseInt(room.floor);
      }
      
      if (floor < 1) floor = 1;
      if (floor > 10) floor = 10;
      
      if (!floors[floor]) {
        floors[floor] = [];
      }
      
      floors[floor].push({
        id: room.id || room._id || Date.now() + Math.random(),
        room_number: room.room_number || `F${floor}R${floors[floor].length + 1}`,
        floor: floor,
        sharing_type: room.sharing_type || room.sharing || "2-Sharing",
        rent: room.rent || room.price || 5000,
        status: room.status || "vacant",
        tenant_name: room.tenant_name || room.tenant?.name || null,
        tenant_phone: room.tenant_phone || room.tenant?.phone || null,
        amenities: room.amenities || ["WiFi", "Attached Bathroom"]
      });
    });
    
    // Create expected floors based on configuration
    const expectedFloors = pgConfig.numFloors || 3;
    for (let floor = 1; floor <= expectedFloors; floor++) {
      if (!floors[floor]) {
        floors[floor] = [];
      }
    }
    
    const filtered = Object.keys(floors)
      .map(floor => ({
        floor: parseInt(floor),
        rooms: floors[floor].sort((a, b) => a.room_number.localeCompare(b.room_number))
      }))
      .sort((a, b) => a.floor - b.floor);
    
    setFilteredRooms(filtered);
  };

  // Create sample room data
  const createSampleRooms = () => {
    if (!selectedPG) return [];
    
    const sampleRooms = [];
    const totalFloors = pgConfig.numFloors || 3;
    const roomsPerFloor = pgConfig.roomsPerFloor || 5;
    
    // Get sharing types and prices from PG configuration
    const sharingTypes = Object.keys(pgConfig.sharingData || {});
    const defaultSharingTypes = ["2-Sharing", "3-Sharing", "4-Sharing"];
    const availableSharingTypes = sharingTypes.length > 0 ? sharingTypes : defaultSharingTypes;
    
    for (let floor = 1; floor <= totalFloors; floor++) {
      for (let roomNum = 1; roomNum <= roomsPerFloor; roomNum++) {
        const roomId = `${selectedPG.hostel_id}_${floor}${String(roomNum).padStart(2, '0')}`;
        const roomNumber = `${floor}${String(roomNum).padStart(2, '0')}`;
        const sharingType = availableSharingTypes[(roomNum - 1) % availableSharingTypes.length];
        
        // Get rent from sharing data or use default calculation
        let rent = pgConfig.sharingData?.[sharingType] || (5000 + (floor * 500) + (roomNum * 100));
        
        sampleRooms.push({
          id: roomId,
          room_number: roomNumber,
          floor: floor,
          sharing_type: sharingType,
          rent: rent,
          status: roomNum <= 2 ? "occupied" : "vacant", // First 2 rooms occupied
          tenant_name: roomNum <= 2 ? ["John Doe", "Jane Smith"][roomNum - 1] : null,
          tenant_phone: roomNum <= 2 ? "9876543210" : null,
          amenities: ["WiFi", "Attached Bathroom", "Bed", "Wardrobe"],
          pg_id: selectedPG.hostel_id
        });
      }
    }
    
    console.log("Created sample rooms:", sampleRooms.length);
    return sampleRooms;
  };

  // Get floor name
  const getFloorName = (floor) => {
    if (floor === 1) return "1st Floor";
    if (floor === 2) return "2nd Floor";
    if (floor === 3) return "3rd Floor";
    return `${floor}th Floor`;
  };

  // Update room status
  const updateRoomStatus = async (roomId, newStatus) => {
    try {
      const updatedRooms = rooms.map(room => 
        room.id === roomId ? { ...room, status: newStatus } : room
      );
      
      setRooms(updatedRooms);
      processRoomsByFloor(updatedRooms);
      
      const token = localStorage.getItem("hlopgToken");
      
      try {
        // Try new endpoint first: /api/hostel/room/{roomId}/status
        await api.put(`/hostel/room/${roomId}/status`, 
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Status updated via new endpoint");
      } catch (error) {
        console.log("New endpoint failed, trying old endpoint...");
        // Fallback to old endpoint
        try {
          await api.put(`/rooms/${roomId}/status`, 
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Status updated via old endpoint");
        } catch (error2) {
          console.log("All endpoints failed, updating locally only");
          // Update locally even if API fails
        }
      }
      
      alert(`Room status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating room status:", error);
      alert("Failed to update room status. Please try again.");
    }
  };

  // Handle room click
  const handleRoomClick = (room) => {
    console.log("Room clicked:", room);
    
    const roomInfo = `
Room Details:
-------------
Room Number: ${room.room_number}
Floor: ${getFloorName(room.floor)}
Sharing Type: ${room.sharing_type}
Rent: ₹${room.rent}/month
Status: ${room.status.toUpperCase()}
${room.tenant_name ? `\nTenant: ${room.tenant_name}\nPhone: ${room.tenant_phone}` : 'Status: VACANT'}
${room.amenities ? `\nAmenities: ${Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities}` : ''}
    `.trim();
    
    alert(roomInfo);
  };

  // Refresh data
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setRoomLoading(true);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'vacant': return '#4CAF50'; // Green
      case 'occupied': return 'red'; // Blue
      case 'maintenance': return '#ff9800'; // Orange
      default: return '#9e9e9e'; // Grey
    }
  };

  if (loading) {
    return (
      <div className="myrooms-loading">
        <div className="spinner"></div>
        <p>Loading your PGs...</p>
      </div>
    );
  }

  if (pgs.length === 0) {
    return (
      <div className="myrooms-empty">
        <div className="empty-icon">🏠</div>
        <h3>No PGs Found</h3>
        <p>You haven't uploaded any PGs yet.</p>
        <p>Go to "Upload PG" to add your first property.</p>
        <button 
          className="go-to-upload-btn"
          onClick={() => window.location.href = "/owner-dashboard?tab=Upload PG"}
        >
          Upload PG
        </button>
      </div>
    );
  }

  return (
    <div className="myrooms-container">
      {/* PG Selection Header */}
      <div className="myrooms-header">
        <div className="pg-selector">
          <h2>Select PG:</h2>
          <select 
            value={selectedPG?.hostel_id || ""}
            onChange={(e) => {
              const pg = pgs.find(p => p.hostel_id == e.target.value);
              if (pg) {
                setSelectedPG(pg);
                setRooms([]);
                setFilteredRooms([]);
              }
            }}
            className="pg-dropdown"
          >
            {pgs.map(pg => (
              <option key={pg.hostel_id} value={pg.hostel_id}>
                {pg.hostel_name} - {pg.area}, {pg.city}
              </option>
            ))}
          </select>
        </div>
        
        {/* <div className="header-actions">
          <button className="refresh-btn" onClick={handleRefresh}>
            Add new 
          </button>
        </div> */}
      </div>

      
      {/* Room Management - Floors (Image Style) */}
      {roomLoading ? (
        <div className="rooms-loading">
          <div className="spinner small"></div>
          <p>Loading rooms...</p>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="no-rooms-found">
          <div className="no-rooms-icon">🚪</div>
          <h3>No Rooms Found</h3>
          <p>This PG doesn't have any rooms yet.</p>
        </div>
      ) : (
        <div className="rooms-management">
          {filteredRooms.map(({ floor, rooms: floorRooms }) => (
            <div key={floor} className="floor-section">
              <div className="floor-header">
                <h3 className="floor-title">
                  {getFloorName(floor)}
                </h3>
                <div className="floor-stats">
                  <span className="floor-stat-item">
                    <span className="stat-dot vacant-dot"></span>
                    Vacant: {floorRooms.filter(r => r.status === 'vacant').length}
                  </span>
                  <span className="floor-stat-item">
                    <span className="stat-dot occupied-dot"></span>
                    Occupied: {floorRooms.filter(r => r.status === 'occupied').length}
                  </span>
                </div>
              </div>
              
              {/* Simple Room Numbers Display (like image) */}
              <div className="rooms-simple-display">
                {floorRooms.map(room => (
                  <div 
                    key={room.id} 
                    className="room-simple-box"
                    style={{ 
                      backgroundColor: getStatusColor(room.status),
                      border: `2px solid ${getStatusColor(room.status)}`
                    }}
                    onClick={() => handleRoomClick(room)}
                    title={`Room ${room.room_number} - ${room.status}`}
                  >
                    <span className="room-simple-number">{room.room_number}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRooms;