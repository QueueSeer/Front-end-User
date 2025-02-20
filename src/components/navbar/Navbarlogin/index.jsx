import React, { useEffect, useState } from "react";
import Logonavbar from "../Logo/Logonavbar";


import { Link } from "react-router-dom";

export default function Navbarlogin() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(matchMedia.matches);

    const handleChange = (e) => setIsDarkMode(e.matches);
    matchMedia.addEventListener("change", handleChange);

    return () => matchMedia.removeEventListener("change", handleChange);
  }, []);

  return (
    <div
    className={`navbar sticky top-0 w-full shadow-md px-12 h-[68px] z-50 ${
      isDarkMode ? "bg-gray-900 text-white" : "bg-base-100 text-gray-800"
      }`}
    >
      {/* โลโก้และชื่อโปรเจกต์ */}
      <div className="flex-1 flex items-center gap-2">
      <Logonavbar />
      
      </div>

      {/* ลิงก์เมนู */}
      <div className="hidden lg:flex flex-none">
        <ul className="menu menu-horizontal gap-1 text-[16px]">
          <li>
            <a
              href="#home"
              className={isDarkMode ? "text-white" : "text-gray-800"}
            >
              หน้าหลัก
            </a>
          </li>
          <li>
            <a
              href="#packages"
              className={isDarkMode ? "text-white" : "text-gray-800"}
            >
              แพ็กเกจ
            </a>
          </li>
          <li>
            <a
              href="#auction"
              className={isDarkMode ? "text-white" : "text-gray-800"}
            >
              ประมูล
            </a>
          </li>
          <li>
            <a
              href="#auction"
              className={isDarkMode ? "text-white" : "text-gray-800"}
            >
              บทความ
            </a>
          </li>
        </ul>
      </div>

      {/* ปุ่มเข้าสู่ระบบและลงทะเบียน */}
      <div className="flex-none flex gap-2 text-[16px]">
        <Link
          to="/login"
          className="btn btn-outline btn-sm hover:bg-opacity-20"
          style={{
            color: isDarkMode ? "#FFFFFF" : "#8677A7",
            borderColor: isDarkMode ? "#FFFFFF" : "#8677A7",
          }}
        >
          เข้าสู่ระบบ
        </Link>
        <Link
          to="/Register"
          className="btn btn-sm"
          style={{
            backgroundColor: isDarkMode ? "#4B5563" : "#8677A7",
            color: isDarkMode ? "#FFFFFF" : "#FFFFFF",
          }}
        >
          ลงทะเบียน
        </Link>
      </div>
    </div>
  );
}
