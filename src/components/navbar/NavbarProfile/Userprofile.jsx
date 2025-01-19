import React, { useState, useRef, useEffect } from "react";
import UserMenu from "./UserMenu"; // เมนูสำหรับ dropdown

export default function UserProfile() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // จัดการ dropdown
  const [profileImage, setProfileImage] = useState(null); // เก็บ URL รูปโปรไฟล์
  const [loading, setLoading] = useState(true); // สถานะการโหลดรูปภาพ
  const [error, setError] = useState(false); // สถานะข้อผิดพลาด
  const dropdownRef = useRef(null); // ตรวจจับคลิกนอก dropdown
  const buttonRef = useRef(null); // อ้างอิงปุ่มที่ใช้เปิด dropdown

  // ดึง URL รูปภาพจาก API
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch("http://localhost:3000/user"); // URL ของ API ที่คืนค่ารูปภาพ
        if (!response.ok) {
          throw new Error("Failed to fetch profile image");
        }
        const data = await response.json(); // API คาดว่าจะส่ง JSON ที่มีฟิลด์ `imageUrl`
        setProfileImage(data.imageUrl); // เก็บ URL รูปภาพใน state
        setLoading(false); // ปิดสถานะการโหลด
      } catch (err) {
        console.error(err);
        setError(true); // เกิดข้อผิดพลาด
        setLoading(false); // ปิดสถานะการโหลด
      }
    };

    fetchProfileImage();
  }, []); // โหลดข้อมูลเมื่อ component ถูก mount

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

  // เพิ่ม event listener เมื่อ component mount และลบเมื่อ unmount
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        ref={buttonRef} // อ้างอิงปุ่มใน useRef
        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        id="user-menu-button"
        aria-expanded={isDropdownOpen ? "true" : "false"}
        onClick={toggleDropdown}
      >
        <span className="sr-only">Open user menu</span>
        {loading || error ? ( // หากยังโหลดอยู่หรือเกิดข้อผิดพลาด
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div> // แสดงวงกลมสีเทา
        ) : (
          <img
            className="w-8 h-8 rounded-full"
            src={profileImage} // ใช้ URL จาก API
            alt="profile"
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
          <UserMenu />
        </div>
      )}
    </div>
  );
}
