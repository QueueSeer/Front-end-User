import React from "react";
import Images from "../../../assets";

const PackagesHeader = ({ onPrev, onNext, currentIndex, totalPages }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex flex-col mb-5">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>
          แพ็กเกจทั้งหมด
        </h2>
      </div>

      {/* 🔹 ปุ่มเลื่อน (เพิ่ม cursor-pointer ให้ชัดว่ากดได้) */}
      <div className="flex items-center gap-4 mb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full shadow-md transition-all duration-200
              ${currentIndex === 0 ? " cursor-not-allowed" : "bg-white hover:bg-gray-200 cursor-pointer"}`}
          >
            <img
              src={Images.Arrowleft}
              alt="prev"
              className="w-8 h-8"
            />
          </button>

          <span className="text-gray-600 text-xl  px-3 py-1 rounded-full">
            {currentIndex + 1} of {totalPages} {/* ✅ ใช้ totalPages */}
          </span>

          <button
            onClick={onNext}
            disabled={currentIndex >= totalPages - 1}
            className={`p-2 rounded-full shadow-md transition-all duration-200
              ${currentIndex >= totalPages - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-200 cursor-pointer"}`}
          >
            <img
              src={Images.ArrowRight}
              alt="next"
              className="w-8 h-8"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackagesHeader;
