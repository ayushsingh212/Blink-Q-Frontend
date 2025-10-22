import React,{useEffect, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import Signupform from "../components/Authentication/SignupForm";
import Loginform from "../components/Authentication/LoginForm";
import ChangePassword from "../components/UserDashBoard/DashboardComponents/AllComponents/ChangePassword";

const FloatingModal = ()=>{
    const dispatch = useDispatch()
    const {showLogin, showUpload} = useSelector((state)=> state.auth);

    if(!showLogin.login && !showLogin.signup && !showLogin.password && !showUpload.videos && !showUpload.post) return null;

    return(
        <div 
        className="bg-black bg-opacity-50 fixed inset-0 flex justify-center items-center z-50">
                {showLogin.login && <Loginform />}
                {showLogin.signup && <Signupform />}
                {showLogin.password && <ChangePassword/>}
                {/* {showUpload.videos && <UploadVideos /> } */}
                {/* {showUpload.post && <UploadPost />} */}
        </div>
    )
}

export default FloatingModal;