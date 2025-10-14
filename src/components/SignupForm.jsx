import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowLogin, signupUser, setError } from "../Redux/Slices/AuthSlice";


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

    const handleChange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value,
        });
    }

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            dispatch(setShowLogin({ login: false, signup: false }))
        }
    };

    const handleFile = (e) => {
        const { name, files } = e.target;
        if (files?.[0]) {
            setFormdata({ ...formdata, [name]: files[0] });
            const preview = URL.createObjectURL(files[0]);
            if (name === "avatar") setAvatarPreview(preview);
            if (name === "coverImage") setCoverImagePreview(preview)
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formdata.email.endsWith("@gmail.com")) {
            dispatch(setError("Invalid email: must end with @gmail.com"));
            return;
        }
        if (formdata.password.length < 6) {
            return;
        }
        const inputData = new FormData();
        Object.entries(formdata).forEach(([k, v]) => inputData.append(k, v));
        dispatch(signupUser(inputData));
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
            className=" bg-gray-900 p-6 rounded-xl shadow-lg w-96 flex flex-col gap-4"
        >
            {error && <p className="text-red-500">{error}</p>}
            <h2 className="text-2xl font-semibold text-center">Sign-Up</h2>

            <input
                name="fullName"
                onChange={(e) => {
                    const value = e.target.value;

                    const hasEmoji = /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu.test(value);

                    if (!hasEmoji) {
                        handleChange(e);
                    }
                }}
                placeholder="Name"
                className="border p-2 rounded"
                value={formdata.fullName}
            />
            <input
                name="username"
                onChange={(e) => {
                    const value = e.target.value;

                    const hasEmoji = /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu.test(value);

                    const noSpace = /\s/.test(value);

                    if (!hasEmoji && !noSpace) {
                        handleChange(e);
                    }
                }}
                title="There should be no spaces in Username"
                placeholder="Username"
                value={formdata.username}
                className="border p-2 rounded"
            />
            <input
                name="email"
                onChange={(e) => {
                    const value = e.target.value;

                    const hasEmoji = /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu.test(value);

                    const noSpace = /\s/.test(value);

                    if (!hasEmoji && !noSpace) {
                        handleChange(e);
                    }
                }}
                value={formdata.email}
                placeholder="E-mail"
                className="border p-2 rounded"
            />
            <input
                name="password"
                type="password"
                onChange={(e) => {
                    const value = e.target.value;

                    const hasEmoji = /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu.test(value);

                    const noSpace = /\s/.test(value);

                    if (!hasEmoji && !noSpace) {
                        handleChange(e);
                    }
                }}
                placeholder="Password"
                title="Must be greater than 6 values"
                value={formdata.password}
                className="border p-2 rounded"
            />
            <div className="flex flex-col gap-2">
                <label>Avatar</label>
                <input type="file" name="avatar" onChange={handleFile} />
                {avatarPreview && (
                    <img
                        src={avatarPreview}
                        alt={avatar}
                        className="h-16 w-16 rounded-full object-cover"
                    />
                )}
            </div>
            <div className="flex flex-col gap-2">
                <label>Cover Image</label>
                <input type="file" onChange={handleFile} name="coverImage" />
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
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
                {loading ? "Creating Account" : "Sign-up"}
            </button>
            <p
                onClick={() => dispatch(setShowLogin({ login: true, signup: false }))}
                className="text-sm text-blue-500 cursor-pointer text-center mt-2">
                Already have an account? Login
            </p>
        </form>
    )
}

export default Signupform;