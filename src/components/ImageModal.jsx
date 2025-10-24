import React from 'react'

export default function ImageModal({currImg, setShowImage}) {
  return (
     <div className='fixed  inset-0 z-1000 h-screen  flex items-center justify-center w-screen bg-black/80 '
      onClick={()=>setShowImage(false)}
      >
    <div onClick={(e)=>e.stopPropagation()} className='flex justify-center items-center z-10'>
      <div className="w-[60vw] h-auto">
        <img src={currImg} alt="" />
      </div>
    </div>
    </div>
  )
}
