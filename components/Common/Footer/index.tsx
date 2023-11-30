/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from "react";
// import { BsTwitter, BsInstagram } from "react-icons/bs";
// import { FaLinkedinIn } from "react-icons/fa";
import { ImFacebook, ImYoutube } from "react-icons/im";
import { MdPhoneInTalk, MdEmail } from "react-icons/md";
import Image from "next/image";
import { Logo, ZaloIconImg } from "../../../public/assets";
import ContactUs from "../ContactUs/ContactUs";
import { useRouter } from "next/router";
import { CURRENT_USER } from "../../../commonModules/localStorege";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { toggleLoginModal } from "../../../store/login/loginSlice";
import { SocialMediaHandler } from "../../../utils/constant";
import { customSelector, getConfig } from "../../../store/custom/customSlice";
import { useTranslate } from "../../../commonModules/translate";

function Footer() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const dispatch = useAppDispatch();
  const customSelectorState = useAppSelector(customSelector);

  const t = useTranslate();

  useEffect(() => {
    dispatch(getConfig());
  }, []);

  const checkLoginAndRedirect = (url: string) => {
    if (CURRENT_USER()?.userId) {
      router.push(url);
    } else {
      dispatch(toggleLoginModal());
    }
  };

  return (
    <>
      <ContactUs show={show} onHide={() => handleClose()} />
      <div className="footertop-cover">
        <div className="CustContainer">
          <div className="footercont-set">
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="footerlogo-cover">
                  <a
                    href="javascript:;"
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    <Image src={Logo} alt="logo" />
                  </a>
                  <div className="socialicon-set">
                    <a
                      target={"_blank"}
                      href={customSelectorState?.configData?.data.socialMediaZaloLink}
                      className="zaloiconsetfot"
                    >
                      <svg width="42" height="42" viewBox="0 0 2500 2372" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M456.955 2060.62C447.323 2056.32 440.245 2051.45 451.617 2041.82C458.579 2036.48 466.122 2031.61 473.665 2026.73C544.102 1981.01 610.246 1931 653.878 1857.31C690.431 1796.04 684.513 1759.95 638.792 1714.81C383.732 1459.75 271.868 1154.79 327.8 794.484C359.48 591.178 452.545 415.259 588.082 262.548C669.892 170.063 767.135 95.2158 873.661 32.9014C880.159 29.188 889.211 28.0276 890.371 18.3961C888.166 13.0582 884.453 14.6828 881.204 14.6828C699.946 14.6828 518.689 10.9695 338.012 15.7272C164.762 21.0651 15.2998 154.977 15.88 347.027C16.9244 907.973 15.88 1469.03 15.88 2030.56C15.88 2204.86 148.748 2350.6 322.462 2357.1C469.255 2363.02 616.164 2358.15 763.537 2357.68C774.329 2358.26 785.005 2358.73 795.797 2358.73H1572.46C1766.14 2358.73 1959.7 2359.77 2153.37 2358.73C2333 2358.73 2478.75 2213.56 2478.75 2034.39V2031.14V1716.44C2478.75 1708.89 2481.42 1700.89 2476.55 1692.76C2466.91 1693.34 2463.09 1701.35 2457.75 1706.8C2353.43 1811.71 2230.19 1896.18 2095.23 1955.83C1764.4 2101.58 1427.76 2111.79 1086.25 1994.59C1056.66 1983.8 1024.4 1982.75 993.764 1990.29C948.624 2001.55 903.948 2015.01 859.272 2028.47C728.029 2069.2 594 2087.42 456.955 2060.62Z" fill="#FDFEFE" />
                        <path d="M762.957 2358.03C616.164 2358.03 468.791 2362.9 321.882 2357.45C148.168 2350.49 15.2998 2204.74 15.2998 2030.91C15.2998 1469.96 16.3442 908.901 15.2998 347.375C15.2998 155.326 165.342 21.4133 338.012 16.5396C518.689 11.6658 699.946 15.4952 881.204 15.4952C884.453 15.4952 888.746 13.8706 890.371 19.2085C889.327 28.84 879.579 30.0004 873.661 33.7137C767.251 96.2603 669.892 170.991 588.082 263.593C453.126 416.304 359.48 591.643 327.8 795.528C271.868 1155.37 384.313 1460.91 638.676 1715.86C683.817 1761.58 689.735 1797.08 653.762 1858.36C610.246 1932.04 543.986 1982.06 473.549 2027.78C466.006 2032.07 458.463 2037.41 450.921 2042.28C439.665 2051.91 446.627 2056.79 456.259 2061.08C458.463 2065.95 461.132 2070.25 464.382 2074.54C526.232 2129.43 584.833 2188.03 645.639 2243.96C674.185 2270.3 702.615 2297.81 730.117 2325.19C741.373 2335.4 760.288 2338.65 762.957 2358.03Z" fill="white" />
                        <path d="M846.855 1154.21C928.085 1154.21 1004.44 1153.63 1080.33 1154.21C1122.8 1154.79 1145.9 1172.55 1150.3 1206.43C1155.18 1248.9 1130.46 1277.45 1084.16 1277.91C997.013 1278.96 910.446 1278.49 823.299 1278.49C798.002 1278.49 773.285 1279.54 747.988 1277.91C716.772 1276.29 686.137 1269.79 671.052 1237.53C655.967 1205.27 666.758 1176.26 687.182 1149.8C770.036 1044.44 853.354 938.376 936.788 833.01C941.661 826.511 946.419 820.129 951.293 814.211C945.955 805.044 938.412 809.337 931.914 808.873C873.777 808.293 815.176 808.873 757.155 808.293C743.694 808.293 730.233 806.668 717.353 803.999C686.718 797.037 667.919 766.402 674.881 736.231C679.755 715.807 695.885 699.097 716.308 694.224C729.189 690.974 742.65 689.35 756.111 689.35C851.845 688.77 948.16 688.77 1043.89 689.35C1061.07 688.77 1077.78 690.974 1094.49 695.268C1131.04 707.684 1146.71 741.569 1132.09 777.077C1119.21 807.713 1098.78 834.054 1078.24 860.395C1007.81 950.212 937.368 1039.45 866.814 1128.22C860.78 1135.41 855.442 1142.38 846.855 1154.21Z" fill="white" />
                        <path d="M1470.81 871.303C1483.69 854.593 1497.15 839.044 1519.2 834.75C1561.67 826.163 1601.48 853.549 1602.06 896.601C1603.68 1004.17 1603.1 1111.74 1602.06 1219.31C1602.06 1247.28 1583.72 1272 1557.38 1280.12C1530.46 1290.33 1499.82 1282.32 1482.07 1259.12C1472.9 1247.86 1469.19 1245.65 1456.31 1255.87C1407.34 1295.67 1351.99 1302.63 1292.22 1283.25C1196.49 1252.04 1157.27 1177.31 1146.48 1086.44C1135.22 988.042 1167.94 904.143 1256.25 852.505C1329.36 808.989 1403.51 812.702 1470.81 871.303ZM1280.39 1067.65C1281.43 1091.32 1288.97 1113.95 1303.02 1132.75C1332.03 1171.5 1387.49 1179.51 1426.72 1150.5C1433.21 1145.63 1439.13 1139.71 1444.47 1132.75C1474.64 1091.9 1474.64 1024.59 1444.47 983.748C1429.39 962.744 1405.71 950.444 1380.42 949.864C1321.23 946.15 1279.81 991.871 1280.39 1067.65ZM1843.54 1070.9C1839.24 932.69 1930.11 829.412 2059.26 825.583C2196.42 821.289 2296.45 913.311 2300.74 1047.69C2305.04 1183.8 2221.72 1280 2093.14 1293C1952.73 1307.04 1841.33 1205.39 1843.54 1070.9ZM1978.49 1058.01C1977.45 1084.94 1985.46 1111.28 2001.59 1133.33C2031.18 1172.08 2086.53 1179.63 2125.29 1149.46C2131.21 1145.16 2136.08 1139.82 2140.84 1134.37C2172.05 1093.52 2172.05 1024.59 2141.42 983.748C2126.33 963.325 2102.66 950.444 2077.36 949.864C2019.46 946.615 1978.49 990.711 1978.49 1058.01ZM1796.19 963.905C1796.19 1047.22 1796.77 1130.66 1796.19 1213.97C1796.77 1252.15 1766.6 1283.95 1728.42 1284.99C1721.93 1284.99 1714.96 1284.41 1708.47 1282.79C1681.54 1275.83 1661.12 1247.28 1661.12 1213.39V785.781C1661.12 760.484 1660.54 735.767 1661.12 710.469C1661.7 669.043 1688.04 642.121 1727.84 642.121C1768.69 641.541 1796.19 668.462 1796.19 711.514C1796.77 795.528 1796.19 880.007 1796.19 963.905Z" fill="white" />
                      </svg>

                    </a>
                    <a
                      target={"_blank"}
                      href={customSelectorState?.configData?.data.socialMediaFacebookLink}
                    >
                        <ImFacebook />
                    </a>
                    <a
                      target={"_blank"}
                      href={customSelectorState?.configData?.data.socialMediaYouTubeLink}
                    >
                        <ImYoutube />
                    </a>
                    {/* <a
                      target={"_blank"}
                      href={`https://www.twitter.com/${SocialMediaHandler.twitter}`}
                    >
                      <BsTwitter />
                    </a> */}
                    {/* <a
                      target={"_blank"}
                      href={`https://www.instagram.com/${SocialMediaHandler.instagram}`}
                    >
                      <BsInstagram />
                    </a> */}
                    {/* <a
                      target={"_blank"}
                      href={`https://www.linkedin.com/${SocialMediaHandler.linkedIn}`}
                    >
                      <FaLinkedinIn />
                    </a> */}
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="footerlink-set">
                  <h4 className="footertitle-set">{t("quick_links")}</h4>
                  <div className="footerlist-set">
                    <ul>
                      <li>
                        <a
                          href="javascript:;"
                          onClick={() => {
                            checkLoginAndRedirect("/me/appointments-list/");
                          }}
                        >
                          {t("MyAppoinmtnt")}
                        </a>
                      </li>
                      <li>
                        <a
                          href="javascript:;"
                          onClick={() => {
                            router.push("/blog/blog-list/");
                          }}
                        >
                          {t("health_feed")}
                        </a>
                      </li>
                      <li>
                        <a
                          href="javascript:;"
                          onClick={() => {
                            router.push("/info/faqs");
                          }}
                        >
                          {t("FAQs")}
                        </a>
                      </li>
                      <li>
                        <a href="javascript:;" onClick={handleShow}>
                          {t("ContactUs")}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="footerlink-set">
                  <h4 className="footertitle-set">{t("privcy_info")}</h4>
                  <div className="footerlist-set">
                    <ul>
                      <li>
                        <a
                          href="javascript:;"
                          onClick={() => {
                            router.push("/info/terms-and-service");
                          }}
                        >
                          {t("terms_service")}
                        </a>
                      </li>
                      <li>
                        <a
                          href="javascript:;"
                          onClick={() => {
                            router.push("/info/privacy-policy");
                          }}
                        >
                          {t("PrivacyPolicy")}
                        </a>
                      </li>
                      <li>
                        <a
                          href="javascript:;"
                          onClick={() => {
                            router.push("/info/about-us");
                          }}
                        >
                          {t("about_us")}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="contactinfo-set">
                  <h4 className="footertitle-set">{t("contact_info")}</h4>
                  <p>
                    {customSelectorState?.configData?.data?.sitContactAddress}
                  </p>
                  <a
                    href={`tel:${customSelectorState?.configData?.data?.siteContactMobileNumber}`}
                  >
                    <MdPhoneInTalk />
                    {
                      customSelectorState?.configData?.data
                        ?.siteContactMobileNumber
                    }
                  </a>
                  <a
                    href={`mailto:${customSelectorState?.configData?.data?.siteContactEmail}`}
                  >
                    <MdEmail />
                    {customSelectorState?.configData?.data?.siteContactEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="copyrightsec-set">
            <p>
              {t("copyright_line").replace("#YEAR#", new Date().getFullYear())}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
