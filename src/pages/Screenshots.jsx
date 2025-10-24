// import React, { useEffect, useRef, useState } from 'react'
// import { db } from "../config/firebase"
// import { Firestore, collection, getDocs, query, where } from 'firebase/firestore'
// import { useParams } from 'react-router-dom'
// import LoadingOverlay from '../components/LoadingOverlay'
// import { format, formatDistanceToNow, formatDistanceToNowStrict, formatISO9075, intlFormat } from "date-fns"
// import ImageModal from '../components/ImageModal'
// import PhotoToVideo from '../components/PhotoToVideo'

// export default function Screenshots() {
//   const params = useParams()
//   const [userInfo, setUserInfo] = useState({})
//   const [userSS, setUserSS] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [openImg, setOpenImg] = useState()
//   const [showImage, setShowImage] = useState(false)
//   const [search, setSearch] = useState({
//     "startingDate": "",
//     "endingDate": "",
//     "startingTime": "",
//     "endingTime": ""
//   });

//   // const userRef = collection(db, "users")
//   useEffect(() => {
//     const userData = async () => {
//       try {
//         // const data = (await getDocs(userRef)).query(collection, where("uid", "==", params.id ))
//         const q = query(collection(db, "users"), where("uid", "==", params.id));
//         const querySnapshot = await getDocs(q);
//         console.log("userInfo", querySnapshot?.docs[0]?.data())
//         setUserInfo(querySnapshot?.docs[0]?.data())
//         // setLoading(false)
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     userData();

//     const userScreenshots = async () => {
//       try {
//         const q = await getDocs(query(collection(db, "screenshots"), where("user_id", "==", params.id)))
//         q.docs.forEach(ss => {
//           setUserSS(prev => [...prev, ss.data()])
//         })
//         setLoading(false)
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     userScreenshots()
//   }, [])
//   // console.log("userSS", userSS)
//   const validDate = userInfo?.lastActiveAt ? new Date(userInfo?.lastActiveAt) : null;
//   // console.log("validDate", validDate)
//   const result = validDate ? formatDistanceToNowStrict(
//     validDate, { addSuffix: true }
//   ) : "unknown time"

//   const imageClicked = (user) => {
//     setOpenImg(user)
//     setShowImage(true)
//   }

//   let ssTimeStamp = []
//   userSS.forEach(user => {
//     // let dateddate = format(new Date(user.timestamp), "dd,MM,yyyy")
//     // let datedHrs = format(new Date(user.timestamp), "HH")
//     // console.log("dateddate: ", dateddate)
//     // console.log("datedHrs: ", datedHrs)
//     const date = new Date(user.timestamp)
//     const formatDate = format(date, "dd,MM,yyyy")
//     const formatHrs = format(date, "HH")
//     ssTimeStamp.push({
//       date: formatDate,
//       hrs: formatHrs
//     })
//   })
//   ssTimeStamp = [...new Set(ssTimeStamp)]
//   console.log("new array: ", [...new Set(ssTimeStamp.hrs)])
//   // console.log("ssTimeStamp: ", ssTimeStamp)


//   const handleInputs = (e) => {
//     setSearch(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }))
//   }
//   console.log("input search: ", search)


//   const filteredTime = ssTimeStamp.filter(time => {

//     // // time.date.includes(search.startingDate)
//     // console.log("time : ", time)
//     // Object.values(time).forEach(index => {
//     //   if(index == search.startingDate) {
//     //     return
//     //   }
//     // })
//   })

//   // console.log("filtered Time: ", filteredTime)

//   return (
//     <>
//       <div className='flex flex-col bg-gray-900 min-h-screen text-white p-6'>
//         <LoadingOverlay loading={loading} />
//         <header className="flex justify-between">
//           <span className='text-2xl font-bold'>{userInfo.name}</span>
//           <span>
//             <span className='font-bold mx-1'>Last Active:</span>
//             <span>{result}</span>
//           </span>
//         </header>

