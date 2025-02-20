//รูปภาพ และชื่อของ user 
//ProfileUser.jsx
import React from 'react';


const ProfileUser = ({ image, text ,alt }) => {
  return (
    <div className="pb-[12px] flex items-center gap-2 border-b-2">
      {/* ไอคอน */}
      <img src={image} alt={alt} className="mr-3 w-7 h-7" />
      {/* ข้อความ */}
      <span className="text-secondary font-semibold text-xl">{text}</span>
    </div>
  );
};

export default ProfileUser;