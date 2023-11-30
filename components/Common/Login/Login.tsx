import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import {
  loginUserAction,
  loginUserSelector,
} from "../../../store/login/loginSlice";
import { useSelector } from "react-redux";
import {
  customSelector,
  getAllCountries,
} from "../../../store/custom/customSlice";
import { toast } from "react-toastify";
import { DeviceType } from "../../../utils/constant";
import { useTranslate } from "../../../commonModules/translate";

function Login(props) {
  const t = useTranslate();
  const dispatch = useAppDispatch();
  const inputRef: any = useRef(null);
  const login = useAppSelector(loginUserSelector);
  const [form, setForm] = useState<any>({});
  const [isFordEmail, setIsForEmail] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [countryCodeLookups, setCountryCodeLookups] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const customDetails = useSelector(customSelector);
  
  useEffect(() => {
    if (
      form?.userName &&
      Number(form.userName) > 0 &&
      form.userName?.length < 11
    ) {
      setIsForEmail(false);
    } else {
      setIsForEmail(true);
    }
  }, [form?.userName]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isFordEmail]);

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

  useEffect(() => {
    if (
      !!login &&
      !!login.data.loginUser &&
      Object.keys(login.data.loginUser).length !== 0
    ) {
      toast.success(t("user_signin_success"));
      setForm({});
      props.onHide();
      props.signinUserAvatar();
    }
  }, [login.data.loginUser]);

  const validateForms = () => {
    const { userName, password } = form;
    const newErrors: any = {};
    if (!userName || userName == "")
      newErrors.userName = t("valid_email_mob");
     if (!password || password == "")
      newErrors.password = t("valid_password");
    return newErrors;
  };

  const loginUser = () => {
    const formErrors = validateForms();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      const login: any = {
        userName: form.userName,
        password: form.password,
        deviceType: DeviceType.Web,
        deviceToken: "",
      };
      if (!isFordEmail) {
        login.countryId = form.country.value;
      }
      setIsLoading(true);
      dispatch(loginUserAction(login)).finally(() => {
        setIsLoading(false);
      });
    }
  };

  const animatedComponents = makeAnimated();

  useEffect(() => {
    if (!customDetails.countries.countries?.length) dispatch(getAllCountries());
  }, []);

  useEffect(() => {
    if (customDetails.countries.countries?.length) {
      const newLookups = customDetails.countries.countries.map((x) => ({
        value: x.countryId,
        label: `${x.code}  +${x.phoneCode}`,
        countryCode: x.phoneCode,
      }));
      setCountryCodeLookups(newLookups);
      setField("country", newLookups[0]);
    }
  }, [customDetails.countries.countries]);

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
          <Modal.Title>{t("login_dialog_title")} {process.env.NEXT_PUBLIC_COMPANY_NAME}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="LoginFormmaincov">
            <div className="ComsetmodlaForm">
              <div className="ComsetFormAddIn">
                <Form.Group className="FormInputcovermain" controlId="">
                  <Form.Label
                    onClick={() => {
                      inputRef.current && inputRef.current.focus();
                    }}
                  >
                    {t('mobile_number_email')}*
                  </Form.Label>
                  {isFordEmail ? (
                    <>
                      <Form.Control
                        ref={inputRef}
                        type="text"
                        onChange={(e) => {
                          setField("userName", e.target.value);
                        }}
                        placeholder={t('mobile_number_email')}
                        value={form.userName}
                        isInvalid={!!errors.userName}
                      />
                      <div style={{ color: "red" }}>{errors.userName}</div>{" "}
                    </>
                  ) : (
                    <div className="MobilCodeformmaincust">
                      <div className="FormComCountrycodeSet">
                        <Select
                          components={animatedComponents}
                          options={countryCodeLookups}
                          classNamePrefix="react-select"
                          onChange={(e) => setField("country", e)}
                          value={form.country}
                        />
                      </div>
                      <Form.Group className="" controlId="mobileNumber">
                        <Form.Control
                          type="text"
                          ref={inputRef}
                          onChange={(e) => {
                            setField("userName", e.target.value);
                          }}
                          placeholder={t('mobile_number_email')}
                          value={form.userName}
                          isInvalid={!!errors.userName}
                        />
                        <div style={{ color: "red" }}>{errors.userName}</div>
                      </Form.Group>
                    </div>
                  )}
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

              <div className="ComsetFormAddIn">
                <Form.Group className="FormInputcovermain" controlId="password">
                  <Form.Label>{t("password")}*</Form.Label>
                  <div className="passboxincovbtn">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      required
                      value={form.password}
                      isInvalid={!!errors.password}
                      onChange={(e) => setField("password", e.target.value)}
                      placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                    />
                    <a
                      className="PassShow"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      <AiOutlineEye />
                    </a>
                    <div style={{ color: "red" }}>{errors.password}</div>
                  </div>
                </Form.Group>
              </div>
              <div className="RemembforgotCover">
                <div className="RemembforgotLeft">
                  <Form.Check aria-label="option 1" label={t("remember")} />
                </div>
                <div className="RemembforgotRight">
                  <a
                    onClick={() => {
                      props.onHide();
                      props.onShowForgotPassword();
                    }}
                  >
                    {t("forgot_password")}
                  </a>
                </div>
              </div>
              <div className="chboxlogotpcheckbox">
                <Form.Check
                  onClick={(e: any) => {
                    if (e.target.value) {
                      props.onShowVerify();
                    }
                    props.onHide();
                  }}
                  aria-label="option 1"
                  label={t("login_with_otp_instedOf_password")}
                />
              </div>
              <div className="noyettextctnewbox">
                <p>
                  {t('no_account_yet')}
                  <a
                    onClick={() => {
                      props.onHide();
                      setForm({});
                      props.onShowCreateAccount();
                    }}
                  >
                    &nbsp;{t('register')}
                  </a>
                </p>
              </div>
              <div className="SaveButtonComsetbox">
                <Button disabled={isLoading} onClick={loginUser}>
                  {t("login")}
                </Button>
              </div>

              {/* <div className="LinOrcovlist">
                                <p>Or</p>
                            </div>

                            <div className="loginwidthmaincovbtn">

                                <a href="">
                                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.8522 8.18577H16.2326V8.15385H9.3095V11.2308H13.6568C13.0226 13.0219 11.3183 14.3077 9.3095 14.3077C6.76065 14.3077 4.69411 12.2412 4.69411 9.69231C4.69411 7.14346 6.76065 5.07692 9.3095 5.07692C10.486 5.07692 11.5564 5.52077 12.3714 6.24577L14.5472 4.07C13.1733 2.78962 11.3357 2 9.3095 2C5.06142 2 1.61719 5.44423 1.61719 9.69231C1.61719 13.9404 5.06142 17.3846 9.3095 17.3846C13.5576 17.3846 17.0018 13.9404 17.0018 9.69231C17.0018 9.17654 16.9487 8.67308 16.8522 8.18577Z" fill="#FFC107" />
                                        <path d="M2.5 6.11192L5.02731 7.96539C5.71115 6.27231 7.36731 5.07692 9.30539 5.07692C10.4819 5.07692 11.5523 5.52077 12.3673 6.24577L14.5431 4.07C13.1692 2.78962 11.3315 2 9.30539 2C6.35077 2 3.78846 3.66808 2.5 6.11192Z" fill="#FF3D00" />
                                        <path d="M9.30901 17.3845C11.2959 17.3845 13.1013 16.6242 14.4663 15.3876L12.0856 13.373C11.2873 13.9801 10.3119 14.3084 9.30901 14.3076C7.30825 14.3076 5.6094 13.0319 4.9694 11.2515L2.46094 13.1842C3.73401 15.6753 6.3194 17.3845 9.30901 17.3845Z" fill="#4CAF50" />
                                        <path d="M16.8552 8.18573H16.2356V8.15381H9.3125V11.2307H13.6598C13.3564 12.0832 12.8099 12.8281 12.0879 13.3734L12.089 13.3727L14.4698 15.3873C14.3013 15.5403 17.0048 13.5384 17.0048 9.69227C17.0048 9.1765 16.9517 8.67304 16.8552 8.18573Z" fill="#1976D2" />
                                    </svg>
                                </a>
                                <a href="">
                                    <svg width="9" height="19" viewBox="0 0 9 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.84172 18.9979V10.3331H8.4952L8.89246 6.95632H5.84172V4.80032C5.84172 3.82267 6.08943 3.15636 7.3686 3.15636L9 3.15553V0.135357C8.71772 0.0943537 7.74937 0.00244141 6.62277 0.00244141C4.27065 0.00244141 2.66034 1.57605 2.66034 4.46606V6.95641H0V10.3332H2.66026V18.998L5.84172 18.9979Z" fill="#3C5A9A" />
                                    </svg>
                                </a>

                            </div> */}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Login;
