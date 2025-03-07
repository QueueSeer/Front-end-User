import React from 'react';

const InfoUser = ({ userData }) => {
  // ฟังก์ชันแปลงวันที่เป็นรูปแบบไทย
  const formatThaiDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      
      // แปลงเป็นรูปแบบ วัน/เดือน/ปี
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  };

  return (
    <div className="flex-1 text-base">
      <h2 className="text-[24px] text-gray-800 font-semibold mb-6">ข้อมูลส่วนตัว</h2>
      <div className="space-y-3 text-[18px]">
        <div className="flex">
          <div className="w-32 font-medium text-black">ชื่อผู้ใช้</div>
          <div>{userData.nickname || '-'}</div>
        </div>
        <div className="flex">
          <div className="w-32 font-medium text-black">ชื่อจริง</div>
          <div>{userData.firstName || '-'}</div>
        </div>
        <div className="flex">
          <div className="w-32 font-medium text-black">นามสกุล</div>
          <div>{userData.lastName || '-'}</div>
        </div>
        <div className="flex">
          <div className="w-32 font-medium text-black">วันเกิด</div>
          <div>{formatThaiDate(userData.birthdate)}</div>
        </div>
        <div className="flex">
          <div className="w-32 font-medium text-black">อีเมล</div>
          <div>{userData.email || '-'}</div>
        </div>
        <div className="flex">
          <div className="w-32 font-medium text-black">เบอร์โทรศัพท์</div>
          <div>{userData.phone || '-'}</div>
        </div>
      </div>
    </div>
  );
};

export default InfoUser;