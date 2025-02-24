import React, { useState } from "react";
import ProfileCard from "../../components/Profilecomponent/ProfileCard";
import Images from "../../assets";
import Navbar from "../../components/navbar";

const seer = {
  profileImageUrl: Images.SeerProfile,
  name: "หมอดูเพียงฟ้า พาขวัญ",
  category: "ศาสตร์ไพ่ยิปซี",
  experience: "10+ ปี",
  followers: "1,025",
  rating: "4.5",
};

const Horoscope = () => {
  const [question, setQuestion] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSubmit = () => {
    if (question.trim()) {
      setIsPopupOpen(true);
    }
  };

  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      <div className="min-h-screen flex flex-col items-center bg-gray-100 pt-20 px-6">
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">

      {/* Header Section */}
<div className="flex flex-col lg:flex-row gap-6 mb-6">
  {/* Profile หมอดู (ขยายให้กว้างขึ้น) */}
  <div className="w-2/3">
    <div className=" p-3 min-h-full">
      <ProfileCard
        profileImageUrl={seer.profileImageUrl}
        name={seer.name}
        category={seer.category}
        experience={seer.experience}
        followers={seer.followers}
        rating={seer.rating}
      />
    </div>
  </div>

  {/* อัตราการตอบกลับ (ลดขนาดลง) */}
  <div className="w-1/3 border rounded-lg shadow p-4 flex flex-col justify-center items-center">
    <h1 className="text-3xl font-bold text-[#65558F]">85 %</h1>
    <p className="text-gray-600 mt-2 text-sm text-center">อัตราการตอบกลับภายใน 15 นาที</p>
  </div>
</div>



         {/* รายละเอียดการดูดวงทันที */}
<div className="mt-6 flex justify-between items-center">
  <h2 className="text-xl font-semibold text-gray-800">รายละเอียดการดูดวงทันที</h2>
  <div className="text-purple-800 font-bold text-lg">150 Coins</div>
</div>


          {/* รูปภาพ + ข้อมูล */}
          <div className="flex flex-col lg:flex-row gap-6 mt-4">
            {/* รูปภาพ */}
            <img src={Images.TaroActive} alt="Tarot Cards" className="w-full lg:w-1/3 rounded-lg object-cover" />

            {/* ข้อมูลการดูดวง */}
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed">
                ** แจ้งรายละเอียดให้ครบถ้วน: ต้องใช้ประกอบการดูดวงค่ะ บางส่วนเป็นระบบอัตโนมัติ
                ส่วนรายละเอียดเพิ่มเติมสามารถพิมพ์เพิ่มเติมช่องกรอกคำถามด้านล่างได้เลยค่ะ
              </p>
              <ul className="text-gray-700 text-sm mt-2 list-disc list-inside">
                <li>ชื่อ</li>
                <li>อายุ (ไม่ต้องถึงวันเกิดเต็มปี)</li>
                <li>สถานะด้านความรัก (โสด / มีแฟน / มีคนคุย / หย่าร้าง)</li>
                <li>สถานะด้านการงาน (เรียน รูปแบบ / ทำงาน / ว่างงาน)</li>
                <li>สถานะการเงิน</li>
              </ul>

              <p className="text-gray-700 text-sm mt-4">
                ไม่รับคำถามความเป็นความตาย วิญญาณ สิ่งศักดิ์สิทธิ์ / ไม่รับคำถามพรมลิขิตแบบตัดสินใจ
                ความสัมพันธ์ซับซ้อนซับซ้อน / คำถามเกิน 3 เรื่องในครั้งเดียวกัน
              </p>
              <p className="text-gray-700 text-sm mt-2">
                คำถามจะได้รับคำตอบใน 15-20 นาที หลังส่งคำถามสุดท้ายที่ส่งมา
              </p>
            </div>
          </div>

          {/* กรอกคำถาม */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">กรอกคำถาม</h2>
            <textarea
              className="w-full border rounded-md px-3 py-2 h-32 resize-none bg-gray-100"
              placeholder="พิมพ์คำถามของคุณที่นี่..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            ></textarea>
          </div>

          {/* ปุ่มย้อนกลับ & ยืนยัน */}
          <div className="flex justify-between mt-6">
            <button
              className="px-6 py-3 rounded-lg font-semibold text-[#65558F] bg-transparent hover:underline transition"
              onClick={() => window.history.back()}
            >
              &lt; ย้อนกลับ
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                question.trim() ? "bg-[#65558F] hover:bg-[#564477]" : "bg-[#65558F] opacity-50 cursor-not-allowed"
              }`}
              onClick={handleSubmit}
              disabled={!question.trim()}
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>

      {/* Popup แจ้งเตือน */}
          {isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="relative bg-white rounded-lg shadow-lg p-6 w-96">
                
                {/* ปุ่มกากบาทปิด */}
                <button 
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                  onClick={() => setIsPopupOpen(false)}
                >
                  ✕
                </button>

                {/* หัวข้อ อยู่ตรงกลาง + สีม่วงเข้ม */}
                <h2 className="text-xl font-semibold text-[#420F75] mb-4 text-center">
                  ส่งข้อความสำเร็จ
                </h2>

                {/* ข้อความ */}
                <p className="text-gray-600 text-center">
                  ข้อความของคุณถูกส่งไปยังหมอดูแล้ว โปรดรอคำตอบ
                </p>
              </div>
            </div>
          )}

    </>
  );
};

export default Horoscope;
