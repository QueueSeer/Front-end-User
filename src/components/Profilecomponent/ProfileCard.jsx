import React, { useState } from "react";
import Images from "./../../assets";

const ProfileCard = ({ profileImageUrl, name, category, experience, followers, rating }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center space-x-6 border border-gray-200">
      {/* Profile Image */}
      <div className="relative w-28 h-28 flex-shrink-0">
        <img src={profileImageUrl || Images.profile} alt="Profile" className="w-full h-full rounded-full border-4 border-white shadow-md" />
        <span className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></span>
      </div>
      {/* Profile Details */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Upper Section */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-black">{name}</h2>
            <p className="text-[#615E83] text-sm font-medium">{category}</p>
          </div>
          <button 
            className={`border border-black px-4 py-1 rounded-lg font-medium transition-colors duration-300 ${isFollowing ? 'bg-[#420F75] text-white' : 'bg-white text-black hover:bg-gray-100'}`}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? "กำลังติดตาม" : "ติดตาม"}
          </button>
        </div>
        <hr className="border-gray-300 my-2" />
        {/* Lower Section */}
        <div className="flex justify-between text-gray-700 font-medium text-center">
          <div className="flex flex-col">
            <span className="text-black text-lg font-semibold">{experience}</span>
            <span className="text-[#8677A7] text-sm font-medium">ประสบการณ์</span>
          </div>
          <div className="flex flex-col">
            <span className="text-black text-lg font-semibold">{followers}</span>
            <span className="text-[#8677A7] text-sm font-medium">ผู้ติดตาม</span>
          </div>
          <div className="flex flex-col">
            <span className="text-black text-lg font-semibold">{rating}</span>
            <span className="text-[#8677A7] text-sm font-medium">รีวิว</span>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfileCard.defaultProps = {
  name: "หมอดูเพียงฟ้า พาขวัญ",
  category: "ศาสตร์ไพ่ยิปซี",
  experience: "10+",
  followers: "0",
  rating: "0",
};

export default ProfileCard;
