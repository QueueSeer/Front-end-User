import React from "react";
import FullCalendarPage from "../../components/Profilecomponent/FullCalendarPage";
import ProfileCard from "../../components/Profilecomponent/ProfileCard";
import ActionButtons from "../../components/Profilecomponent/ActionButtons";
import ProfileTabs from "../../components/Profilecomponent/About/ProfileTabs";

const QseerSchedulePage = ({ profileImageUrl, name, category, experience, followers, rating }) => {
  return (
    <div className="p-12 flex flex-col w-full gap-6">
      {/* ส่วนบน: แบ่งซ้ายขวา */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ซ้าย: ProfileCard */}
        <div className="lg:w-1/2 w-full">
          <ProfileCard
            profileImageUrl={profileImageUrl}
            name={name}
            category={category}
            experience={experience}
            followers={followers}
            rating={rating}
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
  );
};

export default QseerSchedulePage;
