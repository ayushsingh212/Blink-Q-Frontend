import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowLogin,
  setError,
  signupUser,
  clearError,
} from "../../Redux/Slices/AuthSlice";

const Signupform = () => {
  const dispatch = useDispatch();
  const modalRef = useRef();

  const [formdata, setFormdata] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const { loading, error } = useSelector((state) => state.auth);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

  // 🧩 Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Close modal
  const handleClose = () => {
    dispatch(clearError());
    dispatch(setShowLogin({ login: false, signup: false }));
  };

  // Click outside to close
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🧩 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
      ""
    );
    setFormdata((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  // 🧩 File handling
  const handleFile = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        e.target.value = "";
        return;
      }

      setFormdata((prev) => ({ ...prev, [name]: file }));
      const preview = URL.createObjectURL(file);
      if (name === "avatar") setAvatarPreview(preview);
      if (name === "coverImage") setCoverImagePreview(preview);
    }
  };

  // Switch to Login
  const clickLogin = () => {
    dispatch(clearError());
    dispatch(setShowLogin({ login: true, signup: false }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (
      formdata.email === "@gmail.com" ||
      !formdata.email.endsWith("@gmail.com")
    ) {
      dispatch(
        setError(
          "Invalid email: must end with @gmail.com but shouldn't be @gmail.com"
        )
      );
      return;
    }

    if (formdata.password.length < 8) {
      dispatch(setError("Password must be at least 8 characters"));
      return;
    }

    const inputData = new FormData();
    Object.entries(formdata).forEach(([k, v]) => inputData.append(k, v));
    dispatch(signupUser(inputData));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4 py-8">
      <form
        ref={modalRef}
        onSubmit={handleSubmit}
        className="relative bg-gray-900 text-gray-100 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-3 sm:gap-4 animate-fadeIn 
                   overflow-y-auto max-h-[90vh] scrollbar-hide"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Error + Title */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <h2 className="text-xl sm:text-2xl font-semibold text-center">
          Sign-Up
        </h2>

        {/* Inputs */}
        <input
          name="fullName"
          maxLength={25}
          onChange={handleChange}
          placeholder="Full Name"
          className="text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formdata.fullName}
        />
        <input
          name="username"
          maxLength={25}
          onChange={(e) => {
            if (/\s/.test(e.target.value)) return;
            handleChange(e);
          }}
          placeholder="Username"
          value={formdata.username}
          className="text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="email"
          maxLength={100}
          onChange={(e) => {
            if (/\s/.test(e.target.value)) return;
            handleChange(e);
          }}
          value={formdata.email}
          placeholder="E-mail"
          className="text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="password"
          type="password"
          minLength={8}
          maxLength={20}
          onChange={(e) => {
            if (/\s/.test(e.target.value)) return;
            handleChange(e);
          }}
          placeholder="Password (8+ characters)"
          value={formdata.password}
          className="text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* File Inputs */}
        <div className="flex flex-col gap-2">
          <label>Avatar</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFile}
            className="text-sm text-gray-400
                       file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-100 file:text-blue-700
                       hover:file:bg-blue-200"
          />
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="avatar"
              className="h-16 w-16 rounded-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label>Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            name="coverImage"
            className="text-sm text-gray-400
                       file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-100 file:text-blue-700
                       hover:file:bg-blue-200"
          />
          {coverImagePreview && (
            <img
              src={coverImagePreview}
              alt="Cover Image"
              className="h-16 w-16 rounded-full object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Sign-up"}
        </button>

        <p
          onClick={clickLogin}
          className="text-sm text-blue-500 cursor-pointer text-center mt-2 hover:underline"
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
};

export default Signupform;
