import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Fillterbar from "../../components/fillterbar";
import BookingSteps from "../../components/bookingcomponent/BookingSteps";
import HeaderSection from "../../components/bookingcomponent/HeaderSection";
import FullCalendarPage from "../../components/bookingcomponent/FullCalendarPage";
import BackButton from "../../components/bookingcomponent/BackButton";
import NextButton from "../../components/bookingcomponent/NextButton";

const BookingSeer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const packageInfo = location.state?.packageInfo;
  const [selectedDate, setSelectedDate] = useState(null);
  const [numQuestions, setNumQuestions] = useState(4); // 🔹 Mock ค่าเป็น 4

  useEffect(() => {
    window.scrollTo(0, 0); // ✅ เลื่อนกลับไปด้านบนทุกครั้งที่โหลด
  }, []);

  if (!packageInfo) {
    return <p>ไม่พบแพ็กเกจที่เลือก</p>;
  }

  return (
    <div>
      <Fillterbar />
      <div className="p-6">
        <BackButton />
        <BookingSteps />
        <HeaderSection packageInfo={packageInfo} setNumQuestions={setNumQuestions} />

        <div className="w-full">
          <FullCalendarPage setSelectedDate={setSelectedDate} />
        </div>

       
      </div>
    </div>
  );
};

export default BookingSeer;
