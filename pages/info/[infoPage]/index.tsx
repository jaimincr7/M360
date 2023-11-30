import { useRouter } from "next/router";
import React, { useEffect } from "react";
import LoadingSpinner from "../../../components/Common/LoadingSpinner";
import {
  customSelector,
  getInfoContentAction,
} from "../../../store/custom/customSlice";
import { CONST_LANGUAGE_ID, InfoPageConst } from "../../../utils/constant";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";

const InfoPage: React.FC<any> = () => {
  const { query, push, isReady } = useRouter();
  const { infoPage } = query;

  const dispatch = useAppDispatch();
  const customSliceSelector = useAppSelector(customSelector);

  useEffect(() => {
    if (isReady) {
      const pageName = infoPage?.toString()?.toLowerCase();
      if (InfoPageConst[pageName]) {
        dispatch(
          getInfoContentAction({
            type: InfoPageConst[pageName],
            languageId: CONST_LANGUAGE_ID,
          })
        );
      } else {
        push("/");
      }
    }
  }, [infoPage, isReady]);

  return (
    <>
      {customSliceSelector.infoContent.status === "loading" ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="AllContpageCoverset">
            <div className="CustContainer">
              <h1>{customSliceSelector.infoContent.data?.title}</h1>
              <div
                className="AllContpageCoverData"
                dangerouslySetInnerHTML={{
                  __html:
                    customSliceSelector.infoContent.data?.description?.toString(),
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InfoPage;
