import React from "react";

const NextButton = ({ onClick, disabled, loading = false, className = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-md text-lg transition 
      ${disabled || loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#6B5B95] text-white hover:bg-[#5A4B80]"}
      ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <span className="mr-2">กำลังดำเนินการ</span>
          <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
        </div>
      ) : (
        "ถัดไป"
      )}
    </button>
  );
};

export default NextButton;