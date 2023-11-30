import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  doctorDetailsSelector,
  getDoctorFeedbackAction,
} from "../../store/doctorDetails/doctorDetailsSlice";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { useTranslate } from "../../commonModules/translate";

const Order_Types = [
  { value: "1", label: "Most Helpful" },
  { value: "2", label: "Recent" }
];
export default function PatientFeedback() {
  const router = useRouter();
  const doctorDetails = useAppSelector(doctorDetailsSelector);
  const [feedback, setFeedback] = useState([]);
  const dispatch = useAppDispatch();

  const t = useTranslate();

  useEffect(() => {
    if (router.isReady) {
      getFeedback(Order_Types[0].value)
    }
  }, [router.isReady]);

  useEffect(() => {
    setFeedback(doctorDetails.doctorFeedbacks?.doctorFeedbacks);
  }, [doctorDetails.doctorFeedbacks.doctorFeedbacks]);

  const animatedComponents = makeAnimated();

  const getFeedback=(orderType:string)=>{
    const { doctorId }: { doctorId?: number } = router.query;
      dispatch(getDoctorFeedbackAction({
        id:doctorId as number,
        orderType
      }));
  }
  
  return (
    <>
      <div className="patientfeed-set">
        <div className="patientrate-left">
          <p>{feedback?.length} {t("results")}</p>
        </div>
        <div className="patientrate-right">
          <p>{t("sort_by")}:</p>
          <Select
            components={animatedComponents}
            classNamePrefix="react-select"
            options={Order_Types}
            defaultValue={Order_Types[0]}
            onChange={(val:any)=>{
              getFeedback(val.value)
            }}
          />
        </div>
      </div>

      <div className="userreview-box">
        {feedback?.length > 0 &&
          feedback?.map((data: any) => (
            <div key={data.createdAt} className="userreview-add">
              <div className="username-set">
                <h5>{data?.fullName}</h5>
                <div className="userrate-icon">
                  {Array.from(
                    Array(parseInt(data?.ratings, 10) || 0),
                    (element, index) => {
                      return <AiFillStar key={index} />;
                    }
                  )}
                </div>
                <p>
                  {moment
                    .utc(data?.createdAt)
                    .local()
                    .startOf("seconds")
                    .fromNow()}
                </p>
              </div>
              <p>{data?.comment}</p>
            </div>
          ))}
      </div>
    </>
  );
}
