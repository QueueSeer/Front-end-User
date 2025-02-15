import React from "react";

const TopUpPackageCard = ({ icon, coins, price, isSelected, onSelect }) => {
  return (
    <div
      className={`border rounded-lg p-4 w-full min-h-[140px] flex flex-col justify-between items-center shadow-sm hover:shadow-md cursor-pointer 
        ${isSelected ? "bg-[#65558F] text-white" : "bg-white text-black"}`}
      onClick={() => onSelect(coins, price)}
    >
      {/* ส่วน Coins และไอคอน */}
      <div className="w-full flex justify-between items-center">
        <p className={`text-lg font-bold ${isSelected ? "text-white" : "text-black"}`}>
          {coins} <span className="font-normal">Coins</span>
        </p>
        <img src={icon} alt="icon" className="w-8 h-8" />
      </div>

      {/* คำอธิบาย (เฉพาะบางแพ็กเกจ) */}
      <p className={`text-sm mt-1 h-[20px] ${isSelected ? "text-gray-200" : "text-gray-500"}`}>
        {coins === 29 ? "ระดับขั้นต่ำ" : ""}
      </p>

      {/* ปุ่มราคา */}
      <button 
        className={`w-full mt-auto py-2 rounded-lg ${isSelected ? "bg-white text-[#65558F]" : "bg-[#9E80B8] text-white"}`}
      >
        {price} บาท
      </button>
    </div>
  );
};

export default TopUpPackageCard;
