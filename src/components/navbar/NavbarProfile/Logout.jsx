import React from "react";
import PropTypes from "prop-types";
import images from "../../../assets"; // Import assets ถูกต้อง

const LogoutButton = ({ onLogout }) => {
  return (
    <li className="border-t border-gray-200 dark:border-gray-700"> {/* เพิ่มขอบบน */}
      <a
        className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
        onClick={onLogout}
      >
        {/* ไอคอน */}
        <span className="mr-3 w-6 h-6">
          <img
            src={images.LogoutIcon} // ใช้ images ให้ตรงกับ import
            alt="LogoutIcon"
          />
        </span>
        {/* ข้อความ */}
        ออกจากระบบ
      </a>
    </li>
  );
};

LogoutButton.propTypes = {
  onLogout: PropTypes.func.isRequired, // ต้องการฟังก์ชันสำหรับจัดการการล็อกเอาต์
};

export default LogoutButton;
