import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Form, Nav, Spinner, Tab } from "react-bootstrap";
import { FaHospital, FaVideo } from "react-icons/fa";
import { TiHome } from "react-icons/ti";
import { Button } from "react-bootstrap";
import { Noslotbook } from "../../../public/assets";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import {
  appointmentStateSelector,
  getDoctorSlotsAction,
  setBookedAppointmentData,
} from "../../../store/user/appointmentSlice";
import { CURRENT_USER } from "../../../commonModules/localStorege";
import { useRouter } from "next/router";
import { useFormikContext } from "formik";
import {
  customSelector,
  getAllServiceTypes,
} from "../../../store/custom/customSlice";
import {
  doctorDetailsSelector,
  getDoctorsDetailsAction,
} from "../../../store/doctorDetails/doctorDetailsSlice";
import { isNumber } from "util";
import { toast } from "react-toastify";
import { toggleLoginModal } from "../../../store/login/loginSlice";
import { HpNameIfNull } from "../../../utils/constant";
import { useTranslate } from "../../../commonModules/translate";

function Index(props: any) {
  let values: any = {},
    setFieldValue: any = (name: string, val: any) => { };
  const formikProps = useFormikContext();
  if (formikProps) {
    values = formikProps.values;
    setFieldValue = formikProps.setFieldValue;
  }
  const router = useRouter();
  const appointmentState = useAppSelector(appointmentStateSelector);
  const customState = useAppSelector(customSelector);
  const doctorDetails = useAppSelector(doctorDetailsSelector);
  const drId = props.drId ? props.drId : Number(router.query?.doctorId);
  const [slots, setSlots] = useState<any>({});
  const [serviceTypes, setServiceTypes] = useState<any>([]);

  const dispatch = useAppDispatch();
  const currentUser = CURRENT_USER();

  const t = useTranslate();

  useEffect(() => {
    dispatch(getAllServiceTypes());
  }, []);

  useEffect(() => {
    if (drId) dispatch(getDoctorsDetailsAction(drId));
  }, [drId]);

  useEffect(() => {
    if (
      customState.serviceTypes?.serviceTypes?.length &&
      !props.followUpServiceId
    ) {
      setServiceTypes(customState.serviceTypes.serviceTypes);
      setFieldValue(
        "doctorServiceTypeId",
        customState.serviceTypes.serviceTypes[0].serviceTypeId
      );
      if (props.onServiceTypeChange) {
        props.onServiceTypeChange(
          customState.serviceTypes.serviceTypes[0].serviceTypeId
        );
      }
    }
  }, [customState.serviceTypes?.serviceTypes]);

  useEffect(() => {
    if (props.followUpServiceId) {
      setFieldValue("doctorServiceTypeId", props.followUpServiceId);
    }
  }, [props.followUpServiceId]);

  useEffect(() => {
    // const doctorId = appointmentState.makeAppointment.selectedDoctorForAppointment;
    if (values?.doctorServiceTypeId) {
      const params: any = {
        doctorId: drId,
        serviceTypeId: values?.doctorServiceTypeId,
        timeZoneOffSet: new Date().getTimezoneOffset().toString(),

        hospitalId: props.isForReschedule ? props.hospitalId : -1,
      };
      if (currentUser?.userId) {
        params.userId = currentUser?.userId;
      }
      dispatch(getDoctorSlotsAction(params));
    }
  }, [
    router.isReady,
    appointmentState.makeAppointment.selectedDoctorForAppointment,
    values?.doctorServiceTypeId,
    drId,
  ]);

  useEffect(() => {
    setSlots(appointmentState.makeAppointment.appointmentSlots);
  }, [appointmentState.makeAppointment.appointmentSlots]);

  useEffect(() => {
    if (slots?.daySlots?.length) {
      setFieldValue("daySlotDetail", slots.daySlots[0]);
    }
  }, [slots]);

  const onBookNow = () => {
    if (CURRENT_USER()?.userId) {
      if (props.isForReschedule && !values.rescheduleRemark) {
        toast.error(t("remark_required"));
        return;
      }
      if (props.handleBookBtn) {
        props.handleBookBtn();
      } else {
        dispatch(
          setBookedAppointmentData({
            ...values,
            doctorId: drId,
            doctorDetails: doctorDetails.data.doctorDetails,
            doctorHospitalDetail: doctorDetails.doctorHospital?.doctorHospital,
            walletBalance: slots.walletBalance,
            displayWalletBalance: slots.displayWalletBalance,
            doctorServiceName: serviceTypes?.find(
              (x: any) =>
                Number(x.serviceTypeId) === Number(values?.doctorServiceTypeId)
            )?.name,
            followupPtDetail: props.appointmentDetail?.patient,
            followupPtAddress: props.appointmentDetail?.appointmentAddress
              ? {
                  value:
                    props.appointmentDetail?.appointmentAddress?.userAddressId?.toString(),
                  label:
                    props.appointmentDetail?.appointmentAddress?.address +
                    ", " +
                    props.appointmentDetail?.appointmentAddress?.ward +
                    ", " +
                    props.appointmentDetail?.appointmentAddress?.city +
                    ", " +
                    props.appointmentDetail?.appointmentAddress?.district,
                }
              : null,
          })
        );
        router.push("/patient-details/");
      }
    } else {
      dispatch(toggleLoginModal());
    }
  };

  return (
    <>
      <div className="docbookapp-cover">
        {!props.followUpServiceId && !props.displaySingleServiceName && (
          <div className="tabbingdatabox-set">
            <ul>
              {props.displaySingleServiceName ? (
                <li>
                  <a
                    href="javascript:void(0)"
                    className={`ourservices-set active`}
                    title={props.displaySingleServiceName}
                  >
                    <Image
                      src={
                        serviceTypes?.find(
                          (x: any) => x.name === props.displaySingleServiceName
                        )?.imagePath
                      }
                      width={20}
                      height={20}
                      alt={"service type"}
                    />
                    {props.displaySingleServiceName}
                  </a>
                </li>
              ) : (
                serviceTypes?.map((x) => (
                  <li key={`service-type-${x.serviceTypeId}`}>
                    <a
                      href="javascript:void(0)"
                      onClick={() => {
                        if (props.onServiceTypeChange) {
                          props.onServiceTypeChange(x.serviceTypeId);
                        }
                        setFieldValue("doctorServiceTypeId", x.serviceTypeId);
                      }}
                      className={`ourservices-set ${values?.doctorServiceTypeId === x.serviceTypeId
                          ? "active"
                          : ""
                      }`}
                      title={x.description}
                    >
                      <Image
                        src={x.imagePath}
                        width={20}
                        height={20}
                        alt={"service type"}
                      />
                      {x.name}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        <div className="selectdaytext-set">
          {appointmentState.makeAppointment.status === "loading" ? (
            <div
              style={{ textAlign: "center", color: "var(--secondary-color)" }}
            >
              <Spinner animation="border" role="status">
                <span className="visually-hidden">{t("loading")}...</span>
              </Spinner>
            </div>
          ) : (
            <Tab.Container
              id="left-tabs-example"
              activeKey={values?.daySlotDetail?.shortDate}
            >
              {slots?.daySlots && (
                <>
                  <h5 className="selectday-title">{t("select_day")}</h5>
                  <div className="bookaslotbox-set">
                    <Nav variant="pills">
                      {slots?.daySlots?.map((x, i) => (
                        <Nav.Item key={`slot-day-${i}`}>
                          <Nav.Link
                            onClick={() => {
                              setFieldValue("daySlotDetail", x);
                              setFieldValue("selectedSlot", {});
                            }}
                            eventKey={x.shortDate}
                          >
                            {x.day} <span>{x.shortDayName?.slice(0, 2)}</span>
                          </Nav.Link>
                        </Nav.Item>
                      ))}
                    </Nav>
                  </div>
                </>
              )}
              {values?.daySlotDetail?.partOfDaySlots?.length ? (
                <>
                  <Tab.Content>
                    <Tab.Pane
                      eventKey={values?.daySlotDetail?.shortDate}
                      className="timeslothg-set"
                    >
                      <h5 className="timesolttitle-set">
                        {t("choose_one_of_the_available_time_slot")}
                      </h5>
                      {values?.daySlotDetail?.partOfDaySlots?.map(
                        (daySlot: any, j: number) => {
                          return (
                            daySlot.timeSlots?.length > 0 && (
                              <div
                                className="ourtimeing-solt"
                                key={`day-slot-selection-${j}-${daySlot.displayServiceCharge}`}
                              >
                                <div className="soltdayamount-set">
                                  <p>
                                    {daySlot.partOfDayName} |{" "}
                                    <span>
                                      {daySlot.hospitalName === null
                                        ? HpNameIfNull
                                        : daySlot.hospitalName}
                                    </span>
                                  </p>
                                  <h5>
                                    <span className="CurrencyTagcl">
                                      {daySlot.displayServiceCharge}
                                    </span>
                                  </h5>
                                </div>
                                <div className="time-slot">
                                  <ul className="clearfix">
                                    {daySlot.timeSlots?.map((time) => (
                                      <li
                                        key={time.slotDateTime + "timeSlot"}
                                        onClick={() => {
                                          setFieldValue("selectedSlot", time);
                                          setFieldValue(
                                            "partOfDaySlotDetail",
                                            daySlot
                                          );
                                        }}
                                      >
                                        <a
                                          className={`doc-slot-list timing ${values?.selectedSlot
                                              ?.slotDateTime ===
                                            time.slotDateTime
                                              ? " slotactive"
                                              : ""
                                          }`}
                                          href="javascript:;"
                                        >
                                          <span>{time.time}</span>
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )
                          );
                        }
                      )}
                    </Tab.Pane>
                  </Tab.Content>
                  {props.isForReschedule && (
                    <div className="ComsetFormAddIn">
                      <Form.Group className="FormInputcovermain" controlId="">
                        <Form.Label>{t("remark")}*</Form.Label>
                        <Form.Control
                          type={"text"}
                          placeholder={t("type_remark_here")}
                          value={values?.rescheduleRemark}
                          onChange={(e) => {
                            setFieldValue("rescheduleRemark", e.target.value);
                          }}
                          onBlur={(e) => {
                            setFieldValue(
                              "rescheduleRemark",
                              e.target.value?.trim()
                            );
                          }}
                        />
                      </Form.Group>
                    </div>
                  )}
                  <div className="booknowappo-btn">
                    <Button
                      type="button"
                      onClick={onBookNow}
                      className="viewpro-btn"
                      disabled={
                        !values?.selectedSlot?.slotDateTime ||
                        (props.isForReschedule &&
                          appointmentState.rescheduleAppointment.status ===
                            "loading")
                      }
                    >
                      {props.bookBtnTitle ? props.bookBtnTitle : t("book_now")}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="noslotimg-set">
                    <Image src={Noslotbook} alt="Noslotbook" height={250} />
                    <p>{t("no_slots_available_selected_day")}</p>
                  </div>
                </>
              )}
            </Tab.Container>
          )}
        </div>
      </div>
    </>
  );
}

export default Index;
