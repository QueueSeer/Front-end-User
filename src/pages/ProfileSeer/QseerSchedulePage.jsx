import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import FullCalendarPage from "../../components/Profilecomponent/FullCalendarPage";
import ProfileCard from "../../components/Profilecomponent/ProfileCard";
import ActionButtons from "../../components/Profilecomponent/ActionButtons";
import ProfileTabs from "../../components/Profilecomponent/About/ProfileTabs";
import Navbar from "../../components/navbar/index"; // เรียกใช้ path ที่ถูกต้อง


const QseerSchedulePage = () => {
  const location = useLocation();

  // ✅ เพิ่ม useEffect เพื่อเลื่อนหน้ากลับด้านบนเมื่อเปลี่ยนหน้า
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const seer = location.state?.seer || {
    id: null, // เพิ่ม id เพื่อใช้กับ API
    profileImageUrl: "", 
    name: "ไม่พบข้อมูลหมอดู",
    category: "ไม่ระบุ",
    experience: "ไม่ระบุ",
    followers: 0,
    rating: 0
  };

  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>
    <div className="p-12 flex flex-col w-full gap-6 mt-20">
      {/* ส่วนบน: แบ่งซ้ายขวา */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ซ้าย: ProfileCard */}
        <div className="lg:w-1/2 w-full">
          <ProfileCard
            profileImageUrl={seer.profileImageUrl}
            name={seer.name}
            category={seer.category}
            experience={seer.experience}
            followers={seer.followers}
            rating={seer.rating}
            seerId={seer.id} // ส่ง id ไปให้ ProfileCard เพื่อใช้กับ API
          />
          <ActionButtons />
        </div>

        {/* ขวา: FullCalendarPage */}
        <div className="lg:w-1/2 w-full">
          <FullCalendarPage />
        </div>
      </div>

      {/* ส่วนล่าง: เต็มจอ */}
      <div className="w-full space-y-4">
        <ProfileTabs />
      </div>
    </div>
    </>
  );
};

export default QseerSchedulePage;