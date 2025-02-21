import React, { useState } from "react";
import PropTypes from "prop-types";
import images from "../../../assets"; // Import assets ถูกต้อง
import LogoutModal from "../../../components/Popup/LogoutModal";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate

const LogoutButton = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate(); // ใช้ navigate

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    navigate("/Login");
  };

  return (
    <div>
      <li className="border-t border-gray-200 dark:border-gray-700">
        {/* เปลี่ยนจาก <a> เป็น <button> และเพิ่ม cursor-pointer */}
        <button
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
          onClick={() => setIsLogoutModalOpen(true)}
        >
          {/* ไอคอน */}
          <span className="mr-3 w-6 h-6">
            <img
              src={images.LogoutIcon} // ใช้ images ให้ตรงกับ import
              alt="Logout Icon"
            />
          </span>
          {/* ข้อความ */}
          ออกจากระบบ
        </button>
      </li>
      {/* ใช้ LogoutModal Component */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

LogoutButton.propTypes = {
  onLogout: PropTypes.func, // เปลี่ยนให้เป็น optional
};

export default LogoutButton;