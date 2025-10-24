import React from "react";
import { useSelector } from "react-redux";

const UserDetails = ({onSelectCategory}) => {
    const user = useSelector((state) => state.auth.user)

    if (!user) {
        return <div>Loading user details...</div>;
    }

    return (
        <div
            className="m-10 ml-5  pb-9 border-b-2 border-white">
            <h2 className="text-5xl font-bold mb-5">{user.fullName}</h2>
            <h4 className="text-2xl font-semibold">{user.username}
                <span
                    onClick={() => onSelectCategory("UserChannel")} 
                    className="ml-2 text-blue-400 underline hover:text-blue-600 cursor-pointer"
                >
                    View Channel
                </span>
            </h4>
            <h4>{user.email}</h4>
        </div>
    )
}

export default UserDetails;