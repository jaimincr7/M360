import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import { MdModeEditOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import {
  ILoginUserWithOTP,
  IRequestOTP,
} from "../../../commonModules/commonInterfaces";
import {
  loginUserAction,
  loginUserSelector,
  loginUserWithOTPAction,
  requestOTPAction,
} from "../../../store/login/loginSlice";
import { useTranslate } from "../../../commonModules/translate";
import { toast } from "react-toastify";

function VerificationCode(props: {
  show: boolean;
  onHide: any;
  mobileNumber: number | string;
  onShowMobileVerify: any;
  onOTPVerify?: any;
  title?: string;
  isForEmail?: boolean;
  isLoading?: boolean;
  isFor: 0 | 1 | 2 | 3;
  signinUserAvatar?:any
  countryId?:number
}) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const login = useAppSelector(loginUserSelector);
  const [errors, setErrors] = useState<any>({});
  const t = useTranslate();
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

  // useEffect(() => {
  //     requestOTP();
  // }, []);

  const validateForms = () => {
    const { OTP } = form;

    const newErrors: any = {};
    if (!OTP || OTP == "") newErrors.OTP = t("enter_valid_OTP");

    return newErrors;
  };
  const requestOTP = () => {
    const data: IRequestOTP = {
      username: props.mobileNumber?.toString()?.split(" ")?.pop(),
      countryId: props.countryId,
      otpType: props.isFor,
    };
    dispatch(requestOTPAction(data)).then((res) => {
      toast.success(
        props.isForEmail
          ? t("otp_sent_to_email")
          : t("otp_sent_to_mob")
      );
    });
  };


  useEffect(() => {
    if (
      login.loginWithOTP.loginWithOTP?.userId
    ) {
      toast.success(t("user_signin_success"));
      setForm({});
      props.onHide();
      if(props.signinUserAvatar)
      props.signinUserAvatar();
    }
  }, [login.loginWithOTP.loginWithOTP]);

  const onOTPVerify = () => {
    const formErrors = validateForms();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      if (props.onOTPVerify) {
        props.onOTPVerify(form);
      } else {
        setIsLoading(true);
        const data: ILoginUserWithOTP = {
          userName: props.mobileNumber?.toString()?.split(" ")?.pop(),
          otp: form.OTP,
          countryId:props.countryId
        };
        dispatch(loginUserWithOTPAction(data)).then(res=>{
         
        }).finally(() => {
          setIsLoading(false);
        });
      }
    }
  };

  return (
    <>
      <Modal
        {...props}
        onHide={() => {
          props.onHide();
          setForm({});
          setErrors({});
        }}
        backdrop="static"
        keyboard={false}
        centered
        className="CustModalComcovermain ComLoginmainModalsetcov"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            {props.hasOwnProperty("title") ? props.title : `${t("login_dialog_title")} ${process.env.NEXT_PUBLIC_COMPANY_NAME}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="LoginFormmaincov">
            <div className="ComsetmodlaForm">
              <div className="VerifyCodeboxcov">
                <h3>{t("verification_code")}</h3>
                <p>
                  {t("otp_send_msg")}{" "}
                  {props.isForEmail ? t("email_address") : t("mobile_number")}
                </p>
                <h6>
                  {props.mobileNumber}{" "}
                  <a>
                    <MdModeEditOutline
                      onClick={() => {
                        props.onShowMobileVerify();
                        props.onHide();
                      }}
                    />
                  </a>
                </h6>
                <div className="ComsetFormAddIn">
                  <Form.Group className="FormInputcovermain" controlId="OTP">
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
                    />
                    <div style={{ color: "red" }}>{errors.OTP}</div>
                  </Form.Group>
                </div>
              </div>
              <div className="noyettextctnewbox">
                <p>
                  {t('did_not_receive_OTP')}{" "}
                  <a onClick={requestOTP}>{t('resend_code')}</a>
                </p>
              </div>
              <div className="SaveButtonComsetbox">
                <Button
                  onClick={onOTPVerify}
                  disabled={props.onOTPVerify ? props.isLoading : isLoading}
                >
                  {t('verify_proceed')}
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default VerificationCode;
