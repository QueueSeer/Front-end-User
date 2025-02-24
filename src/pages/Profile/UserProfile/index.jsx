import React from "react";
import HeaderProfile from "./HeaderProfile";
import ContentUser from "./ContentUser";
import CategoryUser from "./CategoryUser";
import UserStats from '../../../components/Popup/profile/UserStats';



const Profile = () => {
  return (
    <div className="px-8 py-6 mx-auto bg-white border rounded-lg ">
      <HeaderProfile />
      <ContentUser />
      <div className="flex flex-col gap-[30px] px-[30px] pb-[18px]">
        <CategoryUser />
        <UserStats /> {/* เพิ่มส่วนแสดงสถิติการดูดวง */}
      </div>
    </div>
  );
};

export default Profile;
