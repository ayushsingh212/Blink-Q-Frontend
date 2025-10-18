import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowLogin, loginUser, setError, clearError } from "../Redux/Slices/AuthSlice";

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
    }

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            dispatch(clearError());
            dispatch(setShowLogin({ login: false, signup: false }))
        }
    };

    const clickSignup = () => {
        dispatch(clearError());
        dispatch(setShowLogin({ login: false, signup: true }))
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formdata.email.endsWith("@gmail.com")) {
            dispatch(setError("Invalid email: must end with @gmail.com"));
            return;
        }
        dispatch(loginUser(formdata));
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        };
    }, []);

    return (
        <form
            ref={modalRef}
            onSubmit={handleSubmit}
            className="bg-gray-900 text-gray-100 p-6 rounded-xl shadow-lg w-96 flex flex-col gap-4"
        >
            {error && <p className="text-red-500">{error}</p>}
            <h2 className="text-2xl font-semibold text-center">Login</h2>

            <input
                name="username"
                placeholder="Enter Username"
                value={formdata.username}
                onChange={handleChange}
                className="text-black border p-2 rounded"
            />
            <input
                name="email"
                placeholder="Enter email"
                value={formdata.email}
                onChange={handleChange}
                className="text-black border p-2 rounded"
            />
            <input
                name="password"
                placeholder="Password"
                value={formdata.password}
                onChange={handleChange}
                className="text-black border p-2 rounded"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                {loading ? "Loggin-in" : "Login"}
            </button>
            <p
                onClick={clickSignup}
                className="text-sm text-blue-500 cursor-pointer text-center mt-2">
                Don't have an account?? Signup
            </p>
        </form>
    )
}

export default Loginform;

