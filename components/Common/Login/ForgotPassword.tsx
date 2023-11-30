import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { AiOutlineEye } from "react-icons/ai";
import { toast } from "react-toastify";
import { IRequestOTP } from "../../../commonModules/commonInterfaces";
import { useTranslate } from "../../../commonModules/translate";
import authService from "../../../services/authService";
import {
  changePasswordOtpAction,
  loginUserSelector,
  otpVerifyAction,
  requestOTPAction,
} from "../../../store/login/loginSlice";
import { OTPTypes } from "../../../utils/constant";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";

function ForgotPassword(props: { show: boolean; onHide: any; onConfirm: any }) {
  const dispatch = useAppDispatch();
  const t = useTranslate();
  const loginSelector = useAppSelector(loginUserSelector);
  const [errors, setErrors] = useState<any>({});
  const [OTPerrors, setOTPErrors] = useState<any>({});
  const [passwordErrors, setPasswordErrors] = useState<any>({});
  const [verificationDetail, setVerificationDetail] = useState<{
    showFor: "forgot" | "verification" | "password";
    userName: string;
    otp: string;
  }>({
    showFor: "forgot",
    userName: "",
    otp: "",
  });
  const [form, setForm] = useState<any>({});
  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const validateForms = () => {
    const { username } = form;
    const newErrors: any = {};
    if (!username || username == "")
      newErrors.username = t("valid_email_mob");
    return newErrors;
  };

  const validateOTPForms = () => {
    const { OTP } = form;

    const newErrors: any = {};
    if (!OTP?.trim()) newErrors.OTP = t("enter_valid_OTP");

    return newErrors;
  };

  const validatePasswordForms = () => {
    const { confirmPassword, newPassword } = form;
    const newErrors: any = {};
    if (newPassword?.length < 6) {
      newErrors.newPassword = t("pass_6_char_long");
    } else if (newPassword !== confirmPassword) {
      newErrors.newPassword = t("pass_confirmPass_same");
      newErrors.confirmPassword = t("pass_confirmPass_same");
    }
    if (!newPassword) {
      newErrors.newPassword = t("new_pass_required");
    }
    if (!confirmPassword) {
      newErrors.confirmPassword =t("confirm_pass_required");
    }
    return newErrors;
  };

  const onOTPCall = () => {
    const formErrors = validateForms();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      const data: IRequestOTP = {
        username: form.username.toString(),
        // countryId: 1,
        otpType: OTPTypes.ForgotPassword,
      };
      dispatch(requestOTPAction(data)).then((res) => {
        if (res?.payload) {
          setVerificationDetail({
            showFor: "verification",
            userName: form.username,
            otp: "",
          });
          toast.success(t("check_mob_otp"));
        }
      });
    }
  };

  const onOTPVerify = () => {
    const formErrors = validateOTPForms();

    if (Object.keys(formErrors).length > 0) {
      setOTPErrors(formErrors);
    } else {
      setOTPErrors({});
      dispatch(
        otpVerifyAction({
          otp: form.OTP,
          otpType: OTPTypes.ForgotPassword,
          //  timeZoneOffSet:new Date().getTimezoneOffset(),
          username: form.username,
        })
      ).then((res) => {
        if (res?.payload) {
          setVerificationDetail({
            showFor: "password",
            userName: form.username,
            otp: form.OTP,
          });
        }
      });
    }
  };

  const onSavePassword = () => {
    const formErrors = validatePasswordForms();

    if (Object.keys(formErrors).length > 0) {
      setPasswordErrors(formErrors);
    } else {
      setPasswordErrors({});
      dispatch(
        changePasswordOtpAction({
          otp: verificationDetail.otp,
          otpType: OTPTypes.ForgotPassword,
          username: verificationDetail.userName,
          password: form.newPassword,
        })
      ).then((res) => {
        if (res?.payload) {
          toast.success(t("pass_changed"));
          props.onConfirm();
        }
      });
    }
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={() => {
          props.onHide();
          setForm({});
          setErrors({});
        }}
        keyboard={false}
        centered
        className="CustModalComcovermain ComLoginmainModalsetcov"
      >
        <>
          <Modal.Header closeButton>
            <Modal.Title>
              {verificationDetail.showFor === "forgot"
                ? t("forgot_password")
                : verificationDetail.showFor === "password"
                  ? t("New_password")
                  : t("verification_code")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {verificationDetail.showFor === "forgot" ? (
              <div className="LoginFormmaincov">
                <div className="ComsetmodlaForm">
                  <div className="forrogonoteboxcov">
                    <p>
                      {t('enter_your_registered_mobile_number')}
                    </p>
                  </div>
                  <div className="ComsetFormAddIn">
                    <Form.Group
                      className="FormInputcovermain"
                      controlId="username"
                    >
                      <Form.Label>{t('mobile_number_or_email')}*</Form.Label>
                      <Form.Control
                        value={form.username}
                        isInvalid={!!errors.username}
                        type="Email"
                        placeholder={t('mobile_number_email')}
                        onChange={(e) => setField("username", e.target.value)}
                        onKeyUp={(e) => {
                          if (e.key === "Enter") {
                            onOTPCall();
                          }
                        }}
                      />
                      <div style={{ color: "red" }}>{errors.username}</div>
                      {/* Mobile Number Input Start */}
                      {/* <div className='MobilCodeformmaincust'>
                                        <div className='FormComCountrycodeSet'>
                                            <Select
                                                components={animatedComponents}
                                                options={countrycode}
                                                classNamePrefix="react-select"
                                                defaultValue={countrycode[0]}
                                            />
                                        </div>
                                        <Form.Control type="" placeholder="Mobile Number" />
                                    </div> */}
                      {/* Mobile Number Input End */}
                    </Form.Group>
                  </div>
                  <div className="SaveButtonComsetbox">
                    <Button
                      onClick={onOTPCall}
                      disabled={loginSelector.requestOTP.status === "loading"}
                    >
                      {t('get_OTP')}
                    </Button>
                  </div>
                </div>
              </div>
            ) : verificationDetail.showFor === "verification" ? (
              <div className="LoginFormmaincov">
                <div className="ComsetmodlaForm">
                  <div className="VerifyCodeboxcov">
                    <p>{t("enter_varification_code")}</p>
                    <div className="ComsetFormAddIn">
                      <Form.Group
                        className="FormInputcovermain"
                        controlId="OTP"
                      >
                        <Form.Control
                          required
                          value={form.OTP}
                          onChange={(e) => {
                            if (e.target.value?.length < 7) {
                              setField("OTP", e.target.value);
                            }
                          }}
                          type="number"
                          placeholder={t("enter_6_digit_otp")}
                          onKeyUp={(e) => {
                            if (e.key === "Enter") {
                              onOTPVerify();
                            }
                          }}
                        />
                        <div style={{ color: "red" }}>{OTPerrors?.OTP}</div>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="noyettextctnewbox">
                    <p>
                      {t("dont_receive_otp")}{" "}
                      <a onClick={onOTPCall}>{t("resend_code")}</a>
                    </p>
                  </div>
                  <div className="SaveButtonComsetbox">
                    <Button
                      type={"button"}
                      onClick={(e) => {
                        e.preventDefault();
                        onOTPVerify();
                      }}
                      disabled={loginSelector.verifyOtp.status === "loading"}
                    >
                      {t("verify_proceed")}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="LoginFormmaincov">
                  <div className="ComsetmodlaForm">
                    <div className="ComsetFormAddIn">
                      <Form.Group className="FormInputcovermain" controlId="">
                        <Form.Label>{t("create_new_password")}*</Form.Label>
                        <div className="passboxincovbtn">
                          <Form.Control
                            type="password"
                            placeholder={t("New_password")}
                            onChange={(e) => {
                              setField("newPassword", e.target.value);
                            }}
                            value={form?.newPassword}
                            onKeyUp={(e) => {
                              if (e.key === "Enter") {
                                onSavePassword();
                              }
                            }}
                          />
                          {/* <p className="noteloginboxcom">
                            password must be 6 characters.
                          </p> */}
                          <div style={{ color: "red" }}>
                            {passwordErrors?.newPassword}
                          </div>
                          {/* <a href="" className="PassHide"><AiOutlineEyeInvisible /></a> */}
                        </div>
                      </Form.Group>
                    </div>
                    <div className="ComsetFormAddIn">
                      <Form.Group className="FormInputcovermain" controlId="">
                        <Form.Label>{t("confirm_your_password")}*</Form.Label>
                        <div className="passboxincovbtn">
                          <Form.Control
                            type="password"
                            placeholder={t("confirm_your_password")}
                            onChange={(e) => {
                              setField("confirmPassword", e.target.value);
                            }}
                            value={form?.confirmPassword}
                            onKeyUp={(e) => {
                              if (e.key === "Enter") {
                                onSavePassword();
                              }
                            }}
                          />
                          <div style={{ color: "red" }}>
                            {passwordErrors?.confirmPassword}
                          </div>
                          {/* <a href="" className="PassHide"><AiOutlineEyeInvisible /></a> */}
                        </div>
                      </Form.Group>
                    </div>

                    <div className="SaveButtonComsetbox">
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onSavePassword();
                        }}
                        disabled={
                          loginSelector.changePassword.status === "loading"
                        }
                      >
                        {t("save_and_change")}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Modal.Body>
        </>
      </Modal>
    </>
  );
}

export default ForgotPassword;
