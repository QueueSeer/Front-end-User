import React, { useState } from "react";

const UserInfoForm = ({ onValidationChange }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    birthTime: "",
    email: "",
    status: "",
    notifyByEmail: false, // ✅ เพิ่ม state การแจ้งเตือน
  });

  const [errors, setErrors] = useState({});

  // เช็คว่าใส่ข้อมูลถูกต้องหรือไม่
  const validateForm = (data) => {
    let newErrors = {};

    if (!data.firstName.trim()) newErrors.firstName = "กรุณากรอกชื่อจริง";
    if (!data.lastName.trim()) newErrors.lastName = "กรุณากรอกนามสกุล";

    // ตรวจสอบรูปแบบวันเกิด (DD/MM/YY)
    if (!/^\d{2}\/\d{2}\/\d{2}$/.test(data.birthDate)) {
      newErrors.birthDate = "รูปแบบวันที่ต้องเป็น DD/MM/YY";
    }

    // ตรวจสอบรูปแบบเวลาเกิด (HH:MM)
    if (data.birthTime && !/^\d{2}:\d{2}$/.test(data.birthTime)) {
      newErrors.birthTime = "รูปแบบเวลาต้องเป็น HH:MM";
    }

    // ตรวจสอบรูปแบบอีเมล
    if (data.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
      newErrors.email = "กรุณากรอกอีเมลให้ถูกต้อง";
    }

    if (!data.status) newErrors.status = "กรุณาเลือกสถานะ";

    setErrors(newErrors);
    onValidationChange(Object.keys(newErrors).length === 0);
  };

  // ฟังก์ชันอัปเดตค่าในฟอร์ม
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value, // ✅ อัปเดตค่า Checkbox
    };
    setFormData(updatedFormData);
    validateForm(updatedFormData);
  };

  return (
    <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
      {/* ชื่อจริง */}
      <div>
        <label className="text-gray-700 font-semibold">
          ชื่อจริง <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
      </div>

      {/* นามสกุล */}
      <div>
        <label className="text-gray-700 font-semibold">
          นามสกุล <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
      </div>

      {/* วันเกิด */}
      <div>
        <label className="text-gray-700 font-semibold">
          วันเกิด <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          placeholder="08/04/45"
          className="w-full p-2 border rounded-md"
        />
        {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
      </div>

      {/* เวลาเกิด */}
      <div>
        <label className="text-gray-700 font-semibold">เวลาเกิด</label>
        <input
          type="text"
          name="birthTime"
          value={formData.birthTime}
          onChange={handleChange}
          placeholder="08:45"
          className="w-full p-2 border rounded-md"
        />
        {errors.birthTime && <p className="text-red-500 text-sm">{errors.birthTime}</p>}
      </div>

      {/* อีเมล */}
      <div>
        <label className="text-gray-700 font-semibold">อีเมล</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* สถานะ */}
      <div>
        <label className="text-gray-700 font-semibold">
          สถานะ <span className="text-red-500">*</span>
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="">เลือกสถานะ</option>
          <option value="single">โสด</option>
          <option value="married">แต่งงาน</option>
          <option value="in_relationship">มีคู่</option>
        </select>
        {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
      </div>

      {/* ✅ ส่วนการแจ้งเตือนผ่านอีเมล */}
      <div className="col-span-2">
        <label className="text-gray-700 font-semibold">การแจ้งเตือน</label>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            name="notifyByEmail"
            checked={formData.notifyByEmail}
            onChange={handleChange}
            className="w-5 h-5 mr-2"
          />
          <label className="text-gray-700">Email</label>
        </div>
        <p className="text-gray-500 text-sm">สำหรับผู้ที่ต้องการรับการแจ้งเตือนผ่านทางอีเมล</p>
      </div>
    </div>
  );
};

export default UserInfoForm;
