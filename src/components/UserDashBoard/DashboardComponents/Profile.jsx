import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../../Config";
import { setUser, fetchUser, logout, setShowLogin } from "../../../Redux/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);

    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "/default-avatar.jpg");
    const [coverImagePreview, setCoverImagePreview] = useState(user?.coverImage || "/default-cover.jpg");


    const [editable, setEditable] = useState(false);
    const [formdata, setFormdata] = useState({
        username: user?.username || "",
        fullname: user?.fullName || "",
        email: user?.email || "",
    })

    const updateInfo = async () => {
        try {
            const res = await axios.put(`${API_BASE_URL}/user/updateDetails`,
                {
                    newName: formdata.fullname,
                    newEmail: formdata.email,
                },
                { withCredentials: true }
            );
            console.log(res.data);
            dispatch(setUser(res.data.data))
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    const updateCover = async () => {
        if (!coverFile) return;

        const formData = new FormData();
        formData.append("coverImage", coverFile)
        try {
            const res = await axios.put(`${API_BASE_URL}/user/coverImage`,
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                });
            dispatch(fetchUser());
        } catch (error) {
            console.log(error);
        }
    }

    const updateAvatar = async () => {
        if (!avatarFile) return;

        const formData = new FormData();
        formData.append("avatar", avatarFile);

        try {
            const res = await axios.put(`${API_BASE_URL}/user/updateAvatar`, formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                });
            dispatch(fetchUser());
        } catch (error) {
            console.log(error);
        }
    }

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout());
        navigate("/");
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormdata((prev) => (
            {
                ...prev,
                [name]: value
            }
        ));
    };

    const handleFile = (e) => {
        const { name, files } = e.target;
        if (files?.[0]) {
            const preview = URL.createObjectURL(files[0]);
            if (name === "avatar") {
                setAvatarFile(files[0]);
                setAvatarPreview(preview);
            } else if (name === "coverImage") {
                setCoverFile(files[0]);
                setCoverImagePreview(preview);
            }
        }
    };

    const handleEdit = () => {
        setEditable((prev) => !prev);
    }

    const handleCancel = () => {
        setFormdata({
            username: user?.username || "",
            fullname: user?.fullName || "",
            email: user?.email || "",
        })

        setAvatarFile(null);
        setCoverFile(null);
        setAvatarPreview(user?.avatar);
        setCoverImagePreview(user?.coverImage);
        setEditable(false);
    }

    const showPassword = async(e) => {
        dispatch(setShowLogin({password:true}));
    }

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (formdata.fullname !== user.fullName || formdata.email !== user.email)
                await updateInfo();

            if (avatarFile) await updateAvatar();
            if (coverFile) await updateCover();

            setEditable(false);
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        if (user) {
            setFormdata({
                username: user.username,
                fullname: user.fullName,
                email: user.email,
            });
        }

        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
            if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
        };
    }, [user, avatarPreview, coverImagePreview]);


    return (
        <>
            <h1 className="text-4xl ml-4 pb-8 font-bold border-b-2 border-white">PROFILE :
                <span className="ml-2 text-4xl">({formdata.username})</span>
                {!editable && (
                    <button
                        onClick={showPassword}
                        className="border-2 text-xl mt-8 ml-[21vw] bg-slate-600 rounded-lg w-[14vw] h-[2.5vw]">
                            Change Password
                    </button>
                )}
                {!editable && (
                    <button
                        onClick={handleLogout}
                        className="border-2 text-xl mt-8 ml-[2vw] bg-slate-600 rounded-lg w-[7vw] h-[2.5vw]">
                            Logout
                    </button>
                )}
            </h1>
            <form className=" mt-2 m-4 grid md:grid-cols-2 border-b-2 border-white pb-7"
                onSubmit={handleSave}>
                <div
                    className=" my-8 text-xl">
                    <label className="mr-2">Name:</label>
                    <input
                        name="fullname"
                        disabled={!editable}
                        onChange={handleChange}
                        className="bg-transparent p-1 w-[30vw] h-[2.5vw] border-2 border-white text-white"
                        value={formdata.fullname} />
                </div>
                <div className=" my-8 text-xl ">
                    <label className="mr-2">E-mail:</label>
                    <input
                        name="email"
                        disabled={!editable}
                        onChange={handleChange}
                        className="bg-transparent p-1 w-[30vw] h-[2.5vw] border-2 border-white  text-white"
                        value={formdata.email} />
                </div>
                {avatarPreview && coverImagePreview && (
                    <div className="relative w-full col-span-2 mb-12 mt-4">
                        <img
                            src={coverImagePreview}
                            alt="Cover"
                            className="w-full h-60 object-cover border-4 border-yellow-500 rounded-2xl"
                        />

                        <div
                            className="absolute bottom-[4px] left-[70%] transform rotate-45 translate-y-1/2 w-44 h-44 rounded-full border-4 border-b-yellow-500 border-r-yellow-500 border-l-transparent border-t-transparent ">
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover transform -rotate-45 "
                            />
                        </div>
                    </div>
                )}
                {editable && (
                    <div className="col-span-2">
                        <label className="text-xl">Avatar </label>
                        <input type="file" name="avatar" onChange={handleFile} />
                        <label className="ml-20 text-xl">Cover Image </label>
                        <input type="file" onChange={handleFile} name="coverImage" />
                    </div>
                )}
                {editable ? (
                    <div className=" mt-8">
                        <button
                            type="submit"
                            className="mr-10 border-2 text-black border-white w-[7vw]  h-[2.5vw] rounded-lg bg-green-500">
                            Save
                        </button>
                        <button
                            type="button"
                            className="mr-10 border-2 border-white w-[7vw]  h-[2.5vw] rounded-lg bg-black"
                            onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="border-2 mt-8 bg-orange-600 rounded-lg w-[7vw] h-[2.5vw] "
                        onClick={handleEdit}>
                        Edit
                    </button>
                )}
            </form >

        </>
    )
}