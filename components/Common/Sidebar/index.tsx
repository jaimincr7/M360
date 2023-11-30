import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import { FaUser } from "react-icons/fa";
import { CURRENT_USER } from "../../../commonModules/localStorege";
import { useTranslate } from "../../../commonModules/translate";
import { useAppSelector } from "../../../utils/hooks";
import { loginUserSelector } from "../../../store/login/loginSlice";

export default function Sidebar() {
  const router = useRouter();
  const login = useAppSelector(loginUserSelector);

  const [currentUser, setCurrentUser] = useState(CURRENT_USER() ?? {});

  useEffect(() => {
    setCurrentUser(CURRENT_USER() ?? {});
  }, []);

  useEffect(() => {
    setCurrentUser(CURRENT_USER() ?? {});
  }, [login.updatedUserData]);

  const t = useTranslate();
  const logout = () => {
    window.localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <div className="SidebarSettingsCov">
        <div className="SidebarSetgsusername">
          <div className="SidebarSetgsuserIner">
            <div className="SidebarSetgsuIcon">
              <FaUser />
            </div>
            <h3>{currentUser.fullName}</h3>
            <p>
              +{currentUser.phoneCode} {currentUser.mobileNumber}
            </p>
          </div>
          <hr />
        </div>
        <div className="SidebarSettCovNav">
          <ul>
            {/*Nav active class add in li :- className="active" */}
            <li
              className={
                router.asPath === "/me/profile-settings/" ? "active" : ""
              }
            >
              <Link href="/me/profile-settings/">{t("profile_setting")}</Link>
            </li>
            <li
              className={
                router.asPath === "/me/appointments-list/" ? "active" : ""
              }
            >
              <Link href="/me/appointments-list/">{t("appointments")}</Link>
            </li>
            <li
              className={
                router.asPath === "/me/health-records/" ? "active" : ""
              }
            >
              <Link href="/me/health-records/">{t("helth_records")}</Link>
            </li>
            <li
              className={router.asPath === "/me/family-member/" ? "active" : ""}
            >
              <Link href="/me/family-member/">{t("family_member")}</Link>
            </li>
            <li
              className={
                router.asPath === "/me/manage-address/" ? "active" : ""
              }
            >
              <Link href="/me/manage-address/">{t("address")}</Link>
            </li>
            <li
              className={router.asPath === "/me/feedback-list/" ? "active" : ""}
            >
              <Link href="/me/feedback-list/">{t("feedback")}</Link>
            </li>
            <li
              className={
                router.asPath === "/me/wallet-history/" ? "active" : ""
              }
            >
              <Link href="/me/wallet-history/">{t("wallet")}</Link>
            </li>
            <li
              className={
                router.asPath === "/me/notification-list/" ? "active" : ""
              }
            >
              <Link href="/me/notification-list/">{t("Notification")}</Link>
            </li>
            <li>
              <a href="/" onClick={() => logout()}>
                {t("Logout")}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
