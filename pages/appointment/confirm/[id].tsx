import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { AiFillStar } from "react-icons/ai";
import { IoCalendar } from "react-icons/io5";
import { MdVerified, MdAccessTimeFilled, MdWarning } from "react-icons/md";
import { Doclist2 } from "../../../public/assets";
import {
  appointmentStateSelector,
  getAppointmentAction,
} from "../../../store/user/appointmentSlice";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import Breadcrumbs from "../../../components/Common/Breadcrumbs";
import { useTranslate } from "../../../commonModules/translate";
import ContactUs from "../../../components/Common/ContactUs/ContactUs";
import { AppointmentStatusType } from "../../../utils/constant";

const AppointmentConfirm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const appointmentState = useAppSelector(appointmentStateSelector);
  const { id: appointmentId, success, error } = router.query;
  const [appointmentDetail, setAppointmentDetail] = useState<any>({});
  const [showContactUs,setShowContactUs]=useState<boolean>(false)
  const t = useTranslate();
  useEffect(() => {
    if (router.isReady) {
      if (Number(appointmentId)) {
        dispatch(getAppointmentAction(Number(appointmentId)));
      } else {
        router.push("/");
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if (appointmentState.appointmentDetail?.data) {
      setAppointmentDetail(appointmentState.appointmentDetail.data);
    }
  }, [appointmentState.appointmentDetail?.data]);

  return (
    <>
      <div className="container">
        <Breadcrumbs
          details={{
            path: "/patient-details",
            details: [
              { label: t("doctor_listing"), path: "/doctor-list" },
              {
                label: t("doctor_detail"),
                path: `/doctor-details/${appointmentDetail?.doctorAppointmentDetails?.doctorId}`,
              },
              { label: t("book_appointment") },
            ],
          }}
        />
        <div className="AppointConfirmCover">
          <div className="AppointConfirmIner">
            <div className="AppointConfirmLeft">
              <div
                className={
                  error && success === "false"
                    ? "ApptConfiDetails ApptConfiDetailsError"
                    : "ApptConfiDetails"
                }
              >
                {error && success === "false" ? (
                  <>
                    <h1 className="d-flex">
                      <MdWarning />
                      <span>{error}</span>
                    </h1>
                    <h6>{t("appointment_failed_due_to_payment")}</h6>
                  </>
                ) : (
                  <>
                    <h1 className="d-flex">
                      <MdVerified />
                      <span> {t("appointment_confirmed")}</span>
                    </h1>
                    <h6>{t("appointment_booked_with")}</h6>
                  </>
                )}

                <h5>
                  {appointmentDetail?.doctorAppointmentDetails?.displayName} on{" "}
                  {moment(appointmentDetail?.appointmentDateTime).format(
                    "MMM DD,yyy |  hh:mm A"
                  )}{" "}
                </h5>
                <p>
                  {error && success === "false"  ?"": <>{t("please_check_your_email_msg")} <br /></>}{" "}
                  {t("having_trouble")}{" "}
                  <a
                    href="javascript:;"
                    onClick={() => {setShowContactUs(true)}}
                    >
                    {t("ContactUs")}
                  </a>
                </p>
              </div>
              <div className="ApptConfiPtdatalst">
                <p>{t("patient_name")}</p>
                <h6>{appointmentDetail?.patient?.fullName} </h6>
              </div>
              <div className="ApptConfiPtdatalst">
                <p>{t("mobile_number")}</p>
                <h6>
                  +{appointmentDetail?.patient?.phoneCode}{" "}
                  {appointmentDetail?.patient?.mobileNumber}
                </h6>
              </div>
              { ((appointmentDetail?.paymentType !== 1)  || (appointmentDetail?.paymentType === 1 && 
                appointmentDetail?.AppointmentStatus === AppointmentStatusType.Booked)) && 
                <div className="ViewApointbtncovconf">
                  <a
                    href="javascript:;"
                    onClick={() =>
                      router.push(`/me/appointment/details/${appointmentId}`)
                    }
                  >
                    {t("view_appointment")}
                  </a>
                </div>
              }
            </div>
            <div className="AppointConfirmRight">
              <div className="AppointConfirmCard">
                <div className="DoctHospitriDetails">
                  <div className="DoctHospiDetTime">
                    <p>
                      <IoCalendar /> {t("on")}{" "}
                      <span>
                        {moment(appointmentDetail?.appointmentDateTime).format(
                          "MMM DD, YYYY"
                        )}{" "}
                      </span>{" "}
                    </p>
                    <hr />
                    <p>
                      <MdAccessTimeFilled /> {t("at")}{" "}
                      {moment(appointmentDetail?.appointmentDateTime).format(
                        "hh:mm A"
                      )}{" "}
                    </p>
                    <br />
                  </div>
                  <div className="DoctHospitDrcov">
                    <Image
                      src={
                        appointmentDetail?.doctorAppointmentDetails?.photoPath
                      }
                      alt=""
                      width={100}
                      height={100}
                    />
                    <h4>
                      {appointmentDetail?.doctorAppointmentDetails?.displayName}
                    </h4>
                    <p>
                      {
                        appointmentDetail?.doctorAppointmentDetails
                          ?.specialities
                      }{" "}
                      |{" "}
                      {
                        appointmentDetail?.doctorAppointmentDetails
                          ?.yearsOfExperience
                      }{" "}
                      {t("years_exp")}
                    </p>
                    <div className="DoctHospitDrstar">
                      {Array.from(
                        {
                          length:
                            appointmentDetail?.doctorAppointmentDetails
                              ?.averageRating,
                        },
                        (_, i) => (
                          <AiFillStar key={`rating-${i}`} />
                        )
                      )}
                      <span>
                        (
                        {
                          appointmentDetail?.doctorAppointmentDetails
                            ?.totalRatings
                        }
                        )
                      </span>
                    </div>
                  </div>
                  <div className="HospiDetailCov">
                    <h3>{appointmentDetail?.hospital?.name}</h3>
                    <p>{appointmentDetail?.hospital?.address}</p>
                  </div>
                </div>

                <div className="DoctHospitriDettyp">
                  <div className="ApptConfiPtdatalst">
                    <p>{t("appointment_type")}</p>
                    <h6>{appointmentDetail?.serviceType} </h6>
                  </div>
                  <div className="ApptConfiPtdatalst">
                    <p>{success==="true" ? t("paid_fees"):t("due_fees")}</p>
                    <h6>
                      <span className="CurrencyTagcl">
                        {appointmentDetail?.displayServiceCharge}
                      </span>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showContactUs &&  <ContactUs show={showContactUs} onHide={() => setShowContactUs(false)} />}
    </>
  );
};

export default AppointmentConfirm;
