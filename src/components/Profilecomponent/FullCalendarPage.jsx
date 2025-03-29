import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import Images from "../../assets";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import axios from "axios";

dayjs.locale("th");

const API_BASE_URL = "https://backend.qseer.app";

const FullCalendarPage = ({ seerId }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [calendarData, setCalendarData] = useState({
    schedules: [],
    day_offs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // ดึงข้อมูลตารางเวลาและวันหยุดของหมอดู
  const fetchCalendarData = async (date) => {
    if (!seerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // API เรียกใช้โดยไม่ต้องส่งพารามิเตอร์เดือนและปี เพราะเป็นตารางประจำสัปดาห์
      const response = await axios.get(`${API_BASE_URL}/api/seer/${seerId}/calendar`);
      
      console.log("Calendar data from API:", response.data);
      
      // หา booked_dates จากแหล่งข้อมูลอื่นถ้ามี
      // สมมติว่าต้องเรียก API อื่นเพื่อดูวันที่จองเต็ม (ถ้ามี)
      let bookedDates = [];
      try {
        // ถ้ามี API สำหรับรายการจองที่เต็ม ให้เรียกตรงนี้
        // const bookingsResponse = await axios.get(`${API_BASE_URL}/api/seer/${seerId}/bookings`);
        // bookedDates = bookingsResponse.data.full_dates || [];
      } catch (bookingErr) {
        console.error("Error fetching bookings:", bookingErr);
      }
      
      // รวมข้อมูลจากทั้งสองแหล่ง
      setCalendarData({
        ...response.data,
        booked_dates: bookedDates
      });
      
      setError(null);
    } catch (err) {
      console.error("Error fetching calendar data:", err);
      setError("ไม่สามารถโหลดข้อมูลตารางเวลาได้");
    } finally {
      setLoading(false);
    }
  };

  // เรียกข้อมูลเมื่อ component โหลดหรือเมื่อ seerId หรือ currentDate เปลี่ยน
  useEffect(() => {
    fetchCalendarData(currentDate);
  }, [seerId, currentDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // ตรวจสอบว่าวันนั้นเป็นวันว่าง วันเต็ม หรือวันหยุด
  const getStatus = (date) => {
    const dayString = date.format("YYYY-MM-DD");
    
    // ตรวจสอบว่าเป็นวันหยุดหรือไม่
    if (calendarData.day_offs && calendarData.day_offs.includes(dayString)) {
      return "holiday";
    }
    
    // แปลงวันเป็นเลข 0-6 (0=จันทร์, 6=อาทิตย์) ตามฟอร์แมตของ API
    let dayNumber = date.day(); // 0=อาทิตย์, 1=จันทร์, ...
    // แปลงวันให้ตรงกับฟอร์แมตของ API (0=จันทร์, 6=อาทิตย์)
    if (dayNumber === 0) {
      dayNumber = 6; // อาทิตย์ = 6
    } else {
      dayNumber = dayNumber - 1; // จันทร์(1) เป็น 0, อังคาร(2) เป็น 1, ...
    }
    
    // ตรวจสอบว่าวันนั้นมีในตารางการทำงานหรือไม่
    const daySchedule = calendarData.schedules && calendarData.schedules.find(schedule => 
      schedule.day === dayNumber
    );
    
    if (daySchedule) {
      // ตรวจสอบว่าวันนี้มีการจองเต็มหรือไม่
      if (calendarData.booked_dates && calendarData.booked_dates.includes(dayString)) {
        return "full";
      }
      return "available";
    }
    
    // ถ้าไม่อยู่ในตารางการทำงาน ให้ถือว่าเป็นวันหยุด
    return "holiday";
  };

  const handleDateChange = (date) => {
    setCurrentDate(date.startOf("month"));
    // ไม่ต้อง fetch ที่นี่เพราะการเปลี่ยน currentDate จะทำให้ useEffect ทำงาน
    setShowDropdown(false);
  };

  return (
    <div className="mb-6">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="mb-6">
          <div className="relative bg-white border border-gray-200 rounded-lg p-6 shadow-md min-h-[390px]">
            {/* Header เลือกเดือน-ปี */}
            <div className="flex items-center justify-center gap-5 mb-8">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 border-none bg-transparent text-[#615E83] text-lg font-semibold focus:outline-none"
                >
                  {`${currentDate.format("MMMM YYYY")}`}
                  <span className="text-sm">▼</span>
                </button>
                {showDropdown && (
                  <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <DateCalendar value={currentDate} onChange={handleDateChange} views={["year", "month"]} openTo="month" />
                  </div>
                )}
              </div>
            </div>

            {/* คำอธิบายสถานะในมุมขวา */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span>ว่าง</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span>เต็ม</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-gray-200 rounded-full mr-2"></span>
                <span>วันหยุด</span>
              </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                <div className="text-red-500 text-center p-4">
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Days Header */}
            <div className="grid grid-cols-7 text-center">
              {["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."].map((day, index) => (
                <div key={index} className="text-[#8677A7] text-sm font-medium flex items-center justify-center h-10">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 text-center">
              {/* ช่องว่างก่อนวันที่ 1 ของเดือน */}
              {Array.from({ length: currentDate.startOf("month").day() }).map((_, index) => (
                <div key={`empty-${index}`} className="w-10 h-10"></div>
              ))}
              {/* วันที่ในเดือน */}
              {Array.from({ length: currentDate.daysInMonth() }, (_, index) => {
                const day = index + 1;
                const date = currentDate.date(day);
                const status = getStatus(date);
                const isFutureDate = date.isAfter(dayjs().subtract(1, 'day'));

                return (
                  <div key={day} className="relative flex flex-col items-center justify-center w-12 h-12 ml-5">
                    {/* วันที่ */}
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        !isFutureDate
                          ? "text-gray-300" // วันในอดีต
                          : status === "holiday"
                          ? "text-gray-400" // ตัวหนังสือสีเทา ถ้าเป็นวันหยุด
                          : "text-gray-800" // ตัดวงกลมสีม่วงสำหรับวันนี้ออกตามที่ต้องการ
                      }`}
                    >
                      {day}
                    </span>
                    {/* วงกลมสีสถานะใต้วันที่ (ไม่แสดงถ้าเป็นวันหยุดหรือวันในอดีต) */}
                    {isFutureDate && status !== "holiday" && status === "available" && (
                      <span className="absolute bottom-0 w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                    {isFutureDate && status !== "holiday" && status === "full" && (
                      <span className="absolute bottom-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default FullCalendarPage;