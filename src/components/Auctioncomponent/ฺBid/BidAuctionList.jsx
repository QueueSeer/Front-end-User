import React from "react";
import Images from "../../../assets"; // ✅ ใช้รูปจาก assets

const BidAuctionList = ({ bidders }) => {
  const myUsername = "แ*********"; // ✅ แทนค่าด้วยชื่อของตัวเอง

  return (
    <div className="mt-6 w-full max-w-2xl mx-auto pb-24">
      {bidders.map((bid, index) => (
        <div
          key={index}
          className="flex justify-between items-center px-4 py-3 rounded-lg mb-2 bg-[#8677A7] text-white relative"
        >
          {/* อันดับ + โปรไฟล์ */}
          <div className="flex items-center gap-3 relative">
            {/* มงกุฎ & ตำแหน่ง */}
            {index === 0 ? (
              <div className="relative">
                <img src={Images.CrownOne} alt="Winner" className="w-7 h-7" />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </span>
              </div>
            ) : (
              <div className="relative">
                <img src={Images.CrownTwo} alt="Rank" className="w-6 h-6 opacity-80" />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </span>
              </div>
            )}

            {/* รูปโปรไฟล์ */}
            <img
              src={bid.username === myUsername ? Images.profilemam : Images.profileWoman}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white"
            />

            {/* ชื่อผู้ใช้ */}
            <div className="text-sm">
              <p className="font-bold">{bid.username}</p>
              <p className="text-xs opacity-80">{bid.hiddenUser}</p>
            </div>
          </div>

          {/* จำนวน Coins */}
          <div className="flex items-center gap-2">
            {/* พื้นหลัง Radial ของถ้วยรางวัล */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFF9E2] to-[#FFF5D1] flex items-center justify-center">
              {/* ไอคอนถ้วยรางวัล */}
              <img src={Images.trophy} alt="Coins" className="w-5 h-5" />
            </div>

            {/* จำนวน Coins */}
            <p className="text-sm font-semibold">{bid.coins} Coins</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BidAuctionList;
