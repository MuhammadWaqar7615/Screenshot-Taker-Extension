// import React, { useState, useEffect, useMemo } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { db } from "../config/firebase";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   doc,
//   getDoc,
// } from "firebase/firestore";

// const Screenshots = () => {
//   const navigate = useNavigate();
//   const params = useParams();
//   const location = useLocation();

//   // State declarations
//   const [items, setItems] = useState([]);
//   const [search, setSearch] = useState("");
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [username, setUsername] = useState("");
//   const [modalType, setModalType] = useState(null);
//   const [tempValue, setTempValue] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [firestoreError, setFirestoreError] = useState(null);
//   const [dateTimeFilter, setDateTimeFilter] = useState({
//     startDate: "",
//     startTime: "",
//     endDate: "",
//     endTime: "",
//   });
//   const [showFilters, setShowFilters] = useState(false);

//   // Get UID from URL parameters
//   const uid = params.id;

//   // ✅ Optimized screenshot fetching with error handling
//   useEffect(() => {
//     if (!uid) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setFirestoreError(null);

//     let q;
//     try {
//       q = query(collection(db, "screenshots"), where("user_id", "==", uid));
//     } catch (err) {
//       console.error("Query build failed:", err);
//       setFirestoreError("Failed to build query");
//       setLoading(false);
//       return;
//     }

//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         setLoading(false);

//         if (snapshot.empty) {
//           setItems([]);
//           setSelectedItem(null);
//           return;
//         }

//         const data = snapshot.docs.map((snap) => {
//           const raw = snap.data();
//           const timestamp = raw.timestamp ? new Date(raw.timestamp) : new Date();
//           return {
//             id: snap.id,
//             title: timestamp.toLocaleString("en-US", {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//               hour: "2-digit",
//               minute: "2-digit",
//               second: "2-digit",
//             }),
//             department: raw.department || "image",
//             url: raw.url || "",
//             timestamp: raw.timestamp || null,
//             dateObject: timestamp,
//           };
//         });

//         // Sort by timestamp (newest first)
//         data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

//         setItems(data);
//         setSelectedItem(
//           (prev) => data.find((item) => item.id === prev?.id) || data[0]
//         );
//       },
//       (err) => {
//         console.error("Firestore error:", err);
//         setFirestoreError("Failed to load screenshots");
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, [uid]);

//   // ✅ Optimized user data fetching
//   useEffect(() => {
//     if (!uid) return;

//     const fetchUser = async () => {
//       try {
//         const userDoc = await getDoc(doc(db, "users", uid));
//         if (userDoc.exists()) {
//           const data = userDoc.data();
//           setUsername(data.name || "Unknown User");
//         } else {
//           setUsername("Unknown User");
//         }
//       } catch (err) {
//         console.error("Error fetching user:", err);
//         setUsername("Unknown User");
//       }
//     };

//     fetchUser();
//   }, [uid]);

//   // ✅ Advanced filtering with date and time
//   const filteredItems = useMemo(() => {
//     let filtered = items;

//     // Text search filter
//     const searchQuery = search.trim().toLowerCase();
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (item) =>
//           item.title.toLowerCase().includes(searchQuery) ||
//           item.department.toLowerCase().includes(searchQuery)
//       );
//     }

//     // Date and time range filter
//     const hasStartFilter = dateTimeFilter.startDate || dateTimeFilter.startTime;
//     const hasEndFilter = dateTimeFilter.endDate || dateTimeFilter.endTime;

//     if (hasStartFilter || hasEndFilter) {
//       filtered = filtered.filter((item) => {
//         if (!item.timestamp) return false;

//         const itemDateTime = new Date(item.timestamp);
//         let startDateTime = null;
//         let endDateTime = null;

//         // Build start datetime
//         if (dateTimeFilter.startDate) {
//           startDateTime = new Date(dateTimeFilter.startDate);
//           if (dateTimeFilter.startTime) {
//             const [hours, minutes] = dateTimeFilter.startTime.split(":");
//             startDateTime.setHours(
//               parseInt(hours),
//               parseInt(minutes),
//               0,
//               0
//             );
//           } else {
//             startDateTime.setHours(0, 0, 0, 0);
//           }
//         }

