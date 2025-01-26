import React, { useState } from "react";
import Images from "../../assets"; // Icons for Sort

const ReviewFilter = () => {
  const stars = [5, 4, 3, 2, 1];
  const [activeFilter, setActiveFilter] = useState("ทั้งหมด"); // Manage active button state

  return (
    <div className="mb-6">
      {/* Desktop View */}
      <div className="hidden sm:flex flex-wrap items-center gap-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* "All Reviews" Button */}
          <button
            onClick={() => setActiveFilter("ทั้งหมด")}
            className={`px-5 py-2 font-medium rounded-full border ${
              activeFilter === "ทั้งหมด"
                ? "border-[#FAA91A] text-[#FAA91A]"
                : "border-gray-300 text-gray-700 hover:border-[#FAA91A] hover:text-[#FAA91A]"
            } focus:outline-none`}
          >
            ทั้งหมด
          </button>

          {/* Star Filter Buttons */}
          {stars.map((star) => (
            <button
              key={star}
              onClick={() => setActiveFilter(`${star} ดาว`)}
              className={`px-5 py-2 font-medium rounded-full border ${
                activeFilter === `${star} ดาว`
                  ? "border-[#FAA91A] text-[#FAA91A]"
                  : "border-gray-300 text-gray-700 hover:border-[#FAA91A] hover:text-[#FAA91A]"
              } focus:outline-none`}
            >
              {star} ดาว
            </button>
          ))}
        </div>

        {/* Sorting Section */}
        <div
          onClick={() => console.log("Sorting triggered")}
          className="mt-4 sm:mt-0 sm:ml-auto flex items-center text-[#65558F] cursor-pointer hover:text-purple-700 w-full sm:w-auto justify-end"
        >
          <span className="mr-1 text-sm sm:text-base">เรียงจากใหม่ไปเก่า</span>
          <img
            src={Images.SortFromBottomToTop}
            alt="Sort Icon"
            className="w-5 h-5"
          />
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex sm:hidden flex-col gap-4">
        {/* Filter Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {/* "All Reviews" Button */}
          <button
            onClick={() => setActiveFilter("ทั้งหมด")}
            className={`px-4 py-2 font-medium rounded-full border ${
              activeFilter === "ทั้งหมด"
                ? "border-[#FAA91A] text-[#FAA91A]"
                : "border-gray-300 text-gray-700 hover:border-[#FAA91A] hover:text-[#FAA91A]"
            } focus:outline-none`}
          >
            ทั้งหมด
          </button>

          {/* Star Filter Buttons */}
          {stars.map((star) => (
            <button
              key={star}
              onClick={() => setActiveFilter(`${star} ดาว`)}
              className={`px-4 py-2 font-medium rounded-full border ${
                activeFilter === `${star} ดาว`
                  ? "border-[#FAA91A] text-[#FAA91A]"
                  : "border-gray-300 text-gray-700 hover:border-[#FAA91A] hover:text-[#FAA91A]"
              } focus:outline-none`}
            >
              {star} ดาว
            </button>
          ))}
        </div>

        {/* Sorting Section */}
        <div
          onClick={() => console.log("Sorting triggered")}
          className="flex items-center justify-end text-[#65558F] cursor-pointer hover:text-purple-700"
        >
          <span className="mr-1 text-sm">เรียงจากใหม่ไปเก่า</span>
          <img
            src={Images.SortFromBottomToTop}
            alt="Sort Icon"
            className="w-5 h-5"
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewFilter;
