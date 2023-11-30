import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { IRequestOTP } from "../../../commonModules/commonInterfaces";
import { requestOTPAction } from "../../../store/login/loginSlice";
import { useAppDispatch } from "../../../utils/hooks";
import { AppDispatch } from "../../../utils/store";
import { OTPTypes } from "../../../utils/constant";
import VerificationCode from "./VerificationCode";
import userService from "../../../services/userService";
import { CURRENT_USER } from "../../../commonModules/localStorege";
import {
  changeEmail,
  changeMobileNumber,
  getUserDetails,
  IChangeMobNo,
} from "../../../store/user/userDetailsSlice";
import { toast } from "react-toastify";
import { useTranslate } from "../../../commonModules/translate";

function ChangeMobileNumber(props: {
  show: boolean;
  onHide: any;
  countryCodeLookups: any[];
  isForEmail: boolean;
}) {
  const animatedComponents = makeAnimated();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    phoneCode: null,
    mobileNumber: "",
    countryId: null,
    emailAddress: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const t = useTranslate();

  const onGetOtp = () => {
    const data: IRequestOTP = {
      username: props.isForEmail
        ? form.emailAddress
        : form.mobileNumber.toString(),
      countryId: Number(form.countryId),
      otpType: props.isForEmail
        ? OTPTypes.ChangeEmail
        : OTPTypes.ChangeMobileNumber,
    };
    if (data?.username?.trim()) {
      setIsLoading(true);
      dispatch(requestOTPAction(data))
        .then((res) => {
          if (res?.payload) {
            setShowVerificationModal(true);
            toast.success(
              props.isForEmail
                ? t("otp_sent_to_email")
                : t("otp_sent_to_mob")
            );
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      toast.error(
        props.isForEmail ? t("plz_enter_email"): t("plz_enter_mobilenumber")
      );
    }
  };
  useEffect(() => {
    if (props.countryCodeLookups?.length) {
      setForm({
        ...form,
        phoneCode: props.countryCodeLookups[0].value,
        countryId: props.countryCodeLookups[0].countryId,
      });
    }
  }, [props.countryCodeLookups]);

  const onHideVerificationModal = () => {
    setShowVerificationModal(false);
  };

  const onOTPVerify = (formVal) => {
    const currentUserId = CURRENT_USER()?.userId;
    const payload: IChangeMobNo = {
      userId: currentUserId,
      otp: formVal.OTP,
    };
    if (props.isForEmail) {
      setIsLoading(true);
      payload.email = form.emailAddress;
      dispatch(changeEmail(payload))
        .then((res) => {
          if (res?.payload?.isSuccess) {
            toast.success(t("email_change_success"));
            dispatch(getUserDetails({ userId: currentUserId }));
            props.onHide();
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(true);
      payload.mobileNumber = form.mobileNumber;
      dispatch(changeMobileNumber(payload))
        .then((res) => {
          if (res?.payload?.isSuccess) {
            toast.success(t("mobil_no_change_success"));
            dispatch(getUserDetails({ userId: currentUserId }));
            props.onHide();
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <Modal
        {...props}
        onHide={() => {
          props.onHide();
          setForm({
            phoneCode: null,
            mobileNumber: "",
            countryId: null,
            emailAddress: "",
          });
        }}
        backdrop="static"
        keyboard={false}
        centered
        className="CustModalComcovermain ComLoginmainModalsetcov"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {props.isForEmail ? t("change_email") : t("chnage_monumber")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="LoginFormmaincov">
            <div className="ComsetmodlaForm">
              <div className="ComsetFormAddIn">
                {props.isForEmail ? (
                  <Form.Group className="FormInputcovermain" controlId="">
                    <Form.Label>{t("email_address")} *</Form.Label>
                    <Form.Control
                      type=""
                      placeholder={t("email_address")}
                      onChange={(e) =>
                        setForm({ ...form, emailAddress: e.target.value })
                      }
                    />
                  </Form.Group>
                ) : (
                  <Form.Group className="FormInputcovermain" controlId="">
                    <Form.Label>{t("mobile_number")}*</Form.Label>
                    <div className="MobilCodeformmaincust">
                      <div className="FormComCountrycodeSet">
                        <Select
                          components={animatedComponents}
                          options={props.countryCodeLookups}
                          classNamePrefix="react-select"
                          onChange={(e) =>
                            setForm({
                              ...form,
                              phoneCode: e.value,
                              countryId: e.countryId,
                            })
                          }
                          value={props.countryCodeLookups?.find(
                            (x) => x.value === form.phoneCode
                          )}
                        />
                      </div>
                      <Form.Control
                        type=""
                        placeholder={t("mobile_number")}
                        onChange={(e) =>
                          setForm({ ...form, mobileNumber: e.target.value })
                        }
                      />
                    </div>
                  </Form.Group>
                )}
              </div>
              <div className="SaveButtonComsetbox">
                <Button type="button" onClick={onGetOtp} disabled={isLoading}>
                  {t("get_OTP")}
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {showVerificationModal && (
        <VerificationCode
          mobileNumber={
            props.isForEmail
              ? form.emailAddress
              : `+${form.phoneCode} ${form.mobileNumber}`
          }
          show={showVerificationModal}
          onHide={onHideVerificationModal}
          onOTPVerify={onOTPVerify}
          isLoading={isLoading}
          onShowMobileVerify={onHideVerificationModal}
          title={""}
          isForEmail={props.isForEmail}
          isFor={
            props.isForEmail
              ? OTPTypes.ChangeEmail
              : OTPTypes.ChangeMobileNumber
          }
        />
      )}
    </>
  );
}

export default ChangeMobileNumber;
