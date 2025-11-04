import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../Config";
import toast from "react-hot-toast";

function SubscribedButton({ username, id }) {
    const [isSubscribed, setIsSubscribed] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const checkSubscribe = async () => {

        setIsChecking(true);

        try {
            const res = await axios.get(
                `${API_BASE_URL}/user/channelProfile/${username}`,
                { withCredentials: true }
            );
            setIsSubscribed(res.data?.data.isSubscribed);
        } catch (error) {
            console.log("checkSubscribe failed", error);
        } finally{
            setIsChecking(false);
        }
    };

    const toggleSubscribe = async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        try {
            const res = await axios.post(
                `${API_BASE_URL}/subscription/toggleSubscribe/${id}`,
                {},
                { withCredentials: true }
            );
            
            setIsSubscribed(res.data.data.isSubscribed);
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
            toast.error("Couldn't update subscription");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkSubscribe();
    }, [username]);

     if (isChecking || isSubscribed === undefined) {
        return (
            <button className="border-2 p-1 px-2 rounded-xl bg-gray-800 border-gray-600 text-white opacity-50 cursor-not-allowed">
                Checking...
            </button>
        );
    }

    return (
        <button 
            className={`border-2 p-1 px-2 rounded-xl hover:opacity-80 disabled:opacity-50 ${
                isSubscribed 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-red-600 border-red-600 text-white"
            }`}
            onClick={toggleSubscribe}
            disabled={isLoading}
        >
            {isLoading ? "Loading..." : (isSubscribed ? "Subscribed" : "Subscribe")}
        </button>
    );
}

export default SubscribedButton;