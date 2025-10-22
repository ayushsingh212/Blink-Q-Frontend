import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../Config";
import { useDispatch, useSelector } from "react-redux";
import { clearError, setShowLogin, setLoading, setError } from "../../../../Redux/Slices/AuthSlice"

export default function ChangePassword() {
    const { loading, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const modalRef = useRef();

    const [formdata, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    })

    const handleChangePassword = async () => {
        dispatch(clearError());
        dispatch(setLoading(true));
        try {
            const res = await axios.put(`${API_BASE_URL}/user/changePassword`, formdata,
                { withCredentials: true }
            );
            console.log(res.data.message);
            return res.message;
        } catch (error) {
            console.log(error);
            dispatch(setError("Couldn't Update"));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleChangePassword();
    }

    const handleChange = (e) => {
        setFormData({
            ...formdata,
            [e.target.name]: e.target.value,
        })
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                dispatch(clearError());
                dispatch(setShowLogin({ password: false }));
            }
        }

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
            <h2 className="text-2xl font-semibold text-center">Change Password</h2>

            <input
                name="oldPassword"
                placeholder="Enter Old Password"
                value={formdata.oldPassword}
                onChange={handleChange}
                className="text-black border p-2 rounded"
            />
            <input
                name="newPassword"
                placeholder="Enter New Password"
                value={formdata.newPassword}
                onChange={handleChange}
                className="text-black border p-2 rounded"
            />
            <input
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                value={formdata.confirmNewPassword}
                onChange={handleChange}
                className="text-black border p-2 rounded"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50">
                {loading ? "Processing" : "Change Password"}
            </button>
        </form>
    )
}