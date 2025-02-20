import React from "react";

import Navbar from "../../components/navbar"; // เรียกใช้ path ที่ถูกต้อง
import Sidebar from "../../components/Sidebar"; // เรียกใช้ path ที่ถูกต้อง

import UserProfile from "./UserProfile"; // เรียกใช้ path ที่ถูกต้อง

export default function Profile() {
  return (
    <div>
      <Navbar /> {/* เรียกใช้ Navbar */}
      <div className="flex px-12 pt-12 gap-14">
        {/* Sidebar */}
        <div className="hidden lg:block w-72">
          <Sidebar />
        </div>
        {/* คอลัมน์ที่ 2 ใช้พื้นที่ที่เหลือ */}
        <div className="flex-1 pb-10">
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
