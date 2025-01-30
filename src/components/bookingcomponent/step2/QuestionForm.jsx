import React from "react";

const QuestionForm = ({ numQuestions, questions, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-6 w-full max-w-4xl mt-6">
      {Array.from({ length: numQuestions }).map((_, index) => (
        <div key={index}>
          <label className="text-gray-700 font-semibold">คำถาม {index + 1} *</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows="3"
            value={questions[index]}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder={`กรอกคำถามที่ ${index + 1}`}
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionForm;
