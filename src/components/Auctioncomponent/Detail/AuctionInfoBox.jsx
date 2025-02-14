import React from "react";
import Images from "../../../assets"; // ✅ ใช้รูปแทนไอคอนจาก assets

const AuctionInfoBox = ({ auction }) => {
  return (
    <div className="grid grid-cols-2 gap-4 ">
      {/* เวลาที่เหลือ */}
      <div className="flex items-center gap-3 border rounded-lg p-4 shadow-sm">
        <img src={Images.ClockCircle} alt="Clock" className="w-8 h-8 text-purple-700" />
        <div>
          <p className="text-gray-600 text-sm">เวลาคงเหลือ</p>
          <p className="text-xl font-bold">
            <span className="text-black">0 วัน</span> <span className="text-gray-800">10:28:45</span>
          </p>
        </div>
      </div>

      {/* จำนวนผู้ประมูล */}
      <div className="flex items-center gap-3 border rounded-lg p-4 shadow-sm">
        <img src={Images.Sledgehammer} alt="Sledgehammer" className="w-8 h-8 text-purple-700" />
        <div>
          <p className="text-gray-600 text-sm">จำนวนผู้ประมูล</p>
          <p className="text-xl font-bold text-black">8 คน</p>
        </div>
      </div>
    </div>
  );
};

export default AuctionInfoBox;
