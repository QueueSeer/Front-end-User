import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserInfo from "./UserInfo";
import Logout from "./Logout";
import Item from "./Item";
import Images from "../../../assets";

// หน้าที่ดึง API จาก Backend
const UserMenu = ({ userData: propUserData }) => {
  const [userData, setUserData] = useState(propUserData || null); // รับข้อมูลจาก prop หรือเริ่มต้นเป็น null
  const [loading, setLoading] = useState(!propUserData); // ถ้ามี propUserData แล้วไม่ต้อง loading
  

  useEffect(() => {
    // ถ้ามี propUserData แล้ว ไม่ต้องเรียก API ใหม่
    if (propUserData) {
      setUserData(propUserData);
      setLoading(false);
      return;
    }

    // ดึงข้อมูลจาก API เมื่อ component ถูก mount และไม่มี propUserData
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://backend.qseer.app/api/user/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // สำหรับส่ง cookies
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [propUserData]); // ดึงข้อมูลเมื่อ propUserData เปลี่ยนแปลง

  // แสดงข้อความ Loading หากข้อมูลยังไม่มา
  if (loading) {
    return <div className="p-4 text-center">กำลังโหลด...</div>;
  }

  // ตรวจสอบว่าได้ข้อมูล userData แล้วหรือไม่
  if (!userData) {
    return <div className="p-4 text-center">ไม่สามารถโหลดข้อมูลผู้ใช้ได้</div>;
  }

  
const tokenAmount = userData?.coins || 0;

  return (
    <div
      className="z-50 my-2 text-base list-none rounded-3xl bg-white shadow-lg overflow-hidden"
      id="user-dropdown"
      style={{ minWidth: "300px" }}
    >
      {/* User Info */}
      <UserInfo
          name={userData.display_name || userData.name || "ผู้ใช้งาน"}
          username={userData.username || ""} // ถ้าไม่มี username ก็ไม่แสดง
          image={userData.image}
          border={true}
        />

      {/* ส่วนแสดงโทเคน - เปลี่ยนเป็นโชคคอยน์และใช้ไอคอนจาก Images */}
      <div className="border-b border-gray-200 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#E6DFF6] flex items-center justify-center mr-2">
              <img src={Images.chock} alt="โชคคอยน์" className="w-5 h-5" />
            </div>
            <span className="text-gray-700">โชคคอยน์</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl font-bold text-[#6A41AB] mr-2">{tokenAmount}</span>
            <Link to="/top-up-coins">
              <button className="w-8 h-8 rounded-full bg-[#E6DFF6] flex items-center justify-center text-[#6A41AB] hover:bg-[#D9CFF1]">
                <img src={Images.plus} alt="เพิ่ม" className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* รายการเมนู */}
      <Item />
      
      {/* ปุ่มออกจากระบบ */}
      <Logout />
    </div>
  );
};

export default UserMenu;