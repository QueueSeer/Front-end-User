import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ ใช้ useNavigate
import Navbarlogin from "../../components/navbar/Navbarlogin";
import Images from "../../assets"; 
import ImageContent from "../../components/landingcomponent/ImageContent";
import Footer from "../../components/Footer";

const contentData = [
    {
        image: Images.Choosefortune,
        title: "เลือกหมอดูที่สนใจ",
        description: `คุณสามารถเลือกหมอดูได้สองวิธี:\n
                     1. ค้นหาหมอดู: กดที่ช่อง "ค้นหาหมอดู" และพิมพ์ชื่อหมอดูที่คุณต้องการ หรือใช้คำค้นที่เกี่ยวข้อง\n
                     2. เลือกจากหมอดูมาแรง: กดที่หมวด "หมอดูมาแรง" ซึ่งจะแสดงหมอดูที่มาแรงในช่วงนั้นทั้งหมด`,
    },
    {
        image: Images.ChoosePackage,
        title: "เลือกแพ็คเกจที่ต้องการ",
        description: `กดที่ปุ่ม "แพ็คเกจ" เพื่อเลือกแพ็คเกจการพยากรณ์ เช่น ความรัก การงาน หรือสุขภาพตามที่หมอดูแต่ละคนให้บริการ`,
    },
    {
        image: Images.ChooseDayandTime,
        title: "เลือกวันและเวลาที่สะดวก",
        description: `กดที่ปุ่ม "เลือกวันเวลา" แล้วเลือกวันที่และเวลาที่สะดวกสำหรับคุณจากตัวเลือกที่มี`,
    },
    {
        image: Images.personalInformation,
        title: "กรอกข้อมูลส่วนตัว",
        description: `กรอกข้อมูลที่จำเป็น เช่น ชื่อ วันเกิด หรือข้อมูลอื่นๆ ที่หมอดูต้องใช้ในการทำนาย`,
    },
    {
        image: Images.PaymentChokCoin,
        title: "ชำระเงินผ่านโชคคอยน์",
        description: `เลือกการชำระผ่าน "โชคคอยน์" เพื่อยืนยันการจอง`,
    },
    {
        image: Images.StatusNotifications,
        title: "รับการแจ้งเตือนสถานะ",
        description: `หลังจากชำระเงินเสร็จ คุณจะได้รับการแจ้งเตือนสถานะการจองคิวและการเตือนเมื่อถึงเวลานัดหมาย`,
    },
];

const LandingPage = () => {
    const navigate = useNavigate(); // ✅ ใช้ useNavigate

    // ✅ ฟังก์ชันนำทางไปหน้า Homepage
    const handleBookingStart = () => {
        navigate("/homepage");
    };

    return (
        <div className="w-full overflow-x-hidden bg-[#F1F5F9]">
            <Navbarlogin />

            {/* ✅ Section1 */}
            <div className="w-screen">
                <img 
                    src={Images.Section1} 
                    alt="Section1" 
                    className="w-full h-auto object-cover"
                />
            </div>

            {/* ✅ Section เนื้อหาที่แสดงต่อกัน */}
            <div className="flex flex-col items-center mt-12 space-y-16">
                {contentData.map((item, index) => (
                    <ImageContent
                        key={index}
                        image={item.image}
                        title={item.title}
                        description={item.description}
                        isReversed={index % 2 !== 0} // สลับตำแหน่งซ้าย-ขวา
                    />
                ))}
            </div>

            {/* SectionEnd (ให้ <Footer /> ติดกับมัน) */}
            <div className="relative w-screen block -mb-px">
                <img 
                    src={Images.SectionEnd} 
                    alt="SectionEnd" 
                    className="w-full h-auto object-cover m-0 p-0"
                />
                {/*  เนื้อหาในเดสก์ท็อป (ซ่อนใน iPad และมือถือ) */}
                <div className="absolute right-4 md:right-12 lg:right-56 top-1/2 -translate-y-1/2 text-white max-w-md hidden xl:block">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">
                        เริ่มต้นจองคิวกับหมอดูที่คุณต้องการ
                    </h2>
                    <p className="text-lg md:text-2xl leading-relaxed mb-6">
                        เลือกหมอดูที่คุณถูกใจและเริ่มต้นจองคิวง่ายๆ ผ่านแอป Qseer 
                        พร้อมรับคำทำนายแบบเจาะลึก ที่จะช่วยให้คุณมองเห็นอนาคตได้ชัดเจนยิ่งขึ้น!
                    </p>
                    <button 
                        className="px-6 py-3 border border-white text-white font-bold text-lg rounded-full shadow-lg hover:bg-white hover:text-[#420F75] transition"
                        onClick={handleBookingStart} // 
                    >
                        เริ่มต้นการจองคิว
                    </button>  
                </div>

               
                <div className="absolute right-4 md:right-20 top-1/2 -translate-y-1/2 xl:hidden">
                    <button 
                        className="px-6 py-3 md:px-10 md:py-5 border border-white text-white font-bold text-lg md:text-2xl rounded-full shadow-lg hover:bg-white hover:text-[#420F75] transition"
                        onClick={handleBookingStart} 
                    >
                        เริ่มต้นการจองคิว
                    </button>  
                </div>
            </div>

            {/*  Footer (ไม่มีช่องว่างด้านบน) */}
            <Footer className="w-full m-0 p-0" />
        </div>
    );
};

export default LandingPage;
