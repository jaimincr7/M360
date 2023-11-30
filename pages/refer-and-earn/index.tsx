import React, { useState, useEffect } from "react";
import {
  ReferEarnImg1,
  YouGetIcon,
  YourFriendsGetIcon,
  FacebookIcon,
  WhatsappIcon,
  FacebookShareIcon,
  TwitterShareIcon,
} from "../../public/assets";
import { Button, Modal } from "react-bootstrap";
import Image from "next/image";
import commonService from "../../services/commonService";
import { CURRENT_USER } from "../../commonModules/localStorege";
import { DeviceType } from "../../utils/constant";
import { info } from "console";
import { title } from "process";
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailIcon,
} from "react-share";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { useTranslate } from "../../commonModules/translate";

function ReferandEarn() {
  const t = useTranslate();
  const [detail, setDetail] = useState<{
    shortLink: string;
    previewLink: string;
    isMobile: boolean;
  }>({ shortLink: "", previewLink: "", isMobile: false });
  
  const [refDetails, setRefDetails] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    let regexp = /android|iphone|kindle|ipad/i;

    commonService
      .getReferralUrl(CURRENT_USER()?.userId, DeviceType.Web)
      .then((res) => {
        if (res?.data) {
          setDetail({
            ...res.data,
            isMobile: regexp.test(window.navigator.userAgent),
          });
        }
      });

      commonService
      .getReferralDetails(CURRENT_USER()?.userId, DeviceType.Web)
      .then((res) => {
        if (res?.data) {
          setRefDetails({
            ...res.data
          });
        }
      });
  }, []);

  return (
    <>
      <div className="container">
        <div className="ReferandEarnboxTitle">
          <h1>{t("refer_friend")}</h1>
        </div>
        <div className="ReferandEarnboxCov">
          <div className="ReferandEarnboxIner">
            <div className="ReferandEarninerTop">
              <h2>{t('refer_friend')}</h2>
              <p>
                {t("refer_frient_line_1")} <br /> {t("refer_frient_line_2")}
              </p>
              <Image width={320} src={ReferEarnImg1} alt="Refer and Earn" />
            </div>
            <div className="ReferandEarninerBot">
              <div className="ReferEarninerboxMain">
                <div className="ReferEarninerboxdata">
                  <Image src={YouGetIcon} alt="You Get" />
                  <h3>{t("you_get")}</h3>
                  <p>
                    {t("earn_pct_off").replace("#PERCENT#", refDetails?.referralByGetValue)}
                  </p>
                </div>
                <div className="ReferEarninerboxdata">
                  <Image src={YourFriendsGetIcon} alt="Your friends get" />
                  <h3>{t("your_friend_get")}</h3>
                  <p>{t("friend_consult").replace("#PERCENT#", refDetails?.referralToGetValue)}</p>
                </div>
              </div>
              <hr />
              <div className="ReferEarninerboxCodecp">
                <div className="ReferEarninoxcoecp1">
                  <h3>
                   {t("your_referral_code")}
                    <span>{detail.shortLink?.split("/")?.pop()}</span>
                  </h3>
                </div>
                <div className="ReferEarninoxcoecp2">
                  <Button
                    onClick={() =>
                      // navigator.clipboard.writeText(detail.shortLink)
                      setShowShareModal(true)
                    }
                  >
                    <span>
                      {/* Copy <br /> Code */}
                      {t("share")}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {detail?.isMobile && (
            <div className="ShareReferralcodebox">
              <p>{t("share_code_via")}</p>
              {/* <a href="">
              <Image src={FacebookIcon} alt="Facebook" />
            </a> */}
              <a
                href={`whatsapp://send?text=${detail.shortLink}`}
                data-action="share/whatsapp/share"
              >
               {t("share_to_wp")}{" "}
              </a>
              <a href="">
                <Image src={WhatsappIcon} alt="Whatsapp" />
              </a>
            </div>
          )}
        </div>
      </div>
      {showShareModal && (
        <Modal
          centered
          backdrop="static"
          show={showShareModal}
          onHide={() => setShowShareModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("refer_friend_family")}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <FacebookShareButton url={detail.shortLink} className="mx-2">
              <Image src={FacebookShareIcon} alt="Facebook" />
            </FacebookShareButton>
            <TwitterShareButton url={detail.shortLink} className="mx-2">
              <Image src={TwitterShareIcon} alt="Twitter" />
            </TwitterShareButton>
            <a
              href={`mailto:?body=${detail.shortLink}`}
              className="PrimaryColor mx-2"
            >
              <MdEmail size={40} />
            </a>
            <svg
              width="26"
              height="30"
              viewBox="0 0 26 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="cursorPointer mx-2"
              onClick={() => {
                navigator.clipboard.writeText(detail.shortLink);
                toast.success(t("refer_copy_success"));
              }}
            >
              <path
                d="M3 5.2125V21.25C2.99976 22.8368 3.60308 24.3643 4.6876 25.5226C5.77212 26.6809 7.25662 27.3834 8.84 27.4875L9.25 27.5H20.285C20.0265 28.231 19.5478 28.864 18.9147 29.3117C18.2817 29.7594 17.5254 29.9999 16.75 30H8C6.01088 30 4.10322 29.2098 2.6967 27.8033C1.29018 26.3968 0.500001 24.4891 0.500001 22.5V8.75C0.499594 7.97418 0.73982 7.21734 1.18757 6.58377C1.63532 5.95021 2.26856 5.47111 3 5.2125ZM21.75 0C22.7446 0 23.6984 0.395088 24.4017 1.09835C25.1049 1.80161 25.5 2.75544 25.5 3.75V21.25C25.5 22.2446 25.1049 23.1984 24.4017 23.9017C23.6984 24.6049 22.7446 25 21.75 25H9.25C8.25544 25 7.30161 24.6049 6.59835 23.9017C5.89509 23.1984 5.5 22.2446 5.5 21.25V3.75C5.5 2.75544 5.89509 1.80161 6.59835 1.09835C7.30161 0.395088 8.25544 0 9.25 0H21.75Z"
                fill="#174799"
              />
            </svg>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default ReferandEarn;
