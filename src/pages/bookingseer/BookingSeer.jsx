import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar"; // เรียกใช้ path ที่ถูกต้อง
import BookingSteps from "../../components/bookingcomponent/BookingSteps";
import HeaderSection from "../../components/bookingcomponent/HeaderSection";
import FullCalendarPage from "../../components/bookingcomponent/FullCalendarPage";
import BackButton from "../../components/bookingcomponent/BackButton";
import NextButton from "../../components/bookingcomponent/NextButton";

const BookingSeer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [packageInfo, setPackageInfo] = useState(location.state?.packageInfo || null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [numQuestions, setNumQuestions] = useState(4);
  const [loading, setLoading] = useState(!packageInfo);
  const [error, setError] = useState(null);

  // 🟢 โหลด `packageInfo` จาก API ถ้าไม่มีค่าเข้ามา
  useEffect(() => {
    if (!packageInfo) {
      fetch("http://localhost:5000/api/package/1") // เปลี่ยนเป็น API จริงเมื่อพร้อม
        .then((response) => {
          if (!response.ok) throw new Error("โหลดแพ็กเกจล้มเหลว");
          return response.json();
        })
        .then((data) => {
          setPackageInfo(data);
          setNumQuestions(data.numQuestions || 4);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching package:", err);
          setError("ไม่สามารถโหลดแพ็กเกจได้");
          setLoading(false);
        });
    }
  }, [packageInfo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return <p className="text-center text-gray-500">กำลังโหลดแพ็กเกจ...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
    {/* Navbar ตรึงด้านบน */}
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <Navbar />
    </div>
      <div className="p-6 mt-8">
        <BackButton />
        <BookingSteps />
        <HeaderSection packageInfo={packageInfo} setNumQuestions={setNumQuestions} />

        <div className="w-full">
          <FullCalendarPage setSelectedDate={setSelectedDate} />
        </div>

        <div className="fixed bottom-4 right-4">
          <NextButton onClick={() => navigate("/bookingSeer2", { state: { packageInfo, selectedDate, numQuestions } })} />
        </div>
      </div>
      </>
  );
};

export default BookingSeer;
