import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import AuctionSearchBar from "../../components/Auctioncomponent/AuctionSearchBar";
import SidebarFilter from "../../components/Searchbar/SidebarFilter";
import SeerCard from "../../components/homecomponent/SeerPopular/SeerCard";
import { useEffect } from "react";


const SearchBookingSeer = () => {
  const location = useLocation();
  const categoryFromState = location.state?.category;

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = () => {
    console.log("ค้นหา:", searchTerm);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const mockSeers = Array.from({ length: 16 }).map((_, index) => ({
    name: `หมอดู ${index + 1}`,
    category: categoryFromState || "ไพ่ทาโรต์",
    rating: 4.2 + (index % 3) * 0.1,
  }));

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      {/* Header */}
      <div className="bg-gray-100 pt-24 pb-6 px-4 lg:px-12 text-center">
        <h1 className="text-4xl font-extrabold text-[#420F75]">
          {categoryFromState ? `หมอดู${categoryFromState}` : "ค้นหาหมอดู"}
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          {categoryFromState
            ? `เรียงตามหมวดหมู่: ${categoryFromState}`
            : "เลือกหมอดูที่คุณไว้วางใจ"}
        </p>
        <div className="max-w-xl mx-auto mt-4">
          <AuctionSearchBar
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

        {/* Content */}
        <div className="w-full">
          {/* Header: หมอดูทั้งหมด */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#2D2D2D]">
              หมอดูทั้งหมด - {mockSeers.length} คน
            </h2>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-700">
                เรียงจาก
              </label>
              <select
                id="sort"
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="desc">มากไปน้อย</option>
                <option value="asc">น้อยไปมาก</option>
                <option value="rating">เรตติ้งสูงสุด</option>
              </select>
            </div>
          </div>

          {/* Seer Cards */}
          <div className="flex flex-wrap justify-start gap-y-4">
            {mockSeers.map((seer, index) => (
              <SeerCard key={index} seer={seer} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBookingSeer;
