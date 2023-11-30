import React, { useEffect, useState } from "react";
import { BsInfoCircleFill } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  appointmentStateSelector,
  makeAppointmentAction,
} from "../../store/user/appointmentSlice";
import { FormikProps, useFormikContext } from "formik";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import OffersModal from "../Common/offersmodal/OffersModal";
import {
  applyWalletBalance,
  walletSelector,
} from "../../store/user/userWalletSlice";
import { CURRENT_USER } from "../../commonModules/localStorege";
import { IMakeAppointment } from "../../commonModules/commonInterfaces";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import {
  applyPromoCode,
  doctorListSelector,
} from "../../store/promocode/promocodeSlice";
import { useTranslate } from "../../commonModules/translate";
import { PaymentTypeEnum } from "../../utils/constant";

function AppointmentPaymentDetials() {
  const { setFieldValue, values }: FormikProps<any> = useFormikContext();
  const dispatch = useAppDispatch();
  const currentUser = CURRENT_USER();
  const walletSelectorState = useAppSelector(walletSelector);
  const router = useRouter();
  const promocodeState = useAppSelector(doctorListSelector);

  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslate();
  const [payAmtDetail, setPayAmtDetail] = useState<{
    amt: number;
    displayAmt: string;
    code: string;
  }>({
    amt: 0,
    displayAmt: "",
    code: "",
  });

  useEffect(() => {
    if (
      values?.bookedAppointmentDetail?.partOfDaySlotDetail?.displayServiceCharge
    ) {
      setPayAmtDetail({
        displayAmt:
          values?.bookedAppointmentDetail?.partOfDaySlotDetail
            ?.displayServiceCharge,
        amt: values?.bookedAppointmentDetail?.partOfDaySlotDetail
          ?.serviceCharge,
        code: "",
      });
    }
  }, [values?.bookedAppointmentDetail?.partOfDaySlotDetail]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const onApplyCpn = (cpnDetail: any) => {
    setPayAmtDetail({
      amt: cpnDetail.finalAmount,
      displayAmt: cpnDetail.displayFinalAmount,
      code: cpnDetail.code,
    });
  };

  const handleMakeAppointment = () => {
    const {
      healthRecord,
      bookedAppointmentDetail,
      consulationNoteAppointmentIds,
      symptoms,
      isWalletUsed,
      promocodeId,
      patientDetail,
      addressDetail,
      paymentType,
    } = values;
    const errors: string[] = [];
    if (!patientDetail?.patientId || !patientDetail?.mobileNumber) {
      errors.push("Please select Patient Details.");
    }
    if (!healthRecord?.length) {
      errors.push("Please select Health Record.");
    }
    if (!(symptoms?.length > 0)) {
      errors.push("Please select Symptoms.");
    }
    if (!addressDetail.value) {
      errors.push("Please select Address.");
    }
    if (errors.length === 0) {
      setIsLoading(true);
      const payload: IMakeAppointment = {
        doctorId: bookedAppointmentDetail.doctorId,
        hospitalId: bookedAppointmentDetail.partOfDaySlotDetail?.hospitalId,
        patientId: patientDetail.patientId,
        userId: currentUser.userId,
        serviceTypeId: bookedAppointmentDetail.doctorServiceTypeId,
        appointmentDateTime: bookedAppointmentDetail.selectedSlot?.slotDateTime,
        addressId: addressDetail.value,
        isWalletUsed: isWalletUsed ? isWalletUsed : false,
        consulationNoteAppointmentIds: consulationNoteAppointmentIds.toString(),
        userHealthRecordIds: healthRecord?.map((x: any) => x.value)?.toString(),
        symptoms: symptoms.map((x) => x.value).toString(),
        mobileNumber: patientDetail.mobileNumber,
        isFollowup: bookedAppointmentDetail.followupParentAppointmentId
          ? true
          : false,
        followupParentAppointmentId:
          bookedAppointmentDetail.followupParentAppointmentId
            ? bookedAppointmentDetail.followupParentAppointmentId
            : 0,
        followupRemark: "",
        paymentType:
          paymentType === "online"
            ? PaymentTypeEnum.PayOnline
            : PaymentTypeEnum.CashOnConsultation,
      };
      if (promocodeId) {
        payload.promocodeId = promocodeId;
      }
      dispatch(makeAppointmentAction(payload))
        .then((res) => {
          if (Number(res.payload?.appointmentId) > 0) {
            if (paymentType === "online") {
              if (res.payload?.paymentCheckout?.checkoutUrl) {
                window.location=res.payload?.paymentCheckout?.checkoutUrl;
              }
            } else {
              toast.success(t("appointment_book_success"));
              router.push("appointment/confirm/" + res.payload?.appointmentId);
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      toast.error(errors.join(""));
    }
  };

  const onRemoveCode = () => {
    dispatch(
      applyPromoCode({
        promocodeId: values.promoCodeId,
        userId: currentUser.userId,
        mobileNumber: currentUser.mobileNumber,
        doctorId: values?.bookedAppointmentDetail?.doctorDetails?.doctorId,
        hospitalId:
          values?.bookedAppointmentDetail?.partOfDaySlotDetail?.hospitalId,
        serviceTypeId: values?.bookedAppointmentDetail?.doctorServiceTypeId,
        isApply: false,
      })
    ).then((res) => {
      if (res.payload?.isValid) {
        setFieldValue("promocodeId", "");
        onApplyCpn({ ...res.payload, code: "" });
        if (values?.isWalletUsed) {
          dispatch(
            applyWalletBalance({
              promocodeId: 0,
              userId: currentUser.userId,
              mobileNumber: currentUser.mobileNumber,
              doctorId:
                values?.bookedAppointmentDetail?.doctorDetails?.doctorId,
              hospitalId:
                values?.bookedAppointmentDetail?.partOfDaySlotDetail
                  ?.hospitalId,
              serviceTypeId:
                values?.bookedAppointmentDetail?.doctorServiceTypeId,
              isApply: true,
            })
          );
        }
      }
    });
  };

  const onWalletUsedChange = () => {
    const isChecked = values?.isWalletUsed ? false : true;
    setFieldValue("isWalletUsed", isChecked);
    dispatch(
      applyWalletBalance({
        promocodeId: values.promocodeId || 0,
        userId: currentUser.userId,
        mobileNumber: currentUser.mobileNumber,
        doctorId: values?.bookedAppointmentDetail?.doctorDetails?.doctorId,
        hospitalId:
          values?.bookedAppointmentDetail?.partOfDaySlotDetail?.hospitalId,
        serviceTypeId: values?.bookedAppointmentDetail?.doctorServiceTypeId,
        isApply: isChecked,
      })
    );
    if (!isChecked && Number(values?.promocodeId)) {
      dispatch(
        applyPromoCode({
          promocodeId: values.promocodeId,
          userId: currentUser.userId,
          mobileNumber: currentUser.mobileNumber,
          doctorId: values?.bookedAppointmentDetail?.doctorDetails?.doctorId,
          hospitalId:
            values?.bookedAppointmentDetail?.partOfDaySlotDetail?.hospitalId,
          serviceTypeId: values?.bookedAppointmentDetail?.doctorServiceTypeId,
          isApply: true,
        })
      ).then((res) => {
        if (res.payload?.isValid) {
          onApplyCpn({ ...res.payload, code: payAmtDetail.code });
        }
      });
    }
  };
  return (
    <div>
      <div className="OfferDetailsboxbtn">
        <Button
          onClick={() => {
            if (!payAmtDetail?.code) {
              handleShow();
            }
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M18.3992 7.14538L19.1194 7.86538C19.6897 8.42538 19.9998 9.18538 19.9998 9.98538C20.0098 10.7854 19.6997 11.5464 19.1395 12.1154C19.1328 12.1227 19.1261 12.1292 19.1194 12.1356C19.1161 12.1388 19.1128 12.142 19.1094 12.1454L18.3992 12.8554C18.1191 13.1354 17.959 13.5154 17.959 13.9164V14.9454C17.959 16.6054 16.6085 17.9564 14.9479 17.9564H13.9176C13.5174 17.9564 13.1373 18.1154 12.8572 18.3954L12.1369 19.1154C11.5467 19.7064 10.7764 19.9954 10.0061 19.9954C9.23586 19.9954 8.46558 19.7064 7.87537 19.1264L7.14511 18.3954C6.865 18.1154 6.48487 17.9564 6.08472 17.9564H5.05435C3.39375 17.9564 2.04326 16.6054 2.04326 14.9454V13.9164C2.04326 13.5154 1.8832 13.1354 1.6031 12.8454L0.882836 12.1354C-0.287588 10.9664 -0.297592 9.05538 0.872832 7.87638L1.6031 7.14538C1.8832 6.86538 2.04326 6.48538 2.04326 6.07538V5.05538C2.04326 3.39538 3.39375 2.04638 5.05435 2.04638H6.08472C6.48487 2.04638 6.865 1.88538 7.14511 1.60538L7.86537 0.885378C9.03579 -0.293622 10.9465 -0.293622 12.1269 0.876378L12.8572 1.60538C13.1373 1.88538 13.5174 2.04638 13.9176 2.04638H14.9479C16.6085 2.04638 17.959 3.39538 17.959 5.05538V6.08638C17.959 6.48538 18.1191 6.86538 18.3992 7.14538ZM7.42391 13.4454C7.66399 13.4454 7.88407 13.3554 8.04413 13.1854L13.186 8.04637C13.5261 7.70637 13.5261 7.14537 13.186 6.80537C12.8459 6.46637 12.2957 6.46637 11.9556 6.80537L6.81369 11.9454C6.47356 12.2854 6.47356 12.8454 6.81369 13.1854C6.97374 13.3554 7.19382 13.4454 7.42391 13.4454ZM11.6953 12.5654C11.6953 13.0554 12.0855 13.4454 12.5756 13.4454C13.0558 13.4454 13.4459 13.0554 13.4459 12.5654C13.4459 12.0864 13.0558 11.6954 12.5756 11.6954C12.0855 11.6954 11.6953 12.0864 11.6953 12.5654ZM7.43501 6.55539C7.91518 6.55539 8.30532 6.94539 8.30532 7.42539C8.30532 7.91639 7.91518 8.30539 7.43501 8.30539C6.95483 8.30539 6.55469 7.91639 6.55469 7.42539C6.55469 6.94539 6.95483 6.55539 7.43501 6.55539Z"
              fill="#3064A2"
            />
          </svg>

          {!payAmtDetail.code ? (
            t("applyCoupon")
          ) : (
            <span className="d-flex justify-content-between">
              &lsquo;{payAmtDetail.code}&lsquo; {t("applied")}{" "}
              <span
                onClick={() => {
                  onRemoveCode();
                }}
              >
                X
              </span>
            </span>
          )}
        </Button>
      </div>
      {values?.bookedAppointmentDetail?.walletBalance > 0 && (
        <div
          className="PatdetaiWalletbla cursorPointer"
          onClick={() => onWalletUsedChange()}
        >
          <Form.Check
            aria-label="option 1"
            label=""
            checked={values?.isWalletUsed}
          />
          <p>
            {t("pay_using")} Click+Cure {t("wallet")} (
            {values?.bookedAppointmentDetail?.displayWalletBalance})
          </p>
        </div>
      )}
      {values?.isWalletUsed ? (
        Number(values?.promocodeId) > 0 ? (
          <div className="DiscountDetail">
            <p>
              {t("total_amount")}:{" "}
              {walletSelectorState?.walletBalance?.displayOriginalCharge}
            </p>
            <p>
              {t("discount")}:
              {walletSelectorState?.walletBalance?.displayDiscount}
            </p>
            <p>
              {t("wallet_balance_used")}:{" "}
              {walletSelectorState?.walletBalance?.displayBalanceUsed}
            </p>
            <p className="m-0">
              {t("final_amount")}:{" "}
              {walletSelectorState?.walletBalance?.displayFinalAmount}
            </p>
          </div>
        ) : (
          <div className="DiscountDetail">
            <p>
              {t("total_amount")}:{" "}
              {walletSelectorState?.walletBalance?.displayOriginalCharge}
            </p>
            <p>
              {t("wallet_balance_used")}:{" "}
              {walletSelectorState?.walletBalance?.displayBalanceUsed}
            </p>
            <p className="m-0">
              {t("final_amount")}:{" "}
              {walletSelectorState?.walletBalance?.displayFinalAmount}
            </p>
          </div>
        )
      ) : (
        Number(values?.promocodeId) > 0 && (
          <div className="DiscountDetail">
            <p>
              {t("total_amount")}:{" "}
              {promocodeState?.applyPromocode?.data?.displayOriginalCharge}
            </p>
            <p>
              {t("discount")}:
              {promocodeState?.applyPromocode?.data?.displayDiscount}
            </p>
            <p className="m-0">
              {t("final_amount")}:{" "}
              {promocodeState?.applyPromocode?.data?.displayFinalAmount}
            </p>
          </div>
        )
      )}

      <div className="PedtdetaiPaybookapoi">
        <h3>{t("payment_method_to_book_appointment")}*</h3>
        <div
          className="PedtdetaiPaybookaIner cursorPointer"
          onClick={() => setFieldValue("paymentType", "online")}
        >
          <Form.Check
            type="radio"
            aria-label="radio 1"
            className="CustReadiocom"
            name="paymentType"
            checked={values?.paymentType === "online"}
          />
          <h3>
            <span className="CurrencyTagcl">
              {" "}
              {values?.isWalletUsed
                ? walletSelectorState?.walletBalance?.displayFinalAmount
                : payAmtDetail.displayAmt}
            </span>
          </h3>
          <p>{t("pay_online")}</p>
        </div>
        <div
          className="PedtdetaiPaybookaIner cursorPointer"
          onClick={() => setFieldValue("paymentType", "cod")}
        >
          <Form.Check
            type="radio"
            aria-label="radio 1"
            className="CustReadiocom"
            name="paymentType"
            checked={values?.paymentType === "cod"}
          />
          <h3>
            <span className="CurrencyTagcl">
              {values?.isWalletUsed
                ? walletSelectorState?.walletBalance?.displayFinalAmount
                : payAmtDetail.displayAmt}
            </span>
          </h3>
          <p>{t("cash_on_consultation")}</p>
        </div>
        {/* <div className="findbtnnumbernotecov">
                    <p><a href=""><BsInfoCircleFill /></a> Lorem Ipsum, sometimes referred to as the placeholder text</p>
                </div> */}
      </div>

      <div className="FormConfirmPay">
        <Button
          type="button"
          onClick={handleMakeAppointment}
          disabled={isLoading}
        >
          {t("confirm_and_pay")}
        </Button>
      </div>

      <div className="bookappointagreTerms">
        <p>
          {t("appointment_terms_1")} <a href="/info/terms-and-service/" target="_blank">{t("terms_and_conditions")}</a>.{" "}
          {t("appointment_terms_2")} <a href="/info/faqs/" target="_blank">{t("payment_faq")}</a>
        </p>
      </div>
      {show && (
        <OffersModal
          show={show}
          onHide={() => handleClose()}
          drId={values?.bookedAppointmentDetail?.doctorDetails?.doctorId}
          onApplyCpn={onApplyCpn}
          serviceTypeId={values?.bookedAppointmentDetail?.doctorServiceTypeId}
          hpId={values?.bookedAppointmentDetail?.partOfDaySlotDetail?.hospitalId}
        />
      )}
    </div>
  );
}

export default AppointmentPaymentDetials;
