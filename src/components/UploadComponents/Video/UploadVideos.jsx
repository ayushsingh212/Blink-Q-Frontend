import React, { useState } from "react";
import InputVideo from "./InputVideo";
import VideoSent from "./VideoSent";

export default function UploadVideos() {
    const [videoFile, setVideoFile] = useState(null);
    const [uploadStage, setUploadStage] = useState("select"); 

    console.log("Current videoFile:", videoFile);

    const handleFileSelect = (file) => {
        setVideoFile(file);
        setUploadStage("uploading");
    };

    const handleUploadSuccess = () => {
        setUploadStage("success");
    };

    const handleReset = () => {
        setVideoFile(null);
        setUploadStage("select");
    };

    const handleNewUpload = () => {
        setVideoFile(null);
        setUploadStage("select");
    };

    return (
        <div className="upload-videos-container">
            {!videoFile ? (
                <div>
                    <InputVideo onFileSelect={handleFileSelect} />
                </div>
            ) : (
                <div>
                    <VideoSent 
                        videoFile={videoFile} 
                        onUploadSuccess={handleUploadSuccess}
                        onReset={handleReset}
                    />
                    
                    {uploadStage === "success" && (
                        <button 
                            onClick={handleNewUpload}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Upload Another Video
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}