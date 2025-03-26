import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/index"; // เรียกใช้ path ที่ถูกต้อง
import ActionSearchBar from "../../components/Searchbar/ActionsearchBar";
import PackageCard from "../../components/homecomponent/Package/PackageCard";
import SidebarFilter from "../../components/Searchbar/SidebarFilter";

const SearchBookingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Scroll to top เมื่อเข้าหน้า
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = () => {
    console.log("ค้นหา:", searchTerm);
  };

  const mockPackages = Array.from({ length: 16 }).map((_, index) => ({
    title: `Package 1`,
    category: "ดูดวงพิเศษ",
    seer: "หมอดูหมายเลข 1",
    rating: 4.0,
    reviews: 935,
    price: 99,
    duration: 15,
    icon: "call",
  }));

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      {/* Headline + Search */}
      <div className="bg-gray-100 pt-24 pb-6 px-4 lg:px-12 text-center">
        <h1 className="text-4xl font-extrabold text-[#420F75]">
          จองคิวดูดวงออนไลน์
        </h1>
        <p className="text-gray-600 mt-2 text-lg">เลือกแพ็กเกจที่คุณสนใจ</p>
        <div className="max-w-xl mx-auto mt-4">
          <ActionSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-100 px-4 lg:px-12 pb-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <SidebarFilter />
        </div>

        {/* Package Cards */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockPackages.map((pkg, index) => (
              <PackageCard key={index} packageInfo={pkg} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBookingPage;
