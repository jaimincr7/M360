import React from "react";
import { Spinner } from "react-bootstrap";
import { useTranslate } from "../../../commonModules/translate";

const LoadingSpinner = () => {
  const t=useTranslate()
  return (
    <div style={{ textAlign: "center", color: "#B01F24" }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">{t("loading")}...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
