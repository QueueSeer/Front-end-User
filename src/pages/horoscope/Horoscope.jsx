import React from "react";

const Horoscope = () => {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-[#65558F]">ดูดวงวันนี้</h1>
        <p className="text-gray-600 text-center mt-2">เช็กดวงของคุณวันนี้กับนักพยากรณ์ของเรา</p>

        {/* ส่วนของคอนเทนต์ */}
        <div className="mt-6 space-y-4">
          <div className="bg-[#F4F1FA] p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-[#65558F]">♈ ราศีเมษ (Aries)</h2>
            <p className="text-gray-700">วันนี้เป็นวันที่ดีสำหรับการเริ่มต้นสิ่งใหม่ อย่าลังเลที่จะก้าวไปข้างหน้า!</p>
          </div>

          <div className="bg-[#F4F1FA] p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-[#65558F]">♉ ราศีพฤษภ (Taurus)</h2>
            <p className="text-gray-700">ระวังเรื่องค่าใช้จ่ายในวันนี้ อาจมีเรื่องให้ต้องใช้เงินมากกว่าที่คิด</p>
          </div>

          {/* เพิ่มราศีอื่นๆ ได้ตามต้องการ */}
        </div>

        {/* ปุ่มย้อนกลับ */}
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-3 rounded-lg font-semibold text-white bg-[#65558F] hover:bg-[#564477] transition"
            onClick={() => window.history.back()}
          >
            กลับ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Horoscope;
