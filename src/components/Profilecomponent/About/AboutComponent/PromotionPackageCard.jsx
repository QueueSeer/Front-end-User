import React from "react";
import PackageCard from "./packagecard";

const PromotionPackageCard = ({ packageInfo }) => {
  return <PackageCard packageInfo={{ ...packageInfo, isPromotion: true, isDiscount: true }} />;
};

export default PromotionPackageCard;
