import React from "react";
import Images from "../../assets"; // นำเข้าภาพที่ใช้

const PaymentOptionCard = ({ isSelected, onSelect }) => {
  return (
    <button 
      className={`flex items-center gap-3 p-4 border rounded-lg shadow-md w-full transition 
        ${isSelected ? "bg-[#65558F] text-white" : "bg-white text-black"} cursor-pointer`}
      onClick={onSelect}
    >
      <img src={Images.QrScan} alt="QR Code" className="w-10 h-10" />
      <p className="text-md font-semibold">QR Code PromptPay</p>
    </button>
  );
};

export default PaymentOptionCard;
