import React, { useState, useEffect } from "react";

const AboutUserProfile = ({ children }) => {
  const [aboutMe, setAboutMe] = useState(""); // เก็บข้อความเกี่ยวกับฉัน
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API
  const fetchUserDescription = async () => {
    try {
      const response = await fetch("http://localhost:3000/user"); // ดึงข้อมูลจาก API
      const data = await response.json(); // แปลงข้อมูล JSON
      setAboutMe(data.desciption); // ตั้งค่า description ที่ได้จาก API
      setLoading(false); // ปิดสถานะการโหลด
    } catch (error) {
      console.error("Error fetching user description:", error);
      setLoading(false);
    }
  };

  // เรียกฟังก์ชัน fetchUserDescription เมื่อคอมโพเนนต์ mount
  useEffect(() => {
    fetchUserDescription();
  }, []);

  // หากข้อมูลกำลังโหลด แสดงข้อความ Loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // ส่งข้อมูล aboutMe และฟังก์ชัน setAboutMe ผ่าน children
  return <>{children(aboutMe, setAboutMe)}</>;
};

export default AboutUserProfile;
