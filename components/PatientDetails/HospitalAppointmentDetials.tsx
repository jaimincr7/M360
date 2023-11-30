import React, { useEffect, useState } from "react";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaHospitalAlt } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { IoCalendar } from "react-icons/io5";
import { Doclist2 } from "../../public/assets";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import {
  appointmentStateSelector,
  clearBookedAppointmentData,
} from "../../store/user/appointmentSlice";
import { FormikProps, useFormikContext } from "formik";
import moment from "moment";
import AppointmentPaymentDetials from "./AppointmentPaymentDetials";
import { useRouter } from "next/router";
import Link from "next/link";
import Datetimeslot from "../Common/DatetimeSlot";
import { title } from "process";
import { Modal } from "react-bootstrap";
import { useTranslate } from "../../commonModules/translate";

function HospitalAppointmentDetials() {
  const { setFieldValue, values }: FormikProps<any> = useFormikContext();
  const appointmentSelector: any = useAppSelector(appointmentStateSelector);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const t = useTranslate();

  const [showDateTimeSlot, setShowDateTimeSlot] = useState(false);
  useEffect(() => {
    if (
      appointmentSelector?.bookedAppointmentDetail &&
      Object.keys(appointmentSelector?.bookedAppointmentDetail)?.length
    ) {
      if (appointmentSelector.bookedAppointmentDetail.followupPtDetail) {
        setFieldValue(
          "patientDetail",
          appointmentSelector.bookedAppointmentDetail.followupPtDetail
        );
      }
      if (appointmentSelector.bookedAppointmentDetail.followupPtAddress) {
        setFieldValue(
          "addressDetail",
          appointmentSelector.bookedAppointmentDetail.followupPtAddress
        );
      }

      setFieldValue(
        "bookedAppointmentDetail",
        appointmentSelector.bookedAppointmentDetail
      );
      dispatch(clearBookedAppointmentData());
    } else {
      router.push("/");
    }
  }, []);

  const handleBookBtn = () => {
    const {
      doctorServiceTypeId,
      daySlotDetail,
      selectedSlot,
      partOfDaySlotDetail,
    } = values;
    setFieldValue("bookedAppointmentDetail", {
      ...values.bookedAppointmentDetail,
      doctorServiceTypeId,
      daySlotDetail,
      selectedSlot,
      partOfDaySlotDetail,
    });
    setShowDateTimeSlot(false);
  };
  return (
    <>
      <div className="DoctHospitriTitle">
        <p>
          <FaHospitalAlt /> {values?.bookedAppointmentDetail?.doctorServiceName}{" "}
          {t("appointment")}
        </p>
      </div>
      <div className="DoctHospitriDetails">
        <div className="DoctHospiDetTime">
          <p>
            <IoCalendar /> {t("on")}{" "}
            <span>
              {moment(
                values?.bookedAppointmentDetail?.selectedSlot?.slotDateTime
              ).format("MMM DD, YYYY")}{" "}
            </span>{" "}
          </p>
          <hr />
          <p>
            <MdAccessTimeFilled /> {t("at")}{" "}
            {values?.bookedAppointmentDetail?.selectedSlot?.time}{" "}
          </p>
          <br />
          <a href="javascript:;" onClick={() => setShowDateTimeSlot(true)}>
            {t("change_date_time")}
          </a>
        </div>
        <div className="DoctHospitDrcov">
          <Image
            src={values?.bookedAppointmentDetail?.doctorDetails?.photoPath}
            alt=""
            height={100}
            width={100}
          />
          <h4>{values?.bookedAppointmentDetail?.doctorDetails?.displayName}</h4>
          <p>
            {values?.bookedAppointmentDetail?.doctorDetails?.degrees} |{" "}
            {values?.bookedAppointmentDetail?.doctorDetails?.yearsOfExperience}{" "}
            {t("years_exp")}
          </p>
          <div className="DoctHospitDrstar">
            {Array.from(
              {
                length:
                  values?.bookedAppointmentDetail?.doctorDetails?.averageRating,
              },
              (_, i) => (
                <AiFillStar key={`rating-${i}`} />
              )
            )}

            <span>
              ({values?.bookedAppointmentDetail?.doctorDetails?.totalRatings})
            </span>
          </div>
        </div>
       {values?.bookedAppointmentDetail?.partOfDaySlotDetail?.hospitalName && <div className="HospiDetailCov">
          <h3>
            {values?.bookedAppointmentDetail?.partOfDaySlotDetail?.hospitalName}
          </h3>
          <p>
            {
              values?.bookedAppointmentDetail?.partOfDaySlotDetail
                ?.hospitalAddress
            }
          </p>
        </div>}
      </div>
      <AppointmentPaymentDetials />
      <Modal
        show={showDateTimeSlot}
        backdrop="static"
        keyboard={false}
        centered
        className="bookappointmodMain"
        onHide={() => setShowDateTimeSlot(false)}
      >
        <Modal.Header closeButton>
          <h5>{t("book_appointment_for_consultation")}</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="bookapp-consult">
            <Datetimeslot
              drId={values?.bookedAppointmentDetail?.doctorDetails?.doctorId}
              bookBtnTitle={t("save_changes")}
              handleBookBtn={handleBookBtn}
              followUpServiceId={
                values?.bookedAppointmentDetail?.followupParentAppointmentId
                  ? values?.bookedAppointmentDetail?.doctorServiceTypeId
                  : null
              }
              displaySingleServiceName={
                values?.bookedAppointmentDetail?.doctorServiceName
              }
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default HospitalAppointmentDetials;