//         // Build end datetime
//         if (dateTimeFilter.endDate) {
//           endDateTime = new Date(dateTimeFilter.endDate);
//           if (dateTimeFilter.endTime) {
//             const [hours, minutes] = dateTimeFilter.endTime.split(":");
//             endDateTime.setHours(
//               parseInt(hours),
//               parseInt(minutes),
//               59,
//               999
//             );
//           } else {
//             endDateTime.setHours(23, 59, 59, 999);
//           }
//         }

//         if (startDateTime && endDateTime) {
//           return (
//             itemDateTime >= startDateTime && itemDateTime <= endDateTime
//           );
//         } else if (startDateTime) {
//           return itemDateTime >= startDateTime;
//         } else if (endDateTime) {
//           return itemDateTime <= endDateTime;
//         }
//         return true;
//       });
//     }

//     return filtered;
//   }, [items, search, dateTimeFilter]);

//   // ✅ Helper functions
//   const handleImageError = (e) => {
//     e.target.style.display = "none";
//     const errorMsg = e.target.nextSibling;
//     if (errorMsg) errorMsg.style.display = "block";
//   };

//   const handleImageLoad = (e) => {
//     const errorMsg = e.target.nextSibling;
//     if (errorMsg) errorMsg.style.display = "none";
//   };

//   const handleModalClose = () => {
//     setModalType(null);
//     setTempValue("");
//   };

//   const handleDateTimeFilterChange = (e) => {
//     const { name, value } = e.target;
//     setDateTimeFilter((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const clearDateTimeFilter = () => {
//     setDateTimeFilter({
//       startDate: "",
//       startTime: "",
//       endDate: "",
//       endTime: "",
//     });
//   };

//   const isFilterActive =
//     dateTimeFilter.startDate ||
//     dateTimeFilter.startTime ||
//     dateTimeFilter.endDate ||
//     dateTimeFilter.endTime;

//   // Get date range summary for display
//   const getFilterSummary = () => {
//     if (!isFilterActive) return null;

//     const parts = [];
//     if (dateTimeFilter.startDate) {
//       parts.push(
//         `From: ${dateTimeFilter.startDate}${dateTimeFilter.startTime ? " " + dateTimeFilter.startTime : ""
//         }`
//       );
//     }
//     if (dateTimeFilter.endDate) {
//       parts.push(
//         `To: ${dateTimeFilter.endDate}${dateTimeFilter.endTime ? " " + dateTimeFilter.endTime : ""
//         }`
//       );
//     }
//     return parts.join(" | ");
//   };

//   return (
//     <div className="flex h-screen bg-gray-100 relative">
//       {/* Global Loader */}
//       {loading && (
//         <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
//           <div className="relative w-16 h-16">
//             <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
//             <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
//           </div>
//           <p className="mt-4 text-gray-200 text-lg font-semibold">
//             Loading Screenshots...
//           </p>
//         </div>
//       )}

//       {/* Sidebar */}
//       <aside className="w-80 bg-gray-800 shadow-lg p-4 border-r border-gray-700 min-h-screen flex flex-col">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-bold text-gray-100">Screenshots</h2>
//           <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
//             {filteredItems.length}/{items.length}
//           </span>
//         </div>

//         {/* Search Box */}
//         <div className="relative mb-4">
//           <input
//             type="text"
//             placeholder="Search by title or department..."
//             className="w-full px-3 py-2 pl-10 text-sm border rounded-md bg-gray-900 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
//         </div>

//         {/* Advanced Filters Section */}
//         <div className="mb-4">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="w-full flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
//           >
//             <span className="text-sm font-medium text-gray-200">
//               ⚙️ Advanced Filters
//             </span>
//             <span
//               className={`transform transition-transform ${showFilters ? "rotate-180" : ""
//                 }`}
//             >
//               ▼
//             </span>
//           </button>

