import React from "react";
import { IoLocationSharp } from "react-icons/io5";
import { FaUserMd } from "react-icons/fa";
import { Tophospital1 } from "../../../../public/assets";
import Image from "next/image";
import { myLoader } from "../../../../commonModules/commonInterfaces";
import { DEFAULT_IMAGE } from "../../../../pages/_app";
import { useTranslate } from "../../../../commonModules/translate";

function HospitalCard(props) {

  const t = useTranslate();

  return (
    <>
      <div className="tophospbox-cover">
        <div className="tophospimg-set">
          <Image
            src={props?.image || DEFAULT_IMAGE}
            alt="Hospitallist"
            loader={myLoader}
            width="0"
            height="0"
            sizes="100vw"
          />
        </div>
        <div className="hospnamedet-set">
          <a href="javascript:;">
            <h5>{props?.name}</h5>
            <p>
              <IoLocationSharp />
              {props?.city}
            </p>
            <span>
              <FaUserMd />
              {props?.doctorCount} {t("doctors")}
            </span>
          </a>
        </div>
      </div>
    </>
  );
}

export default HospitalCard;
