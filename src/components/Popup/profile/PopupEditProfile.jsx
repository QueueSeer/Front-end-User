import React, { useState } from "react";
import { createPortal } from "react-dom";

const PopupEditProfile = ({ isOpen, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState({ ...userData });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return createPortal(
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-purple-800">แก้ไขโปรไฟล์</h2>

        {/* ชื่อผู้ใช้ */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">ชื่อผู้ใช้ *</label>
          <input type="text" name="nickname" className="border rounded-md px-3 py-2 w-full" value={formData.nickname} onChange={handleChange} />
        </div>

        {/* ชื่อจริง - นามสกุล */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">ชื่อจริง *</label>
            <input type="text" name="firstName" className="border rounded-md px-3 py-2 w-full" value={formData.firstName} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">นามสกุล *</label>
            <input type="text" name="lastName" className="border rounded-md px-3 py-2 w-full" value={formData.lastName} onChange={handleChange} />
          </div>
        </div>

        {/* วันเดือนปีเกิด */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">วันเดือนปีเกิด *</label>
          <div className="grid grid-cols-3 gap-4">
            <select name="day" className="border rounded-md px-3 py-2 w-full" onChange={handleChange} value={formData.day || "08"}>
              {[...Array(31)].map((_, i) => (
                <option key={i} value={String(i + 1).padStart(2, "0")}>{i + 1}</option>
              ))}
            </select>
            <select name="month" className="border rounded-md px-3 py-2 w-full" onChange={handleChange} value={formData.month || "เมษายน"}>
              {["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"].map((month, i) => (
                <option key={i} value={month}>{month}</option>
              ))}
            </select>
            <select name="year" className="border rounded-md px-3 py-2 w-full" onChange={handleChange} value={formData.year || "2545"}>
              {[...Array(50)].map((_, i) => (
                <option key={i} value={String(2550 - i)}>{2550 - i}</option>
              ))}
            </select>
          </div>
        </div>

        {/* อีเมล */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">อีเมล *</label>
          <input type="email" name="email" className="border rounded-md px-3 py-2 w-full" value={formData.email} onChange={handleChange} />
        </div>

        {/* เบอร์โทรศัพท์ */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">เบอร์โทรศัพท์ *</label>
          <input type="text" name="phone" className="border rounded-md px-3 py-2 w-full" value={formData.phone} onChange={handleChange} />
        </div>

        {/* ปุ่ม ยกเลิก & บันทึก */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="bg-gray-300 px-4 py-2 rounded-md" onClick={onClose}>ยกเลิก</button>
          <button className="bg-purple-800 text-white px-4 py-2 rounded-md" onClick={handleSubmit}>บันทึก</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PopupEditProfile;
