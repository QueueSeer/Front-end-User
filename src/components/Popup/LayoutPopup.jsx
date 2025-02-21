import React from "react";

const LayoutPopup = ({ title = "", children, isOpen, onClose }) => {
  if (!isOpen) return null; // ถ้า isOpen เป็น false ไม่ต้องแสดง Popup

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 transition-opacity animate-fade"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white h-[500px] px-10 py-7 rounded-lg w-3/4 md:w-[860px] shadow-lg">
        {/* Header Popup */}
        <div className="flex justify-between items-center mb-4 border-b border-zinc-300 pb-2">
          <h2 className="text-2xl font-semibold text-primary">
            {title ? `รายละเอียด${title}` : "รายละเอียด"}
          </h2>
          <button
            onClick={onClose} // ปิด Popup
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="ปิดหน้าต่าง"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-7 h-7"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* เนื้อหาภายใน Popup */}
        <div className="pr-3 text-gray-700 space-y-5 text-lg max-h-[400px] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutPopup;
