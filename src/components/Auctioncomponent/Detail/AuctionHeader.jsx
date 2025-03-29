import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../../assets"; 
import AuctionPopup from "./AuctionPopup";

const AuctionHeader = ({ auction, onBack }) => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // ตรวจสอบว่า auction มีค่าหรือไม่
  if (!auction) return null;

  // สร้างฟังก์ชันสำหรับการกลับไปหน้าก่อนหน้า
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="relative w-full bg-[#8677A7] text-white p-6 rounded-lg">
      {/* ปุ่มย้อนกลับ */}
      <button 
        onClick={handleBack} 
        className="absolute top-4 left-4 flex items-center text-gray-600 text-sm px-3 py-1 bg-gray-200 rounded-full"
      >
        <img src={Images.backtoback} alt="Back" className="w-2 h-3 mr-2" />
        <span>ย้อนกลับ</span>
      </button>

      {/* คอนเทนเนอร์หลัก */}
      <div className="flex flex-col md:flex-row gap-0 items-stretch p-7">
        {/* รูปภาพประมูล (เต็มขนาดของการ์ด) */}
        <div className="w-full md:w-1/2">
          <img 
            src={auction.image || Images.auctionImages} 
            alt={auction.title} 
            className="w-full h-full object-cover rounded-t-lg md:rounded-t-none md:rounded-l-lg" 
          />
        </div>

        {/* ข้อมูลหลัก */}
        <div className="w-full md:w-1/2 bg-white text-gray-800 p-6 rounded-b-lg md:rounded-b-none md:rounded-r-lg flex flex-col justify-between shadow-md">
          {/* สถานะ + ปุ่มแชร์ */}
          <div className="flex justify-between items-center">
            <span className="bg-green-200 text-green-700 text-xs px-3 py-1 rounded-full">กำลังประมูล</span>
            <button className="text-gray-500">
              <img src={Images.share} alt="Share" className="w-5 h-5" />
            </button>
          </div>

          {/* ข้อมูลประมูล */}
          <h1 className="text-lg font-bold mt-2 text-gray-900">{auction.title}</h1>
          <p className="text-sm text-gray-600">{auction.shortDescription || auction.description}</p>
          <p className="text-lg font-semibold text-purple-700 mt-2">
            ราคาเริ่มต้น <span className="text-[#5A189A]">{auction.initialBid || 50} Coins</span>
          </p>

          {/* หมอดู */}
          <div className="flex items-center mt-2">
            <img 
              src={auction.astrologer?.image || Images.profileSmall} 
              alt={auction.astrologer?.name || "หมอดู"} 
              className="w-8 h-8 rounded-full" 
            />
            <p className="ml-2 text-sm font-medium">
              {auction.astrologer?.name || "ไม่ระบุชื่อหมอดู"}
            </p>
          </div>

          {/* ปุ่มร่วมประมูล */}
          <button
            className="mt-4 bg-[#8677A7] text-white py-1.5 px-6 rounded-full w-full text-sm font-medium shadow-md hover:bg-[#77599A] transition"
            onClick={() => setIsPopupOpen(true)}
          >
            เข้าร่วมประมูล
          </button>
        </div>
      </div>

      {/* แสดง Popup เมื่อกด "เข้าร่วมประมูล" */}
      {isPopupOpen && <AuctionPopup auction={auction} onClose={() => setIsPopupOpen(false)} />}
    </div>
  );
};

export default AuctionHeader;