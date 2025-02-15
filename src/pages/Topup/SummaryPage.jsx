import React, { useState } from "react";
import Images from "../../assets";
import { useLocation, useNavigate } from "react-router-dom";

const SummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCoins, selectedPrice, selectedPayment, currentCoins } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);
  const [updatedCoins, setUpdatedCoins] = useState(currentCoins); // เก็บค่าล่าสุดของ Coins

  const handleConfirmPayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUpdatedCoins(prev => prev + selectedCoins); // อัปเดตจำนวน Coin ใน LuckCard
      navigate("/top-up-coins", { state: { updatedCoins: updatedCoins + selectedCoins } }); // ส่งค่ากลับไปอัปเดต
    }, 2000); // โหลด 2 วินาที
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <svg
            className="animate-spin h-12 w-12 text-[#65558F]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
            ></path>
          </svg>
        </div>
      )}

      {/* Back Button */}
      <div className="absolute top-16 left-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-full px-4 py-3 mt-5"
        >
          <img src={Images.ArrowLeft} alt="Arrow Left Icon" className="w-5 h-5" />
          <span className="text-sm">ย้อนกลับ</span>
        </button>
      </div>

      {/* Card Container */}
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg overflow-hidden mt-10">
        {/* Image Section */}
        <div className="relative w-full h-48 bg-gray-200">
          <img
            src={Images.Packetphoto}
            alt="Packet"
            className="w-full h-full object-cover"
          />
          <img
            src={Images.logomarbeltext}
            alt="Logo"
            className="absolute top-[83%] left-1/2 transform -translate-x-1/2 w-16"
          />
        </div>

        {/* Summary Details */}
        <div className="p-6 bg-gray-100 rounded-lg pb-5">
          <div className="flex justify-between items-center mt-5">
            <span className="text-gray-600 font-medium">จำนวนทั้งหมด</span>
            <span className="font-bold text-gray-800">🔮 {selectedCoins} คอยน์</span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600 font-medium">ราคา</span>
            <span className="font-bold text-gray-800">{selectedPrice.toFixed(2)} บาท</span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600 font-medium">ช่องทางการชำระเงิน</span>
            <span className="font-bold text-gray-800">{selectedPayment}</span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600 font-medium">ชื่อผู้ใช้</span>
            <span className="font-bold text-gray-800">แมมผู้ชอบดูดวง</span>
          </div>
        </div>

        {/* Confirm Payment Button */}
        <div className="p-6 bg-white">
          <button
            className={`w-full py-3 text-center font-semibold rounded-lg shadow-md ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#65558F] text-white hover:bg-[#5A189A]"
            }`}
            onClick={handleConfirmPayment}
            disabled={isLoading}
          >
            ทำการชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
