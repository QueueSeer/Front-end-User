import React from "react";
import { Link } from "react-router-dom";

const SidebarItem = React.memo(({ icon, text, href, isActive }) => {
  return (
    <li>
      <Link
        to={href}
        className={`flex items-center p-3 rounded-md cursor-pointer font-medium  ${
          isActive
            ? "bg-background"
            : "text-gray-700 hover:bg-purple-50 hover:text-purple-500"
        }`}
      >
        <img src={icon} alt={text} className="w-5 h-5" />
        <span className="ml-3">{text}</span>
      </Link>
    </li>
  );
});

export default SidebarItem;
