import React, { useState, useEffect } from "react";
import Images from "./../../assets";
import axios from "axios";

// กำหนด API Base URL อย่างชัดเจน
const API_BASE_URL = "https://backend.qseer.app";

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
  const [followerCount, setFollowerCount] = useState(parseInt(followers) || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // ตรวจสอบสถานะล็อกอินและอัปเดตสถานะการติดตามจาก local storage
  useEffect(() => {
    if (!seerId) return;

    const checkLoginStatus = async () => {
      try {
        // ตรวจสอบสถานะล็อกอิน
        const loginResponse = await axios.get(`${API_BASE_URL}/api/user/me`, {
          withCredentials: true
        });
        setIsLoggedIn(true);
        
        // พยายามดึงสถานะการติดตามจาก localStorage
        const followStateKey = `follow_state_${seerId}`;
        const savedFollowState = localStorage.getItem(followStateKey);
        
        if (savedFollowState === 'true') {
          console.log(`Found saved follow state for seer ${seerId}: following`);
          setIsFollowing(true);
        }
      } catch (error) {
        // ไม่ได้ล็อกอิน หรือมีข้อผิดพลาดอื่นๆ
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
        setIsFollowing(false);
        
        // ลบสถานะการติดตามใน localStorage เมื่อไม่ได้ล็อกอิน
        const followStateKey = `follow_state_${seerId}`;
        localStorage.removeItem(followStateKey);
      }
    };

    checkLoginStatus();
  }, [seerId]);

  // ฟังก์ชันสำหรับการล็อกอิน
  const handleLogin = () => {
    window.location.href = "/login";
  };

  // ฟังก์ชันสำหรับการติดตาม
  const handleFollow = async () => {
    if (!seerId || !isLoggedIn) {
      !isLoggedIn && handleLogin();
      return;
    }
    
    // ถ้ากำลังติดตามอยู่แล้ว ไม่ต้องเรียก API
    if (isFollowing) return;
    
    setIsLoading(true);
    
    try {
      // เรียก API ติดตามหมอดู
      await axios.post(`${API_BASE_URL}/api/user/me/follow/${seerId}`, {}, {
        withCredentials: true
      });
      
      // อัปเดตสถานะและบันทึกใน localStorage
      setIsFollowing(true);
      setFollowerCount(prev => parseInt(prev) + 1);
      
      // บันทึกสถานะการติดตามใน localStorage
      const followStateKey = `follow_state_${seerId}`;
      localStorage.setItem(followStateKey, 'true');
      
    } catch (error) {
      console.error("Error following:", error);
      
      if (error.response) {
        if (error.response.status === 401) {
          alert("กรุณาเข้าสู่ระบบก่อนดำเนินการติดตาม");
          setIsLoggedIn(false);
          handleLogin();
        } else if (error.response.status === 409) {
          // กรณีติดตามอยู่แล้ว แค่อัปเดต UI และ localStorage
          setIsFollowing(true);
          const followStateKey = `follow_state_${seerId}`;
          localStorage.setItem(followStateKey, 'true');
        } else {
          alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันสำหรับการเลิกติดตาม
  const handleUnfollow = async () => {
    if (!seerId || !isLoggedIn) return;
    
    setIsLoading(true);
    
    try {
      // เรียก API เลิกติดตามหมอดู
      await axios.delete(`${API_BASE_URL}/api/user/me/follow/${seerId}`, {
        withCredentials: true
      });
      setIsFollowing(false);
      setFollowerCount(prev => Math.max(0, parseInt(prev) - 1));
    } catch (error) {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  // ฟังก์ชันจัดการกดปุ่มติดตาม/เลิกติดตาม
  const handleFollowToggle = () => {
    if (isLoading) return;
    
    if (!isLoggedIn) {
      handleLogin();
      return;
    }
    
    if (isFollowing) {
      setShowConfirmation(true);
    } else {
      handleFollow();
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
            className={`border border-black px-4 py-1 rounded-lg font-medium transition-colors duration-300 
              ${isLoggedIn 
                ? (isFollowing ? 'bg-[#420F75] text-white' : 'bg-white text-black hover:bg-gray-100') 
                : 'bg-[#420F75] text-white'}
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={handleFollowToggle}
            disabled={isLoading}
          >
            {isLoading 
              ? "กำลังดำเนินการ..." 
              : (isLoggedIn 
                  ? (isFollowing ? "กำลังติดตาม" : "ติดตาม")
                  : "เข้าสู่ระบบเพื่อติดตาม")}
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

      {/* Confirmation Modal for Unfollowing */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-bold mb-4">ยกเลิกการติดตามหมอดู</h3>
            <p className="mb-6">คุณต้องการยกเลิกการติดตาม {name} ใช่หรือไม่?</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                onClick={() => setShowConfirmation(false)}
              >
                ยกเลิก
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={handleUnfollow}
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;