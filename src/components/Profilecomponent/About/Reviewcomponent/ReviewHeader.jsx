import React, { useState, useEffect } from "react";
import Images from "../../../../assets";
import ReviewFilter from "../Reviewcomponent/ReviewFilter";

const ReviewHeader = ({ setFilteredReviews }) => {
  const [activeFilter, setActiveFilter] = useState("ทั้งหมด");

  const reviews = [
    { id: 1, name: "หมูชอบชอบ", date: "9 กันยายน 2567", package: "แพคเกจดูดวงรายเดือน", text: "ทักแรง แม่นจนขนลุก!", stars: 5 },
    { id: 2, name: "พลอยชอบดูดวง", date: "9 กันยายน 2567", package: "แพคเกจดูดวงรายเดือน", text: "นี่ล่ะขนลุกเลยยยยยยย", stars: 4 },
    { id: 3, name: "ไม่ใช่หมูแต่เป็นผม", date: "9 กันยายน 2567", package: "แพคเกจดูดวงรายเดือน", text: "แม่นจริง คนคุยไม่กลับมา", stars: 5 },
    { id: 4, name: "ไม่ใช่หมูแต่เป็นผม", date: "9 กันยายน 2567", package: "แพคเกจดูดวงรายเดือน", text: "แม่นจริง คนคุยไม่กลับมา", stars: 3 },
    { id: 5, name: "ไม่ใช่หมูแต่เป็นผม", date: "9 กันยายน 2567", package: "แพคเกจดูดวงรายเดือน", text: "แม่นจริง คนคุยไม่กลับมา", stars: 2 },
    { id: 6, name: "ไม่ใช่หมูแต่เป็นผม", date: "9 กันยายน 2567", package: "แพคเกจดูดวงรายเดือน", text: "แม่นจริง คนคุยไม่กลับมา", stars: 1 },
  ];

  useEffect(() => {
    const filtered = activeFilter === "ทั้งหมด"
      ? reviews
      : reviews.filter(review => review.stars === parseInt(activeFilter));

    setFilteredReviews(filtered);
  }, [activeFilter, reviews, setFilteredReviews]);

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1">
            <img src={Images.Starcolor} alt="Star Yellow" className="w-6 h-6" />
            <img src={Images.Starcolor} alt="Star Yellow" className="w-6 h-6" />
            <img src={Images.Starcolor} alt="Star Yellow" className="w-6 h-6" />
            <img src={Images.Starcolor} alt="Star Yellow" className="w-6 h-6" />
            <img src={Images.StarYellow} alt="Star Empty" className="w-6 h-6" />
          </div>
          <div className="text-lg font-bold text-[#F59E0B]">โดยเฉลี่ย 4.5</div>
          <div className="hidden sm:block text-gray-500">(150 รีวิว)</div>
          <div className="mt-5 sm:mt-5 pl-2">
          <ReviewFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        </div>
        </div>

       
       
      </div>
    </div>
  );
};

export default ReviewHeader;
