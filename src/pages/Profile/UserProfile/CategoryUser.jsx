import React, { useState } from "react";
import Images from "../../../assets";
import PopupCategory from "../../../components/Popup/profile/PopupCategory"; // Import Popup สำหรับเลือกหมวดหมู่

const CategoryUser = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // สถานะเปิด/ปิด Popup
  const [selectedCategory, setSelectedCategory] = useState(""); // เก็บหมวดหมู่ที่เลือก

  // ฟังก์ชันสำหรับแสดง/ซ่อน Popup
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  // ฟังก์ชันสำหรับบันทึกหมวดหมู่ที่เลือก
  const handleSave = (category) => {
    setSelectedCategory(category); // อัปเดตหมวดหมู่ที่เลือก
    setIsPopupOpen(false); // ปิด Popup หลังจากบันทึก
  };

  return (
    <div>
      <h2 className="text-xl text-gray-800 font-semibold mb-4">
        เรื่องที่เชี่ยวชาญของฉัน
      </h2>

      {/* ปุ่มสำหรับเปิด Popup */}
      <button
        onClick={togglePopup}
        className="border-2 px-[30px] py-[20px] rounded-[5px] w-[420px]"
      >
        <div className="flex flex-row gap-[20px] items-center">
          <img
            src={Images.StarsIcon}
            alt="Starts Icon"
            className="mr-3 w-8 h-8 items-center"
          />
          <div className="flex flex-col gap-[5px] items-start">
            <div className="font-semibold text-black">หมวดหมู่ดูดวง</div>
            <div className="font-regular text-black/80 text-[18px]">
            {selectedCategory || "ยังไม่มีหมวดหมู่ที่เลือก"}
            </div>
          </div>
        </div>
      </button>

      {/* Popup สำหรับเลือกหมวดหมู่ */}
      <PopupCategory
        isOpen={isPopupOpen} // สถานะเปิด/ปิด Popup
        onClose={togglePopup} // ฟังก์ชันปิด Popup
        selectedCategory={selectedCategory} // หมวดหมู่ที่เลือกในปัจจุบัน
        onSave={handleSave} // ฟังก์ชันสำหรับบันทึกหมวดหมู่
      />
    </div>
  );
};

export default CategoryUser;
