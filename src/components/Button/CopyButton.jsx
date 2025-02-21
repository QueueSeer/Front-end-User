import React, { useState } from "react";

const CopyButton = ({ text, isCopied, onCopy, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleCopy = async (e) => {
    e.stopPropagation(); // ป้องกันการคลิกในส่วนอื่น เช่น Card
    try {
      await navigator.clipboard.writeText(text); // คัดลอกข้อความไปยัง clipboard
      onCopy(); // อัปเดตสถานะการคัดลอก
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      className={`w-[140px] py-2 mx-3 rounded-full shadow-sm border border-2 flex items-center justify-center transition-colors ${
        isCopied
          ? "bg-secondary2 text-white"
          : isHovered
          ? "bg-secondary2 text-white"
          : "bg-white text-secondary2"
      } ${className}`} // รวม className จาก props
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCopy}
    >
      <p className={`font-bold ${isCopied || isHovered ? "text-[18px]" : ""}`}>
        {isCopied ? "คัดลอกแล้ว" : isHovered ? "คัดลอก" : text}
      </p>
    </button>
  );
};

export default CopyButton;
