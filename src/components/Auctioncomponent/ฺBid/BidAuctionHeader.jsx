import React from "react";

const BidAuctionHeader = ({ auctioneer, timeLeft }) => {
  return (
    <div className="text-center">
      {/* หัวข้อหลัก */}
      <h1 className="text-3xl font-bold text-[#5A189A]">ประมูลดูดวงออนไลน์</h1>
      <p className="text-gray-700 mt-1 text-lg">{auctioneer}</p>

      {/* Countdown Timer */}
      <div className="flex justify-center gap-4 mt-4">
        {timeLeft.map((unit, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* 🔹 กล่องแสดงตัวเลขหลักสิบและหลักหน่วย (ถ้าไม่มีให้เติม 0) */}
            <div className="flex gap-1">
              <div className="bg-white border border-gray-400 text-[#8677A7] font-bold text-2xl w-10 h-12 flex items-center justify-center rounded-md shadow-sm">
                {unit.value[0] ?? "0"}
              </div>
              <div className="bg-white border border-gray-400 text-[#8677A7] font-bold text-2xl w-10 h-12 flex items-center justify-center rounded-md shadow-sm">
                {unit.value[1] ?? "0"}
              </div>
            </div>

            {/* ชื่อหน่วย (วัน / ชั่วโมง / นาที / วินาที) */}
            <p className="text-sm text-gray-600 mt-1">{unit.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidAuctionHeader;
