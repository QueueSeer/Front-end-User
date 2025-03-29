import React, { useState } from "react";
import Images from "../../../assets";
import AuctionPopup from "./AuctionPopup";

const AuctionDetailSection = ({ auction }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // ตรวจสอบว่ามีข้อมูลหรือไม่
  if (!auction) return null;

  // จัดรูปแบบข้อมูลเวลา
  const formatDateDisplay = (dateString) => {
    if (!dateString) return "ไม่ระบุ";
    
    try {
      // กรณีที่ dateString เป็นข้อความที่ถูกฟอร์แมตแล้ว
      if (typeof dateString === 'string' && !dateString.includes('T') && !dateString.endsWith('Z')) {
        return dateString; // ส่งคืนค่าเดิม
      }
      
      // แปลงเป็น Date object
      const date = new Date(dateString);
      
      // ตรวจสอบว่า date ถูกต้องหรือไม่
      if (isNaN(date.getTime())) {
        return dateString; // ถ้าแปลงไม่ได้ ส่งคืนค่าเดิม
      }
      
      // ดึงวันที่ เดือน ปี
      const day = date.getDate();
      const monthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      const month = monthNames[date.getMonth()];
      
      // แปลงปีเป็น พ.ศ.
      const year = date.getFullYear() + 543;
      
      // แปลงเวลาเป็นรูปแบบไทย
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `วันที่ ${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแปลงวันที่:", error);
      return dateString; // ส่งคืนค่าเดิมถ้าเกิดข้อผิดพลาด
    }
  };
  // หมวดหมู่ดูดวง (สามารถดึงจาก API ถ้ามี หรือกำหนดเอง)
  const categories = ["ความรัก", "การงาน", "การเงิน", "สุขภาพ", "ภาพรวม"];

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
          <p className="text-gray-600 mt-1">
            เริ่มประมูล: {formatDateDisplay(auction.startDate)}
          </p>
          <p className="text-gray-600">
            สิ้นสุดประมูล: {formatDateDisplay(auction.endDate)}
          </p>
          {auction.appointStartTime && (
            <p className="text-gray-600">
              เวลานัดหมาย: {formatDateDisplay(auction.appointStartTime)}
              {auction.appointEndTime && ` - ${formatDateDisplay(auction.appointEndTime)}`}
            </p>
          )}
        </div>

        {/* หมวดหมู่ */}
        <div className="mb-6">
          <p className="text-lg font-bold border-l-4 border-[#8677A7] pl-3">หมวดหมู่</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((tag, index) => (
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
          {auction.description ? (
            <div className="mt-3 text-gray-900 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: auction.description }} />
            </div>
          ) : (
            <div className="mt-3 text-gray-900 leading-relaxed">
              <p>
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
          )}
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
        <p className="text-sm text-gray-600 line-clamp-3">{auction.shortDescription}</p>

        {/* ราคาเริ่มต้น */}
        <p className="text-sm font-medium mt-2">
          ราคาเริ่มต้น: <span className="text-purple-700 font-bold">{auction.initialBid} Coins</span>
        </p>

        {/* ปุ่มเข้าร่วมประมูล */}
        <button
          className="mt-4 bg-[#8677A7] text-white py-1.5 px-6 rounded-full w-full text-sm font-medium shadow-md hover:bg-[#77599A] transition"
          onClick={() => setIsPopupOpen(true)}
        >
          เข้าร่วมประมูล
        </button>
      </div>

      {/* แสดง Popup เมื่อ isPopupOpen เป็น true */}
      {isPopupOpen && <AuctionPopup auction={auction} onClose={() => setIsPopupOpen(false)} />}
    </div>
  );
};

export default AuctionDetailSection;