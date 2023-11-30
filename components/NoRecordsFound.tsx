import React from "react";
import { useTranslate } from "../commonModules/translate";

const NoRecordsFound = () => {
  const t=useTranslate()
  return (
    <div className="my-4 d-flex justify-content-center">{t("no_record_found")}</div>
  );
};

export default NoRecordsFound;
