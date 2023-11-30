import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { ICreateUser } from "../../../commonModules/commonInterfaces";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import {
  createUser,
  loginUserAction,
  loginUserSelector,
} from "../../../store/login/loginSlice";
import {
  customSelector,
  getAllCountries,
} from "../../../store/custom/customSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useTranslate } from "../../../commonModules/translate";
import { DeviceType } from "../../../utils/constant";

function CreateAccount(props: {
  show: boolean;
  onHide: any;
  createUserAvatar?: any;
  onShowLogin?: any;
}) {
  const login = useAppSelector(loginUserSelector);
  const router = useRouter();
  const t = useTranslate();
  const [form, setForm] = useState<any>({
    country: {
      value: 3,
      label: "USA  +1",
      countryCode: 1,
    },
  });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [countryCodeLookups, setCountryCodeLookups] = useState<any>([]);
  const dispatch = useAppDispatch();
  const customDetails = useSelector(customSelector);

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
    const {
      fullName,
      email,
      mobileNumber,
      uniqueId,
      zaloNumber,
      password,
      confirmPassword,
      readTerms,
    } = form;
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    const smallChars = /[a-z]/;
    const capitalChars=/[A-Z]/

    const newErrors: any = {};
    if (!fullName || fullName == "" || !fullName.replace(/\s/g, "").length)
      newErrors.fullName = t("valid_full_name");
    if (!email || email == "" || (!email.includes("@") && !email.includes(".")))
      newErrors.email = t("valid_email");
    if (
      !mobileNumber ||
      mobileNumber == "" ||
      mobileNumber.toString().length > 15 ||
      mobileNumber.toString().length < 7
    )
      newErrors.mobileNumber = t("must_be_bw_7_to_15");
    if (!uniqueId || uniqueId == "" || Number(uniqueId) <= 0)
      newErrors.uniqueId = t("valid_uniqueId_passport");
    // if (!zaloNumber || zaloNumber == '' || !zaloNumber.match(specialChars) || !zaloNumber.match(alphaChars))
    //     newErrors.zaloNumber = 'Please Enter a valid Zalo Number!(Atleast 1 Alpha Numeric and 1 Special Character)';
    if (
      !password ||
      password == "" ||
      !password.match(specialChars) ||
      !password.match(smallChars) ||
      !password.match(capitalChars) ||
      password.toString().length < 6
    )
      newErrors.password =
        t("valid_pass")
    if (password && password.includes(" "))
      newErrors.password = t("pass_does_not_contain_space");
    if (confirmPassword !== password)
      newErrors.confirmPassword = t("pass_confirm_pass_same");
    if (
      !confirmPassword ||
      confirmPassword == "" ||
      !confirmPassword.match(specialChars) ||
      !confirmPassword.match(smallChars) ||
      !confirmPassword.match(capitalChars) ||
      confirmPassword.toString().length < 6
    )
      newErrors.confirmPassword =
        t("valid_confirm_pass")
    if (!confirmPassword || confirmPassword.length === 0)
      newErrors.confirmPassword =t("enter_confirm_pass");
    if (!readTerms)
      newErrors.readTerms = t("read_agree_terms");

    return newErrors;
  };

  // useEffect(() => {
  //   if (
  //     !!login &&
  //     !!login.createUser.createUser &&
  //     login.createUser.isSuccess &&
  //     Object.keys(login.createUser.createUser).length !== 0
  //   ) {
    
  //     // props.createUserAvatar();
  //   }
  // }, [login.createUser.createUser]);

  const animatedComponents = makeAnimated();

  const onCreate = () => {
    const formErrors = validateForms();

    if (Object.keys(formErrors).length > 0 || form.readTerms !== true) {
      setErrors(formErrors);
    } else {
      const data: ICreateUser = {
        fullName: form.fullName,
        email: form.email,
        phoneCode: form.country.countryCode,
        countryId: form.country.value,
        mobileNumber: form.mobileNumber,
        uniqueId: form.uniqueId,
        zaloNumber: form.zaloNumber,
        passwordHash: form.password,
      };
      if (router.query?.invitedby) {
        data.referralId = Number(router.query?.invitedby);
      }
      setIsLoading(true);
      dispatch(createUser(data))
        .then((res: any) => {
          if (res.payload?.data) {
            const login: any = {
              userName: form.email,
              password: form.password,
              deviceType: DeviceType.Web,
              deviceToken: "",
            };
            dispatch(loginUserAction(login)).then((loginRes) => {
              if (loginRes.payload) {
                toast.success(t("user_create_success"));
                props.onHide();
                setForm({});
                props.createUserAvatar(loginRes.payload);
                localStorage.setItem("user", JSON.stringify(loginRes.payload));
                window.dispatchEvent(new Event("loggedInCustomEvent"));
              }
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      {/* <ToastContainer /> */}
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
          <Modal.Title>{t("create_account")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="LoginFormmaincov">
            <div className="ComsetmodlaForm">
              {/* {form?.readTerms !== true ? (<div style={{ color: 'orange' }}>Please read and agree for all terms and condition</div>) : form?.readTerms} */}
              <div className="ComsetFormAddIn">
                <Form.Group className="FormInputcovermain" controlId="fullName">
                  <Form.Label>{t("fullname")}</Form.Label>
                  <Form.Control
                    value={form.fullName}
                    isInvalid={!!errors.fullName}
                    type="text"
                    placeholder="Your name"
                    onChange={(e) => setField("fullName", e.target.value)}
                  />
                  <div style={{ color: "red" }}>{errors.fullName}</div>
                </Form.Group>
              </div>

              <div className="ComsetFormAddIn">
                <Form.Group
                  className="FormInputcovermain"
                  controlId="mobileNumber"
                >
                  <Form.Label>{t("mobile_number")}*</Form.Label>
                  <div className="MobilCodeformmaincust">
                    <div className="FormComCountrycodeSet">
                      <Select
                        components={animatedComponents}
                        options={countryCodeLookups}
                        classNamePrefix="react-select"
                        defaultValue={3}
                        value={form.country}
                        onChange={(e) => setField("country", e)}
                      />
                    </div>
                    <Form.Control
                      value={form.mobileNumber}
                      isInvalid={!!errors.mobileNumber}
                      type="number"
                      placeholder={t("mobile_number")}
                      onChange={(e) => setField("mobileNumber", e.target.value)}
                    />
                    <div style={{ color: "red" }}>{errors.mobileNumber}</div>
                  </div>
                </Form.Group>
              </div>

              <div className="ComsetFormAddIn">
                <Form.Group className="FormInputcovermain" controlId="">
                  <Form.Label>Email*</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    isInvalid={!!errors.email}
                    placeholder="Your Email"
                    onChange={(e) => setField("email", e.target.value)}
                  />
                  <div style={{ color: "red" }}>{errors.email}</div>
                </Form.Group>
              </div>

              <div className="ComsetFormAddIn">
                <Form.Group className="FormInputcovermain" controlId="">
                  <Form.Label>{t("unique_id_passport")} *</Form.Label>
                  <Form.Control
                    type="number"
                    isInvalid={!!errors.uniqueId}
                    placeholder={t("enter_unique_id_passport")}
                    onChange={(e) => setField("uniqueId", e.target.value)}
                  />
                  <div style={{ color: "red" }}>{errors.uniqueId}</div>
                </Form.Group>
              </div>

              <div className="ComsetFormAddIn">
                <Form.Group className="FormInputcovermain" controlId="">
                  <Form.Label>{t("zalo_number")}</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder={t("enter_zalo_number")}
                    onChange={(e) => setField("zaloNumber", e.target.value)}
                  />
                  <div style={{ color: "red" }}>{errors.zaloNumber}</div>
                </Form.Group>
              </div>

              <Row>
                <Col md={6}>
                  <div className="ComsetFormAddIn">
                    <Form.Group className="FormInputcovermain" controlId="">
                      <Form.Label>{t("password")}*</Form.Label>
                      <Form.Control
                        type="password"
                        isInvalid={!!errors.password}
                        placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                        onChange={(e) => setField("password", e.target.value)}
                      />
                      <p className="noteloginboxcom">
                        {t("password_mustbe_six_char")}
                      </p>
                      <div style={{ color: "red" }}>{errors.password}</div>
                    </Form.Group>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="ComsetFormAddIn">
                    <Form.Group className="FormInputcovermain" controlId="">
                      <Form.Label>{t("confirm_password")}</Form.Label>
                      <Form.Control
                        type="password"
                        isInvalid={!!errors.confirmPassword}
                        placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                        onChange={(e) =>
                          setField("confirmPassword", e.target.value)
                        }
                      />
                      <div style={{ color: "red" }}>
                        {errors.confirmPassword}
                      </div>
                    </Form.Group>
                  </div>
                </Col>
              </Row>

              <div className="agreeconditbox">
                <Form.Check
                  aria-label="option 1"
                  label=""
                  onChange={(e) => {
                    setField("readTerms", e.target.checked);
                  }}
                />
                <p>
                  {t("i_agree_to")}{" "}
                  <a
                    onClick={() => {
                      window.open(
                        window.location.href + "/info/terms-and-service/"
                      );
                    }}
                  >
                    {t("terms_and_conditions")}*
                  </a>
                </p>
              </div>
              <div style={{ color: "red" }}>{errors.readTerms}</div>

              <div className="noyettextctnewbox">
                <p>
                  {t("already_have_account")}{" "}
                  <a
                    onClick={() => {
                      props.onHide();
                      setForm({});
                      props.onShowLogin();
                    }}
                  >
                    {t("login")}
                  </a>
                </p>
              </div>
              <div className="SaveButtonComsetbox">
                <Button onClick={onCreate} disabled={isLoading}>
                  {t("create_account")}
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateAccount;