//           {showFilters && (
//             <div className="mt-2 p-3 bg-gray-900 rounded-lg border border-gray-700">
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="text-sm font-medium text-gray-200">
//                   Date & Time Range
//                 </h3>
//                 {isFilterActive && (
//                   <button
//                     onClick={clearDateTimeFilter}
//                     className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-400 hover:border-red-300 transition-colors"
//                   >
//                     Clear All
//                   </button>
//                 )}
//               </div>

//               <div className="space-y-3">
//                 {/* Start Date/Time */}
//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <label className="text-xs text-gray-400 block mb-1">
//                       Start Date
//                     </label>
//                     <input
//                       type="date"
//                       name="startDate"
//                       value={dateTimeFilter.startDate}
//                       onChange={handleDateTimeFilterChange}
//                       className="w-full px-2 py-1 text-xs border rounded bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-xs text-gray-400 block mb-1">
//                       Start Time
//                     </label>
//                     <input
//                       type="time"
//                       name="startTime"
//                       value={dateTimeFilter.startTime}
//                       onChange={handleDateTimeFilterChange}
//                       className="w-full px-2 py-1 text-xs border rounded bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
//                     />
//                   </div>
//                 </div>

//                 {/* End Date/Time */}
//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <label className="text-xs text-gray-400 block mb-1">
//                       End Date
//                     </label>
//                     <input
//                       type="date"
//                       name="endDate"
//                       value={dateTimeFilter.endDate}
//                       onChange={handleDateTimeFilterChange}
//                       className="w-full px-2 py-1 text-xs border rounded bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-xs text-gray-400 block mb-1">
//                       End Time
//                     </label>
//                     <input
//                       type="time"
//                       name="endTime"
//                       value={dateTimeFilter.endTime}
//                       onChange={handleDateTimeFilterChange}
//                       className="w-full px-2 py-1 text-xs border rounded bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {isFilterActive && (
//                 <div className="mt-3 p-2 bg-blue-900 rounded text-xs text-blue-200">
//                   <div className="font-medium">Active Filter:</div>
//                   <div className="truncate">{getFilterSummary()}</div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Quick Stats */}
//         <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
//           <div className="grid grid-cols-2 gap-3 text-xs">
//             <div>
//               <div className="text-gray-400">Total</div>
//               <div className="text-white font-medium">{items.length}</div>
//             </div>
//             <div>
//               <div className="text-gray-400">Filtered</div>
//               <div className="text-blue-400 font-medium">
//                 {filteredItems.length}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Screenshots List */}
//         <div className="flex-1 overflow-hidden">
//           {filteredItems.length === 0 ? (
//             <div className="text-center py-8">
//               <div className="text-gray-400 text-4xl mb-2">📷</div>
//               <p className="text-gray-400 text-sm mb-2">
//                 {items.length === 0
//                   ? "No screenshots found"
//                   : "No matching results"}
//               </p>
//               {isFilterActive && items.length > 0 && (
//                 <p className="text-gray-500 text-xs">
//                   Adjust your filters to see more results
//                 </p>
//               )}
//             </div>
//           ) : (
//             <ul className="space-y-1 overflow-y-auto max-h-full">
//               {filteredItems.map((item) => (
//                 <li
//                   key={item.id}
//                   className={`p-3 m-2.5 rounded-lg cursor-pointer transition-all duration-200 border group ${selectedItem?.id === item.id
//                       ? "bg-blue-600 border-blue-400 shadow-lg scale-[1.02]"
//                       : "bg-gray-900 border-transparent hover:bg-gray-700 hover:border-gray-600"
//                     }`}
//                   onClick={() => setSelectedItem(item)}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1 min-w-0">
//                       <p
//                         className={`font-medium truncate text-sm ${selectedItem?.id === item.id
//                             ? "text-white"
//                             : "text-gray-200"
//                           }`}
//                       >
//                         {item.title}
//                       </p>
//                       <p
//                         className={`text-xs truncate mt-1 ${selectedItem?.id === item.id
//                             ? "text-blue-100"
//                             : "text-gray-400"
//                           }`}
//                       >
//                         {item.department}
//                       </p>
//                     </div>
//                     {selectedItem?.id === item.id && (
//                       <div className="text-white ml-2 text-sm">●</div>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col min-h-0 bg-gray-900">
//         {/* Header */}
//         <div className="bg-gray-800 border-b border-gray-700 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-white">{username}</h1>
//               <div className="flex items-center space-x-4 mt-1">
//                 <p className="text-gray-400 text-sm">Screenshots Gallery</p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               <button
//                 className="px-4 cursor-pointer py-2 text-sm text-white rounded-lg shadow bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center space-x-2"
//                 onClick={() => navigate(`/userDetails/${uid}`)}
//               >
//                 <span>User Details</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Content Area */}
//         <div className="flex-1 p-6 overflow-auto">
//           {items.length === 0 ? (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <div className="text-6xl mb-4">📸</div>
//                 <h3 className="text-xl font-semibold text-gray-200 mb-2">
//                   No Screenshots Available
//                 </h3>
//                 <p className="text-gray-400">
//                   This user doesn't have any screenshots yet.
//                 </p>
//               </div>
//             </div>
//           ) : selectedItem ? (
//             <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
//               {/* Image Header */}
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h3 className="text-2xl font-bold text-white mb-2">
//                     {selectedItem.title}
//                   </h3>
//                   <div className="flex items-center space-x-3">
//                     <span className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300">
//                       Department: {selectedItem.department}
//                     </span>
//                     <span className="text-gray-500">•</span>
//                     <span className="text-sm text-gray-400">
//                       {new Date(selectedItem.timestamp).toLocaleDateString(
//                         "en-US",
//                         {
//                           weekday: "long",
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         }
//                       )}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="text-right flex items-center">
//                   <span className="center">
//                     <div className="flex justify-center space-x-4 mx-3">
//                       <button
//                         onClick={() => {
//                           const currentIndex = items.findIndex(
//                             (item) => item.id === selectedItem.id
//                           );
//                           const prevItem = items[currentIndex - 1];
//                           if (prevItem) setSelectedItem(prevItem);
//                         }}
//                         disabled={
//                           items.findIndex(
//                             (item) => item.id === selectedItem.id
//                           ) === 0
//                         }
//                         className="px-6 py-2 cursor-pointer bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors font-medium"
//                       >
//                         ← Previous
//                       </button>
//                       <button
//                         onClick={() => {
//                           const currentIndex = items.findIndex(
//                             (item) => item.id === selectedItem.id
//                           );
//                           const nextItem = items[currentIndex + 1];
//                           if (nextItem) setSelectedItem(nextItem);
//                         }}
//                         disabled={
//                           items.findIndex(
//                             (item) => item.id === selectedItem.id
//                           ) === items.length - 1
//                         }
//                         className="px-6 py-2 cursor-pointer bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors font-medium"
//                       >
//                         Next →
//                       </button>
//                     </div>
//                   </span>
//                   <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">
//                     {items.findIndex((item) => item.id === selectedItem.id) + 1}{" "}
//                     of {items.length}
//                   </span>
//                 </div>
//               </div>

