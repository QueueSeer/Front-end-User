import React, { useEffect, useState } from "react";
import { calculateTimeAgo } from "./timestampUtils"; // นำเข้า Utility
import { useNavigate  } from 'react-router-dom';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]); // เก็บข้อมูลการแจ้งเตือน
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const navigate  = useNavigate(); // กำหนด useHistory เพื่อใช้ในการนำทาง

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:3000/notifications");
        const data = await response.json();
        setNotifications(data); // บันทึกข้อมูลการแจ้งเตือนใน state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (id) => {
    // ใช้ navigate เพื่อไปยังหน้าใหม่
    navigate(`/notification/${id}`);
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (notifications.length === 0) {
    return <div>No notifications available.</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <ul>
        {notifications.map((noti) => (
          <li key={noti.id} className="flex items-start space-x-4 p-3 bg-white">
            <button
              onClick={() => handleNotificationClick(noti.id)} // ฟังก์ชันที่ต้องการให้ไปหน้าที่เกี่ยวข้อง
              className="flex items-start space-x-4 w-full text-left"
            >
              {/* รูปโปรไฟล์ */}
              <img
                src={noti.imageUrl}
                alt={noti.name}
                className="w-9 h-9 rounded-full object-cover"
                onError={(e) => (e.target.src = "/assets/images/default.png")} // รูปสำรอง
              />

              {/* ข้อมูลแจ้งเตือน */}
              <div>
                <p className="text-gray-800 text-sm">
                  <span className="font-semibold">{noti.name}:</span>{" "}
                  <span>{noti.text}</span>
                </p>
                <p className="text-gray-500 py-1 text-sm font-medium">
                  {calculateTimeAgo(noti.date_created)}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
