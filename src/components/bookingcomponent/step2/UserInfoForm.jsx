import React, { useEffect, useState } from "react";

const UserInfoForm = ({ formData, setFormData, loading, onValidationChange, requiredData = [] }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    birthDate: false,
    birthTime: false,
    status: false
  });

  // เช็คความถูกต้องของฟอร์ม
  const validateForm = (data) => {
    let newErrors = {};

    // ตรวจสอบข้อมูลที่จำเป็นตาม requiredData
    if (requiredData.includes("name")) {
      if (!data.firstName.trim() && touched.firstName) newErrors.firstName = "กรุณากรอกชื่อจริง";
      if (!data.lastName.trim() && touched.lastName) newErrors.lastName = "กรุณากรอกนามสกุล";
    }

    if (requiredData.includes("birthdate")) {
      if (!data.birthDate && touched.birthDate) {
        newErrors.birthDate = "กรุณากรอกวันเกิด";
      } else if (touched.birthDate && typeof data.birthDate === 'string' && 
                 data.birthDate.trim() !== "" && !/^\d{2}\/\d{2}\/\d{2}$/.test(data.birthDate)) {
        newErrors.birthDate = "รูปแบบวันที่ต้องเป็น DD/MM/YY";
      }
    }

    if (requiredData.includes("birthtime")) {
      if (!data.birthTime && touched.birthTime) {
        newErrors.birthTime = "กรุณากรอกเวลาเกิด";
      } else if (touched.birthTime && data.birthTime && !/^\d{2}:\d{2}$/.test(data.birthTime)) {
        newErrors.birthTime = "รูปแบบเวลาต้องเป็น HH:MM";
      }
    }

    if (requiredData.includes("email")) {
      if ((!data.email || !data.email.trim()) && touched.email) {
        newErrors.email = "กรุณากรอกอีเมล";
      } else if (touched.email && data.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
        newErrors.email = "กรุณากรอกอีเมลให้ถูกต้อง";
      }
    }

    if (requiredData.includes("status") && !data.status && touched.status) {
      newErrors.status = "กรุณาเลือกสถานะ";
    }

    // ถ้าไม่มี requiredData ให้ตรวจสอบข้อมูลพื้นฐาน
    if (requiredData.length === 0) {
      if (!data.firstName.trim() && touched.firstName) newErrors.firstName = "กรุณากรอกชื่อจริง";
      if (!data.lastName.trim() && touched.lastName) newErrors.lastName = "กรุณากรอกนามสกุล";
      if ((!data.email || !data.email.trim()) && touched.email) {
        newErrors.email = "กรุณากรอกอีเมล";
      } else if (touched.email && data.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
        newErrors.email = "กรุณากรอกอีเมลให้ถูกต้อง";
      }
    }

    setErrors(newErrors);
    
    // ส่งสถานะการตรวจสอบกลับไปยังคอมโพเนนต์หลัก (ถ้ามี)
    if (onValidationChange) {
      // ตรวจสอบความถูกต้องทั้งหมด โดยไม่สนใจว่า touched หรือไม่
      const realValidation = checkRealValidation(data);
      onValidationChange(realValidation);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  // ตรวจสอบความถูกต้องจริงของข้อมูล (ไม่สนใจ touched)
  const checkRealValidation = (data) => {
    // ตรวจสอบข้อมูลที่จำเป็นตาม requiredData
    if (requiredData.includes("name")) {
      if (!data.firstName.trim() || !data.lastName.trim()) return false;
    }

    if (requiredData.includes("birthdate")) {
      if (!data.birthDate) return false;
      if (typeof data.birthDate === 'string' && 
          data.birthDate.trim() !== "" && !/^\d{2}\/\d{2}\/\d{2}$/.test(data.birthDate)) {
        return false;
      }
    }

    if (requiredData.includes("birthtime")) {
      if (!data.birthTime) return false;
      if (data.birthTime && !/^\d{2}:\d{2}$/.test(data.birthTime)) return false;
    }

    if (requiredData.includes("email")) {
      if (!data.email || !data.email.trim()) return false;
      if (data.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) return false;
    }

    if (requiredData.includes("status") && !data.status) return false;

    // ถ้าไม่มี requiredData ให้ตรวจสอบข้อมูลพื้นฐาน
    if (requiredData.length === 0) {
      if (!data.firstName.trim() || !data.lastName.trim()) return false;
      if (!data.email || !data.email.trim()) return false;
      if (data.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) return false;
    }

    return true;
  };

  // ฟังก์ชันอัปเดตค่าในฟอร์ม
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    // บันทึกว่าฟิลด์นี้ถูกแตะต้องแล้ว
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // ส่งค่าไปที่คอมโพเนนต์แม่
    setFormData(name, newValue);

    // ตรวจสอบความถูกต้องของฟอร์ม
    validateForm({
      ...formData,
      [name]: newValue
    });
  };
  
  // ฟังก์ชันจัดการเฉพาะการกรอกวันที่ (DD/MM/YY)
  const handleDateChange = (e) => {
    let value = e.target.value;
    
    // บันทึกว่าฟิลด์นี้ถูกแตะต้องแล้ว
    setTouched(prev => ({
      ...prev,
      birthDate: true
    }));
    
    // กรองให้เหลือแต่ตัวเลขและเครื่องหมาย /
    value = value.replace(/[^\d/]/g, '');
    
    // จัดรูปแบบ DD/MM/YY
    if (value.length) {
      // ลบเครื่องหมาย / ทั้งหมดออกก่อน
      let digitsOnly = value.replace(/\//g, '');
      
      // จำกัดความยาวให้ไม่เกิน 6 ตัว (DDMMYY)
      digitsOnly = digitsOnly.slice(0, 6);
      
      // เพิ่มเครื่องหมาย / ตามตำแหน่ง
      if (digitsOnly.length > 0) {
        if (digitsOnly.length <= 2) {
          // ถ้ามีแค่ตัวเลขวันที่
          value = digitsOnly;
        } else if (digitsOnly.length <= 4) {
          // วันที่และเดือน
          value = digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2);
        } else {
          // วันที่ เดือน และปี
          value = digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2, 4) + '/' + digitsOnly.slice(4);
        }
      }
    }
    
    // ส่งค่าไปที่คอมโพเนนต์แม่
    setFormData("birthDate", value);
    
    // ตรวจสอบความถูกต้องของฟอร์ม
    validateForm({
      ...formData,
      birthDate: value
    });
  };
  
  // ฟังก์ชันจัดการเฉพาะการกรอกเวลา (HH:MM)
  const handleTimeChange = (e) => {
    let value = e.target.value;
    
    // บันทึกว่าฟิลด์นี้ถูกแตะต้องแล้ว
    setTouched(prev => ({
      ...prev,
      birthTime: true
    }));
    
    // กรองให้เหลือแต่ตัวเลขและเครื่องหมาย :
    value = value.replace(/[^\d:]/g, '');
    
    // จัดรูปแบบ HH:MM
    if (value.length) {
      // ลบเครื่องหมาย : ทั้งหมดออกก่อน
      let digitsOnly = value.replace(/:/g, '');
      
      // จำกัดความยาวให้ไม่เกิน 4 ตัว (HHMM)
      digitsOnly = digitsOnly.slice(0, 4);
      
      // เพิ่มเครื่องหมาย : ตามตำแหน่ง
      if (digitsOnly.length > 0) {
        if (digitsOnly.length <= 2) {
          // ถ้ามีแค่ตัวเลขชั่วโมง
          value = digitsOnly;
        } else {
          // ชั่วโมงและนาที
          value = digitsOnly.slice(0, 2) + ':' + digitsOnly.slice(2);
        }
      }
    }
    
    // ส่งค่าไปที่คอมโพเนนต์แม่
    setFormData("birthTime", value);
    
    // ตรวจสอบความถูกต้องของฟอร์ม
    validateForm({
      ...formData,
      birthTime: value
    });
  };

  // ส่งข้อมูลการตรวจสอบไปยังคอมโพเนนต์หลัก เมื่อโหลดข้อมูลเสร็จสิ้น
  useEffect(() => {
    if (!loading && formData) {
      // เมื่อข้อมูลถูกโหลดเสร็จแล้ว ให้ตรวจสอบความถูกต้องโดยไม่สนใจ touched
      if (onValidationChange) {
        const isValid = checkRealValidation(formData);
        onValidationChange(isValid);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, formData]);

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
            onBlur={() => setTouched(prev => ({ ...prev, firstName: true }))}
            className={`w-full p-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
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
            onBlur={() => setTouched(prev => ({ ...prev, lastName: true }))}
            className={`w-full p-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
        </div>
      )}

      {/* วันเกิด - ปรับให้ใช้ handleDateChange เพื่อจัดรูปแบบอัตโนมัติ */}
      {(shouldShowField("birthDate")) && (
        <div>
          <label className="text-gray-700 font-semibold">
            วันเกิด {requiredData.includes("birthdate") && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            name="birthDate"
            value={formatBirthdate(formData.birthDate)}
            onChange={handleDateChange}
            onBlur={() => setTouched(prev => ({ ...prev, birthDate: true }))}
            
            className={`w-full p-2 border ${errors.birthDate ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          />
          {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
          <p className="text-gray-500 text-xs mt-1">รูปแบบวันที่ วว/ดด/ปป (เช่น 08/04/45)</p>
        </div>
      )}

      {/* เวลาเกิด - ปรับให้ใช้ handleTimeChange เพื่อจัดรูปแบบอัตโนมัติ */}
      {(shouldShowField("birthTime")) && (
        <div>
          <label className="text-gray-700 font-semibold">
            เวลาเกิด {requiredData.includes("birthtime") && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            name="birthTime"
            value={formData.birthTime || ""}
            onChange={handleTimeChange}
            onBlur={() => setTouched(prev => ({ ...prev, birthTime: true }))}
           
            className={`w-full p-2 border ${errors.birthTime ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          />
          {errors.birthTime && <p className="text-red-500 text-sm">{errors.birthTime}</p>}
          <p className="text-gray-500 text-xs mt-1">รูปแบบเวลา ชช:นน (เช่น 08:45)</p>
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
            onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
            className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
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
            onBlur={() => setTouched(prev => ({ ...prev, status: true }))}
            className={`w-full p-2 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-md`}
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