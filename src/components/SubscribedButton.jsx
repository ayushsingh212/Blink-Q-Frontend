import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../Config";
import toast from "react-hot-toast";

function SubscribedButton({ username, id }) {

    const [isSubcribed, setIsSubscribed] = useState(false);

    const checkSubscribe = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/user/channelProfile/${username}`,
                { withCredentials: true }
            );
            console.log(res);
            setIsSubscribed(res.data?.data.isSubcribed);
        } catch (error) {
            console.log("checkSubscribe failed");
        }
    }

    const subscribe = async() => {
        try {
            const res = await axios.post(`http://localhost:8080/api/subscription/${id}/subscribe`,
                {withCredentials:true}
            );
            setIsSubscribed(true);
            console.log(res);
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
            toast.error("Couldn't Subscribe");
        }
    }

    useEffect(() => {
        checkSubscribe();
    })
    return (
        <div>
            {isSubcribed ? (
                <select>
                    <option>Subscribed</option>
                    <option>Unsubscribe</option>
                </select>
            ) : (
                <button 
                className="bg-black border-white border-2 p-1 px-2 rounded-xl"
                onClick={subscribe}
                >Subscribe</button>
    )
}
        </div >
    );
}

export default SubscribedButton;