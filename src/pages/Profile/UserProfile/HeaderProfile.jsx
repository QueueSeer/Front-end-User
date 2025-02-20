// HeaderProfile.js
import React from 'react';
import Images from '../../../assets'; 
import Header from '../../../components/Profile/Header';

const HeaderProfile = () => {
  return (
    <Header image={Images.UserIcon} alt='User Icon' text="โปรไฟล์" />

  );
};

export default HeaderProfile;
