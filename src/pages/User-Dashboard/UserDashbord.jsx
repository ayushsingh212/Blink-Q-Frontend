import React, { useState } from "react";
import SidebarUser from "../../components/UserDashBoard/DashboardComponents/SidebarUser";
import Profile from "../../components/UserDashBoard/DashboardComponents/Profile";
import WatchHistory from "../../components/UserDashBoard/DashboardComponents/WatchHistory";
import All from "../../components/UserDashBoard/DashboardComponents/All";
import UserChannel from "../../components/UserDashBoard/DashboardComponents/UserChannel";

export default function UserDashboard() {
    const [selectedCategory, setSelectedCategory] = useState("All")

    return (

        <div className=" flex ">
            <div className="w-1/6 mr-11">
                <SidebarUser onSelectedCategory={setSelectedCategory}/>
            </div>
            <div className="w-4/5">
                {selectedCategory === "All" && (
                    <All onSelectCategory={setSelectedCategory} /> 
                )}
                {selectedCategory=="Profile" && <Profile/>}
                {selectedCategory=="Watch History" && <WatchHistory/>}
                {selectedCategory=="UserChannel" && <UserChannel/>}
            </div>
        </div>
    )
}