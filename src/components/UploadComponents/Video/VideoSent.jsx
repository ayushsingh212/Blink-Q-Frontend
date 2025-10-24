import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from '../../../Config.js'
import { useDispatch, useSelector } from "react-redux";
import { setShowUpload, setError, setLoading, clearError } from "../../../Redux/Slices/AuthSlice.js";
import { useNavigate } from "react-router-dom";

export default function VideoSent({ videoFile }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formdata, setFormdata] = useState({
        title: "",
        description: "",
        thumbnail: null,
        isPublish: false,
    })

    const { loading, error } = useSelector((state) => state.auth)

    const [thumbnail, setThumbnail] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const sanitizedValue = value.replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
            ""
        );
        setFormdata((prev) => ({ ...prev, [name]: sanitizedValue }));
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file for thumbnail.");
                e.target.value = ""
                return;
            }

            setThumbnail(file);
            setFormdata((prev) => ({ ...prev, [e.target.name]: file }))
        }
    }

    const cancelUpload = () => {
        dispatch(setShowUpload({ videos: false }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("clicked");
        dispatch(setLoading(true));
        toast.loading("Uploading video...", { id: "upload" });

        if (!videoFile && !formdata.thumbnail) {
            toast.error("Please provide both video and thumbnail", { id: "upload" });
            return;
        }

        const uploadForm = new FormData();
        uploadForm.append("title", formdata.title);
        uploadForm.append("description", formdata.description);
        uploadForm.append("video", videoFile);
        uploadForm.append("thumbnail", formdata.thumbnail);
        uploadForm.append("isPublished", formdata.isPublish);

        try {
            const res = await axios.post(`${API_BASE_URL}/user/uploadVideo`, uploadForm,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" }
                });
            console.log("Upload Successfull", res.data);
            toast.success("Video uploaded successfully!");
            dispatch(clearError());
            dispatch(setShowUpload({videos:false}));
            navigate('/');
        } catch (error) {
            dispatch(setError(error));
            console.log("error sending video", error.response?.data?.message || error.message);
            toast.error("Failed to upload video!");
        } finally {
            console.log("run complete");
            dispatch(setLoading(false));
        }
    }

    if (loading) return (
            <div className="flex flex-col items-center justify-center bg-[#132440] border-2 border-white rounded-lg text-center p-10 animate-pulse">
                <h2 className="text-xl text-white font-semibold mb-3">
                    Uploading your video...
                </h2>
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mt-3"></div>
            </div>
        );

    if (error) return (
        <div className=" bg-[#132440] border-2 border-white rounded-lg text-center">
            <button type="button" onClick={cancelUpload} className="text-white text-3xl font-bold ml-[20vw]">
                <i className="ri-close-line"></i>
            </button>
            <div className="m-5">
                {error}
            </div>
        </div>
    )

    return (
        <div className="flex flex-col gap-4 p-4 bg-[#132440] rounded-2xl border-4 border-white">
            <h2 className="text-4xl font-bold">Video Preview
                <span>
                    <button type="button" onClick={cancelUpload} className=" text-4xl font-bold ml-[44vw]">
                        <i className="ri-close-line"></i>
                    </button>
                </span>
            </h2>
            <div className="flex ">

                <form onSubmit={handleSubmit} className=" h-full">
                    <div className="mb-3">
                        <label className="text-lg">Title:</label>
                        <input
                            type="text"
                            name="title"
                            onChange={handleChange}
                            value={formdata.title}
                            placeholder="Enter the title"
                            maxLength={50}
                            required
                            className="rounded-lg w-[24vw] text-black p-1 border-[3px] border-black"
                        />
                    </div>
                    <div className="flex flex-col mb-5">
                        <label className="text-lg">Description: </label>
                        <textarea
                            name="description"
                            type="text"
                            placeholder="Enter the description of the video"
                            onChange={handleChange}
                            maxLength={200}
                            value={formdata.description}
                            required
                            className=" rounded-lg text-black p-1 h-[8vw] w-[26.4vw] "
                        />
                    </div>
                    <div className="flex flex-col mb-5">
                        <label className="text-lg">Thumb-Nail:</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            name="thumbnail"
                            accept="image/*"
                        />
                        {thumbnail && (
                            <img src={URL.createObjectURL(thumbnail)} alt="thumbnail" className="w-[20vw] h-[10vw] mt-2" />
                        )}
                    </div>
                    <div className="flex flex-col mb-5">
                        <label>
                            <input
                                type="checkbox"
                                checked={formdata.isPublish}
                                onChange={() =>
                                    setFormdata((prev) => ({ ...prev, isPublish: !prev.isPublish }))
                                }
                            />
                            Publish
                        </label>
                        <button type="submit" className="bg-green-600 w-[26.4vw] text-white py-2 rounded">
                            Upload Video
                        </button>
                    </div>
                </form>

                <div className="ml-20 w-[25vw]">
                    <video
                        src={URL.createObjectURL(videoFile)}
                        controls
                        className="h-[15vw] w-[25vw] mb-5"
                    />
                    <h4 className=" text-lg mb-3 font-semibold">File Name: {videoFile.name}</h4>
                    <h4 className=" text-lg mb-3 font-semibold">File Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB</h4>
                </div>
            </div>
        </div>
    )

}