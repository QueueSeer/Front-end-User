import React, { useEffect } from "react";
import Images from "../../assets";

const LogoutModal = ({ isOpen, onClose, onLogout, isLoggingOut }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // ปิดการ scroll
    } else {
      document.body.style.overflow = "auto"; // เปิดการ scroll เมื่อ modal ปิด
    }

    return () => {
      document.body.style.overflow = "auto"; // คืนค่าปกติเมื่อ component ถูก unmount
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white px-8 py-6 rounded-xl shadow-lg w-[450px] h-[400px] flex flex-col justify-between">
        {/* ส่วนหัว */}
        <div className="text-center">
          <img src={Images.Logout} alt="Logout Icon" className="w-24 h-auto mx-auto" />
          <h2 className="text-[26px] font-semibold text-gray-900 pt-3">
            คุณต้องการออกจากระบบหรือไม่?
          </h2>
          <p className="text-[18px] text-gray-600 mt-2">ออกจากระบบ Qseer</p>
          <p className="text-[18px] text-gray-600 mt-1">คุณสามารถเข้าสู่ระบบใหม่ได้ตลอดเวลา</p>
        </div>

        {/* ปุ่ม */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onLogout}
            className="px-4 py-3 bg-secondary2 text-white rounded-full font-semibold w-full hover:bg-secondary disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>กำลังออกจากระบบ...</span>
              </div>
            ) : (
              "ออกจากระบบ"
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold w-full hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoggingOut}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};

// กำหนดค่าเริ่มต้นเพื่อไม่ให้เกิด error เมื่อไม่ได้ส่ง prop
LogoutModal.defaultProps = {
  isLoggingOut: false
};

export default LogoutModal;