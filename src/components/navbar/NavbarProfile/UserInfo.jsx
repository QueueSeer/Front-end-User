import React from "react";

const UserInfo = ({ name, username, border, image }) => {
  return (
    <div
      className={`flex flex-col items-center py-5 px-4 ${
        border ? "border-b border-gray-200 dark:border-gray-600" : ""
      }`}
    >
      {/* รูปโปรไฟล์ */}
      <img
        className="w-16 h-16 rounded-full mb-2"
        src={image || "https://via.placeholder.com/150"}
        alt={name}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150";
        }}
      />
      
      {/* ชื่อผู้ใช้ */}
      <span className="block text-gray-900 dark:text-white font-sans font-semibold text-xl mb-1.5 text-[#420F75]">
        {name}
      </span>
      
      {/* ชื่อผู้ใช้ในระบบ */}
      {username && (
        <span className="block text-gray-500 truncate dark:text-gray-400 font-sans text-sm">
          @{username}
        </span>
      )}
    </div>
  );
};

export default UserInfo;