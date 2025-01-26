import React from "react";
import SocialLinks from "./SocialLinks";
import TagsSection from "./TagsSection";



const AboutSection = () => {
  return (
    <div>
        <h2 className="text-2xl font-bold flex items-center">
          <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>เกี่ยวกับเรา
        </h2>
      <p className="text-gray-700 mt-2">
      Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

      </p>
      <SocialLinks/>
      <TagsSection/>
    </div>
  );
};

export default AboutSection;
