import React from "react";
import Images from "../../assets"; // Import รูปจาก assets

const Pagination = ({ title, subtitle, page, setPage, totalPages }) => {
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="flex justify-between items-center w-full max-w-6xl">
      {/* หัวข้อ (เปลี่ยนค่าได้) */}
      <div className="flex flex-col mt-10">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="w-2 h-6 bg-purple-700 mr-2"></span> {title}
        </h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>

      {/* Pagination + ปุ่ม "ทั้งหมด" */}
      <div className="hidden sm:flex items-center gap-4">
        {/* ปุ่ม "ทั้งหมด" */}
        <button className="border border-gray-400 px-4 py-1 rounded-full text-purple-700 text-sm font-medium">
          ทั้งหมด
        </button>

        {/* ปุ่มเปลี่ยนหน้า */}
        <div className="flex items-center gap-2">
          {/* ปุ่ม Prev */}
          <button 
            onClick={handlePrev} 
            disabled={page === 1} 
            className={`p-2 rounded-full ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "shadow-md"}`}
          >
            <img 
              src={page === 1 ? Images.Arrowleft : Images.Arrowleftcolor} 
              alt="prev" 
              className="w-8 h-8" 
            />
          </button>

          {/* แสดงเลขหน้า */}
          <span className="text-gray-600 text-sm">{page} of {totalPages}</span>

          {/* ปุ่ม Next */}
          <button 
            onClick={handleNext} 
            disabled={page >= totalPages} 
            className={`p-2 rounded-full ${page >= totalPages ? "bg-gray-300 cursor-not-allowed" : "shadow-md"}`}
          >
            <img 
              src={Images.ArrowRight} 
              alt="next" 
              className="w-8 h-8" 
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
