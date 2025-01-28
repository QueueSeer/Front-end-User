import React from "react";
import Images from "../../../../assets";

const ReviewList = ({ filteredReviews = [] }) => {  // ✅ ให้ค่าเริ่มต้นเป็น []
  return (
    <div className="mb-6 px-4 md:px-8 lg:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 gap-y-8">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="p-6 sm:p-8 bg-white rounded-lg border border-gray-300 shadow-sm  flex flex-col justify-between w-full"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-start space-x-4">
                  <img
                    src={Images.member1}
                    alt={review.name}
                    className="w-14 h-14 rounded-full"
                  />
                  <div>
                    <h2 className="text-lg font-bold">{review.name}</h2>
                    <p className="text-sm text-gray-500">
                      {review.date} | {review.package}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, index) => (
                    <img
                      key={index}
                      src={index < review.stars ? Images.Starcolor : Images.StarYellow}
                      alt="Star"
                      className="w-5 h-5"
                    />
                  ))}
                </div>
              </div>
              <hr className="my-4 border-t border-gray-200" />
              <p className="text-gray-700 flex-grow">{review.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-2">ไม่มีรีวิวที่ตรงกับการค้นหา</p>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