//         <main className='flex-1 flex gap-3'>
//           <div className="w-full flex-1 pr-3 border-r-2 border-gray-600 ">
//             <h1 className="text-2xl font-bold">Gallery</h1>
//             <div className='flex justify-between flex-wrap'>
//               {/* starting and ending range filters of date and time */}
//               <label htmlFor="">
//                 Starting Date:
//                 <input name="startingDate" value={search.startingDate} onChange={handleInputs} type="date" id="" className='border border-white text-white' />
//               </label>
//               <label htmlFor="">
//                 Ending Date:
//                 <input name="endingDate" value={search.endingDate} onChange={handleInputs} type="date" id="" className='border border-white text-white' />
//               </label>
//               <label htmlFor="">
//                 Starting Time:
//                 <input name="startingTime" value={search.startingTime} onChange={handleInputs} type="time" id="" className='border border-white text-white' />
//               </label>
//               <label htmlFor="">
//                 Ending time:
//                 <input name="endingTime" value={search.endingTime} onChange={handleInputs} type="time" id="" className='border border-white text-white' />
//               </label>
//             </div>
//             <div className="mt-5">
//               <div className='my-3'>
//                 {/* <p>- Hours range (1:00AM - 2:00AM)</p> */}
//                 {
//                   [...new Map(ssTimeStamp.map(item => [item.hrs, item])).values()]
//                     .map((num, i) => (
//                       <div key={i} className="mb-6">

//                         <h2 className="text-2xl font-bold text-gray-200">
//                           Date: {num.date}
//                         </h2>
//                         {/* Hour Title */}
//                         <h2 className="text-lg font-semibold text-gray-200 mb-3">
//                           Hours: {num.hrs}:00 - {Number(num.hrs) + 1}:00
//                         </h2>

//                         {/* Image Grid */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//                           {userSS.map((user, j) => {
//                             const hours = Number(format(new Date(user.timestamp), "HH"));
//                             const blockStart = Number(num.hrs);
//                             const blockEnd = blockStart + 1;

//                             if (hours >= blockStart && hours < blockEnd) {
//                               return (
//                                 <div
//                                   onClick={() => imageClicked(user.url)}
//                                   key={j}
//                                   className="main w-full cursor-pointer h-auto bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all duration-200"
//                                 >
//                                   <img
//                                     src={user.url}
//                                     alt=""
//                                     className="w-full h-auto object-cover p-1 rounded-lg"
//                                   />
//                                   <div className="my-2 text-sm text-gray-300 flex flex-col items-start px-3">
//                                     <span>{format(new Date(user.timestamp), "d MMM, yyyy")}</span>
//                                     <span>{format(new Date(user.timestamp), "h:mm a")}</span>
//                                   </div>
//                                 </div>
//                               );
//                             }
//                             return null;
//                           })}
//                         </div>
//                       </div>
//                     ))
//                 }

//               </div>
//             </div>
//           </div>
//           <aside className=''>
//             <div className=''>
//               <PhotoToVideo images={userSS} />
//             </div>
//           </aside>
//         </main>
//       </div>

//       {
//         showImage &&
//         <ImageModal currImg={openImg} setShowImage={setShowImage} />
//       }
//     </>
//   )
// }


//=========================================================================================================================

import React, { useEffect, useState } from 'react'
import { db } from "../config/firebase"
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import LoadingOverlay from '../components/LoadingOverlay'
import { format, formatDistanceToNowStrict } from "date-fns"
import ImageModal from '../components/ImageModal'
import PhotoToVideo from '../components/PhotoToVideo'

