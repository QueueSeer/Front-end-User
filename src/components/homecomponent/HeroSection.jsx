import React from "react";
import Images from "../../assets";

const HeroSection = () => {
  return (
    <div className="relative w-full h-[460px] bg-gradient-to-l from-[#65558F] via-[#7465A8] to-[#FFFFFF] flex flex-col md:flex-row items-center p-16">
      <div className="flex-1 text-black text-center md:text-left">
        <h1 className="text-5xl font-bold">สวัสดีวันอาทิตย์</h1>
        <p className="text-2xl mt-4">ดูดวงสะดวก จองคิวทันใจที่ Qseer</p>
      </div>
      <div className="flex-1 flex justify-end w-full">
        <img src={Images.Luckycolor} alt="Lucky Color" className="w-full h-auto max-w-none object-cover" />
      </div>
    </div>
  );
};

export default HeroSection;
