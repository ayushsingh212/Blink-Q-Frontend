import React from "react";
import { setShowUpload } from "../../../Redux/Slices/AuthSlice";
import { useDispatch } from "react-redux";

export default function InputVideo({ onFileSelect }) {
    const dispatch = useDispatch();

    const cancelUpload = () => {
        dispatch(setShowUpload({ videos: false }));
    }

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("Selected video file:", file);
        if (!file.type.startsWith("video/")) {
            alert("Please upload a valid video file!");
            e.target.value = ""; 
            return;
        }

        onFileSelect(file);
    };

    return (
        <div className="bg-[#132440] border-2 border-white rounded-lg text-center p-6">
            <button 
                type="button" 
                onClick={cancelUpload} 
                className="text-white text-3xl font-bold float-right hover:text-gray-300"
            >
                <i className="ri-close-line"></i>
            </button>
            
            <div className="clear-both mt-2">
                <h2 className="text-2xl text-white font-semibold mb-6">Upload A Video</h2>
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFile}
                    className="block w-full text-sm text-gray-600 border border-gray-500 cursor-pointer rounded-lg bg-white p-2"
                />
            </div>
        </div>
    );
}