import React, { useState } from "react";
import Images from "../../assets";
import Pagination from "../Reviewcomponent/Pagination"; 
import ReportReviewPopup from "../Reviewcomponent/ReportReviewPopup";

const ReviewList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const totalPages = 3;

  const reviews = [
    {
      id: 1,
      name: "หมูชอบชอบ",
      date: "9 กันยายน 2567, 09:30",
      package: "แพคเกจดูดวงรายเดือน",
      text: "ทักแรง แม่นจนขนลุก!",
      stars: 5,
    },
    {
      id: 2,
      name: "พลอยชอบดูดวง",
      date: "9 กันยายน 2567, 09:30",
      package: "แพคเกจดูดวงรายเดือน",
      text: "นี่ล่ะขนลุกเลยยยยยยย",
      stars: 4,
    },
    {
      id: 3,
      name: "ไม่ใช่หมูแต่เป็นผม",
      date: "9 กันยายน 2567, 09:30",
      package: "แพคเกจดูดวงรายเดือน",
      text: "แม่นจริง คนคุยไม่กลับมา",
      stars: 5,
    },
    {
      id: 4,
      name: "หมูชอบชอบ",
      date: "9 กันยายน 2567, 09:30",
      package: "แพคเกจดูดวงรายเดือน",
      text: "ทักแรง แม่นจนขนลุก!",
      stars: 4,
    },
  ];

  const handleReportClick = (review) => {
    setSelectedReview(review);
    setIsReportOpen(true);
  };

  const handleReportClose = () => {
    setIsReportOpen(false);
    setSelectedReview(null);
  };

  return (
    <div className="space-y-6 px-4 md:px-8 lg:px-12">
      {/* Map over reviews */}
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-4 sm:p-6 bg-white rounded-lg border border-gray-300 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-start space-x-4">
              <img
                src={Images.member1}
                alt={review.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="text-lg font-bold">{review.name}</h2>
                <p className="text-sm text-gray-500">
                  {review.date} | {review.package}
                </p>
              </div>
            </div>
            {/* Stars Section */}
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, index) => (
                <img
                  key={index}
                  src={
                    index < review.stars ? Images.Starcolor : Images.StarYellow
                  }
                  alt="Star"
                  className="w-5 h-5"
                />
              ))}
            </div>
          </div>
          {/* Horizontal line ABOVE the review text */}
          <hr className="my-4 border-t border-gray-200" />
          <p className="text-gray-700">{review.text}</p>
          {/* Report Button */}
          <div className="flex justify-end mt-2">
            <button
              onClick={() => handleReportClick(review)}
              className="text-red-600 hover:underline text-sm"
            >
              รายงาน
            </button>
          </div>
        </div>
      ))}

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      />

      {/* ReportReviewPopup Component */}
      {isReportOpen && (
        <ReportReviewPopup review={selectedReview} onClose={handleReportClose} />
      )}
    </div>
  );
};

export default ReviewList;
