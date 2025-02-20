import React, { useState } from "react";

const PopupCategory = ({ isOpen, onClose, selectedCategory, onSave }) => {
  const [selected, setSelected] = useState(selectedCategory || ""); // เก็บหมวดหมู่ที่เลือก (เลือกได้อย่างเดียว)

  // รายชื่อหมวดหมู่
  const categories = [
    "ดูดวงด้วยศาสตร์ตัวเลข",
    "ไพ่ยิปซี",
    "โหงวเฮ้ง",
    "ไพ่พรหมญาณ",
    "ไพ่ออราเคิล",
    "ศาสตร์ฮินดู",
    "โหราศาสตร์จีน",
    "ดูดวงโหราศาสตร์ไทย",
    "โหราศาสตร์ตะวันตก",
  ];

  // ฟังก์ชันเลือกหมวดหมู่
  const handleCategorySelect = (category) => {
    setSelected(category);
  };

  // ฟังก์ชันบันทึกการเลือก
  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  // หาก Popup ไม่เปิด ให้ return null
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white px-[50px] py-[30px] mx-auto rounded-lg w-[500px] shadow-lg">
        {/* หัวข้อ */}
        <div className="flex justify-between items-center mb-[16px] border-zinc-300 border-b">
          <h2 className="text-[28px] font-semibold text-primary">
            เลือกหมวดหมู่ดูดวง
          </h2>
          
        </div>
        <p className="text-sm text-gray-600 mb-[20px]">
          กรุณาเลือกหมวดหมู่ดูดวงที่ให้บริการ
        </p>

        {/* ตัวเลือกหมวดหมู่ */}
        <div className="flex flex-wrap gap-3 mb-[26px]">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-4 py-2 rounded-full border text-sm ${
                selected === category
                  ? "bg-secondary2 text-white border-purple-600"
                  : "bg-white text-black border-gray-300"
              } hover:border-purple-500`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ปุ่มบันทึก */}
        <button
          onClick={handleSave}
          className="w-full bg-primary text-white py-2 rounded-full hover:bg-primary/90"
        >
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default PopupCategory;
