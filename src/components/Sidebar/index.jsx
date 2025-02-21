import React, { useState, useMemo } from "react";
import SidebarItem from "./item/SidebarItem";
import MenuItems from "./item/MenuItems";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutModal from "../Popup/LogoutModal";
import Images from "../../assets";

const Sidebar = ({ activeOverride = null }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // คำนวณเมนูที่ active อยู่
  const activeIndex = useMemo(() => {
    if (activeOverride !== null) {
      return activeOverride;
    }
    const currentIndex = MenuItems.findIndex((item) =>
      Array.isArray(item.href)
        ? item.href.includes(location.pathname)
        : item.href === location.pathname
    );
    return currentIndex !== -1 ? currentIndex : 0;
  }, [location.pathname, activeOverride]);

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    navigate("/Login");
  };

  return (
    <div className="relative">
      {/* Hamburger Button สำหรับ Mobile */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed top-20 left-4 z-50 p-2 text-purple-700 text-2xl"
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-30 left-0 transition-transform ${
          isSidebarOpen ? "translate-x-0 w-1/2" : "-translate-x-full w-1/2"
        } lg:translate-x-0 lg:w-full lg:static`}
      >
        {isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-1 right-2 text-gray-700 text-xl z-50"
          >
            ✖
          </button>
        )}

        {/* Sidebar Content */}
        <div
          className={`bg-white p-3 w-full rounded-lg border border-gray-200 h-auto flex flex-col justify-start mb-6 ${
            isSidebarOpen ? "pt-8" : "lg:pt-3"
          }`}
        >
          <ul className="space-y-2 list-none">
            {MenuItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                text={item.text}
                href={Array.isArray(item.href) ? item.href[0] : item.href}
                isActive={activeIndex === index}
                onClick={() => setIsSidebarOpen(false)}
              />
            ))}
          </ul>

          {/* Logout Button */}
          <div className="mt-8 pt-1 border-t border-gray-300 dark:border-gray-700">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center justify-start w-full p-3 rounded-md cursor-pointer font-medium text-gray-700 hover:bg-[#B6AFCA] hover:text-black"
            >
              <img
                src={Images.LogoutIcon}
                alt="Logout Icon"
                className="w-5 h-5"
              />
              <span className="ml-3">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ใช้ LogoutModal Component */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Sidebar;
