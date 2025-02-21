import Images from "../../../assets";

const MenuItems = [
  { icon: Images.UserIcon, text: "โปรไฟล์", href: "/profileme" },
  { icon: Images.calendarIcon, text: "จองคิว", href: "/queuehistory" },
  { icon: Images.OutlineIcon, text: "การชำระเงิน", href: ["/paymentHistoryPage"] }, 
  { icon: Images.Users_GroupIcon, text: "ผู้ติดตาม", href: "/follower" },
];

export default MenuItems;
