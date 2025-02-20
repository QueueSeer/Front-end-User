import React from "react";
import { useNavigate } from "react-router-dom"; // สำหรับการนำทาง

const BackButton = ({ to = -1, label = "ย้อนกลับ" }) => {
  const navigate = useNavigate(); // ใช้ navigate สำหรับการนำทาง

  const handleBackClick = () => {
    navigate(to); // นำทางไปยัง path ที่กำหนด
  };

  return (
    <button
      onClick={handleBackClick}
      className={`flex items-center justify-center gap-2 bg-white text-primary border-2 border-primary w-[130px] py-2 px-4 rounded-full hover:bg-primary/60 hover:text-white`}
    >
      {/* ไอคอนย้อนกลับ */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
      {/* ข้อความปุ่ม */}
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
