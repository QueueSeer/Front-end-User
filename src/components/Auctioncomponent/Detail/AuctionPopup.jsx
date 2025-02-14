import React from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../../assets"; // ✅ ใช้ภาพจาก assets

const AuctionPopup = ({ auction, onClose }) => {
  const navigate = useNavigate(); // ใช้ navigate เพื่อนำทาง

  const steps = [
    { id: "01", title: "เริ่มต้น 50 coins", desc: "จะเข้าร่วมการประมูลได้ ต้องมีโชค Coins เริ่มต้นที่ 50 coins กรณีที่มีโชค Coins ไม่ถึง เติมได้ที่ โชคCoins" },
    { id: "02", title: "อ่านรายละเอียด", desc: "โปรดตรวจสอบรายละเอียดแพ็กเกจอย่างละเอียดก่อนเข้าร่วม เพื่อให้มั่นใจว่าตรงตามความต้องการของคุณ" },
    { id: "03", title: "เข้าร่วมการประมูล", desc: "เมื่อพร้อมแล้วคุณสามารถเข้าร่วมการประมูลและวางเงิน ประมูลตามขั้นตอนที่ระบบกำหนด" },
    { id: "04", title: "ก่อนจบประมูล 5 นาที ระบบจะปิดลำดับ", desc: "ในช่วง 5 นาทีสุดท้าย ระบบจะปิดการเปลี่ยนแปลงลำดับผู้ประมูล เพื่อป้องกันการแก้ไขในนาทีสุดท้าย" },
    { id: "05", title: "สรุปผลการประมูล", desc: "หลังจากการประมูลสิ้นสุด ระบบจะแจ้งผลผู้ชนะให้ได้รับแพ็กเกจทันที" }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-[600px] max-h-[600px] overflow-y-auto relative">
        {/* ปิด Popup */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500">
          ✖
        </button>

        {/* หัวข้อ */}
        <h2 className="text-lg font-bold text-[#5A189A] flex items-center">
          <img src={Images.Sledgehammer} alt="ประมูล" className="w-6 h-6 mr-2" />
          รายละเอียดการประมูล
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          การประมูลดูดวง คือระบบที่เปิดให้ลูกค้าสามารถเข้าร่วมประมูลเพื่อจองคิวปรึกษาหมอดู
          โดยมีขั้นตอนการประมูลดังนี้
        </p>

        {/* โชคของคุณ */}
        <div className="bg-[#8677A7] text-white p-5 rounded-lg mt-4 text-center">
          <p className="text-lg">โชคของคุณ</p>
          <p className="text-3xl font-bold">200 Coins</p>
        </div>

        {/* ✅ ขั้นตอนการประมูล */}
        <div className="flex mt-6">
          {/* เส้นเชื่อม + วงกลมหมายเลข */}
          <div className="relative flex flex-col items-center w-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#5A189A] text-white flex items-center justify-center rounded-full text-lg font-bold">
                  {step.id}
                </div>
                {index < steps.length - 1 && <div className="w-1 h-12 bg-gray-300"></div>}
              </div>
            ))}
          </div>

          {/* เนื้อหาขั้นตอน */}
          <div className="flex flex-col gap-8 ml-5">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div>
                  <h3 className="text-[#5A189A] font-bold">{step.title}</h3>
                  <p className="text-gray-700 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ปุ่มยืนยัน */}
        <div className="flex justify-between mt-6 gap-4">
          {/* ✅ เมื่อกดปุ่ม "ยอมรับเงื่อนไข" ไปหน้า BidAuction */}
          <button
            className="bg-[#8677A7] text-white py-3 px-6 rounded-full w-1/2 text-base font-medium hover:bg-[#77599A] transition"
            onClick={() => navigate("/bidAuction")}  
          >
            ยอมรับเงื่อนไข
          </button>

          {/* ✅ เมื่อกดปุ่ม "ย้อนดูรายละเอียด" กลับไปหน้า Auction (เหมือนกดกากบาท) */}
          <button
            className="bg-gray-300 text-gray-700 py-3 px-6 rounded-full w-1/2 text-base font-medium"
            onClick={onClose}
          >
            ย้อนดูรายละเอียด
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionPopup;
