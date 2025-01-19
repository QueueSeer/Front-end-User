// src/components/NotificationHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // ใช้สำหรับเปลี่ยนหน้าใน React Router

const NotificationInfo = () => {
  const navigate = useNavigate(); // ใช้งาน navigate เพื่อเปลี่ยนหน้า

  const handleGoToAllNotifications = () => {
    navigate("/notifications"); // กำหนด path ของหน้าที่ต้องการไป เช่น "/notifications"
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 pb-2 border-b border-gray-200 dark:border-gray-600">
      {/* หัวข้อ */}
      <span className="text-gray-900 dark:text-white font-sans font-semibold text-lg">
        การแจ้งเตือน
      </span>
      {/* ปุ่ม "ทั้งหมด" */}
      <button
        onClick={handleGoToAllNotifications}
        className="text-primary text-sm font-semibold hover:underline"
      >
        ทั้งหมด
      </button>
    </div>
  );
};

export default NotificationInfo;
