import React, { useState, useEffect } from "react";
import Images from "../../assets"; // Import รูปจาก assets

const HeaderSection = ({ packageInfo, setNumQuestions }) => {
  const [packageData, setPackageData] = useState(packageInfo || null);
  const [loading, setLoading] = useState(!packageInfo);
  const [error, setError] = useState(null);

  // 🟢 โหลดข้อมูลแพ็กเกจจาก API ถ้า `packageInfo` ไม่มี
  useEffect(() => {
    if (!packageInfo) {
      fetch("http://localhost:5000/api/package/1") // เปลี่ยนเป็น API จริงเมื่อพร้อม
        .then((response) => {
          if (!response.ok) throw new Error("โหลดแพ็กเกจล้มเหลว");
          return response.json();
        })
        .then((data) => {
          setPackageData(data);
          setNumQuestions(data.numQuestions || 4);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching package:", err);
          // 🟢 ใช้ Mock Data ถ้า API ล้มเหลว
          setPackageData({
            title: "แพ็กเกจดูดวงพื้นฐาน",
            price: 100,
            numQuestions: 4,
          });
          setNumQuestions(4);
          setLoading(false);
        });
    }
  }, [packageInfo, setNumQuestions]);

  if (loading) return <p className="text-center text-gray-500">กำลังโหลดข้อมูลแพ็กเกจ...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-12">
      {/* ชื่อแพ็กเกจ & ราคา */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{packageData?.title || "แพ็กเกจดูดวง"} </h1>
        <p className="text-purple-900 font-bold text-xl">{packageData?.price || 100} Coins</p>
      </div>

      {/* ภาพ + รายละเอียด */}
      <div className="flex space-x-8">
        {/* ภาพ */}
        <div className="w-1/3">
          <img src={Images.tarotImages} alt="Tarot Cards" className="w-full rounded-lg shadow-md" />
        </div>

        {/* รายละเอียด */}
        <div className="w-2/3">
          <p className="text-gray-700">
            ในแพ็กเกจนี้คุณสามารถถามได้ <strong>{packageData?.numQuestions || 4} คำถาม</strong> 
             :โดยผู้เชี่ยวชาญด้านโหราศาสตร์จะให้คำแนะนำเกี่ยวกับความรักและความสัมพันธ์
            และเจาะลึกเกี่ยวกับเรื่องความรักโดยแบ่งการทำนายออกเป็น 12 เดือน ซึ่งคุณจะได้รู้ถึง:
          </p>

          <ul className="list-decimal list-inside text-gray-700 mt-3 space-y-2">
            <li><strong>การทำนายปัญหาหรืออุปสรรคที่อาจเกิดขึ้น:</strong> คำแนะนำในการจัดการปัญหา</li>
            <li><strong>ช่วงเวลาที่ดีที่สุดในการสร้างความสัมพันธ์ใหม่:</strong> การเริ่มต้นความสัมพันธ์</li>
            <li><strong>การเสริมสร้างความสัมพันธ์ที่มีอยู่:</strong> พัฒนาความสัมพันธ์ให้ดียิ่งขึ้น</li>
            <li><strong>การตัดสินใจในด้านความรัก:</strong> คำแนะนำสำหรับเรื่องสำคัญ</li>
            <li><strong>คำแนะนำตามดวงชะตาส่วนตัว:</strong> ข้อมูลที่ปรับให้เข้ากับดวงของคุณ</li>
          </ul>
        </div>
      </div>

      {/* เส้นกั้นด้านล่าง */}
      <hr className="mt-6 border-gray-300" />
    </div>
  );
};

export default HeaderSection;
