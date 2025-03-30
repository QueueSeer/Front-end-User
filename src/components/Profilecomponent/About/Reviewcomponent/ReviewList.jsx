import React from "react";
import Images from "../../../../assets";

const ReviewList = ({ filteredReviews = [], loading = false, error = null }) => {
  // แสดง loading indicator
  if (loading) {
    return (
      <div className="mb-6 px-4 md:px-8 lg:px-12 flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // แสดงข้อความเมื่อมีข้อผิดพลาด
  if (error) {
    return (
      <div className="mb-6 px-4 md:px-8 lg:px-12">
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 px-4 md:px-8 lg:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 gap-y-8">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="p-6 sm:p-8 bg-white rounded-lg border border-gray-300 shadow-sm flex flex-col justify-between w-full"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-start space-x-4">
                  {/* ใช้รูปโปรไฟล์หรือตัวย่อชื่อถ้าไม่มีรูป */}
                  {review.profileImage ? (
                    <img
                      src={review.profileImage}
                      alt={review.name}
                      className="w-14 h-14 rounded-full"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-purple-200 flex items-center justify-center text-purple-800 font-bold">
                      {review.name.charAt(0)}
                    </div>
                  )}
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
              <p className="text-gray-700 flex-grow">{review.text || "ไม่มีข้อความรีวิว"}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-2">ไม่มีรีวิวของหมอดู</p>
        )}
      </div>
    </div>
  );
};

export default ReviewList;