import React from "react";
import Buttonaboutme from "./Buttonaboutme";

const PopupProfile = ({ isOpen, onClose, textarea, setTextarea, onSave }) => {
  // ฟังก์ชันจัดการการเปลี่ยนแปลงใน textarea
  const handleChange = (event) => {
    setTextarea(event.target.value); // อัปเดตข้อความเมื่อพิมพ์
  };

  // ฟังก์ชันสำหรับบันทึกข้อความ
  const handleSave = () => {
    console.log("บันทึกข้อความ:", textarea); // ล็อกข้อความที่บันทึก
    onSave(textarea); // ส่งข้อความที่แก้ไขกลับไปยัง AboutUser
    onClose(); // ปิด Popup หลังจากบันทึก
  };

  if (!isOpen) return null; // ถ้า Popup ไม่เปิด ให้ return null

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white px-[40px] py-7 rounded-[18px] max-w-[750px] mx-auto w-[700px]">
        {/* หัวข้อ Popup */}
        <h2 className="text-[28px] font-semibold mb-6 border-zinc-300 border-b text-primary">
        คำอธิบายเกี่ยวกับฉัน
        </h2>
        <form className="text-[16px]">
          <textarea
            value={textarea} // แสดงข้อความที่ส่งมาจาก props
            onChange={handleChange} // เรียกฟังก์ชันเมื่อข้อความเปลี่ยน
            className="w-full h-[225px] pt-4 px-6 border border-zinc-300 rounded-[20px] resize-none"
          />
        </form>
        {/* ปุ่มจัดการ Popup */}
        <Buttonaboutme onSave={handleSave} onCancel={onClose} />
      </div>
    </div>
  );
};

export default PopupProfile;
