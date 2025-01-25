import React from "react";

const ImageContent = ({ image, title, description, isReversed }) => {
  // ✅ ทำให้คำใน "" เป็นสี #420F75
  const formatDescription = (text) => {
    return text.split(/("[^"]*")/g).map((part, index) =>
      part.startsWith('"') && part.endsWith('"') ? (
        <span key={index} className="text-[#420F75] font-medium">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className={`flex flex-col md:flex-row items-center justify-center w-full max-w-screen-xl mx-auto px-6 md:px-16 gap-12 ${isReversed ? "md:flex-row-reverse" : ""}`}>
      
      {/*  ภาพ */}
      <div className="flex-1 flex justify-center">
        <img 
          src={image} 
          alt={title} 
          className="w-full max-w-lg h-auto object-cover "
        />
      </div>

      {isReversed ? (
        // 🔹 คำอธิบายฝั่งซ้าย
        <div className="flex-1 md:text-left ml-auto">
          <h2 className="text-4xl md:text-4xl font-bold mb-6">{title}</h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-md">
            {formatDescription(description)}
          </p>
        </div>
      ) : (
        // 🔹 คำอธิบายฝั่งขวา
        <div className="flex-1 md:text-left">
          <h2 className="text-4xl md:text-4xl font-bold mb-6">{title}</h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed whitespace-pre-line">
            {formatDescription(description)}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageContent;
