import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import SlotComponent from "./SlotComponent";
import NextButton from "./NextButton";

dayjs.locale("th");

const FullCalendarPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const packageInfo = location.state?.packageInfo;
  
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🟢 โหลดข้อมูลปฏิทินจาก API
  useEffect(() => {
    fetch("http://localhost:5000/api/calendar") // เปลี่ยนเป็น API จริงเมื่อพร้อม
      .then((response) => {
        if (!response.ok) throw new Error("โหลดข้อมูลปฏิทินล้มเหลว");
        return response.json();
      })
      .then((data) => {
        setCalendarData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching calendar:", err);
        // 🟢 ใช้ Mock Data ถ้า API ล้มเหลว
        setCalendarData([
          { date: "2025-01-14", status: "available" },
          { date: "2025-01-15", status: "full" },
          { date: "2025-01-16", status: "available" },
        ]);
        setLoading(false);
      });
  }, []);

  // ตรวจสอบว่าวันไหนเต็ม/ว่าง
  const getStatus = (date) => {
    const dayData = calendarData.find((item) => item.date === date.format("YYYY-MM-DD"));
    return dayData ? dayData.status : "available";
  };

  // เปลี่ยนเดือนที่แสดง
  const handleDateChange = (date) => {
    setCurrentDate(date.startOf("month"));
    setShowDropdown(false);
  };

  // เลือกวัน
  const handleSelectDate = (date) => {
    if (!dayjs().isAfter(date, "day") && getStatus(date) !== "full") {
      setSelectedDate(date);
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
                const isSelected = selectedDate && selectedDate.isSame(date, "day");

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
            <SlotComponent selectedDate={selectedDate} />
          </div>

          {/* ปุ่ม NextButton */}
          <div className="fixed bottom-4 right-4">
            <NextButton
              onClick={() => navigate("/bookingSeer2", { state: { packageInfo, selectedDate } })}
              disabled={!selectedDate}
              className="w-auto"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FullCalendarPage;
