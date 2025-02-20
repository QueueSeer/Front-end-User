import React from "react";
import Images from "../../assets"; // นำเข้าไฟล์รูปภาพทั้งหมด
import { useNavigate, useLocation } from "react-router-dom";

const LuckCard = ({ coins, showTopUp = false, className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ ใช้ค่าที่อัปเดตจาก location.state ถ้ามี ไม่งั้นใช้ค่า coins เดิม
  const updatedCoins = location.state?.updatedCoins ?? coins;

  return (
    <div className={`bg-[#8365A8] text-white p-5 rounded-lg shadow-lg flex flex-col w-[300px] h-[150px] relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-md font-semibold">โชคของคุณ</p>
        <img src={Images.image64} alt="Info" className="w-5 h-5 cursor-pointer" />
      </div>

      {/* Coin Balance - แสดงจำนวน Coins */}
      <div className="flex justify-end items-center mt-3">
        <p className="text-4xl font-bold">{updatedCoins}</p>
        <p className="text-3xl font-bold ml-2">Coins</p>
      </div>

      {/* ปุ่มเติมโชค */}
      <button
        className="absolute bottom-3 left-5 text-sm flex items-center text-white opacity-80 hover:opacity-100"
        onClick={() => navigate("/top-up-coins", { state: { from: "BidAuctionFooter" } })}
      >
        {showTopUp ? "เติมโชค Coin" : "ประวัติการเติมโชค"}
        <img src={Images.nextmoney} alt="ArrowRight" className="w-2 h-3 ml-1" />
      </button>
    </div>
  );
};

export default LuckCard;
