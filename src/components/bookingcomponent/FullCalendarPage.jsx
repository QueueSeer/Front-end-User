import "dayjs/locale/th";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import NextButton from "./NextButton";
import SlotComponent from "./SlotComponent";
import dayjs from "dayjs";

dayjs.locale("th");

const FullCalendarPage = ({ selectedDate, setSelectedDate, selectedTime, setSelectedTime }) => { 


  const navigate = useNavigate();
  const location = useLocation();
  const packageInfo = location.state?.packageInfo;
  
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [calendarData, setCalendarData] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🟢 โหลดข้อมูลปฏิทินจาก API
  useEffect(() => {
    const fetchSeerCalendar = async () => {
      try {
        const response = await fetch("https://backend.qseer.app/api/seer/1/calendar", {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        });
  
        if (!response.ok) throw new Error("โหลดตารางเวลาหมอดูล้มเหลว");
  
        const data = await response.json();
  
        // 🔹 แปลงข้อมูล `schedules` ให้เป็นวันที่ของเดือนปัจจุบัน
        const schedules = data.schedules.map((schedule) => {
          const today = dayjs().startOf("week"); // วันอาทิตย์ของสัปดาห์นี้
          return {
            date: today.add(schedule.day, "day").format("YYYY-MM-DD"),
            startTime: schedule.start_time,
            endTime: schedule.end_time,
            status: "available",
          };
        });
  
        // 🔹 จัดรูปแบบวันหยุด (day_offs)
        const dayOffs = data.day_offs.map((dayOff) => ({
          date: dayOff,
          status: "full",
        }));
  
        setCalendarData([...schedules, ...dayOffs]); // รวมวันทำงานกับวันหยุด
        console.log(calendarData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching seer calendar:", err);
        setLoading(false);
      }
    };
  
    fetchSeerCalendar();
  }, []);
  

  // ตรวจสอบว่าวันไหนเต็ม/ว่าง
  const getStatus = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    const dayOfWeek = date.day(); // ได้ค่า 0-6 (อาทิตย์ - เสาร์)
  
    const availableDay = calendarData.find((item) => item.date === formattedDate || item.day === dayOfWeek);
    return availableDay ? availableDay.status : "full"; // ถ้าไม่มีวันนั้นถือว่าเต็ม
  };
  

  // เปลี่ยนเดือนที่แสดง
  const handleDateChange = (date) => {
    setCurrentDate(date.startOf("month"));
    setShowDropdown(false);
  };

  // เลือกวัน
  const handleSelectDate = (date) => {
    if (!dayjs().isAfter(date, "day") && getStatus(date) === "available") {
      setSelectedDate(dayjs(date).startOf("day")); // ✅ ใช้ startOf("day") ป้องกันปัญหาเวลา
    }
  };
  
  

  return (
    <div className="flex flex-col items-center mb-6">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="relative bg-white border border-gray-200 rounded-lg p-6 shadow-md min-h-[480px] w-[650px]">
          {/* Header เลือกเดือน-ปี */}
          <div className="flex items-center justify-center gap-5 mb-8">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 border-none bg-transparent text-[#615E83] text-lg font-semibold focus:outline-none"
              >
                {currentDate.format("MMMM YYYY")}
                <span className="text-sm">▼</span>
              </button>
              {showDropdown && (
                <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                  <DateCalendar 
                    value={currentDate} 
                    onChange={handleDateChange} 
                    views={["year", "month"]} 
                    openTo="month" 
                  />
                </div>
              )}
            </div>
          </div>

          {/* คำอธิบายสถานะ */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 text-sm text-gray-700">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span>ว่าง</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              <span>เต็ม</span>
            </div>
          </div>

          {/* ตารางวัน */}
          {loading ? (
            <p className="text-center text-gray-500">กำลังโหลดข้อมูลปฏิทิน...</p>
          ) : (
            <div className="grid grid-cols-7 text-center pl-4">
              {Array.from({ length: currentDate.startOf("month").day() }).map((_, index) => (
                <div key={`empty-${index}`} className="w-12 h-12"></div>
              ))}
              {Array.from({ length: currentDate.daysInMonth() }, (_, index) => {
                const day = index + 1;
                const date = currentDate.date(day);
                const status = getStatus(date);
                const isPast = dayjs().isAfter(date, "day");
                const isSelected = selectedDate && selectedDate.isSame(date, "day"); // ✅ ป้องกัน error


                return (
                  <div key={day} className="relative flex flex-col items-center justify-center w-14 h-14 cursor-pointer">
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center z-0">
                        <span className="w-12 h-12 border-2 border-[#420F75] rounded-full"></span>
                      </span>
                    )}
                    <span
                      className={`relative w-10 h-10 flex items-center justify-center rounded-full transition ${
                        isPast ? "text-gray-500 cursor-default" : "text-gray-800 hover:border-gray-400"
                      }`}
                      onClick={() => handleSelectDate(date)}
                    >
                      {day}
                      {!isPast && status !== "full" && (
                        <span className="absolute bottom-0 w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </LocalizationProvider>

      {selectedDate && (
  <>
    <div className="mt-6">
      <SlotComponent 
        selectedDate={selectedDate} 
        setSelectedTime={setSelectedTime}  // ✅ ส่งไปให้ SlotComponent
      />
    </div>

    {/* ปุ่ม NextButton */}
    <div className="fixed bottom-4 right-4">
      <NextButton
        onClick={() => navigate("/bookingSeer2", { state: { packageInfo, selectedDate, selectedTime } })} // ✅ เพิ่ม selectedTime
        disabled={!selectedDate || !selectedTime} // ✅ ป้องกันการกดถ้าไม่ได้เลือกเวลา
        className="w-auto"
      />
    </div>
  </>
)}

    </div>
  );
};

export default FullCalendarPage;
