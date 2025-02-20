import React, { useState } from "react";
import Images from "../../../assets";
import HeaderProfile from "./HeaderProfile";
import ContentUser from "./ContentUser";
import AboutUser from "./AboutUser";
import CategoryUser from "./CategoryUser";
import SocialLinksManager from "./SocialLinksManager";
import AccountPrompay from "./AccountPrompay";

const Profile = () => {
  return (
    <div className="px-8 py-6 mx-auto bg-white border rounded-lg ">
      <HeaderProfile />

      <ContentUser />
      <div className="flex flex-col gap-[30px] px-[30px] pb-[18px]">
        {/* Button to show the popup */}
        <AboutUser />

        <CategoryUser />

        <SocialLinksManager />

        <AccountPrompay />

      
      </div>
    </div>
  );
};

export default Profile;
