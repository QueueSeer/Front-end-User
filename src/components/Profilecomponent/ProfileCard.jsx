import React, { useState, useEffect } from "react";
import Images from "./../../assets";
import axios from "axios";

const ProfileCard = ({ 
  profileImageUrl = null, 
  name = "หมอดูเพียงฟ้า พาขวัญ", 
  category = "ศาสตร์ไพ่ยิปซี", 
  experience = "10+", 
  followers = "0", 
  rating = "0", 
  seerId = null 
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(followers);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already following this seer when component mounts
  useEffect(() => {
    // You might need an API endpoint to check if the user is following a specific seer
    // This is a placeholder - you would need to implement this endpoint on your backend
    const checkFollowStatus = async () => {
      try {
        // Example API call to get user's followed seers
        const response = await axios.get("/api/user/me/follows");
        // Check if current seer is in the list of followed seers
        const isAlreadyFollowing = response.data.some(follow => follow.seer_id === seerId);
        setIsFollowing(isAlreadyFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    if (seerId) {
      checkFollowStatus();
    }
  }, [seerId]);

  const handleFollowToggle = async () => {
    if (!seerId) {
      console.error("No seer ID provided");
      return;
    }

    setIsLoading(true);

    try {
      if (isFollowing) {
        // Unfollow the seer
        await axios.delete(`/api/user/me/follow/${seerId}`);
        setFollowerCount(prev => Math.max(0, prev - 1));
      } else {
        // Follow the seer
        await axios.post(`/api/user/me/follow/${seerId}`);
        setFollowerCount(prev => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
      
      // Handle specific error cases
      if (error.response) {
        if (error.response.status === 401) {
          alert("กรุณาเข้าสู่ระบบก่อนดำเนินการ");
        } else if (error.response.status === 404) {
          alert("ไม่พบข้อมูลหมอดู");
        } else {
          alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            className={`border border-black px-4 py-1 rounded-lg font-medium transition-colors duration-300 ${isFollowing ? 'bg-[#420F75] text-white' : 'bg-white text-black hover:bg-gray-100'} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={handleFollowToggle}
            disabled={isLoading}
          >
            {isLoading ? "กำลังดำเนินการ..." : (isFollowing ? "กำลังติดตาม" : "ติดตาม")}
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
            <span className="text-black text-lg font-semibold">{followerCount}</span>
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

// Default parameters are now defined directly in the function signature above

export default ProfileCard;