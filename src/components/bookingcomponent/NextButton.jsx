import React from "react";

const NextButton = ({ onClick, disabled, className = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-md text-lg transition 
      ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#6B5B95] text-white hover:bg-[#5A4B80]"}
      ${className}`}
    >
      ถัดไป
    </button>
  );
};

export default NextButton;
