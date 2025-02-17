import React, { useState, useEffect } from "react";

const QuestionForm = ({ numQuestions, bookingId, onChange }) => {
  const [questions, setQuestions] = useState(Array(numQuestions).fill(""));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🟢 โหลดคำถามจาก API ถ้ามี
  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/questions?bookingId=${bookingId}`)
      .then((response) => {
        if (!response.ok) throw new Error("โหลดคำถามไม่สำเร็จ");
        return response.json();
      })
      .then((data) => {
        setQuestions(data.questions || Array(numQuestions).fill(""));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setError("ไม่สามารถโหลดคำถามได้");
        setLoading(false);
      });
  }, [bookingId, numQuestions]);

  // 🟢 Auto-save คำถามเมื่อมีการแก้ไข (บันทึกทันที)
  useEffect(() => {
    if (!bookingId) return;

    fetch(`http://localhost:5000/api/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, questions }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("บันทึกคำถามล้มเหลว");
      })
      .catch((err) => console.error("Error saving questions:", err));
  }, [questions, bookingId]);

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
    onChange(index, value);
  };

  if (loading) return <p className="text-center text-gray-500">กำลังโหลดคำถาม...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

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
            value={question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            placeholder={`กรอกคำถามที่ ${index + 1}`}
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionForm;
