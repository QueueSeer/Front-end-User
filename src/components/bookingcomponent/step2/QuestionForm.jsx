import React, { useEffect, useState } from "react";

const QuestionForm = ({ numQuestions, questions, setQuestions }) => {
  // 🟣 กรณีไม่จำกัดคำถาม (แสดงช่องเดียว)
  if (numQuestions < 1 || numQuestions > 6) {
    return (
      <div className="w-full max-w-4xl mt-4">
        <label className="text-gray-700 font-semibold">
          พิมพ์คำถามของคุณทั้งหมดในช่องด้านล่าง <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#6B5B95] focus:outline-none"
          rows="6"
          value={questions[0] || ""}
          onChange={(e) => {
            // สร้างอาร์เรย์ใหม่แทนที่จะแก้ไขอาร์เรย์เดิม
            const newQuestions = [...questions];
            newQuestions[0] = e.target.value;
            setQuestions(newQuestions);
          }}
          placeholder="พิมพ์คำถามของคุณทั้งหมดในช่องนี้..."
        />
      </div>
    );
  }

  // 🟣 กรณีจำกัดคำถาม (หลายช่อง)
  return (
    <div className="grid grid-cols-2 gap-6 w-full max-w-4xl mt-6">
      {questions.map((question, index) => (
        <div key={index}>
          <label className="text-gray-700 font-semibold">
            คำถาม {index + 1} <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#6B5B95] focus:outline-none"
            rows="3"
            value={question || ""}
            onChange={(e) => {
              // สร้างอาร์เรย์ใหม่เพื่อให้ React ตรวจจับการเปลี่ยนแปลงได้
              const newQuestions = [...questions];
              newQuestions[index] = e.target.value;
              setQuestions(newQuestions);
            }}
            placeholder={`กรอกคำถามที่ ${index + 1}`}
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionForm;