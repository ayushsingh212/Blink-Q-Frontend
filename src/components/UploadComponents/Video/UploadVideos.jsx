import React, { useState } from "react";
import InputVideo from "./InputVideo";
import VideoSent from "./VideoSent";

export default function UploadVideos() {

    const [videoFile, setVideoFile] = useState(null);
    console.log("Current videoFile:", videoFile);

    return (
        <div >
            { !videoFile ? (
                <div>
                    <InputVideo onFileSelect={setVideoFile}/>
                </div>
            ) : (
                <div>
                    <VideoSent videoFile={videoFile} />
                </div>
            )}
        </div>
    )
}