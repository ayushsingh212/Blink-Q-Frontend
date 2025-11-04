import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../../Config";
import {
  setUser,
  fetchUser,
  logout,
  setShowLogin,
} from "../../../Redux/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar || "/default-avatar.jpg"
  );
  const [coverImagePreview, setCoverImagePreview] = useState(
    user?.coverImage || "/default-cover.jpg"
  );

  const [editable, setEditable] = useState(false);
  const [formdata, setFormdata] = useState({
    username: user?.username || "",
    fullname: user?.fullName || "",
    email: user?.email || "",
  });

  const updateInfo = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/user/updateDetails`,
        {
          newName: formdata.fullname,
          newEmail: formdata.email,
        },
        { withCredentials: true }
      );
      dispatch(setUser(res.data.data));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateCover = async () => {
    if (!coverFile) return;
    const formData = new FormData();
    formData.append("coverImage", coverFile);
    try {
      await axios.put(`${API_BASE_URL}/user/coverImage`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(fetchUser());
    } catch (error) {
      console.log(error);
    }
  };

  const updateAvatar = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    try {
      await axios.put(`${API_BASE_URL}/user/updateAvatar`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(fetchUser());
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleEdit = () => setEditable((p) => !p);

  const handleCancel = () => {
    setFormdata({
      username: user?.username || "",
      fullname: user?.fullName || "",
      email: user?.email || "",
    });
    setAvatarFile(null);
    setCoverFile(null);
    setAvatarPreview(user?.avatar || "/default-avatar.jpg");
    setCoverImagePreview(user?.coverImage || "/default-cover.jpg");
    setEditable(false);
  };

  const showPassword = async (e) => {
    dispatch(setShowLogin({ password: true }));
  };

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
  };

  useEffect(() => {
    if (user) {
      setFormdata({
        username: user.username,
        fullname: user.fullName,
        email: user.email,
      });
      setAvatarPreview(user.avatar || "/default-avatar.jpg");
      setCoverImagePreview(user.coverImage || "/default-cover.jpg");
    }

    return () => {
      try {
        URL.revokeObjectURL(avatarPreview);
      } catch {}
      try {
        URL.revokeObjectURL(coverImagePreview);
      } catch {}
    };
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            PROFILE{" "}
            <span className="text-yellow-300 text-base sm:text-lg">
              ({formdata.username})
            </span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          {!editable && (
            <>
              <button
                onClick={showPassword}
                className="w-full sm:w-auto px-4 py-2 bg-slate-600 rounded-md text-sm sm:text-base hover:bg-slate-700 transition"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 rounded-md text-sm sm:text-base hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          )}

          {!editable && (
            <button
              onClick={handleEdit}
              className="w-full sm:w-auto px-4 py-2 bg-orange-600 rounded-md text-sm sm:text-base hover:bg-orange-700 transition"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-6 pb-10"
      >
        <div>
          <label htmlFor="fullname" className="block text-sm sm:text-base mb-2">
            Full name
          </label>
          <input
            id="fullname"
            name="fullname"
            disabled={!editable}
            onChange={handleChange}
            value={formdata.fullname}
            className={`w-full p-2 rounded-md bg-transparent border-2 ${
              editable ? "border-yellow-400" : "border-white/40"
            } text-white placeholder:text-white/60 focus:outline-none`}
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm sm:text-base mb-2">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            disabled={!editable}
            onChange={handleChange}
            value={formdata.email}
            className={`w-full p-2 rounded-md bg-transparent border-2 ${
              editable ? "border-yellow-400" : "border-white/40"
            } text-white placeholder:text-white/60 focus:outline-none`}
            placeholder="you@example.com"
            type="email"
          />
        </div>

        {coverImagePreview && (
          <div className="col-span-1 md:col-span-2 relative mt-2">
            {/* cover */}
            <div className="w-full overflow-hidden rounded-2xl border-4 border-yellow-500">
              <img
                src={coverImagePreview}
                alt="cover"
                className="w-full object-cover h-40 sm:h-56 md:h-64"
              />
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:-translate-y-1/3">
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full ring-4 ring-yellow-500 overflow-hidden bg-black">
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {editable && (
          <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-4 mt-10">
            <label className="flex-1">
              <div className="text-sm mb-1">Change Avatar</div>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleFile}
                className="w-full text-sm"
              />
            </label>

            <label className="flex-1">
              <div className="text-sm mb-1">Change Cover Image</div>
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={handleFile}
                className="w-full text-sm"
              />
            </label>
          </div>
        )}

        {editable && (
          <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-green-500 rounded-md text-black hover:bg-green-600 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-4 py-2 bg-gray-800 border border-white/20 rounded-md hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
