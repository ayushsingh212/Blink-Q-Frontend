import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../Config";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  setShowLogin,
  setLoading,
  setError,
} from "../../../../Redux/Slices/AuthSlice";

export default function ChangePassword() {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const modalRef = useRef();

  const [formdata, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChangePassword = async () => {
    dispatch(clearError());
    dispatch(setLoading(true));
    try {
      const res = await axios.put(
        `${API_BASE_URL}/user/changePassword`,
        formdata,
        {
          withCredentials: true,
        }
      );
      console.log(res.data.message);
      return res.data.message;
    } catch (error) {
      console.log(error);
      dispatch(setError("Couldn't update password"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleChangePassword();
  };

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        dispatch(clearError());
        dispatch(setShowLogin({ password: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4 sm:px-0">
      <form
        ref={modalRef}
        onSubmit={handleSubmit}
        className="bg-gray-900 text-gray-100 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md flex flex-col gap-4"
      >
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <h2 className="text-xl sm:text-2xl font-semibold text-center">
          Change Password
        </h2>

        <input
          name="oldPassword"
          placeholder="Enter Old Password"
          type="password"
          value={formdata.oldPassword}
          onChange={handleChange}
          className="text-black border border-gray-300 p-2 sm:p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          name="newPassword"
          placeholder="Enter New Password"
          type="password"
          value={formdata.newPassword}
          onChange={handleChange}
          className="text-black border border-gray-300 p-2 sm:p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          name="confirmNewPassword"
          placeholder="Confirm New Password"
          type="password"
          value={formdata.confirmNewPassword}
          onChange={handleChange}
          className="text-black border border-gray-300 p-2 sm:p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-500 text-black font-semibold py-2 sm:py-3 rounded hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
    