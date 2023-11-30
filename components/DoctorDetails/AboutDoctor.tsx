import React, { useEffect, useState } from "react";
import { FaUserAlt, FaGraduationCap } from "react-icons/fa";
import { BsFillStarFill, BsBriefcaseFill } from "react-icons/bs";
import { RiShieldStarFill } from "react-icons/ri";
import { useAppSelector } from "../../utils/hooks";
import { doctorDetailsSelector } from "../../store/doctorDetails/doctorDetailsSlice";
import moment from "moment";
import { useTranslate } from "../../commonModules/translate";
import { CURRENT_LANG_ID } from "../../commonModules/localStorege";

export default function AboutDoctor() {
  const doctorDetails = useAppSelector(doctorDetailsSelector);
  const [doctor, setDoctor] = useState<any>({});
  const t = useTranslate();
  const currentLang = CURRENT_LANG_ID();

  useEffect(() => {
    setDoctor(doctorDetails.data.doctorDetails);
  }, [doctorDetails.data.doctorDetails]);

  return (
    <>
      {!!doctor && !!doctor?.biography && (
        <div className="aboutmedoc-det">
          <h5 className="aboutdoc-title">
            <FaUserAlt />
            {t("professional_bio")}
          </h5>
          <div className="aboutdoc-text">
            <p>{currentLang === "2" && doctor?.vietnamBiography ? doctor?.vietnamBiography : doctor?.biography}</p>
          </div>
        </div>
      )}

      {!!doctor &&
        !!doctor?.specialities &&
        doctor?.specialities?.length > 0 && (
          <div className="aboutmedoc-det">
            <h5 className="aboutdoc-title">
              <BsFillStarFill />
            {t("Specializations")}
            </h5>
            <div className="specializlist-set">
              <ul>
                {doctor?.specialities?.map((spc) => (
                  <li key={spc.specialityId}>{spc?.name ? spc?.name : ""}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

      {!!doctor && doctor?.experiance && doctor?.experiance?.length > 0 && (
        <div className="aboutmedoc-det">
          <h5 className="aboutdoc-title">
            <BsBriefcaseFill />
            {t("Experience")}
          </h5>
          <div className="educationlist-set">
            <ul>
              {doctor?.experiance?.map((exp) => (
                <>
                  <li>
                    {" "}
                    {moment(exp.from).format("MM/DD/YYYY")} -{" "}
                    {moment(exp.to).format("MM/DD/YYYY")} {currentLang === "2" && exp.vietnamDesignation ? exp.vietnamDesignation : exp.designation} at{" "}
                    {currentLang === "2" && exp.vietnamHospitalName ? exp.vietnamHospitalName : exp.hospitalName}
                  </li>
                </>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!!doctor && doctor?.education && doctor?.education?.length > 0 && (
        <div className="aboutmedoc-det">
          <h5 className="aboutdoc-title">
            <FaGraduationCap />
            {t("Education")}
          </h5>
          <div className="educationlist-set">
            <ul>
              {doctor?.education?.map((edu) => (
                <>
                  <li>
                    {currentLang === "2" && edu.vietnamDegree? edu.vietnamDegree : edu.degree} - {currentLang === "2" && edu.vietnamCollege ? edu.vietnamCollege : edu.college},{" "}
                    {moment(edu.completionYear).format("MM/DD/YYYY")}{" "}
                  </li>
                </>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!!doctor && doctor?.awards && doctor?.awards?.length > 0 && (
        <div className="aboutmedoc-det">
          <h5 className="aboutdoc-title">
            <RiShieldStarFill />
            {t("AwardsandRecognitions")}
          </h5>
          <div className="educationlist-set">
            <ul>
              {doctor?.awards?.map((awd) => (
                <>
                  <li>
                    {currentLang === "2" && awd.vietnamAward ? awd.vietnamAward : awd.award} - {moment(awd.year).format("MM/DD/YYYY")}
                  </li>
                </>
              ))}
            </ul>
          </div>
        </div>
      )}      
    </>
  );
}
