import React from "react";
import { Androidicon, Iosicon, Mobileimage } from "../../../public/assets";
// import '../../../css/main.css';
import Image from "next/image";

import { Container } from "react-bootstrap";
import { useTranslate } from "../../../commonModules/translate";
import { useAppSelector } from "../../../utils/hooks";
import { customSelector } from "../../../store/custom/customSlice";

function Appsection() {
  const t = useTranslate();
  const customSelectorState = useAppSelector(customSelector);

  return (
    <>
      <div className="appsect-cover">
        <Container>
          {/* <div className="CustContainer"> */}
          <div className="appsect-set">
            <div className="appsect-left">
              <h2>{t('download_insmart')}</h2>
              <p>
                {t("access_video_tagline_1")} <br />
                {t("access_video_tagline_2")}
              </p>
              <div className="downloadapp-set">
                <span>{t("get_link_line")}</span>
                <div className="appicon-img">
                  <a href={customSelectorState?.configData?.data.androidApkLink}>
                    <Image src={Androidicon} alt="android" />
                  </a>
                  <a href={customSelectorState?.configData?.data.iosApkLink}>
                    <Image src={Iosicon} alt="ios" />
                  </a>
                </div>
              </div>
            </div>
            <div className="appsect-right footer-mobile-image">
              <Image
                src={Mobileimage}
                width="0"
                height="100"
                alt="Mobile image"
              />
            </div>
          </div>
          {/* </div> */}
        </Container>
      </div>
    </>
  );
}

export default Appsection;
