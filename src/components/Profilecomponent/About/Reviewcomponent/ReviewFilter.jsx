import React from "react";

const ReviewFilter = ({ activeFilter, setActiveFilter }) => {
  const stars = [5, 4, 3, 2, 1];

  return (
    <div className="mb-6">
      {/* Desktop View */}
      <div className="hidden sm:flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
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

          {stars.map((star) => (
            <button
              key={star}
              onClick={() => setActiveFilter(`${star}`)}
              className={`px-5 py-2 font-medium rounded-full border ${
                activeFilter === `${star}`
                  ? "border-[#FAA91A] text-[#FAA91A]"
                  : "border-gray-300 text-gray-700 hover:border-[#FAA91A] hover:text-[#FAA91A]"
              } focus:outline-none`}
            >
              {star} ดาว
            </button>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex sm:hidden flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
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

          {stars.map((star) => (
            <button
              key={star}
              onClick={() => setActiveFilter(`${star}`)}
              className={`px-4 py-2 font-medium rounded-full border ${
                activeFilter === `${star}`
                  ? "border-[#FAA91A] text-[#FAA91A]"
                  : "border-gray-300 text-gray-700 hover:border-[#FAA91A] hover:text-[#FAA91A]"
              } focus:outline-none`}
            >
              {star} ดาว
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewFilter;
