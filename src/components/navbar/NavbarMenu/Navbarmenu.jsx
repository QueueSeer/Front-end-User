// navbarlinks.jsx

import React from 'react';

const NavbarLinks = () => {
  return (
    <div className="hidden lg:flex flex-none">
      <ul className="flex space-x-5 gap-1 text-gray-800">
        <li>
          <a href="#home">หน้าหลัก</a>
        </li>
        <li>
          <a href="#packages">แพ็กเกจ</a>
        </li>
        <li>
          <a href="#auction">ประมูล</a>
        </li>
      </ul>
    </div>
  );
};

export default NavbarLinks;
