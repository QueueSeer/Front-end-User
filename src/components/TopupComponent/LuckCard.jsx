import React from "react";
import Images from "../../assets"; // นำเข้าไฟล์รูปภาพทั้งหมด
import { useNavigate } from "react-router-dom";

const LuckCard = ({ coins, showTopUp = false, className = "" }) => {
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้า

  return (
    <div className={`bg-[#8365A8] text-white p-5 rounded-lg shadow-lg flex flex-col w-[300px] h-[150px] relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-md font-semibold">โชคของคุณ</p>
        <img src={Images.image64} alt="Info" className="w-5 h-5 cursor-pointer" />
      </div>

      {/* Coin Balance - แสดงจำนวน Coins */}
      <div className="flex justify-end items-center mt-3">
        <p className="text-4xl font-bold">{coins}</p>
        <p className="text-3xl font-bold ml-2">Coins</p>
      </div>

      {/* ปุ่มที่เปลี่ยนได้ตาม `showTopUp` */}
      <button
        className="absolute bottom-3 left-5 text-sm flex items-center text-white opacity-80 hover:opacity-100"
        onClick={() => navigate("/top-up-coins")} // ไปหน้าเติมโชค
      >
        {showTopUp ? "เติมโชค Coin" : "ประวัติการเติมโชค"}
        <img src={Images.nextmoney} alt="ArrowRight" className="w-2 h-3 ml-1" />
      </button>
    </div>
  );
};

export default LuckCard;
