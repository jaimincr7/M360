import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { toast } from "react-toastify";
import ReCaptcha from "react-google-recaptcha";
import { IAddContactUs } from "../../commonModules/commonInterfaces";
import {
  customSelector,
  addContactUsMessage,
  getAllCountries,
} from "../../store/custom/customSlice";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { useTranslate } from "../../commonModules/translate";

function ContactUsMobile() {
  const t=useTranslate()
  const dispatch = useAppDispatch();
  const customDetails = useAppSelector(customSelector);
  const [form, setForm] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [countryCodeLookups, setCountryCodeLookups] = useState<any>([]);

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
    const { fullName, email, mobileNumber, message, country } = form;

    const newErrors: any = {};
    if (!fullName || fullName == "" || !fullName.replace(/\s/g, "").length)
    newErrors.fullName = t("valid_full_name");
    if (!email || email == "" || (!email.includes("@") && !email.includes(".")))
    newErrors.email = t("valid_email");
    if (!message || message == "")
      newErrors.message = t("valid_msg");
    if (
      !mobileNumber ||
      mobileNumber == "" ||
      mobileNumber.toString().length > 15 ||
      mobileNumber.toString().length < 7
    )
      newErrors.mobileNumber =
      t("must_be_bw_7_to_15");

    return newErrors;
  };

  const onSubmit = () => {
    const formErrors = validateForms();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      const data: IAddContactUs = {
        fullName: form.fullName,
        email: form.email,
        phoneCode: form.country.countryCode,
        countryId: form.country.value,
        mobileNumber: form.mobileNumber,
        message: form.message,
      };
      dispatch(addContactUsMessage(data));
      toast.success(t("msg_sent"));
      setForm({
        fullName: "",
        email: "",
        phoneCode: countryCodeLookups[0].countryCode,
        countryId: countryCodeLookups[0].value,
        mobileNumber: "",
        message: "",
        country: countryCodeLookups[0],
      });
    }
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

  const animatedComponents = makeAnimated();

  return (
    <>
      <Row>
        <Col md={6}>
          <div className="ContactusFormMap">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15677.67776832283!2d106.7000103!3d10.779152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38da1b09c9%3A0xa1258269d8ffabdd!2sB%E1%BA%BFn%20Ngh%C3%A9%2C%20District%201%2C%20Ho%20Chi%20Minh%20City%20700000%2C%20Vietnam!5e0!3m2!1sen!2sin!4v1670611536219!5m2!1sen!2sin"></iframe>
          </div>
        </Col>
        <Col md={6}>
          <div className="ComsetmodlaForm">
            <Row>
              <div className="ContactusTitle">
              <h3>{t("ContactUs")}</h3>
              </div>
              <Col md={12}>
                <div className="ComsetFormAddIn">
                  <Form.Group className="FormInputcovermain" controlId="">
                  <Form.Label>{t("fullname")}*</Form.Label>
                    <Form.Control
                      value={form.fullName}
                      isInvalid={!!errors.fullName}
                      type="text"
                      placeholder={t("enter_fullname")}
                      onChange={(e) => setField("fullName", e.target.value)}
                    />
                  </Form.Group>
                  <div style={{ color: "red" }}>{errors.fullName}</div>
                </div>
              </Col>
              <Col md={12}>
                <div className="ComsetFormAddIn">
                  <Form.Group className="FormInputcovermain" controlId="">
                    <Form.Label>{t("mobile_number")}*</Form.Label>
                    <div className="MobilCodeformmaincust">
                      <div className="FormComCountrycodeSet">
                        <Select
                          components={animatedComponents}
                          options={countryCodeLookups}
                          classNamePrefix="react-select"
                          value={form.country}
                          defaultValue={countryCodeLookups[0]}
                          onChange={(e) => setField("country", e)}
                        />
                      </div>
                      <Form.Control
                        value={form.mobileNumber}
                        isInvalid={!!errors.mobileNumber}
                        type="number"
                        placeholder={t("enter_mobile_number")}
                        onChange={(e) =>
                          setField("mobileNumber", e.target.value)
                        }
                      />
                      <div style={{ color: "red" }}>{errors.mobileNumber}</div>
                    </div>
                  </Form.Group>
                </div>
              </Col>
              <Col md={12}>
                <div className="ComsetFormAddIn">
                  <Form.Group className="FormInputcovermain" controlId="">
                  <Form.Label>{t("email_address")} *</Form.Label>
                    <Form.Control
                      type="email"
                      value={form.email}
                      isInvalid={!!errors.email}
                      placeholder={t("enter_email_address")}
                      onChange={(e) => setField("email", e.target.value)}
                    />
                  </Form.Group>
                  <div style={{ color: "red" }}>{errors.email}</div>
                </div>
              </Col>
              <Col md={12}>
                <div className="ComsetFormAddIn">
                  <Form.Group
                    className="FormInputcovermain TextareaFormboxset"
                    controlId=""
                  >
                    <Form.Label>{t("message")}*</Form.Label>
                    <Form.Control
                      onChange={(e) => setField("message", e.target.value)}
                      value={form.message}
                      isInvalid={!!errors.message}
                      as="textarea"
                      placeholder={t("message")}
                    />
                  </Form.Group>
                  <div style={{ color: "red" }}>{errors.message}</div>
                </div>
              </Col>

              <ReCaptcha sitekey={process.env.NEXT_PUBLIC_APP_SITE_KEY} />
              <Col md={12}>
                <div className="ComsetBtnSaveFull">
                  <Button onClick={onSubmit}>{t("send_msg")}</Button>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default ContactUsMobile;
