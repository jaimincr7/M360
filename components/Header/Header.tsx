import { useEffect, useState } from "react";
import { Dropdown, Nav, Navbar } from "react-bootstrap";
import { BiUser } from "react-icons/bi";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Image from "next/image";
import { Logo, UserProfileIcon } from "../../public/assets";
import Search from "../Common/search";
import Login from "../Common/Login/Login";
import VerificationCode from "../Common/Login/VerificationCode";
import ForgotPassword from "../Common/Login/ForgotPassword";
import CreateAccount from "../Common/Login/CreateAccount";
import {
  loginUserSelector,
  toggleLoginModal,
} from "../../store/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { useRouter } from "next/router";
import Link from "next/link";
import { getUserFromStorage } from "../../commonModules/commonInterfaces";
import MobileCodeVerification from "../Common/Login/MobileCodeVerification";
import { changeLanguage } from "../../store/language/languageSlice";
import { OTPTypes } from "../../utils/constant";
import { useTranslate } from "../../commonModules/translate";
import { getAllLanguages } from "../../store/custom/customSlice";

let currentUser: any = {};
function Header() {
  const login = useAppSelector(loginUserSelector);
  const router = useRouter();
  const t = useTranslate();
  const dispatch = useAppDispatch();
  const animatedComponents = makeAnimated();
  // const languages = [
  //   { value: "en", label: "English" },
  //   { value: "vi", label: "Vietnam" },
  //   { value: "ar", label: "Arabic" },
  // ];

  const [languages, setLanguageOptions] = useState([]);
  const [language, setLanguage] = useState(null);
  const [show, setShow] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(0);
  const [countryId, setCountryId] = useState(0);
  const [mobileNumberDisplay, setMobileNumberDisplay] = useState<
    string | number
  >(0);
  const [forgotUsernameDetail, setForgotUsernameDetail] = useState<{
    isForEmail: boolean;
    userName: string;
  }>({
    isForEmail: false,
    userName: "",
  });
  const [fullName, setFullName] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [showMobileCodeVerification, setShowMbileCodeVerification] =
    useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const handleShow = () => {
    setShow(true);
    setForgotUsernameDetail({
      isForEmail: false,
      userName: "",
    });
  };
  const handleClose = () => setShow(false);
  const handleCloseForgotPassword = () => setShowForgotPassword(false);
  const setCloseCreateAccount = () => setShowCreateAccount(false);
  const handleCloseVerification = () => setShowVerification(false);
  const handleCloseMobileVerification = () =>
    setShowMbileCodeVerification(false);

  useEffect(() => {
    dispatch(getAllLanguages()).then((res) => {
      const newLangs = res?.payload?.languages
        ?.filter((x: any) => x.isActive && x.shortName)
        ?.map((x: any) => ({
          value: x.shortName,
          label: x.name,
          languageId: x.languageId,
        }));
      setLanguageOptions(newLangs);
    });
  }, []);

  useEffect(() => {
    if (languages?.length) {
      if (localStorage && localStorage.getItem("lang")) {
        let lang = localStorage.getItem("lang");
        setLanguage(languages.find((i) => i.value === lang));
        dispatch(changeLanguage(lang));
      } else {
        setLanguage(languages[0]);
      }
    }
  }, [languages]);

  //On Create User change Avatar.
  const createUserAvatar = (value:any) => {
    setFullName(value?.fullName);
    setMobileNumberDisplay(value?.mobileNumber);
    setMobileNumberDisplay(
      `+${value?.phoneCode} ${value?.mobileNumber}`
    );
    localStorage.setItem("user", JSON.stringify(value));
  };
  //On Sign In User change Avatar.
  const signinUserAvatar = () => {
    setFullName(login.data.loginUser?.fullName);
    setMobileNumberDisplay(
      `+${login.data.loginUser?.phoneCode} ${login.data.loginUser?.mobileNumber}`
    );
    localStorage.setItem("user", JSON.stringify(login.data.loginUser));
    window.dispatchEvent(new Event("loggedInCustomEvent"));
  };

  const signinUserAvatarForOTP = () => {
    setFullName(login.loginWithOTP.loginWithOTP?.fullName);
    setMobileNumberDisplay(
      `+${login.loginWithOTP.loginWithOTP?.phoneCode} ${login.loginWithOTP.loginWithOTP?.mobileNumber}`
    );
    localStorage.setItem("user", JSON.stringify(login.loginWithOTP.loginWithOTP));
    window.dispatchEvent(new Event("loggedInCustomEvent"));
  };

  //On Get User
  useEffect(() => {
    currentUser = getUserFromStorage();
    if (Object.keys(currentUser).length > 0) {
      setFullName(currentUser.fullName);
      setMobileNumberDisplay(
        `+${currentUser.phoneCode} ${currentUser.mobileNumber}`
      );
    }
  }, []);

  useEffect(() => {
    currentUser = getUserFromStorage();
    if (Object.keys(currentUser).length > 0) {
      setFullName(currentUser.fullName);
      setMobileNumberDisplay(
        `+${currentUser.phoneCode} ${currentUser.mobileNumber}`
      );
    }
  }, [login.updatedUserData]);

  useEffect(() => {
    if (login.showLoginModal) {
      handleShow();
      dispatch(toggleLoginModal());
    }
  }, [login.showLoginModal]);

  const logout = () => {
    setFullName("");
    window.localStorage.clear();
    window.location.href = "/";
  };

  const onLanguageChange = (e) => {
    console.log(e, "eeee");
    setLanguage(languages.find((i) => i.value === e.value));
    dispatch(changeLanguage(e.value));
    if (localStorage) {
      localStorage.setItem("lang", e.value);
      localStorage.setItem("languageId", e.languageId);
    }
    window.location.reload();
  };

  return (
    <>
      {show && (
        <Login
          show={show}
          onHide={() => handleClose()}
          onShowVerify={() => setShowMbileCodeVerification(true)}
          onShowForgotPassword={() => setShowForgotPassword(true)}
          onShowCreateAccount={() => setShowCreateAccount(true)}
          signinUserAvatar={signinUserAvatar}
        />
      )}
      {showVerification && (
        <VerificationCode
          onShowMobileVerify={() => setShowMbileCodeVerification(true)}
          mobileNumber={
            forgotUsernameDetail.userName
              ? forgotUsernameDetail.userName
              : mobileNumber
          }
          countryId={countryId}
          show={showVerification}
          onHide={() => handleCloseVerification()}
          isForEmail={forgotUsernameDetail.isForEmail}
          isFor={OTPTypes.Login}
          signinUserAvatar={signinUserAvatarForOTP}
        />
      )}
      {showMobileCodeVerification && (
        <MobileCodeVerification
          show={showMobileCodeVerification}
          setShowVerification={() => setShowVerification(true)}
          setMobileNumber={setMobileNumber}
          setCountryId={setCountryId}
          setShowLogin={() => setShow(true)}
          onHide={() => handleCloseMobileVerification()}
        />
      )}
      {showCreateAccount && (
        <CreateAccount
          onShowLogin={() => setShow(true)}
          show={showCreateAccount}
          onHide={() => setCloseCreateAccount()}
          createUserAvatar={(value:any) => createUserAvatar(value)}
        />
      )}
      {showForgotPassword && (
        <ForgotPassword
          show={showForgotPassword}
          onHide={() => handleCloseForgotPassword()}
          onConfirm={(userName: string) => {
            handleCloseForgotPassword();
            setShow(true);
          }}
        />
      )}
      {/* <NewPassword show={show} onHide={() => handleClose()} /> */}

      <div className="headertop-cover">
        <div className="CustContainer">
          <Navbar collapseOnSelect expand="lg" className="headermainCov">
            <Link href="/" legacyBehavior>
              <Navbar.Brand href="#home">
                <div className="headerlogo-set">
                  <Image src={Logo} alt="logo" />
                </div>
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />

            {/* User Nav Menu Start */}

            {fullName == "" ? (
              <div className="signinup_btn">
                <a
                  href="javascript:;"
                  onClick={() => {
                    if (fullName == "") handleShow();
                  }}
                >
                  <BiUser />
                  <>
                    {t("signIn")} / {t("signUp")}
                  </>
                </a>
              </div>
            ) : (
              <></>
            )}
            {fullName == "" ? (
              <></>
            ) : (
              <Dropdown
                className="UserDatacCovmainnav"
                autoClose={"inside" || "outside"}
              >
                <Dropdown.Toggle id="dropdown-autoclose-outside">
                  <BiUser /> {fullName}
                </Dropdown.Toggle>
                <Dropdown.Menu className="mainnavuserloinboff">
                  <div className="userprofiledataCov">
                    <Image src={UserProfileIcon} alt="User Profile" />
                    <h6>{fullName}</h6>
                    <p>{mobileNumberDisplay}</p>
                  </div>
                  <Dropdown.Item
                    onClick={() => router.push("/me/appointments-list/")}
                  >
                    {t("MyAppoinmtnt")}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => router.push("/me/health-records/")}
                  >
                    {t("MyHealthRecords")}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => router.push("/me/manage-address/")}
                  >
                    {t("MyAddress")}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => router.push("/me/profile-settings/")}
                  >
                    {t("view_update_profile")}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => router.push("/me/notification-list/")}
                  >
                    {t("Notification")}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => logout()}>
                    {t("Logout")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}

            {/* User Nav Menu End */}

            <Search />

            <Navbar.Collapse id="responsive-navbar-nav" className="">
              <Nav className="">
                <Nav.Link
                  onClick={() => {
                    router.push({
                      pathname: "/doctor-list",
                      query: { servicetype: "1" },
                    });
                  }}
                >
                  {t("home_visit")}
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    router.push({
                      pathname: "/doctor-list",
                      query: { servicetype: "2" },
                    });
                  }}
                >
                  {t("vidio_consult")}
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    router.push({
                      pathname: "/doctor-list",
                      query: { servicetype: "3" },
                    });
                  }}
                >
                  {t("hospital_visit")}
                </Nav.Link>
                <div className="langdown-btn">
                  <Select
                    components={animatedComponents}
                    classNamePrefix="react-select"
                    value={language}
                    options={languages}
                    defaultValue={languages[0]}
                    onChange={(event: any) => onLanguageChange(event)}
                  />
                </div>
              </Nav>
            </Navbar.Collapse>
          </Navbar>

          {/* <div className="headerbox-cover">
                        <div className="headerlogo-set">
                            <a href="javascript:;"><img src={Logo} alt="logo" /></a>
                        </div>
                        <div className="searchbar-set">
                            <BiSearch />
                        </div>

                        <div className="right-headerpart">
                            <div className="ourmenulist-set">
                                <ul>
                                    <li>
                                    </li>
                                    <li>
                                        <a href="javascript:;">Video Consult</a>
                                    </li>
                                    <li>
                                        <a href="javascript:;">{t('hospital_visit')}</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="signinup_btn">
                                <a href="javascript:;"><BiUser />Sign In / Sign Up</a>
                            </div>
                            <div className="langdown-btn">
                                <select className="langdropdown" name="language">
                                    <option value="">English</option>
                                    <option value="">Vietnam</option>
                                    <option value="">Arabic</option>
                                </select>
                            </div>
                        </div>
                    </div> */}
        </div>
      </div>
    </>
  );
}

export default Header;
