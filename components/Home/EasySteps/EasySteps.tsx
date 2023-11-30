import React from "react";
import {
  One,
  Searchicon,
  Docotricon,
  Two,
  Calandericon,
  Three,
  Checkedicon,
  Four,
} from "../../../public/assets";
import Image from "next/image";
import { useTranslate } from "../../../commonModules/translate";

function EasySteps() {
  const t = useTranslate();

  return (
    <>
      <div className="getsolution-set">
        <div className="CustContainer">
          <div className="getsolution-title">
            <h2>{t("steps_for_solution")}</h2>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="getsolution-list">
                <Image
                  src={Searchicon}
                  alt="searchicon"
                  className="geticon-set"
                  width="0"
                  height="0"
                  sizes="100vw"
                />
                <h5>{t("search_doctor")}</h5>
                <p>{t("solution_step1")}</p>
                <div className="numberimg">
                  <Image
                    src={One}
                    alt="One"
                    width="0"
                    height="0"
                    sizes="100vw"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="getsolution-list">
                <Image
                  src={Docotricon}
                  alt="docotricon"
                  className="geticon-set"
                  width="0"
                  height="0"
                  sizes="100vw"
                />
                <h5>{t("check_doctor_profile")}</h5>
                <p>{t("solution_step1")}</p>
                <div className="numberimg">
                  <Image
                    src={Two}
                    alt="Two"
                    width="0"
                    height="0"
                    sizes="100vw"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="getsolution-list">
                <Image
                  src={Calandericon}
                  alt="calandericon"
                  className="geticon-set"
                  width="0"
                  height="0"
                  sizes="100vw"
                />
                <h5>{t("schedule_appointment")}</h5>
                <p>{t("solution_step1")}</p>
                <div className="numberimg">
                  <Image
                    src={Three}
                    alt="Three"
                    width="0"
                    height="0"
                    sizes="100vw"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="getsolution-list">
                <Image
                  src={Checkedicon}
                  alt="checkedicon"
                  className="geticon-set"
                  width="0"
                  height="0"
                />
                <h5>{t("get_your_solution")}</h5>
                <p>{t("solution_step1")}</p>
                <div className="numberimg">
                  <Image src={Four} alt="Four" width="0" height="0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EasySteps;
