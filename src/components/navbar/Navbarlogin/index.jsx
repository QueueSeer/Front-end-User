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
      className={`navbar flex justify-between items-center shadow-md px-4 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-base-100 text-gray-800"
      }`}
    >
      {/* โลโก้ด้านซ้าย */}
      <div className="flex items-center gap-2">
        <Logonavbar />
      </div>

      {/* ลิงก์เมนู + ปุ่ม เข้าสู่ระบบ และ ลงทะเบียน (จัดให้อยู่แถวเดียวกัน) */}
      <div className="flex items-center gap-6">
        <nav className="flex gap-6">
          <a href="#home" className={isDarkMode ? "text-white" : "text-gray-800"}>
            หน้าหลัก
          </a>
          <a href="#packages" className={isDarkMode ? "text-white" : "text-gray-800"}>
            แพ็กเกจ
          </a>
          <a href="#auction" className={isDarkMode ? "text-white" : "text-gray-800"}>
            ประมูล
          </a>
          <a href="#articles" className={isDarkMode ? "text-white" : "text-gray-800"}>
            บทความ
          </a>
        </nav>

        {/* ปุ่มเข้าสู่ระบบและลงทะเบียน (สี #8677A7) */}
        <div className="flex gap-2">
          <Link
            to="/login"
            className="border border-[#8677A7] text-[#8677A7] px-4 py-2 text-sm rounded-lg hover:bg-[#8677A7] hover:text-white transition"
          >
            เข้าสู่ระบบ
          </Link>
          <Link
            to="/Register"
            className="bg-[#8677A7] text-white px-4 py-2 text-sm rounded-lg hover:bg-[#6b5b8d] transition"
          >
            ลงทะเบียน
        </Link>
      </div>
      </div>
    </div>
  );
}
