import React from "react";
import PopularCategoriesHeader from "./PopularCategoriesHeader";
import CategoryCard from "./CategoryCard";

const PopularCategories = () => {
    const categories = [
        { title: "โหราศาสตร์ไทย", description: "ดูดวงพื้นดวงตามวันเดือนปีเกิด" },
        { title: "โหราศาสตร์จีน", description: "ดูปีชง ฝ่าดวงชะตา" },
        { title: "ไพ่ยิปซี", description: "การดูดวงด้วยไพ่ทาโรต์" },
        { title: "โหราศาสตร์ตะวันตก", description: "ดูดวงวันราศีประจำตัวคุณ" },
        { title: "โหงวเฮ้ง", description: "การดูดวงด้วยลักษณะใบหน้า" },
        { title: "อื่น ๆ", description: "" }, // Card นี้จะมีพื้นหลังมืด
    ];

    return (
        <div className="p-12">
            <PopularCategoriesHeader />
            <div className="grid grid-cols-3 gap-6 mt-4">
                {categories.map((category, index) => (
                    <CategoryCard key={index} category={category} />
                ))}
            </div>
        </div>
    );
};

export default PopularCategories;
