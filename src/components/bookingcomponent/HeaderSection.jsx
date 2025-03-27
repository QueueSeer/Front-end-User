import React from "react";
import Images from "../../assets"; // รูป default

const HeaderSection = ({ packageInfo, setNumQuestions }) => {
  const {
    name,
    price,
    image,
    description,
    question_limit,
    duration,
    foretell_channel,
    reading_type
  } = packageInfo;

  // แปลงข้อความ description เป็นลำดับ bullet
  const formatDescriptionToList = (text) => {
    if (!text) return ["ไม่มีคำอธิบายแพ็กเกจ"];
    return text.split("\n").map((item) => item.trim()).filter(Boolean);
  };

  const formattedDescription = formatDescriptionToList(description);
  const isFree = !price || price === 0;

  return (
    <div className="p-12">
      {/* ชื่อแพ็กเกจ & ราคา */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{name || "แพ็กเกจดูดวง"}</h1>
        <p className="text-purple-900 font-bold text-xl">
          {isFree ? "ฟรี" : `${price} Coins`}
        </p>
      </div>

      {/* ภาพ + รายละเอียด */}
      <div className="flex space-x-8">
        {/* ภาพ */}
        <div className="w-1/3">
          <img
            src={image === "/default-image.jpg" ? Images.tarotImages : image}
            alt="ภาพแพ็กเกจ"
            className="w-full rounded-lg shadow-md object-cover h-60"
          />
        </div>

        {/* รายละเอียด */}
        <div className="w-2/3 space-y-4">
          <p className="text-gray-700 leading-7">
            คุณสามารถถามได้ <strong>{question_limit ?? 0} คำถาม</strong> <br />
            ระยะเวลาในการดูดวง: <strong>{duration / 60} นาที</strong> <br />
            ช่องทางการดูดวง: <strong>{foretell_channel}</strong> <br />
            ประเภทการทำนาย: <strong>{reading_type}</strong>
          </p>

          <ul className="list-decimal list-inside text-gray-700 space-y-2">
            {formattedDescription.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* เส้นกั้นด้านล่าง */}
      <hr className="mt-6 border-gray-300" />
    </div>
  );
};

export default HeaderSection;
