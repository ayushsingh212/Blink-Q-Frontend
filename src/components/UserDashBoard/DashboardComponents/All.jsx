import react from "react";
import Image from "./AllComponents/Image";
import UserDetails from "./AllComponents/UserDetails";
import WatchHistoryAll from "./AllComponents/WatchHistoryAll";

export default function All({ onSelectCategory }) {

    return (
        <>
            <Image />
            <UserDetails onSelectCategory={onSelectCategory} />
            <WatchHistoryAll />
        </>
    )
}