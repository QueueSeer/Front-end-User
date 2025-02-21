import React from "react";

const BackButton = ({ label, onClose }) => {
  return (
    <div>
      <button
        onClick={onClose} // ใช้ฟังก์ชัน onClose ที่ส่งมาจาก props
        className="bg-white text-primary border-2 border-primary w-[115px] py-2 rounded-full hover:bg-primary/60 hover:text-white"
      >
        {label || "ย้อนกลับ"} {/* ใช้ข้อความที่ส่งเข้ามา หรือค่าเริ่มต้นคือ "ย้อนกลับ" */}
      </button>
    </div>
  );
};

export default BackButton;
