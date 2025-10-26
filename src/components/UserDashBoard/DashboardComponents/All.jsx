import react from "react";
import Image from "./AllComponents/Image";
import UserDetails from "./AllComponents/UserDetails";
import WatchHistoryAll from "./AllComponents/WatchHistoryAll";
import { useNavigate } from "react-router-dom";

export default function All({ onSelectCategory }) {

    const navigate = useNavigate();

    return (
        <>
            <Image />
            <UserDetails onSelectCategory={onSelectCategory} />
            <WatchHistoryAll />
            <button onClick={()=> navigate('/lobby')}>Lobby</button>
        </>
    )
}