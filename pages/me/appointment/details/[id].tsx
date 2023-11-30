import { useEffect, useState } from "react";
import { AiFillEye, AiFillStar } from "react-icons/ai";
import { BiDownload } from "react-icons/bi";
import { BsFileEarmarkFill, BsEyeFill } from "react-icons/bs";
import { FaFilePrescription } from "react-icons/fa";
import { MdAccessTimeFilled, MdOutlineVerifiedUser } from "react-icons/md";
import {
  AppointmentReschedule,
  CancelAppointment,
  CompletedIcon,
  Doclist2,
  StartCall,
} from "../../../../public/assets";
import { Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import EPrescriptionModal from "../../../../components/Appointment/ePrescriptionModal";
import { useRouter } from "next/router";
import {
  appointmentStateSelector,
  getAppointmentAction,
  IRescheduleAppointment,
  rescheduleAppointmentAction,
} from "../../../../store/user/appointmentSlice";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import moment from "moment";
import Image from "next/image";
import {
  AppointmentStatus,
  HospitalFileType,
  InsuranceStatus,
  PaymentStatusEnum,
  UserType,
  UserTypeDetail,
} from "../../../../utils/constant";
import Bookappmodel from "../../../../components/Common/Model/bookappointment/bookappmodel";
import CancelAppointmentModal from "../../../../components/Appointment/cancelAppointmentModal";
import ShareFeedbackModal from "../../../../components/Appointment/ShareFeedback";
import AddInsuranceDetail from "../../../../components/Appointment/AddInsuranceDetail";
import { CURRENT_USER } from "../../../../commonModules/localStorege";
import { toast } from "react-toastify";
import Link from "next/link";
import { AiOutlineEye } from "react-icons/ai";
import { useTranslate } from "../../../../commonModules/translate";

function AppointmentDetails() {
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showShareFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const appointmentState = useAppSelector(appointmentStateSelector);
  const { id: appointmentId } = router.query;

  const [appointmentDetail, setAppointmentDetail] = useState<any>({});

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

  const handleReschedule = (values: any) => {
    const payload: IRescheduleAppointment = {
      appointmentId: appointmentDetail?.appointmentId,
      rescheduledByUserId: CURRENT_USER()?.userId,
      rescheduledByUserType: UserType.User,
      remark: values?.rescheduleRemark,
      oldServiceTypeId: appointmentDetail.serviceTypeId,
      newServiceTypeId: values.doctorServiceTypeId,
      oldAppointmentDate: appointmentDetail.appointmentDateTime,
      newAppointmentDate: values.selectedSlot?.slotDateTime,
    };
    dispatch(rescheduleAppointmentAction(payload)).then((res: any) => {
      if (res.payload?.appointmentId) {
        toast.success(res.payload.message);
        dispatch(getAppointmentAction(appointmentDetail?.appointmentId));
      }
      setShowRescheduleModal(false);
    });
  };
  return (
    <>
      {/* <RescheduleAppointment show={show} onHide={() => handleClose()} /> */}
      {/* <CallModal show={show} onHide={() => handleClose()} /> */}

      {showPrescriptionModal && (
        <EPrescriptionModal
          show={showPrescriptionModal}
          onHide={() => setShowPrescriptionModal(false)}
          prescriptionURL={appointmentDetail.prescription.prescriptionFilePath}
        />
      )}
      {showFollowUpModal && (
        <Bookappmodel
          followupParentAppointmentId={appointmentDetail?.appointmentId}
          followupParentServiceTypeId={appointmentDetail?.serviceTypeId}
          title={t("BookFollowupAppointment")}
          show={showFollowUpModal}
          selectedDrId={appointmentDetail?.doctorAppointmentDetails?.doctorId}
          onHide={() => {
            setShowFollowUpModal(false);
          }}
          appointmentDetail={appointmentDetail}
        />
      )}
      {showRescheduleModal && (
        <Bookappmodel
          title={t("reschedual_appintmnet")}
          followupParentServiceTypeId={appointmentDetail?.serviceTypeId}
          show={showRescheduleModal}
          selectedDrId={appointmentDetail?.doctorAppointmentDetails?.doctorId}
          onHide={() => {
            setShowRescheduleModal(false);
          }}
          bookBtnTitle={t("reschedual_appintmnet")}
          isForReschedule={true}
          handleReschedule={handleReschedule}
          hospitalId={appointmentDetail?.hospitalId}
        />
      )}
      {showCancelModal && (
        <CancelAppointmentModal
          show={showCancelModal}
          onHide={() => setShowCancelModal(false)}
          appointmentId={appointmentDetail?.appointmentId}
        />
      )}
      {showShareFeedbackModal && (
        <ShareFeedbackModal
          doctorId={appointmentDetail?.doctorAppointmentDetails?.doctorId}
          show={showShareFeedbackModal}
          onHide={() => setShowFeedbackModal(false)}
          appointmentId={appointmentDetail?.appointmentId}
        />
      )}
      {showInsuranceModal && (
        <AddInsuranceDetail
          doctorId={appointmentDetail?.doctorAppointmentDetails?.doctorId}
          show={showInsuranceModal}
          onHide={() => setShowInsuranceModal(false)}
          appointmentId={appointmentDetail?.appointmentId}
        />
      )}

      <div className="DetailsAppointdataBg">
        <div className="container">
          <div className="DetailsAppointdataCov">
            <div className="DetailsApontdataTitle">
              <h1>{t("appointment_details")}</h1>
            </div>
            <div className="DetailsApontdataIner">
              <div className="DetailsApontdatanLeft">
                {appointmentDetail?.isRatingOptionAvailable && (
                  <div className="AppontmentCompletedBox">
                    <Image
                      width={30}
                      height={30}
                      src={CompletedIcon}
                      alt="Appontment Completed"
                    />
                    <h4>
                      {AppointmentStatus[appointmentDetail?.appointmentStatus]}
                    </h4>
                    <Button
                      type="button"
                      onClick={() => setShowFeedbackModal(true)}
                    >
                      {t("share_your_feddback")}
                    </Button>
                  </div>
                )}
                <div className="ApondeltaDrcov">
                  <Image
                    src={appointmentDetail?.doctorAppointmentDetails?.photoPath}
                    alt=""
                    height={100}
                    width={100}
                  />
                  <h4>
                    {appointmentDetail?.doctorAppointmentDetails?.displayName}
                  </h4>
                  <p>
                    {appointmentDetail?.doctorAppointmentDetails?.specialities}{" "}
                    | 12 Years of Exp.
                  </p>
                  <div className="ApondeltaDrcovStar">
                    {Array.from(
                      Array(
                        parseInt(
                          appointmentDetail?.doctorAppointmentDetails
                            ?.averageRating,
                          10
                        ) || 0
                      ),
                      (element, index) => {
                        return <AiFillStar key={index} />;
                      }
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
                <div className="AppointInsuranceClaimed">
                  {appointmentDetail?.insuranceDetail?.insuranceClaimId ? (
                    <div className="InsuranceClaimedData">
                      <div className="InsuceCladdataLeft">
                        <h5>
                          <MdOutlineVerifiedUser /> {t("insurance_claimed")}
                        </h5>
                        <p>
                          {moment(
                            appointmentDetail?.insuranceDetail?.createdAt
                          ).format("MMM DD,yyyy | hh:mm A")}
                        </p>
                      </div>
                      <div className="InsuceCladdataRight">
                        <p>
                          <MdAccessTimeFilled />
                          {
                            InsuranceStatus[
                              appointmentDetail?.insuranceDetail
                                ?.insuranceStatus
                            ]
                          }
                        </p>
                      </div>
                    </div>
                  ) : (
                    appointmentDetail?.isClaimOptionAvailable && (
                      <div className="ApptInsurClaBtn">
                        <Button
                          type="button"
                          onClick={() => setShowInsuranceModal(true)}
                        >
                          <MdOutlineVerifiedUser /> {t("CalimInsurence")}
                        </Button>
                      </div>
                    )
                  )}
                </div>

                {/* Cancelled Remark Details */}
                {AppointmentStatus[appointmentDetail?.appointmentStatus] ===
                  AppointmentStatus[5] && (
                  <div className="Userapointremarkcancell">
                    <h6>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.5307 9.26112L8.26933 6.0016L11.5289 2.74209C12.1558 2.11695 12.1558 1.09949 11.5289 0.474355C10.9019 -0.156284 9.88809 -0.15445 9.26112 0.472521L5.99977 3.73204L2.73842 0.468855C2.11145 -0.158117 1.09583 -0.15445 0.468854 0.468855C-0.156285 1.09583 -0.156285 2.11328 0.468854 2.73842L3.73204 6.0016L0.476187 9.25562C-0.150785 9.8826 -0.150785 10.9 0.476187 11.5234C0.789673 11.8387 1.19849 11.9945 1.60914 11.9945C2.02162 11.9945 2.43043 11.8387 2.74392 11.5252L5.99977 8.26934L9.26296 11.5307C9.57644 11.8442 9.98526 12 10.3959 12C10.8066 12 11.2172 11.8423 11.5307 11.5307C12.1577 10.9037 12.1577 9.8881 11.5307 9.26112Z"
                          fill="#F44242"
                        />
                      </svg>
                      {t("appointment_cancelled")}
                    </h6>
                    {appointmentDetail?.cancelComment && (
                      <p>{appointmentDetail?.cancelComment}</p>
                    )}
                  </div>
                )}
                {/* Cancelled Remark Details */}

                {(appointmentDetail?.isCancelOptionAvailable ||
                  appointmentDetail?.isRescheduleOptionAvailable ||
                  appointmentDetail?.isVideoCallOptionAvailable) && (
                  <div className="ApondeltaDrcovAction">
                    {appointmentDetail?.isCancelOptionAvailable && (
                      <a
                        href="javascript:void(0);"
                        className="CancelAppointbtn"
                        onClick={() => setShowCancelModal(true)}
                      >
                        <Image
                          width={30}
                          height={30}
                          src={CancelAppointment}
                          alt="Cancel"
                        />{" "}
                        {t("Cancel")}
                      </a>
                    )}
                    {appointmentDetail?.isRescheduleOptionAvailable && (
                      <a
                        href="javascript:void(0);"
                        className="RescheduleAppointbtn"
                        onClick={() => setShowRescheduleModal(true)}
                      >
                        <Image
                          width={30}
                          height={30}
                          src={AppointmentReschedule}
                          alt="Reschedule"
                        />{" "}
                        {t("Reschedule")}
                      </a>
                    )}

                    {appointmentDetail?.isVideoCallOptionAvailable && (
                      <Link
                        href={"/me/appointment/videocall/" + appointmentId}
                        className="StartcallAppointbtn"
                      >
                        <Image
                          width={30}
                          height={30}
                          src={StartCall}
                          alt="Start call"
                        />{" "}
                        {t("StartCall")}
                      </Link>
                    )}
                  </div>
                )}
                {appointmentDetail?.appointmentRescheduleDetails?.length >
                  0 && (
                  <>
                    <div className="DetailsApontdataTitle">
                      <h1 className="mb-0">{t("reschedule_details")}</h1>
                    </div>
                    {appointmentDetail?.appointmentRescheduleDetails?.map(
                      (x: any, index: number) => {
                        return (
                          <div
                            className="RescheduleDataCov mb-0"
                            key={`reschedule-detail-${index}`}
                          >
                            <div className="RescheduleDataCard">
                              <h6>
                                {t("reschedule_by")} :{" "}
                                {UserTypeDetail[x?.rescheduledByUserType]}
                              </h6>
                              <h5>{t("previous_appointment_date_time")}:</h5>
                              <p>
                                {moment(x?.oldAppointmentDate).format(
                                  "DD-MM-yyyy, hh:mm A"
                                )}
                              </p>
                              <h5>{t("new_appointment_date_time")}:</h5>
                              <p>
                                {moment(x?.newAppointmentDate).format(
                                  "DD-MM-yyyy, hh:mm A"
                                )}
                              </p>
                              <h4>
                                <span>{t("remark")}:</span> {x?.remark}
                              </h4>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </>
                )}
                {/* {!appointmentDetail?.appointmentRescheduleDetails
                  ?.isRescheduled && (
                 
                )} */}
                {appointmentDetail?.isFollowupOptionAvailable && (
                  <div className="BookAppointfollowbtn">
                    <Button
                      type="button"
                      onClick={() => setShowFollowUpModal(true)}
                    >
                      {t("book_follow_up_appointment")}
                    </Button>
                  </div>
                )}
              </div>

              <div className="DetailsApontdatanRight">
                <div className="AcppointrightdataCov">
                  <div className="AcppointrightdaLeft">
                    <p>{t("apointment_no")}</p>
                  </div>
                  <div className="AcppointrightdaRight">
                    <p>{appointmentDetail?.appointmentNumber}</p>
                  </div>
                </div>
                <div className="AcppointrightdataCov">
                  <div className="AcppointrightdaLeft">
                    <p>{t("appointment_on")}</p>
                  </div>
                  <div className="AcppointrightdaRight">
                    <p>
                      {" "}
                      {moment(appointmentDetail?.appointmentDateTime).format(
                        "MMM DD, yyyy | hh:mm A"
                      )}
                    </p>
                  </div>
                </div>
                <div className="AcppointrightdataCov">
                  <div className="AcppointrightdaLeft">
                    <p>{t("uniqueid_and_passportno")}</p>
                  </div>
                  <div className="AcppointrightdaRight">
                    <p>{appointmentDetail?.patient?.uniqueId}</p>
                  </div>
                </div>
                <div className="AcppointrightdataCov">
                  <div className="AcppointrightdaLeft">
                    <p>{t("service_type")}</p>
                  </div>
                  <div className="AcppointrightdaRight">
                    <p>{appointmentDetail?.serviceType}</p>
                  </div>
                </div>
                {appointmentDetail?.prescription?.prescriptionFilePath && (
                  <div className="presdataMainCovbox">
                    <p>
                      <FaFilePrescription /> {t("Prescription")}
                    </p>
                    <div className="presdataMainCovBtn">
                      <Button
                        onClick={() => {
                          setShowPrescriptionModal(true);
                        }}
                      >
                        <AiFillEye />
                      </Button>
                      <Button type="button">
                        {/* eslint-disable-next-line react/jsx-no-target-blank */}
                        <a
                          href={
                            appointmentDetail.prescription.prescriptionFilePath
                          }
                          download="prescription.pdf"
                          target={"_blank"}
                        >
                          {" "}
                          <BiDownload />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                <div className="paripaymeAcodCov">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <h4>
                          {t("patient")}:{" "}
                          <span>{appointmentDetail?.patient?.fullName}</span>
                        </h4>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="paripaymeAcodInerdata">
                          <h5>
                            {appointmentDetail?.patient?.fullName} -{" "}
                            {appointmentDetail?.patient?.relation}
                          </h5>
                          <h6>
                            {appointmentDetail?.patient?.uniqueId}{" "}
                            <span>
                              {appointmentDetail?.patient?.gender === "M"
                                ? "Male"
                                : "Female"}{" "}
                              |{" "}
                              {
                                moment(appointmentDetail?.patient?.birthDate)
                                  .fromNow()
                                  .split(" ")[0]
                              }{" "}
                              {t("years")}
                            </span>
                          </h6>
                          <p>
                            +{appointmentDetail?.patient?.phoneCode}{" "}
                            {appointmentDetail?.patient?.mobileNumber}
                          </p>
                          <p> {appointmentDetail?.patient?.email}</p>
                          {/* <p>{appointmentDetail?.appointmentAddress?.address}, {appointmentDetail?.appointmentAddress?.ward}, {appointmentDetail?.appointmentAddress?.city}, {appointmentDetail?.appointmentAddress?.district}, {appointmentDetail?.appointmentAddress?.country}</p> */}
                          {appointmentDetail?.patient?.zaloNumber && (
                            <p>
                              {t("zalo_number")}:{" "}
                              <span>
                                {appointmentDetail?.patient?.zaloNumber}
                              </span>
                            </p>
                          )}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>

                <div className="paripaymeAcodCov">
                  <Accordion defaultActiveKey="3">
                    <Accordion.Item eventKey="3">
                      <Accordion.Header>
                        <h4>{t("petient_address")}</h4>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="paripaymeAcodInerdata">
                          <p>
                            {appointmentDetail?.appointmentAddress?.address},{" "}
                            {appointmentDetail?.appointmentAddress?.ward},{" "}
                            {appointmentDetail?.appointmentAddress?.city},{" "}
                            {appointmentDetail?.appointmentAddress?.district},{" "}
                            {appointmentDetail?.appointmentAddress?.country}
                          </p>
                          <p>
                            +{appointmentDetail?.appointmentAddress?.phoneCode}{" "}
                            {
                              appointmentDetail?.appointmentAddress
                                ?.mobileNumber
                            }
                          </p>
                          {appointmentDetail?.appointmentAddress?.email}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>

                <div className="paripaymeAcodCov">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        <h4>{t("symptoms_health_record")}</h4>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="parieAcodSymHelthdata">
                          <h3>{t("Symptoms")}</h3>
                          <p>
                            {appointmentDetail?.appointmentSymptoms
                              ?.map((x) => x.name)
                              ?.join(", ")}
                          </p>
                          <h3>{t("HealthRecord")}</h3>

                          {appointmentDetail?.healthRecords?.map((ht, i) =>
                            ht?.appointmentHelathRecordFiles?.map((x) => (
                              <div
                                className="AaapointRecordIner "
                                key={`health-rec-${x.filePath}`}
                              >
                                <p>
                                  {x.fileType === HospitalFileType.Document ? (
                                    <BsFileEarmarkFill />
                                  ) : (
                                    <BsFileEarmarkFill />
                                  )}
                                  {`${x.name}`}
                                </p>
                                <div>
                                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                                  <a
                                    href={x.filePath}
                                    download={x.name}
                                    target={"_blank"}
                                    className="PassShow"
                                  >
                                    <BsEyeFill />
                                  </a>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        {appointmentDetail?.consultationNotes && (
                          <div className="ConsultNoteboxapoinCov">
                            <h3>{t("consultion_notes")}</h3>
                            <p>
                              {appointmentDetail?.consultationNotes?.toString()}
                            </p>
                          </div>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>

                <div className="paripaymeAcodCov">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        <h4>
                          {t("payment_overview")}:{" "}
                          <span>
                            {PaymentStatusEnum.Completed ===
                            appointmentDetail?.paymentStatus
                              ? t("paid_online")
                              : t("cash_on_consultation")}
                          </span>
                        </h4>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="AppointmentPaymentBox">
                          <div className="ApntmentPayetblCov">
                            <div className="ApntmentPayetblLeft">
                              <p>{t("appoinmnent_charge")}</p>
                            </div>
                            <div className="ApntmentPayetblRight">
                              <p>
                                <span className="CurrencyTagcl">
                                  {appointmentDetail?.displayServiceCharge?.charAt(
                                    0
                                  )}
                                </span>
                                {appointmentDetail?.charge}
                              </p>
                            </div>
                          </div>
                          {appointmentDetail?.promocode && (
                            <div className="ApntmentPayetblCov">
                              <div className="ApntmentPayetblLeft">
                                <p>{t("promocode")}</p>
                                <h5>{appointmentDetail?.promocode}</h5>
                              </div>
                              <div className="ApntmentPayetblRight">
                                <p>
                                  -
                                  <span className="CurrencyTagcl">
                                    {appointmentDetail?.displayPromocodeDiscountAmount?.charAt(
                                      0
                                    )}
                                  </span>
                                  {appointmentDetail?.promocodeDiscountAmount}
                                </p>
                              </div>
                            </div>
                          )}
                          {appointmentDetail?.isWalletUsed && (
                            <div className="ApntmentPayetblCov">
                              <div className="ApntmentPayetblLeft">
                                <p>{t("wallate_discount")}</p>
                              </div>
                              <div className="ApntmentPayetblRight">
                                <p>
                                  -
                                  <span className="CurrencyTagcl">
                                    {appointmentDetail?.displayWalletAmount?.charAt(
                                      0
                                    )}
                                  </span>
                                  {appointmentDetail?.walletAmount}
                                </p>
                              </div>
                            </div>
                          )}
                          <hr />
                          <div className="ApntmentPayetblCov">
                            <div className="ApntmentPayetblLeft">
                              <p>
                                {PaymentStatusEnum.Completed ===
                                appointmentDetail?.paymentStatus
                                  ? t("paid_fees")
                                  : t("due_fees")}
                              </p>
                            </div>
                            <div className="ApntmentPayetblRight">
                              <h5>
                                <span className="CurrencyTagcl">
                                  {appointmentDetail?.displayServiceCharge?.charAt(
                                    0
                                  )}
                                </span>
                                {appointmentDetail?.finalCharge}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppointmentDetails;
