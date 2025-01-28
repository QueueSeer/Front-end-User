import React from "react";
import PackageCard from "./packagecard";

const NewPackageCard = ({ packageInfo }) => {
  return <PackageCard packageInfo={{ ...packageInfo, isNew: true }} />;
};

export default NewPackageCard;
