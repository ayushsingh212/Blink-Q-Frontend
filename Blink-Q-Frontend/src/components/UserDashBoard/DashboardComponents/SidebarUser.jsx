import React, { useState } from "react";

const SidebarUser = ({ onSelectedCategory }) => {
  const options = ["All", "Profile", "Watch History"];
  const [selected, setSelected] = useState("All");

  const handleSelect = (option) => {
    setSelected(option);
    onSelectedCategory(option);
  };

  return (
    <aside>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleSelect(option)}
          className={`block w-full text-left py-2 px-3 my-2 mx-3 rounded transition-all duration-200 ${
            selected === option
              ? "bg-gray-700 font-semibold text-blue-400"
              : "hover:bg-slate-800 text-gray-300"
          }`}
        >
          {option}
        </button>
      ))}
    </aside>
  );
};

export default SidebarUser;
