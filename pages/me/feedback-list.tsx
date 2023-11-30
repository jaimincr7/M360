import React, { useEffect, useState } from "react";
import BTable from "react-bootstrap/Table";
import { useTable, Column, useSortBy } from "react-table";
import { Button } from "react-bootstrap";
import { AiFillStar } from "react-icons/ai";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import UserProfileLayout from "../../layouts/userProfileLayout";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import {
  AppointmentReviewParams,
  appointmentReviewSelector,
  getAppointmentReviewes,
} from "../../store/user/userFeedbacksForDoctorSlice";
import { CURRENT_USER } from "../../commonModules/localStorege";
import moment from "moment";
import { FeedbackSortingType } from "../../utils/constant";
import NoRecordsFound from "../../components/NoRecordsFound";
import { useTranslate } from "../../commonModules/translate";

function FeedbackList() {
  const dispatch = useAppDispatch();
  const user = CURRENT_USER();
  const feedbacks = useAppSelector(appointmentReviewSelector);

  const t = useTranslate();

  const animatedComponents = makeAnimated();
  const [feedbackSortingTypeVal, setFeedbackSortingTypeVal] = useState<number>(
    FeedbackSortingType[0].value
  );
  useEffect(() => {
    const params: AppointmentReviewParams = {
      UserId: user?.userId,
      feedBackSortingType: feedbackSortingTypeVal,
    };
    dispatch(getAppointmentReviewes(params));
  }, [feedbackSortingTypeVal]);

  interface dataInterface {
    col1: string;
    col2: string;
  }
  const data = React.useMemo(() => [], []);
  const columns = React.useMemo(() => [] as Column[], []);
  const { getTableProps, getTableBodyProps } = useTable(
    { columns, data },
    useSortBy
  );
  return (
    <>
      <div className="FeedbackboxCovTitle">
        <div className="FeedbackboxTitleLeft">
          <h1>{t("feedback")}</h1>
        </div>
        <div className="FeedbackboxTitleRight">
          <div className="montfltmaindahtlrec">
            <Select
              components={animatedComponents}
              classNamePrefix="react-select"
              options={FeedbackSortingType.map(i => ({ ...i, label: t(i.label) }))}
              value={{
                ...FeedbackSortingType.find(
                  (x) => x.value === feedbackSortingTypeVal
                ), label: t(FeedbackSortingType.find(
                  (x) => x.value === feedbackSortingTypeVal
                ).label)
              }}
              onChange={(opt: any) => setFeedbackSortingTypeVal(opt.value)}
            />
          </div>
        </div>
      </div>

      <div className="ComallTblcovlst maxHeight">
        <BTable
          striped
          bordered
          hover
          size="sm"
          {...getTableProps()}
          className="TableaminCust"
        >
          <thead>
            <tr>
              <th className="Drnamerating">{t("Name")}</th>
              <th>{t("date")}</th>
              <th>{t("rating")}</th>
              <th>{t("review")}</th>
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {feedbacks?.reviewList?.length > 0 &&
              feedbacks.reviewList?.map((data) => (
                <tr key={`feedback-${data.appointmentReviewId}`}>
                  <td>{data.doctorName}</td>
                  <td>
                    {moment(data.createdAt).format("D")}{" "}
                    {moment(data.createdAt).format("MMM")},{" "}
                    {moment(data.createdAt).format("YYYY")}
                  </td>
                  <td>
                    <span className="Ratingboxstarbox">
                      {Array.from(
                        Array(parseInt(data.ratings.toString(), 10) || 0),
                        (element, index) => {
                          return <AiFillStar key={index} />;
                        }
                      )}
                    </span>
                  </td>
                  <td>{data.comment}</td>
                </tr>
              ))}
          </tbody>
        </BTable>
        {!feedbacks?.reviewList?.length && <NoRecordsFound />}
      </div>
    </>
  );
}

FeedbackList.PageLayout = UserProfileLayout;
export default FeedbackList;
