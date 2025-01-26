import React from "react";
import FullCalendarPage from "../../components/Profilecomponent/FullCalendarPage";
import ProfileCard from "../../components/Profilecomponent/ProfileCard";
import ActionButtons from "../../components/Profilecomponent/ActionButtons";
import ProfileTabs from "../../components/Profilecomponent/About/ProfileTabs";

//import AboutSection from "../../components/Profilecomponent/About/AboutSection";
//import SocialLinks from "../../components/Profilecomponent/About/SocialLinks";
//import TagsSection from "../../components/Profilecomponent/About/TagsSection";

const QseerSchedulePage = ({ profileImageUrl, name, category, experience, followers, rating }) => {
  return (
    <div className="p-12 flex space-x-6">
      <div className="flex-1">
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

        {/* เพิ่มส่วน "เกี่ยวกับเรา", Social Links, และ แท็ก */}
        <ProfileTabs />
      </div>
      <div className="w-1/2">
        <FullCalendarPage />
      </div>
    </div>
  );
};

export default QseerSchedulePage;
