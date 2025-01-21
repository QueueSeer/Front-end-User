import React, { useState, useEffect } from "react";
import UserInfo from "./UserInfo";
import Logout from "./Logout";
import Item from "./Item";

//หน้าที่ดึง API จาก Backend

const UserMenu = () => {
  const [userData, setUserData] = useState(null); // State สำหรับเก็บข้อมูล user
  const [loading, setLoading] = useState(true); // State สำหรับแสดงสถานะการโหลด

  useEffect(() => {
    // ดึงข้อมูลจาก API เมื่อ component ถูก mount
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }); // URL ของ API
        const data = await response.json(); // แปลง response เป็น JSON
        setUserData(data); // อัปเดต state ด้วยข้อมูลที่ได้จาก API
        setLoading(false); // ปิดสถานะการโหลด
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false); // แม้เกิด error ให้ปิดสถานะการโหลด
      }
    };

    fetchUserData();
  }, []); // ดึงข้อมูลเพียงครั้งเดียวเมื่อ mount

  // แสดงข้อความ Loading หากข้อมูลยังไม่มา
  if (loading) {
    return <div>Loading...</div>;
  }

  // ตรวจสอบว่าได้ข้อมูล userData แล้วหรือไม่
  if (!userData) {
    return <div>Error loading user data</div>;
  }

  return (
    <div
      className="z-50 my-2 px-6 text-base list-none rounded-3xl dark:bg-gray-700"
      id="user-dropdown"
    >
      {/* User Info */}
      <UserInfo
        name={userData.name} // ใช้ค่าจาก API
        // username={userData.username} // ใช้ค่าจาก API
        border={true} // Adds the bottom border
      />

      <Item />
      <Logout />
    </div>
  );
};

export default UserMenu;
