import React from "react";
import FullCalendarPage from "../../components/Profilecomponent/FullCalendarPage";
import ProfileCard from "../../components/Profilecomponent/ProfileCard";
import ActionButtons from "../../components/Profilecomponent/ActionButtons";
import ProfileTabs from "../../components/Profilecomponent/About/ProfileTabs";

const QseerSchedulePage = ({ profileImageUrl, name, category, experience, followers, rating }) => {
  return (
    <div className="p-12 flex flex-wrap lg:flex-nowrap gap-6 w-full">
      <div className="flex-1 w-full">
        <ProfileCard
          profileImageUrl={profileImageUrl}
          name={name}
          category={category}
          experience={experience}
          followers={followers}
          rating={rating}
        />
        <div className="mt-6 space-y-4">
          <ActionButtons />
        </div>

       
        <div className="w-full">
          <ProfileTabs />
        </div>
      </div>

      {/* ให้ FullCalendarPage ไม่บีบ ProfileTabs */}
     
        <FullCalendarPage />
     
    </div>
  );
};

export default QseerSchedulePage;
