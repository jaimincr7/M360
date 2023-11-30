import React, { useEffect, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { IoCalendar } from "react-icons/io5";
import { RiPencilFill } from "react-icons/ri";

import DatePicker from "react-datepicker";
import UserProfileLayout from "../../layouts/userProfileLayout";

import ChangeMobileNumber from "../../components/Common/Login/ChangeMobileNumber";
import { CURRENT_USER } from "../../commonModules/localStorege";
import {
  getUserDetails,
  updateUserDetails,
  userDetailDetailsSelector,
  UserDetails,
} from "../../store/user/userDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../utils/store";
import { IAddPatient } from "../../commonModules/commonInterfaces";
import { PatientDetails } from "../../store/patientDetails/patientDetailsSlice";
import moment from "moment";
import {
  customSelector,
  getAllCountries,
} from "../../store/custom/customSlice";
import { resetPassword } from "../../store/user/userDetailsSlice";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslate } from "../../commonModules/translate";
import { updateLoggedInData } from "../../store/login/loginSlice";

const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    const smallChars = /[a-z]/;
    const capitalChars=/[A-Z]/
function ProfileSettings() {
  const currentUser = CURRENT_USER();
  const userDetailsState = useSelector(userDetailDetailsSelector);
  const customDetails = useSelector(customSelector);
  const [show, setShow] = useState(false);
  const [isChangeForEmail, setIsChangeForEmail] = useState(false);
  const [form, setForm] = useState<any>(userDetailsState.userDetails);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [birthDate, setdate] = useState<Date | any>(null);
  const [showError, setShowError] = useState(false);
  const [countryCodeLookups, setCountryCodeLookups] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslate();

  const [initVal, setInitVal] = useState<any>({
    fullName: "",
    gender: "",
    phoneCode: "",
    mobileNumber: "",
    email: "",
    dateOfBirth: "",
    uniqueId: "",
    zaloNumber: "",
  });

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().nullable().required(t("fullname_is_required")),
    gender: Yup.mixed().nullable().required(t("gender_required")),
    mobileNumber: Yup.number()
      .nullable()
      .required(t("mobile_no_required"))
      .min(999999, t("must_be_bw_7_to_15"))
      .max(999999999999999, t("must_be_bw_7_to_15")),
    email: Yup.string()
      .nullable()
      .email(t("valid_email"))
      .required(t("email_required")),
    dateOfBirth: Yup.date().nullable().required(t("dob_required")),
    uniqueId: Yup.number()
      .nullable()
      .required(t("uniqueId_passport_required"))
      .min(1, t("valid_uniqueId_passport"))
      .typeError(t("must_number")),
  });

  const formRef: any = useRef();

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
    if (customDetails.countries.countries?.length) {
      setCountryCodeLookups(
        customDetails.countries.countries.map((x) => ({
          value: x.phoneCode,
          label: `${x.code}  +${x.phoneCode}`,
          countryId: x.countryId,
        }))
      );
    }
  }, [customDetails.countries.countries]);

  useEffect(() => {
    dispatch(getUserDetails({ userId: currentUser.userId }));
    if (!customDetails.countries.countries?.length) dispatch(getAllCountries());
  }, []);

  useEffect(() => {
    if (userDetailsState.userDetails?.userId) {
      setInitVal({
        fullName: userDetailsState.userDetails?.fullName,
        gender: genderOptions?.find(
          (x: any) => x.value === userDetailsState.userDetails?.gender
        ),
        phoneCode: {
          value: userDetailsState.userDetails?.phoneCode,
          label: `${userDetailsState.userDetails?.countryCode} +${userDetailsState.userDetails?.phoneCode}`,
          countryId: userDetailsState.userDetails?.countryId,
        },
        mobileNumber: userDetailsState.userDetails?.mobileNumber,
        email: userDetailsState.userDetails?.email,
        dateOfBirth: userDetailsState.userDetails?.birthDate,
        uniqueId: userDetailsState.userDetails?.uniqueId,
        zaloNumber: userDetailsState.userDetails?.zaloNumber,
      });
    }
  }, [userDetailsState.userDetails]);

  const animatedComponents = makeAnimated();

  const genderOptions: any = [
    { value: "M", label: t("Male") },
    { value: "F", label: t("Female")},
  ].map((gender, index) => {
    return {
      label: gender.label,
      value: gender.value,
      key: index,
    };
  });

  const onChange = (dates: any) => {
    setdate(dates);
  };

  const handleSave = () => {
    const { values, validateForm, resetForm, setFieldValue, setFieldTouched } =
      formRef.current;
    validateForm(values).then((res) => {
      if (res && Object.keys(res).length) {
        setShowError(true);
      } else {
        const data: UserDetails = {
          userId: currentUser.userId,
          fullName: values?.fullName,
          email: values?.email,
          countryId: values?.phoneCode?.countryId,
          countryCode: userDetailsState.userDetails?.countryCode,
          phoneCode: values?.phoneCode?.value,
          mobileNumber: values?.mobileNumber,
          birthDate: values?.dateOfBirth,
          gender: values?.gender?.value,
          uniqueId: values?.uniqueId,
          zaloNumber: values?.zaloNumber,
        };
        setIsLoading(true);
        dispatch(updateUserDetails(data))
          .then((res) => {
            if (res?.payload) {
              toast.success(t("profile_update_success"));
              dispatch(getUserDetails({ userId: currentUser.userId })).then(
                (res) => {
                  const storedUserInfo = CURRENT_USER();
                  Object.keys(storedUserInfo).forEach((key) => {
                    if (res.payload && res.payload[key]) {
                      storedUserInfo[key] = res.payload[key];
                    }
                  });
                  localStorage.setItem("user", JSON.stringify(storedUserInfo));
                  dispatch(updateLoggedInData(storedUserInfo));
                }
              );
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    });
  };

  const onPasswordChange = () => {
    const { confirmPassword, newPassword, currentPassword }: any = form
      ? form
      : {};
    const newErrors = errors ? { ...errors } : {};
    let isValid = true;
     if (newPassword !== confirmPassword) {
      newErrors.newPassword = t("pass_confirmPass_same");
      newErrors.confirmPassword = t("pass_confirmPass_same");
      isValid = false;
    }
    if (
      (!newErrors.confirmPassword )&&(
        !confirmPassword || confirmPassword?.length < 6 ||
     !confirmPassword?.match(specialChars) ||
      !confirmPassword?.match(smallChars) ||
      !confirmPassword?.match(capitalChars)) 
    ){
      newErrors.confirmPassword =
        t("valid_confirm_pass")
        isValid = false;
    }
    if (
      (!newErrors.currentPassword )&&(
        !currentPassword?.length || currentPassword?.length < 6 ||
      !currentPassword?.match(specialChars) ||
       !currentPassword?.match(smallChars) ||
       !currentPassword?.match(capitalChars)) 
     ){
       newErrors.currentPassword =
         t("valid_current_pass")
         isValid = false;
     }
     if (
      (!newErrors.newPassword )&&(
        !newPassword || newPassword?.length < 6||
      !newPassword?.match(specialChars) ||
       !newPassword?.match(smallChars) ||
       !newPassword?.match(capitalChars)) 
     ){
       newErrors.newPassword =
         t("valid_new_pass")
         isValid = false;
     }

   
    if (isValid) {
      delete newErrors.newPassword;
      delete newErrors.confirmPassword;
      setIsLoading(true);
      dispatch(
        resetPassword({
          // username:form.email,
          userId: currentUser?.userId,
          confirmPassword,
          newPassword,
          oldPassword: currentPassword,
        })
      )
        .then((res) => {
          if (res.payload?.isSuccess)
            toast.success(t("pass_changed"));
          setForm({
            ...form,
            confirmPassword: "",
            newPassword: "",
            currentPassword: "",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setErrors(newErrors);
    }
  };

  const renderError = (fieldName: string, errors: any) => {
    return (
      errors &&
      errors[fieldName] &&
      showError && <div style={{ color: "red" }}>{errors[fieldName]}</div>
    );
  };
  const renderInput = (
    label: string,
    fieldName: string,
    placeholder: string,
    errors: any,
    values: any,
    isNumber?: boolean
  ) => {
    const fieldError = renderError(fieldName, errors);
    return (
      <div className="ComsetFormAddIn">
        <Form.Group className="FormInputcovermain" controlId="">
          <Form.Label>{label}</Form.Label>
          <Form.Control
            type={isNumber ? "number" : "text"}
            placeholder={placeholder}
            value={values[fieldName]}
            onChange={(e) => {
              formRef.current?.setFieldValue(fieldName, e.target.value);
            }}
            onBlur={(e) => {
              if (!isNumber)
                formRef.current?.setFieldValue(
                  fieldName,
                  e.target.value?.trim()
                );
            }}
            className={fieldError ? "errorBorder" : ""}
          />
          {renderError(fieldName, errors)}
        </Form.Group>
      </div>
    );
  };

  return (
    <>
      {show && (
        <ChangeMobileNumber
          show={show}
          onHide={() => handleClose()}
          countryCodeLookups={countryCodeLookups}
          isForEmail={isChangeForEmail}
        />
      )}
      <Formik
        initialValues={initVal}
        innerRef={formRef}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("formil values", values);
        }}
        enableReinitialize
      >
        {({ handleSubmit, values, setFieldValue, errors }) => (
          <form onSubmit={handleSubmit}>
            <div className="CardBoxProfSetititle">
              <h1>{t("profile_setting")}</h1>
            </div>
            <div className="Profilesetigcovform">
              <Row>
                <Col md={4}>
                  {renderInput(
                    t("fullname") + "*",
                    "fullName",
                    t("enter_fullname"),
                    errors,
                    values
                  )}
                </Col>
                <Col md={4}>
                  <div className="ComsetFormAddIn">
                    <div className="FormSelectcovermain">
                      <p>{t("Gender")}</p>
                      <Select
                        components={animatedComponents}
                        classNamePrefix="react-select"
                        options={genderOptions}
                        onChange={(e) => setFieldValue("gender", e)}
                        value={values.gender}
                        className={
                          renderError("gender", errors) ? "errorBorder" : ""
                        }
                      />
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="ComsetFormAddIn">
                    <Form.Group className="FormInputcovermain" controlId="">
                      <Form.Label>{t("mobile_number")}*</Form.Label>
                      <div className="MobilCodeformmaincust">
                        <div
                          className="FormComCountrycodeSet"
                          style={{ zIndex: 1 }}
                        >
                          <Select
                            components={animatedComponents}
                            options={countryCodeLookups}
                            classNamePrefix="react-select"
                            value={values?.phoneCode}
                            onChange={(e) => {
                              setFieldValue("phoneCode", e);
                            }}
                            isDisabled={true}
                          />
                        </div>
                        <div className="editforminputCov">
                          <Form.Control
                            type=""
                            style={{ color: "gray" }}
                            value={userDetailsState.userDetails?.mobileNumber}
                            placeholder={t("mobile_number")}
                            readOnly={true}
                          />
                          <a
                            href="javascript:void(0);"
                            onClick={() => {
                              setIsChangeForEmail(false);
                              handleShow();
                            }}
                          >
                            <RiPencilFill />
                          </a>
                        </div>
                      </div>
                    </Form.Group>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="ComsetFormAddIn">
                    <Form.Group className="FormInputcovermain" controlId="">
                      <Form.Label>{t("email_address")}*</Form.Label>
                      <div className="editforminputCov">
                        <Form.Control
                          type=""
                          placeholder={t("email_address")}
                          value={values?.email}
                        />
                        <a
                          href="javascript:void(0);"
                          onClick={() => {
                            setIsChangeForEmail(true);
                            handleShow();
                          }}
                        >
                          <RiPencilFill />
                        </a>
                      </div>
                    </Form.Group>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="ComsetFormAddIn">
                    <div className="FormInputcovermain ComsetFormDatepic">
                      <p>{t("date_of_birth")}*</p>
                      <div className="ComsetFormDateiner">
                        <DatePicker
                          onChange={(date) =>
                            setFieldValue("dateOfBirth", date)
                          }
                          className={
                            "form-control " +
                            (renderError("dateOfBirth", errors)
                              ? "errorBorder"
                              : "")
                          }
                          selected={
                            values?.dateOfBirth
                              ? new Date(values?.dateOfBirth)
                              : null
                          }
                          maxDate={new Date()}
                          dateFormat={"dd/MM/yyyy"}
                          placeholderText={t("enter_dob")}
                        />
                        <IoCalendar />
                      </div>
                      {renderError("dateOfBirth", errors)}
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  {renderInput(
                    t("uniqueid_and_passportno") + "*",
                    "uniqueId",
                    t("uniqueid_and_passportno"),
                    errors,
                    values,
                    true
                  )}
                </Col>
                <Col md={4}>
                  {renderInput(
                    t("zalo_number"),
                    "zaloNumber",
                    t("zalo_number"),
                    errors,
                    values,
                    true
                  )}
                </Col>
                <Col md={12}>
                  <div className="SaveformBtnmaincov">
                    <Button
                      type="button"
                      disabled={isLoading}
                      onClick={handleSave}
                    >
                      {t("save_changes")}
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </form>
        )}
      </Formik>
      <hr className="HrLineboxcov" />
      <div className="Profilesetigcovform">
        <div className="resetpasstitle">
          <h3>{t("reset_password")}</h3>
        </div>
        <Row>
          <Col md={4}>
            <div className="ComsetFormAddIn">
              <Form.Group className="FormInputcovermain" controlId="">
                <Form.Label>{t("current_password")}</Form.Label>
                <Form.Control
                autoComplete="new-password"
                  type="password"
                  placeholder={t("Current_password")}
                  className={errors?.currentPassword ? "errorBorder" : ""}
                  onChange={(e) => {
                    setField("currentPassword", e.target.value);
                  }}
                  value={form?.currentPassword}
                />
                <div style={{ color: "red" }}>{errors?.currentPassword}</div>
              </Form.Group>
            </div>
          </Col>
          <Col md={4}>
            <div className="ComsetFormAddIn">
              <Form.Group className="FormInputcovermain" controlId="">
                <Form.Label>{t("new_password")}</Form.Label>
                <Form.Control
                  type="password"
                  placeholder={t("New_password")}
                  className={errors?.newPassword ? "errorBorder" : ""}
                  onChange={(e) => {
                    setField("newPassword", e.target.value);
                  }}
                  value={form?.newPassword}
                />

                <div style={{ color: "red" }}>{errors?.newPassword}</div>
              </Form.Group>
            </div>
          </Col>
          <Col md={4}>
            <div className="ComsetFormAddIn">
              <Form.Group className="FormInputcovermain" controlId="">
                <Form.Label>{t("confirm_password")}*</Form.Label>
                <Form.Control
                  type="password"
                  placeholder={t("confirm_password")}
                  className={errors?.confirmPassword ? "errorBorder" : ""}
                  onChange={(e) => {
                    setField("confirmPassword", e.target.value);
                  }}
                  value={form?.confirmPassword}
                />
                <div style={{ color: "red" }}>{errors?.confirmPassword}</div>
              </Form.Group>
            </div>
          </Col>
          <Col md={12}>
            <div className="SaveformBtnmaincov">
              <Button
                type="button"
                onClick={onPasswordChange}
                disabled={isLoading}
              >
                {t("save_changes")}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

ProfileSettings.PageLayout = UserProfileLayout;

export default ProfileSettings;
