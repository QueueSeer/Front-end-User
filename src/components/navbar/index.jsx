// src/components/Navbar.jsx
import React from "react";
import UserProfile from "./NavbarProfile/Userprofile"; // Import ไฟล์ที่แยกออกมา
import Notification from "./NavbarNotification/Notification";
import Logonavbar from "./Logo/Logonavbar";
import Navbarmenu from "./NavbarMenu/Navbarmenu";

export default function Navbar() {
  return (
    <div className="navbar sticky top-0 w-full bg-base-100 shadow-md px-12 h-[68px] z-50">
      {/* โลโก้ */}
      <Logonavbar />

      <div className="space-x-5">
        {/* ลิงก์เมนู */}
        <Navbarmenu />

        {/* การแจ้งเตือน */}
        <Notification />

        {/* โปรไฟล์ผู้ใช้ */}
        <UserProfile />
      </div>
    </div>
  );
}
