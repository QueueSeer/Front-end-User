// src/components/UserInfo.jsx
import React from "react";

const UserInfo = ({ name, username, border }) => {
  return (
    <div
      className={`px-4 py-2 ${
        border ? "border-b border-gray-200 dark:border-gray-600" : ""
      }`}
    >
      <span className="block text-gray-900 dark:text-white font-sans font-semibold text-[20px] mb-1.5">
        {/* เพิ่ม mb-1 (margin-bottom) เพื่อสร้างระยะห่าง */}
        {name}
      </span>
      {/* <span className="block text-gray-500 truncate dark:text-gray-400 font-sans text-sm">
        {username}
      </span> */}
    </div>
  );
};

export default UserInfo;
