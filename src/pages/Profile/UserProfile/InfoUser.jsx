// InfoUser.jsx
import React from 'react';

const InfoUser = () => {
  return (
    <div className="flex-1 text-base">
      <h2 className="text-[24px] text-gray-800 font-semibold mb-6">
        ข้อมูลส่วนตัว
      </h2>
      <div className="space-y-3 text-[18px]">
        <div className="flex">
          <div className="w-32 font-medium text-black">ชื่อหมอดู</div>
          <div>เพียงฟ้า พาชัย</div>
        </div>
        <div className="flex">
          <div className="w-32 font-medium text-black">ชื่อจริง</div>
          <div>สุรีภรณ์</div>
        </div>
        <div className="flex">
          <div className="w-32 font-medium text-black">นามสกุล</div>
          <div>นาภาลัย</div>
        </div>
        <div className="flex">
          <div className="w-32 font-medium text-black">วันเดือนปีเกิด</div>
          <div>17 ตุลาคม 2545</div>
        </div>
        <div className="flex">
          <div className="w-32 font-medium text-black">อีเมล</div>
          <div>Sureeporn.SN@gmail.com</div>
        </div>
        <div className="flex">
          <div className="w-32 font-medium text-black">เบอร์โทรศัพท์</div>
          <div>0956966952</div>
        </div>
      </div>
    </div>
  );
};

export default InfoUser;
