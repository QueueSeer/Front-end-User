import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

const SlotComponent = ({ selectedDate, setSelectedTime }) => { 
  if (!selectedDate) return null; 

  const [availableSlots, setAvailableSlots] = useState([]); // เวลาว่างจาก API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTime, setLocalSelectedTime] = useState(null);
  const [timePeriod, setTimePeriod] = useState("morning"); // ค่าเริ่มต้นเป็นช่วงเช้า

  const location = useLocation();
  const seerId = location.state?.seerId || 1; // ค่าเริ่มต้นเป็น 1
  const packageId = location.state?.packageId || 1; // ค่าเริ่มต้นเป็น 1

  // 🟢 โหลดเวลาที่ว่างจาก API
  useEffect(() => {
    if (!selectedDate || !selectedDate.isValid()) return;
  
    const startDate = selectedDate.format("YYYY-MM-DD");
    const endDate = startDate;
  
    fetch(`https://backend.qseer.app/api/seer/${seerId}/package/fortune/${packageId}/time-slots?start_date=${startDate}&end_date=${endDate}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("โหลดเวลาที่ว่างล้มเหลว");
        return response.json();
      })
      .then((data) => {
        console.log("เวลาที่ว่างจาก API:", data); // ✅ Debug
  
        // 🔹 แปลง `start_time` เป็น HH:mm อย่างถูกต้อง
        const slots = data.map(slot => {
          const formattedTime = dayjs(slot.start_time).format("HH:mm");
          console.log("🔹 เวลาที่แปลงแล้ว:", formattedTime); // ✅ Debug
          return formattedTime;
        });
  
        setAvailableSlots(slots);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching time slots:", err);
        setLoading(false);
      });
  }, [selectedDate, seerId, packageId]);
  
  

  // 🟢 ฟังก์ชันเลือกเวลา
  const handleSelectTime = (time) => {
    setLocalSelectedTime(time);
    setSelectedTime(time); // ✅ ส่งค่าไปให้ `FullCalendarPage`
  };

  // 🔹 แยกเวลาว่างเป็นช่วงเช้าและช่วงบ่าย
  const morningSlots = availableSlots.filter(time => time >= "09:00" && time < "12:00");
  const afternoonSlots = availableSlots.filter(time => time >= "13:00" && time < "16:00");

  return (
    <div className="w-[650px] mt-5">
      {/* ปุ่มเลือกช่วงเวลา */}
      <div className="flex items-center space-x-6 mb-4">
        {morningSlots.length > 0 && (
          <button
            className={`flex items-center space-x-2 ${timePeriod === "morning" ? "text-[#6B5B95] font-semibold" : "text-gray-500"}`}
            onClick={() => setTimePeriod("morning")}
          >
            <div className={`w-4 h-4 rounded-full ${timePeriod === "morning" ? "bg-[#6B5B95]" : "bg-gray-300"}`}></div>
            <span>ช่วงเช้า</span>
          </button>
        )}

        {afternoonSlots.length > 0 && (
          <button
            className={`flex items-center space-x-2 ${timePeriod === "afternoon" ? "text-[#6B5B95] font-semibold" : "text-gray-500"}`}
            onClick={() => setTimePeriod("afternoon")}
          >
            <div className={`w-4 h-4 rounded-full ${timePeriod === "afternoon" ? "bg-[#6B5B95]" : "bg-gray-300"}`}></div>
            <span>ช่วงบ่าย</span>
          </button>
        )}
      </div>

      {/* แสดงสถานะโหลดข้อมูล */}
      {loading ? (
        <p className="text-center text-gray-500">กำลังโหลดข้อมูลเวลา...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-4 gap-3 mt-5">
          {(timePeriod === "morning" ? morningSlots : afternoonSlots).map((time) => (
            <button
              key={time}
              className={`px-6 py-2 border rounded-full text-center transition ${
                selectedTime === time
                  ? "bg-[#420F75] text-white" // เวลาที่เลือก (ม่วง)
                  : "text-gray-700 border-gray-300 hover:bg-gray-100" // เวลาที่ยังว่าง
              }`}
              onClick={() => handleSelectTime(time)} // ✅ ใช้ฟังก์ชันที่ถูกต้อง
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlotComponent;
