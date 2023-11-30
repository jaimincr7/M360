import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAppDispatch } from "../../../utils/hooks";
import {
  ILoginUserWithOTP,
  IRequestOTP,
} from "../../../commonModules/commonInterfaces";
import {
  loginUserWithOTPAction,
  requestOTPAction,
} from "../../../store/login/loginSlice";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  customSelector,
  getAllCountries,
} from "../../../store/custom/customSlice";
import { useSelector } from "react-redux";
import { useTranslate } from "../../../commonModules/translate";
import { toast } from "react-toastify";
import { OTPTypes } from "../../../utils/constant";

function MobileCodeVerification(props: {
  show: boolean;
  setShowLogin: any;
  onHide: any;
  setMobileNumber: any;
  setShowVerification: any;
  setCountryId?:any
}) {
  const animatedComponents = makeAnimated();

  const dispatch = useAppDispatch();
  const [form, setForm] = useState<any>({});
  const [countryCodeLookups, setCountryCodeLookups] = useState<any>([]);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const customDetails = useSelector(customSelector);
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

  const validateForms = () => {
    const { mobileNumber } = form;

    const newErrors: any = {};
    if (!mobileNumber || mobileNumber == "")
      newErrors.mobileNumber = t("mobile_no_required");
    else if (
      mobileNumber?.toString().length > 15 ||
      mobileNumber?.toString().length < 7
    )
      newErrors.mobileNumber = t("must_be_bw_7_to_15");

    return newErrors;
  };

  const onOTPVerify = () => {
    const formErrors = validateForms();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setIsLoading(true);
      const data: IRequestOTP = {
        username: form.mobileNumber.toString(),
        countryId: form.country.value,
        otpType: OTPTypes.Login,
      };
      dispatch(requestOTPAction(data))
        .then((res) => {
          if (res?.payload?.userId) {
            props.onHide();
            if(props.setCountryId)
            props.setCountryId( form.country.value)
            props.setShowVerification();
            toast.success(t("otp_sent_to_mob"));
            props.setMobileNumber(
              `+${form.country.countryCode} ${form.mobileNumber.toString()}`
            );
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
              <div className="VerifyCodeboxcov">
                <h3>{t('mobile_number')}</h3>
                <div className="ComsetFormAddIn">
                  <Form.Group className="FormInputcovermain" controlId="">
                    <div className="MobilCodeformmaincust">
                      <div className="FormComCountrycodeSet">
                        <Select
                          components={animatedComponents}
                          options={countryCodeLookups}
                          classNamePrefix="react-select"
                          // defaultValue={countryCodeLookups?.length ? countryCodeLookups[0] : null}
                          onChange={(e) => setField("country", e)}
                          value={form.country}
                        />
                      </div>
                      <Form.Group
                        className="FormInputcovermain"
                        controlId="mobileNumber"
                      >
                        <Form.Control
                          required
                          value={form.mobileNumber}
                          onChange={(e) =>
                            setField("mobileNumber", e.target.value)
                          }
                          type="number"
                          placeholder="Eg: 8844556611"
                        />
                        <div style={{ color: "red" }}>
                          {errors.mobileNumber}
                        </div>
                      </Form.Group>
                    </div>
                  </Form.Group>
                </div>
              </div>
              <div className="chboxlogotpcheckbox">
                <Form.Check
                  aria-label="option 1"
                  label={t("login_with_username_instedOf_otp")}
                  onClick={(e: any) => {
                    if (e.target.value) {
                      props.setShowLogin();
                      props.onHide();
                    }
                  }}
                />
              </div>
              <div className="SaveButtonComsetbox">
                <Button onClick={onOTPVerify} disabled={isLoading}>
                  {t("get_OTP")}
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default MobileCodeVerification;
