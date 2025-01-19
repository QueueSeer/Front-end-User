import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom"; // นำเข้า Link จาก react-router-dom

const MenuItem = ({ icon, children, onClick, to }) => {
  return (
    <li>
      <Link
        to={to} // ใช้ Link เพื่อทำการนำทางไปยังเส้นทางที่ระบุ
        className="flex items-center px-4 py-3 text-sm text-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
        onClick={onClick} // หากต้องการทำฟังก์ชันบางอย่างตอนคลิก (เช่น การบันทึกหรือการทำอะไรบางอย่าง) สามารถใช้ onClick ได้
      >
        {/* ไอคอน */}
        <span className="mr-3 w-6 h-6">{icon}</span>
        {/* ข้อความหรือคอนเทนต์ */}
        {children}
      </Link>
    </li>
  );
};

// กำหนดประเภทของ Props
MenuItem.propTypes = {
  icon: PropTypes.node.isRequired, // ตรวจสอบให้ icon เป็นอะไรก็ได้ที่สามารถแสดงผลได้ เช่น JSX หรือ Element
  children: PropTypes.node.isRequired, // ใช้ children แทน text เพื่อให้สามารถใส่เนื้อหาหลายอย่างได้
  onClick: PropTypes.func, // ฟังก์ชันที่ใช้เมื่อคลิก
  to: PropTypes.string.isRequired, // เส้นทางที่ต้องการไปเมื่อคลิก
};

export default MenuItem;
