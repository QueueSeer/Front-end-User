import React from "react";
import { Link } from "react-router-dom";

const NavbarLinks = () => {
  return (
    <div className="hidden lg:flex flex-none">
      <ul className="flex space-x-5 gap-1 text-gray-800">
        <li>
          <Link to="/homepage">หน้าหลัก</Link>
        </li>
        <li>
          <Link to="/search-booking">แพ็กเกจ</Link>
        </li>
        <li>
          <Link to="/top-up-coins">เติมโชค</Link>
        </li>
        <li>
          <Link to="/auction">ประมูล</Link>
        </li>
        <li>
          <Link to="/articles">บทความ</Link>
        </li>
      </ul>
    </div>
  );
};

export default NavbarLinks;
