import React, { useEffect, useState } from "react";

import PackageCard from "./PackageCard";
import PackageHeader from "./PackageHeader";
import { useNavigate } from "react-router-dom"; // เพิ่ม import useNavigate

const PackageSection = () => {
    const navigate = useNavigate(); // สร้าง instance navigate
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const visiblePackages = 5; // จำนวนแพ็คเกจที่แสดงในแต่ละหน้า (5 การ์ด)
    const cardGap = 16; // ระยะห่างระหว่างการ์ด (px)

    // โหลดข้อมูลแพ็คเกจจาก API
    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const params = new URLSearchParams();
            params.append("limit", 5);
            params.append("direction", "asc");
            const apiResponse = await fetch(`https://backend.qseer.app/api/seer/package/fortune/search?${params}`,{
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            })
            .then((res) => res.json())
            .then((res) => {
                console.log(res)
                return res
            })
            .then((res) => setPackages(res.packages))
            setLoading(false);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลแพ็คเกจ:", error);
            setError("ไม่สามารถโหลดข้อมูลแพ็คเกจได้");
            setLoading(false);
        }
    };
 
    // ปุ่มถัดไป (Next)
    const nextSlide = () => {
        if (currentIndex < packages.length - visiblePackages) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // ปุ่มก่อนหน้า (Prev)
    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // ฟังก์ชันจัดการเมื่อคลิกที่การ์ด - แก้ไขให้นำทางไปยังหน้ารายละเอียดแพ็คเกจ
    const handleCardClick = (pkg) => {
        // นำทางไปยังหน้าจองหมอดู พร้อมส่งข้อมูลแพ็คเกจไปด้วย
        navigate("/bookingSeer", { 
            state: { 
                packageInfo: pkg 
            } 
        });
    };

    if (loading) {
        return <div className="p-12 translate-y-[-60px] text-center">กำลังโหลดข้อมูล...</div>;
    }

    if (error) {
        return <div className="p-12 translate-y-[-60px] text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-12 translate-y-[-60px]">
            <PackageHeader 
                onPrev={prevSlide} 
                onNext={nextSlide} 
                currentIndex={currentIndex} 
                totalPackages={packages.length} 
            />
            <div className="overflow-hidden w-full">
                <div 
                    className="flex transition-transform duration-300" 
                    style={{ 
                        gap: `${cardGap}px`,
                        transform: `translateX(-${currentIndex * (100 / visiblePackages)}%)`,
                        paddingRight: `${cardGap}px` // เพิ่ม padding ด้านขวาเพื่อป้องกันการ์ดสุดท้ายขาด
                    }}
                >
                    {packages.map((pkg) => (
                        <div 
                            key={pkg.id} 
                            className="flex-shrink-0 card-container" 
                            style={{ 
                                width: `calc((100% - ${cardGap * (visiblePackages - 1)}px) / ${visiblePackages})`,
                                cursor: 'pointer',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                            }}
                            onClick={() => handleCardClick(pkg)} // ส่งทั้งอ็อบเจ็กต์ pkg ไปให้ฟังก์ชัน handleCardClick
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <PackageCard packageInfo={pkg} />
                        </div>
                    ))}
                </div>
            </div>

            {/* CSS สำหรับ Hover Effect */}
            <style jsx>{`
                /* จัดการกับการ์ดภายใน */
                .card-container:hover > * {
                    border-color: #420F75;
                }
            `}</style>
        </div>
    );
};

export default PackageSection;