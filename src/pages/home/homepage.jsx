import React from "react";
import Fillterbar from "../../components/fillterbar";
import HeroSection from "../../components/homecomponent/HeroSection";
import SearchBar from "../../components/homecomponent/SearchBar";
import IconSection from "../../components/homecomponent/IconSection";
import FeatureSection from "../../components/homecomponent/FeatureSection";
import PopularSeers  from "../../components/homecomponent//SeerPopular/PopularSeers";
import PackageSection  from "../../components/homecomponent//Package/PackageSection";
import PopularCategories  from "../../components/homecomponent//PopularCategories/PopularCategories";


// Home Component
const Homepage = () => {
  return (
    <>
      <Fillterbar />  
      <div className="w-full">
        <HeroSection />
        <div className="p-8">
          <SearchBar />
          <IconSection />
          <FeatureSection />
          <PopularSeers />
          <PackageSection />
          <PopularCategories/>
         
        </div>
      </div>
    </>
  );
};

export default Homepage;
