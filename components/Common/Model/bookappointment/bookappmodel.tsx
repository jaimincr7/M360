/* eslint-disable react-hooks/rules-of-hooks */
import { Formik } from "formik";
import React, { useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Datetimeslot from "../../DatetimeSlot";
import { useTranslate } from "../../../../commonModules/translate";

function bookappmodel(props: {
  show: boolean;
  onHide: any;
  selectedDrId: number;
  title?: string;
  followupParentAppointmentId?: number;
  bookBtnTitle?: string;
  isForReschedule?: boolean;
  handleReschedule?: (Values: any) => void;
  hospitalId?: number;
  followupParentServiceTypeId?: number;
  appointmentDetail?: any;
}) {
  const {
    show,
    onHide,
    selectedDrId,
    title,
    followupParentAppointmentId,
    bookBtnTitle,
    isForReschedule,
    handleReschedule,
    followupParentServiceTypeId,
    appointmentDetail,
  } = props;

  const formRef: any = useRef(null);
  const t = useTranslate();
  const initVal = {
    doctorServiceTypeId: "",
    daySlotDetail: {},
    followupParentAppointmentId: 0,
  };

  useEffect(() => {
    if (formRef.current) {
      formRef.current.setFieldValue(
        "followupParentAppointmentId",
        followupParentAppointmentId
      );
    }
  }, [formRef, followupParentAppointmentId]);

  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      centered
      className="bookappointmodMain"
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <h5>{title ? title : t("book_appointment_for_consultation")}</h5>
      </Modal.Header>
      <Modal.Body>
        <Formik
          innerRef={formRef}
          initialValues={initVal}
          onSubmit={(values) => {
            console.log("formil values", values);
          }}
          enableReinitialize
        >
          {({ handleSubmit, values }) => (
            <form onSubmit={handleSubmit}>
              <div className="bookapp-consult">
                {handleReschedule ? (
                  <Datetimeslot
                    drId={selectedDrId}
                    bookBtnTitle={bookBtnTitle}
                    isForReschedule={isForReschedule}
                    handleBookBtn={() => {
                      handleReschedule(values);
                    }}
                    hospitalId={props.hospitalId}
                    followUpServiceId={
                      (followupParentAppointmentId || isForReschedule) &&
                        followupParentServiceTypeId
                        ? followupParentServiceTypeId
                        : null
                    }
                  />
                ) : (
                  <Datetimeslot
                    drId={selectedDrId}
                    bookBtnTitle={bookBtnTitle}
                    isForReschedule={isForReschedule}
                    followUpServiceId={
                      (followupParentAppointmentId || isForReschedule) &&
                        followupParentServiceTypeId
                        ? followupParentServiceTypeId
                        : null
                    }
                    appointmentDetail={appointmentDetail}
                  />
                )}
              </div>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default bookappmodel;