//               {/* Image Display */}
//               <div className="flex justify-center">
//                 {selectedItem.url ? (
//                   <div className="text-center">
//                     <img
//                       src={selectedItem.url}
//                       alt="Screenshot"
//                       className="max-w-full max-h-[80vh] w-[53.5vw] rounded-xl shadow-2xl border-4 border-gray-700 mx-auto"
//                       onError={handleImageError}
//                       onLoad={handleImageLoad}
//                     />
//                     <div className="hidden mt-2 p-2 bg-red-900 rounded text-sm text-red-200">
//                       ⚠️ Image failed to load. Please check the URL.
//                     </div>

//                     {/* Navigation Controls */}
//                     {/* <div className="flex justify-center space-x-4 mt-6">
//                       <button
//                         onClick={() => {
//                           const currentIndex = items.findIndex(
//                             (item) => item.id === selectedItem.id
//                           );
//                           const prevItem = items[currentIndex - 1];
//                           if (prevItem) setSelectedItem(prevItem);
//                         }}
//                         disabled={
//                           items.findIndex(
//                             (item) => item.id === selectedItem.id
//                           ) === 0
//                         }
//                         className="px-6 py-2 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors font-medium"
//                       >
//                         ← Previous
//                       </button>
//                       <button
//                         onClick={() => {
//                           const currentIndex = items.findIndex(
//                             (item) => item.id === selectedItem.id
//                           );
//                           const nextItem = items[currentIndex + 1];
//                           if (nextItem) setSelectedItem(nextItem);
//                         }}
//                         disabled={
//                           items.findIndex(
//                             (item) => item.id === selectedItem.id
//                           ) === items.length - 1
//                         }
//                         className="px-6 py-2 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors font-medium"
//                       >
//                         Next →
//                       </button>
//                     </div> */}
//                   </div>
//                 ) : (
//                   <div className="text-center py-12">
//                     <div className="text-6xl mb-4">❌</div>
//                     <p className="text-red-400 text-lg font-medium">
//                       No image URL available
//                     </p>
//                     <p className="text-gray-400 text-sm mt-1">
//                       The screenshot data doesn't contain a valid URL
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <div className="text-6xl mb-4">👆</div>
//                 <h3 className="text-xl font-semibold text-gray-200 mb-2">
//                   Select a Screenshot
//                 </h3>
//                 <p className="text-gray-400">
//                   Choose a screenshot from the sidebar to view it here.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Screenshots;






