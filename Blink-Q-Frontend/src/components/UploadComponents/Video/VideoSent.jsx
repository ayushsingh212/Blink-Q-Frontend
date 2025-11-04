import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from '../../../Config.js'
import { useDispatch, useSelector } from "react-redux";
import { setShowUpload, setError, setLoading, clearError } from "../../../Redux/Slices/AuthSlice.js";
import { useNavigate } from "react-router-dom";

export default function VideoSent({ videoFile }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnail: null,
        isPublish: false,
    });

    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            const sanitizedValue = value.replace(
                /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
                ""
            );
            setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
        }
    }, []);

    const handleFileChange = useCallback((e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file for thumbnail.");
                e.target.value = "";
                return;
            }

            const previewUrl = URL.createObjectURL(file);
            setThumbnailPreview(previewUrl);
            setFormData(prev => ({ ...prev, thumbnail: file }));
        }
    }, []);

    const cancelUpload = useCallback(() => {
        if (thumbnailPreview) {
            URL.revokeObjectURL(thumbnailPreview);
        }
        dispatch(setShowUpload({ videos: false }));
    }, [dispatch, thumbnailPreview]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!videoFile) {
            toast.error("Please select a video file", { id: "upload" });
            return;
        }

        if (!formData.thumbnail) {
            toast.error("Please provide a thumbnail", { id: "upload" });
            return;
        }

        if (!formData.title.trim()) {
            toast.error("Please enter a title", { id: "upload" });
            return;
        }

        dispatch(setLoading(true));
        toast.loading("Uploading video...", { id: "upload" });

        const uploadForm = new FormData();
        uploadForm.append("title", formData.title.trim());
        uploadForm.append("description", formData.description.trim());
        uploadForm.append("video", videoFile);
        uploadForm.append("thumbnail", formData.thumbnail);
        uploadForm.append("isPublished", formData.isPublish);

        try {
            const res = await axios.post(`${API_BASE_URL}/user/uploadVideo`, uploadForm, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Video uploaded successfully!", { id: "upload" });
            dispatch(clearError());
            dispatch(setShowUpload({ videos: false }));
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to upload video";
            dispatch(setError(errorMessage));
            toast.error(errorMessage, { id: "upload" });
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        return () => {
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [thumbnailPreview]);

    if (loading) return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-[800px] h-[400px] bg-[#132440] border-2 border-white rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl text-white font-semibold mb-4">Uploading your video...</h2>
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-[800px] h-[400px] bg-[#132440] border-2 border-white rounded-lg p-6">
                <button
                    type="button"
                    onClick={cancelUpload}
                    className="text-white text-2xl float-right hover:text-gray-300"
                >
                    <i className="ri-close-line"></i>
                </button>
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-white text-lg mb-4">{error}</p>
                    <button
                        onClick={() => dispatch(clearError())}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-[900px] h-[600px] bg-[#132440] border-2 border-white rounded-xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-white h-16">
                    <h2 className="text-xl font-bold text-white">Upload Video</h2>
                    <button
                        type="button"
                        onClick={cancelUpload}
                        className="text-white text-2xl hover:text-gray-300"
                    >
                        <i className="ri-close-line"></i>
                    </button>
                </div>

                <div className="flex h-[544px]"> 
                    <div className="w-1/2 p-6 border-r border-white overflow-y-auto scrollbar-hide">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-white block mb-2 font-medium">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    onChange={handleChange}
                                    value={formData.title}
                                    placeholder="Enter video title"
                                    maxLength={50}
                                    required
                                    className="w-full p-3 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                                <div className="text-right text-sm text-gray-400 mt-1">
                                    {formData.title.length}/50
                                </div>
                            </div>

                            <div>
                                <label className="text-white block mb-2 font-medium">Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Enter video description"
                                    onChange={handleChange}
                                    maxLength={200}
                                    value={formData.description}
                                    required
                                    rows="4"
                                    className="w-full p-3 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:border-blue-500 resize-none"
                                />
                                <div className="text-right text-sm text-gray-400 mt-1">
                                    {formData.description.length}/200
                                </div>
                            </div>

                            <div>
                                <label className="text-white block mb-2 font-medium">Thumbnail</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    name="thumbnail"
                                    accept="image/*"
                                    className="w-full text-white text-sm p-2 border border-gray-300 rounded-lg cursor-pointer bg-transparent"
                                />
                                {thumbnailPreview && (
                                    <div className="mt-3">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="w-40 h-24 object-cover rounded-lg border-2 border-white"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isPublish"
                                    checked={formData.isPublish}
                                    onChange={handleChange}
                                    className="w-4 h-4 mr-2"
                                />
                                <label className="text-white cursor-pointer">Publish immediately</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 mt-4"
                                disabled={loading}
                            >
                                {loading ? "Uploading..." : "Upload Video"}
                            </button>
                        </form>
                    </div>

                    <div className="w-1/2 p-6 overflow-y-auto">
                        <div className="space-y-4">
                            <div className="bg-black rounded-lg overflow-hidden">
                                <video
                                    src={URL.createObjectURL(videoFile)}
                                    controls
                                    className="w-full h-48 object-contain"
                                />
                            </div>

                            <div className="text-white space-y-3 p-4 bg-gray-800 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">Video Details</h3>
                                <div>
                                    <span className="font-medium">File Name:</span>
                                    <p className="text-gray-300 text-sm break-words mt-1">{videoFile.name}</p>
                                </div>
                                <div>
                                    <span className="font-medium">File Size:</span>
                                    <p className="text-gray-300 text-sm mt-1">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                                <div>
                                    <span className="font-medium">File Type:</span>
                                    <p className="text-gray-300 text-sm mt-1">{videoFile.type || "Unknown"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}