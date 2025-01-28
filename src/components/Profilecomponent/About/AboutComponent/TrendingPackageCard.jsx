import React from "react";
import PackageCard from "./packagecard";

const TrendingPackageCard = ({ packageInfo }) => {
  return <PackageCard packageInfo={{ ...packageInfo, isPromotion: true }} />;
};

export default TrendingPackageCard;
