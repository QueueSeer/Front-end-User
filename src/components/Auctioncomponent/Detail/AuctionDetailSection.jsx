import React, { useState } from "react";
import Images from "../../../assets";
import AuctionPopup from "./AuctionPopup"; // ✅ เพิ่ม Popup

const AuctionDetailSection = ({ auction }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // ✅ State สำหรับ Popup

  return (
    <div className="mt-4 text-gray-800 grid grid-cols-3 gap-6">
      {/* ส่วนข้อมูลรายละเอียด */}
      <div className="col-span-2">
        {/* สถานะ */}
        <div className="mb-6">
          <p className="text-lg font-bold border-l-4 border-[#8677A7] pl-3 ">สถานะ</p>
          <p className="text-lg mt-1">เปิดประมูล</p>
        </div>

        {/* ระยะเวลา */}
        <div className="mb-6">
          <p className="text-lg font-bold border-l-4 border-[#8677A7] pl-3">ระยะเวลา</p>
          <p className="text-gray-600 mt-1">เริ่มประมูล: วันที่ 24 ตุลาคม 2567 11:30 น.</p>
          <p className="text-gray-600">สิ้นสุดประมูล: วันที่ 24 ตุลาคม 2567 20:30 น.</p>
        </div>

        {/* หมวดหมู่ */}
        <div className="mb-6">
          <p className="text-lg font-bold border-l-4 border-[#8677A7] pl-3">หมวดหมู่</p>
          <div className="flex gap-2 mt-2">
            {["ความรัก", "การงาน", "การเงิน", "สุขภาพ", "ภาพรวม"].map((tag, index) => (
              <span 
                key={index} 
                className="bg-white border border-gray-400 text-[#420F75] text-sm px-4 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* รายละเอียด */}
        <div className="mt-6">
          <p className="text-lg font-bold border-l-4 border-[#8677A7] pl-3">รายละเอียด</p>
          <p className="mt-3 text-gray-900 leading-relaxed">
            การประมูลแพ็กเกจดูดวงที่ครอบคลุมเรื่องความรัก สุขภาพ การงาน และการพยากรณ์ประจำปี 
            ถือเป็นโอกาสที่สำคัญสำหรับผู้ที่ต้องการศึกษาเส้นทางชีวิตของตนเองให้ลึกซึ้งขึ้น 
            โดยสามารถดูดวงเชิงลึกและวางแผนชีวิตได้
          </p>
          <ul className="mt-3 space-y-2 text-gray-900 list-disc list-inside">
            <li>
              <strong>ความรัก:</strong> คุณจะได้รับการทำนายแนวโน้มในความสัมพันธ์ของคุณ ซึ่งจะช่วยให้คุณสามารถเข้าใจสถานการณ์และวางแผนชีวิตได้ดีขึ้น
            </li>
            <li>
              <strong>สุขภาพ:</strong> การดูดวงสุขภาพช่วยให้คุณรู้จักระวังและป้องกันปัญหาสุขภาพล่วงหน้า
            </li>
            <li>
              <strong>การงาน:</strong> คุณจะได้รับการชี้แนะแนวทางโอกาสความก้าวหน้าในอาชีพ หรือการลงทุนใหม่ 
            </li>
            <li>
              <strong>ภาพรวมประจำปี:</strong> การดูดวงแนวโน้มของครึ่งปีหรือประจำปีช่วยให้คุณมองชีวิตอย่างเป็นระบบ
            </li>
          </ul>
        </div>
      </div>

      {/* กล่องด้านขวา - Sticky Sidebar */}
<div className="bg-white shadow-md p-4 rounded-lg border w-full max-w-xs self-start ml-auto relative sticky top-20">
  {/* บรรทัดเดียวกัน: สถานะ + ปุ่มแชร์ */}
  <div className="flex justify-between items-center">
    {/* สถานะ */}
    <span className="bg-green-200 text-green-700 text-xs px-2 py-1 rounded-full">
      กำลังประมูล
    </span>

    {/* ปุ่มแชร์ */}
    <button className="p-2 hover:bg-gray-200 rounded-full">
      <img src={Images.share} alt="แชร์" className="w-5 h-5" />
    </button>
  </div>

  {/* ชื่อการประมูล */}
  <h3 className="text-md font-bold mt-2">{auction.title}</h3>
  <p className="text-sm text-gray-600">{auction.description}</p>

  {/* ปุ่มเข้าร่วมประมูล */}
  <button
    className="mt-4 bg-[#8677A7] text-white py-1.5 px-6 rounded-full w-full text-sm font-medium shadow-md hover:bg-[#77599A] transition"
    onClick={() => setIsPopupOpen(true)}
  >
    เข้าร่วมประมูล
  </button>
</div>

{/* ✅ แสดง Popup เมื่อ isPopupOpen เป็น true */}
{isPopupOpen && <AuctionPopup auction={auction} onClose={() => setIsPopupOpen(false)} />}

    </div>
  );
};

export default AuctionDetailSection;
