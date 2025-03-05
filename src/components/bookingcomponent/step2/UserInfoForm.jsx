import React, { useState, useEffect } from "react";

const UserInfoForm = ({ formData, setFormData, loading, requiredData = [] }) => {
  const [errors, setErrors] = useState({});

  // เช็คความถูกต้องของฟอร์ม
  const validateForm = (data) => {
    let newErrors = {};

    // ตรวจสอบข้อมูลที่จำเป็นตาม requiredData
    if (requiredData.includes("name")) {
      if (!data.firstName.trim()) newErrors.firstName = "กรุณากรอกชื่อจริง";
      if (!data.lastName.trim()) newErrors.lastName = "กรุณากรอกนามสกุล";
    }

    if (requiredData.includes("birthdate")) {
      if (!data.birthDate) newErrors.birthDate = "กรุณากรอกวันเกิด";
      else if (typeof data.birthDate === 'string' && !/^\d{2}\/\d{2}\/\d{2}$/.test(data.birthDate)) {
        newErrors.birthDate = "รูปแบบวันที่ต้องเป็น DD/MM/YY";
      }
    }

    if (requiredData.includes("birthtime")) {
      if (!data.birthTime) newErrors.birthTime = "กรุณากรอกเวลาเกิด";
      else if (!/^\d{2}:\d{2}$/.test(data.birthTime)) {
        newErrors.birthTime = "รูปแบบเวลาต้องเป็น HH:MM";
      }
    }

    if (requiredData.includes("email")) {
      if (!data.email || !data.email.trim()) {
        newErrors.email = "กรุณากรอกอีเมล";
      } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
        newErrors.email = "กรุณากรอกอีเมลให้ถูกต้อง";
      }
    }

    if (requiredData.includes("status") && !data.status) {
      newErrors.status = "กรุณาเลือกสถานะ";
    }

    // ถ้าไม่มี requiredData ให้ตรวจสอบข้อมูลพื้นฐาน
    if (requiredData.length === 0) {
      if (!data.firstName.trim()) newErrors.firstName = "กรุณากรอกชื่อจริง";
      if (!data.lastName.trim()) newErrors.lastName = "กรุณากรอกนามสกุล";
      if (!data.email || !data.email.trim()) {
        newErrors.email = "กรุณากรอกอีเมล";
      } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
        newErrors.email = "กรุณากรอกอีเมลให้ถูกต้อง";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ฟังก์ชันอัปเดตค่าในฟอร์ม
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    // ส่งค่าไปที่คอมโพเนนต์แม่
    setFormData(name, newValue);

    // ตรวจสอบความถูกต้องของฟอร์ม
    validateForm({
      ...formData,
      [name]: newValue
    });
  };

  // แสดง loading skeleton ระหว่างโหลดข้อมูล
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl animate-pulse">
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // รูปแบบวันเกิดสำหรับแสดงผล
  const formatBirthdate = (birthdate) => {
    if (!birthdate) return "";
    if (typeof birthdate === 'string') return birthdate;
    
    if (birthdate instanceof Date) {
      const day = String(birthdate.getDate()).padStart(2, '0');
      const month = String(birthdate.getMonth() + 1).padStart(2, '0');
      const year = String(birthdate.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    }
    
    return "";
  };

  // ฟังก์ชันตรวจสอบว่าควรแสดงฟิลด์นี้หรือไม่
  const shouldShowField = (fieldName) => {
    // ถ้าไม่มี requiredData ให้แสดงฟิลด์ที่มีอยู่เดิม
    if (requiredData.length === 0) {
      return true;
    }

    // แปลงจาก fieldName เป็นชื่อที่ตรงกับใน requiredData
    const fieldMapping = {
      "firstName": "name",
      "lastName": "name",
      "birthDate": "birthdate",
      "birthTime": "birthtime",
      "email": "email",
      "status": "status"
    };

    return requiredData.includes(fieldMapping[fieldName]);
  };

  return (
    <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
      {/* ชื่อจริง */}
      {(shouldShowField("firstName")) && (
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
      )}

      {/* นามสกุล */}
      {(shouldShowField("lastName")) && (
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
      )}

      {/* วันเกิด */}
      {(shouldShowField("birthDate")) && (
        <div>
          <label className="text-gray-700 font-semibold">
            วันเกิด {requiredData.includes("birthdate") && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            name="birthDate"
            value={formatBirthdate(formData.birthDate)}
            onChange={handleChange}
            placeholder="08/04/45"
            className="w-full p-2 border rounded-md"
          />
          {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
        </div>
      )}

      {/* เวลาเกิด */}
      {(shouldShowField("birthTime")) && (
        <div>
          <label className="text-gray-700 font-semibold">
            เวลาเกิด {requiredData.includes("birthtime") && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            name="birthTime"
            value={formData.birthTime || ""}
            onChange={handleChange}
            placeholder="08:45"
            className="w-full p-2 border rounded-md"
          />
          {errors.birthTime && <p className="text-red-500 text-sm">{errors.birthTime}</p>}
        </div>
      )}

      {/* อีเมล */}
      {(shouldShowField("email")) && (
        <div>
          <label className="text-gray-700 font-semibold">
            อีเมล <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
      )}

      {/* สถานะ */}
      {(shouldShowField("status")) && (
        <div>
          <label className="text-gray-700 font-semibold">
            สถานะ {requiredData.includes("status") && <span className="text-red-500">*</span>}
          </label>
          <select
            name="status"
            value={formData.status || ""}
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
      )}

      {/* ส่วนการแจ้งเตือน */}
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