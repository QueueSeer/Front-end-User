import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios"; // เพิ่ม axios

const PopupEditProfile = ({ isOpen, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState({ ...userData });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // อัปเดต formData เมื่อ userData เปลี่ยน
  useEffect(() => {
    if (userData) {
      // แยกวันเดือนปีเกิดออกมา (ถ้ามี)
      let day = "01";
      let month = "มกราคม";
      let year = (new Date().getFullYear() + 543 - 20).toString(); // ค่าเริ่มต้นเป็นปี พ.ศ. 20 ปีก่อน
      
      if (userData.birthdate) {
        const birthDate = new Date(userData.birthdate);
        if (!isNaN(birthDate.getTime())) {
          day = String(birthDate.getDate()).padStart(2, "0");
          
          // แปลงเดือนเป็นชื่อภาษาไทย
          const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
                           "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
          month = thaiMonths[birthDate.getMonth()];
          
          // แปลงปีเป็น พ.ศ.
          year = (birthDate.getFullYear() + 543).toString();
        }
      }
      
      setFormData({
        ...userData,
        day,
        month,
        year
      });
    }
  }, [userData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // แปลงวันเดือนปีเป็นรูปแบบ ISO
      const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
                       "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
      const monthIndex = thaiMonths.indexOf(formData.month);
      const year = parseInt(formData.year) - 543; // แปลงจาก พ.ศ. เป็น ค.ศ.
      
      // สร้างวันที่ในรูปแบบ ISO
      const birthdate = new Date(year, monthIndex, parseInt(formData.day));
      const isoDate = birthdate.toISOString();
      
      // เตรียมข้อมูลสำหรับส่งไป API
      const apiData = {
        display_name: formData.nickname,
        first_name: formData.firstName,
        last_name: formData.lastName,
        birthdate: isoDate,
        phone_number: formData.phone
        // ไม่ส่ง email เพราะบางครั้ง API อาจไม่อนุญาตให้เปลี่ยน email
      };
      
      // เรียก API เพื่ออัปเดตข้อมูล
      const response = await axios.patch('https://backend.qseer.app/api/user/me', apiData, {
        withCredentials: true, // สำคัญสำหรับการส่ง cookies
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log("User data updated successfully:", response.data);
      
      // ส่งข้อมูลที่อัปเดตกลับไปยังคอมโพเนนต์หลัก
      onSave({
        ...formData,
        birthdate: isoDate // เก็บวันเกิดในรูปแบบ ISO
      });
      
      onClose();
    } catch (err) {
      console.error("Error updating user data:", err);
      setError("ไม่สามารถอัปเดตข้อมูลได้ โปรดลองอีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-purple-800">แก้ไขโปรไฟล์</h2>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* ชื่อผู้ใช้ */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">ชื่อผู้ใช้ *</label>
          <input 
            type="text" 
            name="nickname" 
            className="border rounded-md px-3 py-2 w-full" 
            value={formData.nickname || ''} 
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        {/* ชื่อจริง - นามสกุล */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">ชื่อจริง *</label>
            <input 
              type="text" 
              name="firstName" 
              className="border rounded-md px-3 py-2 w-full" 
              value={formData.firstName || ''} 
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">นามสกุล *</label>
            <input 
              type="text" 
              name="lastName" 
              className="border rounded-md px-3 py-2 w-full" 
              value={formData.lastName || ''} 
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* วันเดือนปีเกิด */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">วันเดือนปีเกิด *</label>
          <div className="grid grid-cols-3 gap-4">
            <select 
              name="day" 
              className="border rounded-md px-3 py-2 w-full" 
              onChange={handleChange} 
              value={formData.day || "01"}
              disabled={isLoading}
            >
              {[...Array(31)].map((_, i) => (
                <option key={i} value={String(i + 1).padStart(2, "0")}>{i + 1}</option>
              ))}
            </select>
            <select 
              name="month" 
              className="border rounded-md px-3 py-2 w-full" 
              onChange={handleChange} 
              value={formData.month || "มกราคม"}
              disabled={isLoading}
            >
              {["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"].map((month, i) => (
                <option key={i} value={month}>{month}</option>
              ))}
            </select>
            <select 
              name="year" 
              className="border rounded-md px-3 py-2 w-full" 
              onChange={handleChange} 
              value={formData.year || (new Date().getFullYear() + 543 - 20).toString()}
              disabled={isLoading}
            >
              {[...Array(50)].map((_, i) => (
                <option key={i} value={String(2550 - i)}>{2550 - i}</option>
              ))}
            </select>
          </div>
        </div>

        {/* อีเมล */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">อีเมล *</label>
          <input 
            type="email" 
            name="email" 
            className="border rounded-md px-3 py-2 w-full bg-gray-100" 
            value={formData.email || ''} 
            onChange={handleChange}
            disabled={true} // ไม่อนุญาตให้เปลี่ยนอีเมล
            title="ไม่สามารถเปลี่ยนอีเมลได้"
          />
          <p className="text-xs text-gray-500 mt-1">ไม่สามารถเปลี่ยนอีเมลได้</p>
        </div>

        {/* เบอร์โทรศัพท์ */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">เบอร์โทรศัพท์ *</label>
          <input 
            type="text" 
            name="phone" 
            className="border rounded-md px-3 py-2 w-full" 
            value={formData.phone || ''} 
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        {/* ปุ่ม ยกเลิก & บันทึก */}
        <div className="flex justify-end gap-3 mt-6">
          <button 
            className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50" 
            onClick={onClose}
            disabled={isLoading}
          >
            ยกเลิก
          </button>
          <button 
            className="bg-purple-800 text-white px-4 py-2 rounded-md disabled:opacity-50 flex items-center justify-center"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังบันทึก...
              </>
            ) : "บันทึก"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PopupEditProfile;