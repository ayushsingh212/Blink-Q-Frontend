import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowLogin,
  setError,
  loginUser,
  clearError,
} from "../../Redux/Slices/AuthSlice";

const Loginform = () => {
  const dispatch = useDispatch();
  const modalRef = useRef();

  const [formdata, setFormdata] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  // --- New function to handle closing ---
  const handleClose = () => {
    dispatch(clearError());
    dispatch(setShowLogin({ login: false, signup: false }));
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose(); // Use the new close function
    }
  };

  const clickSignup = () => {
    dispatch(clearError());
    dispatch(setShowLogin({ login: false, signup: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formdata.email.endsWith("@gmail.com")) {
      dispatch(setError("Invalid email: must end with @gmail.com"));
      return;
    }
    dispatch(loginUser(formdata));
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <form
        ref={modalRef}
        onSubmit={handleSubmit}
        className="relative bg-gray-900 text-gray-100 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-3 sm:gap-4 animate-fadeIn"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors"
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

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <h2 className="text-xl sm:text-2xl font-semibold text-center">Login</h2>

        <input
          name="username"
          placeholder="Enter Username"
          value={formdata.username}
          onChange={handleChange}
          className="text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="email"
          placeholder="Enter email"
          value={formdata.email}
          onChange={handleChange}
          className="text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formdata.password}
          onChange={handleChange}
          className="text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          onClick={clickSignup}
          className="text-sm text-blue-500 cursor-pointer text-center mt-2 hover:underline"
        >
          Don’t have an account? Signup
        </p>
      </form>
    </div>
  );
};

export default Loginform;
