import React, { useRef, useState } from "react";

export default function PhotoToVideo({ images }) {
  const [videoURL, setVideoURL] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);

  const generateVideo = async () => {
    if (!images || images.length === 0) return alert("No screenshots found!");
    setIsGenerating(true);
    setVideoURL(null);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const stream = canvas.captureStream(30); // 30 FPS
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setVideoURL(URL.createObjectURL(blob));
      setIsGenerating(false);
    };

    recorder.start();

    // Loop through screenshots
    for (let i = 0; i < images.length; i++) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Prevent tainting if hosted on Firebase
      img.src = images[i].url; // assuming userSS has 'url' property
      await new Promise((res) => {
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setTimeout(res, 1000); // each image for 1 sec
        };
      });
    }

    recorder.stop();
  };

  return (
    <div className="p-3 text-center">
      <h2 className="text-lg font-bold mb-2 text-gray-100">🖼️ Generate Video</h2>
      <canvas
        ref={canvasRef}
        width={480}
        height={270}
        className="border border-gray-600 hidden rounded mb-3"
      ></canvas>

      <button
        onClick={generateVideo}
        disabled={isGenerating}
        className={`px-4 py-2 rounded text-white cursor-pointer ${
          isGenerating ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isGenerating ? "Generating..." : "Generate Video"}
      </button>

      {videoURL && (
        <div className="mt-4">
          <h3 className="font-semibold mb-1 text-gray-200">Preview:</h3>
          <video controls src={videoURL} width="300" height="270" className="border border-white rounded-lg" />
          <a
            href={videoURL}
            download="screenshots_video.webm"
            className="inline-block py-2 px-4 mt-3 rounded-md bg-blue-700 hover:bg-blue-800"
          >
            Download Video
          </a>
        </div>
      )}
    </div>
  );
}