export default function Screenshots() {
  const params = useParams()
  const [userInfo, setUserInfo] = useState({})
  const [userSS, setUserSS] = useState([])
  const [loading, setLoading] = useState(true)
  const [openImg, setOpenImg] = useState()
  const [showImage, setShowImage] = useState(false)
  const [search, setSearch] = useState({
    startingDate: "",
    endingDate: "",
    startingTime: "",
    endingTime: ""
  })

  // 🔹 Fetch user data and screenshots
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", params.id))
        const querySnapshot = await getDocs(q)
        setUserInfo(querySnapshot?.docs[0]?.data() || {})
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    const fetchScreenshots = async () => {
      try {
        const q = await getDocs(query(collection(db, "screenshots"), where("user_id", "==", params.id)))
        const allScreenshots = q.docs.map(doc => doc.data())
        setUserSS(allScreenshots)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching screenshots:", error)
      }
    }

    fetchUserData()
    fetchScreenshots()
  }, [params.id])

  // 🔹 Last active time
  const validDate = userInfo?.lastActiveAt ? new Date(userInfo?.lastActiveAt) : null
  const result = validDate
    ? formatDistanceToNowStrict(validDate, { addSuffix: true })
    : "unknown time"

  // 🔹 Handle image modal
  const imageClicked = (imgUrl) => {
    setOpenImg(imgUrl)
    setShowImage(true)
  }

  // 🔹 Handle input changes
  const handleInputs = (e) => {
    setSearch(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // 🔹 Filter screenshots by date and time
  const filteredScreenshots = userSS.filter((ss) => {
    if (
      !search.startingDate ||
      !search.endingDate ||
      !search.startingTime ||
      !search.endingTime
    ) {
      return true // no filters applied, show all
    }

    const screenshotTime = new Date(ss.timestamp)
    const start = new Date(`${search.startingDate}T${search.startingTime}`)
    const end = new Date(`${search.endingDate}T${search.endingTime}`)

    return screenshotTime >= start && screenshotTime <= end
  })

  // 🔹 Group filtered screenshots by date/hour
  const ssTimeStamp = [
    ...new Map(
      filteredScreenshots.map((ss) => {
        const date = new Date(ss.timestamp)
        const formatDate = format(date, "dd,MM,yyyy")
        const formatHrs = format(date, "HH")
        return [`${formatDate}-${formatHrs}`, { date: formatDate, hrs: formatHrs }]
      })
    ).values()
  ]

  return (
    <>
      <div className='flex flex-col bg-gray-900 min-h-screen text-white p-6'>
        <LoadingOverlay loading={loading} />

        {/* 🔹 Header */}
        <header className="flex justify-between">
          <span className='text-2xl font-bold'>{userInfo.name}</span>
          <span>
            <span className='font-bold mx-1'>Last Active:</span>
            <span>{result}</span>
          </span>
        </header>

        {/* 🔹 Main Content */}
        <main className='flex-1 flex gap-3'>
          <div className="w-full flex-1 pr-3 border-r-2 border-gray-600">
            <h1 className="text-2xl font-bold">Gallery</h1>

            {/* 🔹 Filters */}
            <div className='flex justify-between flex-wrap gap-3 mt-3'>
              <label>
                Starting Date:
                <input
                  name="startingDate"
                  value={search.startingDate}
                  onChange={handleInputs}
                  type="date"
                  className='border border-white text-white bg-transparent rounded-md p-1 ml-2'
                />
              </label>
              <label>
                Ending Date:
                <input
                  name="endingDate"
                  value={search.endingDate}
                  onChange={handleInputs}
                  type="date"
                  className='border border-white text-white bg-transparent rounded-md p-1 ml-2'
                />
              </label>
              <label>
                Starting Time:
                <input
                  name="startingTime"
                  value={search.startingTime}
                  onChange={handleInputs}
                  type="time"
                  className='border border-white text-white bg-transparent rounded-md p-1 ml-2'
                />
              </label>
              <label>
                Ending Time:
                <input
                  name="endingTime"
                  value={search.endingTime}
                  onChange={handleInputs}
                  type="time"
                  className='border border-white text-white bg-transparent rounded-md p-1 ml-2'
                />
              </label>
              <button
                onClick={() => setSearch({
                  startingDate: "",
                  endingDate: "",
                  startingTime: "",
                  endingTime: ""
                })}
                className="border px-3 py-1 rounded-lg hover:bg-gray-700"
              >
                Clear Filters
              </button>
            </div>

            {/* 🔹 Screenshot Display */}
            <div className="mt-5">
              {ssTimeStamp.length === 0 ? (
                <p className="text-gray-400 text-center mt-10">
                  No screenshots found for selected range.
                </p>
              ) : (
                ssTimeStamp.map((num, i) => (
                  <div key={i} className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-200">
                      Date: {num.date}
                    </h2>
                    <h2 className="text-lg font-semibold text-gray-200 mb-3">
                      Hours: {num.hrs}:00 - {Number(num.hrs) + 1}:00
                    </h2>

                    {/* 🔹 Image Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {filteredScreenshots.map((ss, j) => {
                        const hours = Number(format(new Date(ss.timestamp), "HH"))
                        const blockStart = Number(num.hrs)
                        const blockEnd = blockStart + 1

                        if (hours >= blockStart && hours < blockEnd) {
                          return (
                            <div
                              onClick={() => imageClicked(ss.url)}
                              key={j}
                              className="cursor-pointer bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all duration-200"
                            >
                              <img
                                src={ss.url}
                                alt=""
                                className="w-full h-auto object-cover p-1 rounded-lg"
                              />
                              <div className="my-2 text-sm text-gray-300 flex flex-col items-start px-3">
                                <span>{format(new Date(ss.timestamp), "d MMM, yyyy")}</span>
                                <span>{format(new Date(ss.timestamp), "h:mm a")}</span>
                              </div>
                            </div>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 🔹 Side Section */}
          <aside>
            <PhotoToVideo images={filteredScreenshots} />
          </aside>
        </main>
      </div>

      {/* 🔹 Image Modal */}
      {showImage && (
        <ImageModal currImg={openImg} setShowImage={setShowImage} />
      )}
    </>
  )
}
