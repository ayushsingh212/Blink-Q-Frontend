import React,{useEffect, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowLogin } from "../Redux/Slices/AuthSlice";
import Signupform from "../components/SignupForm";
import Loginform from "../components/LoginForm";

const FloatingModal = ()=>{
    const dispatch = useDispatch()
    const {showLogin} = useSelector((state)=> state.auth);

    if(!showLogin.login && !showLogin.signup ) return null;

    return(
        <div 
        className="bg-black bg-opacity-50 fixed inset-0 flex justify-center items-center z-50">
                {showLogin.login && <Loginform />}
                {showLogin.signup && <Signupform />}
        </div>
    )
}

export default FloatingModal;