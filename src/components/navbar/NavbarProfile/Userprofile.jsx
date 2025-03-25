import React, { useState, useRef, useEffect } from "react";
import UserMenu from "./UserMenu";
import md5 from "md5"; // ต้องติดตั้ง: npm install md5

export default function UserProfile() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // ฟังก์ชันสำหรับรับ Gravatar URL จากอีเมล
  const getGravatarUrl = (email) => {
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=mp&s=200`;
  };

  // ฟังก์ชันสำหรับรับ URL รูปโปรไฟล์ Google จากอีเมล Gmail
  const getGoogleProfileImage = (email) => {
    // ตรวจสอบว่าเป็นอีเมล Gmail หรือไม่
    if (email.endsWith('@gmail.com')) {
      return `https://lh3.googleusercontent.com/a/${btoa(email).replace(/=/g, '')}=s96-c`;
    }
    return null;
  };

  // ดึงข้อมูลผู้ใช้จาก API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://backend.qseer.app/api/user/me", {
          credentials: "include", // ส่ง cookies สำหรับการรับรองตัวตน
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ฟังก์ชันเปิด/ปิด dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // ฟังก์ชันปิด dropdown เมื่อคลิกนอก dropdown และปุ่มเปิด
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current && 
      !dropdownRef.current.contains(event.target) && 
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
  };

  // เพิ่ม event listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // กำหนดแหล่งที่มาของรูปโปรไฟล์
  const getProfileImage = () => {
    if (!userData) return null;
    
    // ลำดับความสำคัญ: 1) รูปจาก API 2) รูปจาก Google 3) รูปจาก Gravatar
    if (userData.image) {
      return userData.image;
    } else if (userData.email) {
      // ลองดึงรูปจาก Google สำหรับอีเมล Gmail
      const googleImage = getGoogleProfileImage(userData.email);
      if (googleImage) {
        return googleImage;
      }
      // ถ้าไม่ใช่ Gmail หรือไม่มีรูปจาก Google ให้ใช้ Gravatar
      return getGravatarUrl(userData.email);
    }
    
    return null;
  };

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        ref={buttonRef}
        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        id="user-menu-button"
        aria-expanded={isDropdownOpen ? "true" : "false"}
        onClick={toggleDropdown}
      >
        <span className="sr-only">Open user menu</span>
        {loading || error ? (
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        ) : (
          <img
            className="w-8 h-8 rounded-full"
            src={getProfileImage()}
            alt={userData?.display_name || "User profile"}
            onError={(e) => {
              // กรณีโหลดรูปไม่สำเร็จ ให้ใช้ Gravatar แทน
              e.target.src = getGravatarUrl(userData?.email || "");
            }}
          />
        )}
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-10 right-0 z-50 bg-white shadow-lg rounded-3xl"
          style={{ minWidth: "300px" }}
        >
          <UserMenu userData={userData} />
        </div>
      )}
    </div>
  );
}