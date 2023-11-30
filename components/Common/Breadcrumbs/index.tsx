import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { IBreadcrumb, BreadcrumbRoutes } from "../../../utils/breadcrumbConst";
import { useTranslate } from "../../../commonModules/translate";

function Breadcrumbs(props) {
  const { details } = props;
  const router = useRouter();
  const t = useTranslate();
  const [breadcrumbDetail, setBreadcrumbDetail] = useState<IBreadcrumb | null>(
    null
  );

  useLayoutEffect(() => {
    const dataObj = BreadcrumbRoutes.find((x) => x.path === router.pathname);
    setBreadcrumbDetail(dataObj);
  }, [router.asPath]);

  useEffect(() => {
    if (details?.details) {
      setBreadcrumbDetail(details);
    }
  }, [details]);

  return (
    breadcrumbDetail?.details && (
      <div className="CustContainer">
        <div className="breadcrumb-title">
          <ul>
            <li className={"cursorPointer"} onClick={() => router.push("/")}>
              {t("home")}
            </li>
            {breadcrumbDetail?.details?.map((detail, index: number) => (
              <React.Fragment key={`breadcrumb-detail=${index}`}>
                <li>
                  {" "}
                  <BiChevronRight />{" "}
                </li>
                <li
                  onClick={() => {
                    if (breadcrumbDetail?.details?.length !== index + 1) {
                      router.push(detail.path);
                    }
                  }}
                  className={
                    breadcrumbDetail?.details?.length === index + 1
                      ? ""
                      : "cursorPointer"
                  }
                >
                  {t(detail.lang_key) ? t(detail.lang_key) : detail.label}
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    )
  );
}

export default Breadcrumbs;