import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";

// Format date for grouping (e.g., "8 Oct, 2024")
function formatDateForGroup(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Format time (e.g., "7:00 PM")
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Group screenshots by date
function groupScreenshotsByDate(screenshots) {
  const grouped = {};
  
  screenshots.forEach(screenshot => {
    if (!screenshot.timestamp) return;
    
    const dateKey = formatDateForGroup(screenshot.timestamp);
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(screenshot);
  });
  
  // Sort screenshots within each date group by timestamp (newest first)
  Object.keys(grouped).forEach(date => {
    grouped[date].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  });
  
  return grouped;
}

// Get time range for a date group
function getTimeRangeForGroup(screenshots) {
  if (!screenshots.length) return "";
  
  const timestamps = screenshots.map(s => new Date(s.timestamp)).filter(ts => !isNaN(ts));
  if (timestamps.length === 0) return "";
  
  const minTime = new Date(Math.min(...timestamps));
  const maxTime = new Date(Math.max(...timestamps));
  
  const timeDiff = maxTime - minTime;
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  let timeRange = `${formatTime(minTime)} - ${formatTime(maxTime)}`;
  
  if (hoursDiff > 0) {
    timeRange += ` → ${hoursDiff}h ${minutesDiff > 0 ? `${minutesDiff}m` : ''}`.trim();
  } else if (minutesDiff > 0) {
    timeRange += ` → ${minutesDiff}m`;
  } else {
    timeRange += ` → <1m`;
  }
  
  return timeRange;
}

const Screenshots = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  // State declarations
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [firestoreError, setFirestoreError] = useState(null);
  const [dateTimeFilter, setDateTimeFilter] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get UID from URL parameters
  const uid = params.id;

  // ✅ Optimized screenshot fetching with error handling
  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setFirestoreError(null);

    let q;
    try {
      q = query(
        collection(db, "screenshots"), 
        where("user_id", "==", uid),
        orderBy("timestamp", "desc")
      );
    } catch (err) {
      console.error("Query build failed:", err);
      setFirestoreError("Failed to build query");
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setLoading(false);

        if (snapshot.empty) {
          setItems([]);
          setSelectedItem(null);
          return;
        }

        const data = snapshot.docs.map((snap) => {
          const raw = snap.data();
          const timestamp = raw.timestamp ? new Date(raw.timestamp) : new Date();
          return {
            id: snap.id,
            title: timestamp.toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            department: "screenshot",
            url: raw.url || "",
            timestamp: raw.timestamp || null,
            dateObject: timestamp,
            // Additional fields for grouping
            formattedDate: formatDateForGroup(raw.timestamp),
            formattedTime: formatTime(raw.timestamp),
          };
        });

        setItems(data);
        setSelectedItem(
          (prev) => data.find((item) => item.id === prev?.id) || data[0]
        );
      },
      (err) => {
        console.error("Firestore error:", err);
        setFirestoreError("Failed to load screenshots");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  // ✅ Optimized user data fetching
  useEffect(() => {
    if (!uid) return;

    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUsername(data.email || data.name || "Unknown User");
        } else {
          setUsername("Unknown User");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUsername("Unknown User");
      }
    };

    fetchUser();
  }, [uid]);

  // ✅ Enhanced filtering with date groups search
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Text search filter - ENHANCED with date group search
    const searchQuery = search.trim().toLowerCase();
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery) ||
          item.department.toLowerCase().includes(searchQuery) ||
          item.formattedDate.toLowerCase().includes(searchQuery) ||
          item.formattedTime.toLowerCase().includes(searchQuery)
      );
    }

    // Date and time range filter
    const hasStartFilter = dateTimeFilter.startDate || dateTimeFilter.startTime;
    const hasEndFilter = dateTimeFilter.endDate || dateTimeFilter.endTime;

    if (hasStartFilter || hasEndFilter) {
      filtered = filtered.filter((item) => {
        if (!item.timestamp) return false;

        const itemDateTime = new Date(item.timestamp);
        let startDateTime = null;
        let endDateTime = null;

        // Build start datetime
        if (dateTimeFilter.startDate) {
          startDateTime = new Date(dateTimeFilter.startDate);
          if (dateTimeFilter.startTime) {
            const [hours, minutes] = dateTimeFilter.startTime.split(":");
            startDateTime.setHours(
              parseInt(hours),
              parseInt(minutes),
              0,
              0
            );
          } else {
            startDateTime.setHours(0, 0, 0, 0);
          }
        }

        // Build end datetime
        if (dateTimeFilter.endDate) {
          endDateTime = new Date(dateTimeFilter.endDate);
          if (dateTimeFilter.endTime) {
            const [hours, minutes] = dateTimeFilter.endTime.split(":");
            endDateTime.setHours(
              parseInt(hours),
              parseInt(minutes),
              59,
              999
            );
          } else {
            endDateTime.setHours(23, 59, 59, 999);
          }
        }

        if (startDateTime && endDateTime) {
          return (
            itemDateTime >= startDateTime && itemDateTime <= endDateTime
          );
        } else if (startDateTime) {
          return itemDateTime >= startDateTime;
        } else if (endDateTime) {
          return itemDateTime <= endDateTime;
        }
        return true;
      });
    }

    return filtered;
  }, [items, search, dateTimeFilter]);

  // ✅ Group filtered items by date
  const groupedItems = useMemo(() => {
    return groupScreenshotsByDate(filteredItems);
  }, [filteredItems]);

  // ✅ Get sorted dates for display
  const sortedDates = useMemo(() => {
    return Object.keys(groupedItems).sort((a, b) => new Date(b) - new Date(a));
  }, [groupedItems]);

  // ✅ Helper functions
  const handleImageError = (e) => {
    e.target.style.display = "none";
    const errorMsg = e.target.nextSibling;
    if (errorMsg) errorMsg.style.display = "block";
  };

  const handleImageLoad = (e) => {
    const errorMsg = e.target.nextSibling;
    if (errorMsg) errorMsg.style.display = "none";
  };

  const handleDateTimeFilterChange = (e) => {
    const { name, value } = e.target;
    setDateTimeFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearDateTimeFilter = () => {
    setDateTimeFilter({
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    });
  };

  const isFilterActive =
    dateTimeFilter.startDate ||
    dateTimeFilter.startTime ||
    dateTimeFilter.endDate ||
    dateTimeFilter.endTime;

  // Get date range summary for display
  const getFilterSummary = () => {
    if (!isFilterActive) return null;

    const parts = [];
    if (dateTimeFilter.startDate) {
      parts.push(
        `From: ${dateTimeFilter.startDate}${dateTimeFilter.startTime ? " " + dateTimeFilter.startTime : ""
        }`
      );
    }
    if (dateTimeFilter.endDate) {
      parts.push(
        `To: ${dateTimeFilter.endDate}${dateTimeFilter.endTime ? " " + dateTimeFilter.endTime : ""
        }`
      );
    }
    return parts.join(" | ");
  };

  // Navigation functions
  const getCurrentItemIndex = () => {
    return items.findIndex(item => item.id === selectedItem?.id);
  };

  const navigateToPrevious = () => {
    const currentIndex = getCurrentItemIndex();
    if (currentIndex > 0) {
      setSelectedItem(items[currentIndex - 1]);
    }
  };

  const navigateToNext = () => {
    const currentIndex = getCurrentItemIndex();
    if (currentIndex < items.length - 1) {
      setSelectedItem(items[currentIndex + 1]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Global Loader */}
      {loading && (
        <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
          </div>
          <p className="mt-4 text-gray-200 text-lg font-semibold">
            Loading Screenshots...
          </p>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-80 bg-gray-800 shadow-lg p-4 border-r border-gray-700 min-h-screen flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-100">Screenshots</h2>
          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
            {filteredItems.length}/{items.length}
          </span>
        </div>

        {/* Search Box */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by date/time (e.g., '8 Oct' or '7:00 PM')..."
            className="w-full px-3 py-2 pl-10 text-sm border rounded-md bg-gray-900 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
        </div>

        {/* Advanced Filters Section */}
        <div className="mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
          >
            <span className="text-sm font-medium text-gray-200">
              ⚙️ Advanced Filters
            </span>
            <span
              className={`transform transition-transform ${showFilters ? "rotate-180" : ""
                }`}
            >
              ▼
            </span>
          </button>

          {showFilters && (
            <div className="mt-2 p-3 bg-gray-900 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-200">
                  Date & Time Range
                </h3>
                {isFilterActive && (
                  <button
                    onClick={clearDateTimeFilter}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-400 hover:border-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {/* Start Date/Time */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="filter-container" onClick={() => document.querySelector('input[name="startDate"]')?.focus()}>
                    <label className="text-xs text-gray-400 block mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={dateTimeFilter.startDate}
                      onChange={handleDateTimeFilterChange}
                      className="w-full px-2 py-1 text-xs border rounded bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    />
                  </div>
                  <div className="filter-container" onClick={() => document.querySelector('input[name="startTime"]')?.focus()}>
                    <label className="text-xs text-gray-400 block mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={dateTimeFilter.startTime}
                      onChange={handleDateTimeFilterChange}
                      className="w-full px-2 py-1 text-xs border rounded bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* End Date/Time */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="filter-container" onClick={() => document.querySelector('input[name="endDate"]')?.focus()}>
                    <label className="text-xs text-gray-400 block mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={dateTimeFilter.endDate}
                      onChange={handleDateTimeFilterChange}
                      className="w-full px-2 py-1 text-xs border rounded bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    />
                  </div>
                  <div className="filter-container" onClick={() => document.querySelector('input[name="endTime"]')?.focus()}>
                    <label className="text-xs text-gray-400 block mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={dateTimeFilter.endTime}
                      onChange={handleDateTimeFilterChange}
                      className="w-full px-2 py-1 text-xs border rounded bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {isFilterActive && (
                <div className="mt-3 p-2 bg-blue-900 rounded text-xs text-blue-200">
                  <div className="font-medium">Active Filter:</div>
                  <div className="truncate">{getFilterSummary()}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-gray-400">Total</div>
              <div className="text-white font-medium">{items.length}</div>
            </div>
            <div>
              <div className="text-gray-400">Filtered</div>
              <div className="text-blue-400 font-medium">
                {filteredItems.length}
              </div>
            </div>
          </div>
        </div>

        {/* Screenshots List - GROUPED BY DATE */}
        <div className="flex-1 overflow-hidden">
          {sortedDates.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">📷</div>
              <p className="text-gray-400 text-sm mb-2">
                {items.length === 0
                  ? "No screenshots found"
                  : "No matching results"}
              </p>
              {isFilterActive && items.length > 0 && (
                <p className="text-gray-500 text-xs">
                  Adjust your filters to see more results
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-full">
              {sortedDates.map((date) => {
                const dateScreenshots = groupedItems[date];
                const timeRange = getTimeRangeForGroup(dateScreenshots);
                
                return (
                  <div key={date} className="date-group">
                    <div className="date-group-header mb-2">
                      <div className="flex items-center justify-between">
                        <h5 className="date-title text-sm font-semibold text-gray-200">
                          {date}
                        </h5>
                        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                          {dateScreenshots.length}
                        </span>
                      </div>
                      {timeRange && (
                        <div className="time-range text-xs text-gray-400 mt-1">
                          {timeRange}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {dateScreenshots.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border group ${selectedItem?.id === item.id
                              ? "bg-blue-600 border-blue-400 shadow-lg scale-[1.02]"
                              : "bg-gray-900 border-transparent hover:bg-gray-700 hover:border-gray-600"
                            }`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p
                                className={`font-medium truncate text-sm ${selectedItem?.id === item.id
                                    ? "text-white"
                                    : "text-gray-200"
                                  }`}
                              >
                                {item.formattedTime}
                              </p>
                              <p
                                className={`text-xs truncate mt-1 ${selectedItem?.id === item.id
                                    ? "text-blue-100"
                                    : "text-gray-400"
                                  }`}
                              >
                                {item.department}
                              </p>
                            </div>
                            {selectedItem?.id === item.id && (
                              <div className="text-white ml-2 text-sm">●</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 bg-gray-900">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{username}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-gray-400 text-sm">Screenshots Gallery</p>
                <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                  {items.length} total screenshots
                </span>
              </div>
            </div>

            {/* <div className="flex items-center space-x-3">
              <button
                className="px-4 cursor-pointer py-2 text-sm text-white rounded-lg shadow bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center space-x-2"
                onClick={() => navigate(`/userDetails/${uid}`)}
              >
                <span>User Details</span>
              </button>
            </div> */}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2">
                  No Screenshots Available
                </h3>
                <p className="text-gray-400">
                  This user doesn't have any screenshots yet.
                </p>
              </div>
            </div>
          ) : selectedItem ? (
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
              {/* Image Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedItem.title}
                  </h3>
                  <div className="flex items-center space-x-3">
                    <span className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300">
                      {selectedItem.formattedDate}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm text-gray-400">
                      {selectedItem.formattedTime}
                    </span>
                  </div>
                </div>

                <div className="text-right flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={navigateToPrevious}
                      disabled={getCurrentItemIndex() === 0}
                      className="px-4 py-2 cursor-pointer bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors font-medium"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={navigateToNext}
                      disabled={getCurrentItemIndex() === items.length - 1}
                      className="px-4 py-2 cursor-pointer bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors font-medium"
                    >
                      Next →
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">
                    {getCurrentItemIndex() + 1} of {items.length}
                  </span>
                </div>
              </div>

              {/* Image Display */}
              <div className="flex justify-center">
                {selectedItem.url ? (
                  <div className="text-center">
                    <img
                      src={selectedItem.url}
                      alt="Screenshot"
                      className="max-w-full max-h-[80vh] w-[53.5vw] rounded-xl shadow-2xl border-4 border-gray-700 mx-auto"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                    <div className="hidden mt-2 p-2 bg-red-900 rounded text-sm text-red-200">
                      ⚠️ Image failed to load. Please check the URL.
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-red-400 text-lg font-medium">
                      No image URL available
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      The screenshot data doesn't contain a valid URL
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">👆</div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2">
                  Select a Screenshot
                </h3>
                <p className="text-gray-400">
                  Choose a screenshot from the sidebar to view it here.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Screenshots;