import React, { useState, useMemo, useContext, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { Doclist1 } from "../../../public/assets";

import { BiUpload } from "react-icons/bi";
import { IoCalendar } from "react-icons/io5";

import { useDropzone } from "react-dropzone";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RegisterDRContext } from "../../../pages/join-as-doctor";
import { ErrorMessage } from "formik";
import Image from "next/image";
import { toast } from "react-toastify";
import { DEFAULT_DATE_FORMAT, ELDER_DATE } from "../../../utils/constant";
import { useTranslate } from "../../../commonModules/translate";

function DoctorBasicDetails() {
  const registerDrContext: any = useContext(RegisterDRContext);
  const {
    setCurrentStep,
    countryCodeLookups,
    genderLookups,
    languageLookups,
    values,
    setFieldValue,
    errors,
    showError,
  } = registerDrContext;
  const animatedComponents = makeAnimated();

  const t = useTranslate();

  const [imagePrev, setImagePrev] = useState("");

  // const onDrop = (acceptedFiles: any) => {
  //     if (acceptedFiles[0]) {
  //         setImagePrev(URL.createObjectURL(acceptedFiles[0]));
  //     }
  // };

  useEffect(() => {
    if (values?.docImg) setImagePrev(URL.createObjectURL(values?.docImg));
  }, [values?.docImg]);

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    fileRejections,
  } = useDropzone({
    // onDrop,
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/PNG": [".PNG"],
      "image/jpg": [".jpg"],
      "image/JPG": [".JPG"],
    },
    maxSize: 2 * 1024 * 1024,
  });

  useEffect(() => {
    if (acceptedFiles?.length) {
      const errors: string[] = [];
      let newFiles: File[] = acceptedFiles;

      newFiles?.forEach((file: any, index: number) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (e: any) => {
          let image: any = new window.Image();
          image.src = e.target.result;
          image.onload = function () {
            if (this.height < 300 || this.width < 300) {
              errors.push(
                t("valid_img_300x300")
              );
            }
            if (errors?.length) {
              toast.error(errors?.toString());
            } else {
              //   setImgErrors(null);
              setFieldValue("docImg", newFiles[0]);
            }
          };
        };
      });
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (fileRejections?.length) {
      const newErrors: any[] = [];
      fileRejections.forEach((element) => {
        if (element.errors?.length) {
          const code = element.errors[0].code;
          if (!newErrors.find((x) => x.code === code))
            newErrors.push({
              code,
              message:
                code === "file-too-large"
                  ? t("file_size_less_than_2mb")
                  : code === "file-invalid-type"
                    ? t("png_jpg_only")
                    : element.errors[0].message,
            });
        }
      });
      toast.error(newErrors.map((x) => x.message).toString());
    }
  }, [fileRejections]);

  const [date, setdate] = useState(new Date());

  const renderError = (fieldName: string) => {
    return (
      errors &&
      errors[fieldName] &&
      showError && <div style={{ color: "red" }}>{errors[fieldName]}</div>
    );
  };
  const renderInput = (
    label: string,
    fieldName: string,
    placeholder: string
  ) => {
    const fieldError = renderError(fieldName);
    return (
      <div className="ComsetFormAddIn">
        <Form.Group className="FormInputcovermain" controlId="">
          <Form.Label>{label}</Form.Label>
          <Form.Control
            type=""
            placeholder={placeholder}
            value={values[fieldName]}
            onChange={(e) => {
              setFieldValue(fieldName, e.target.value);
            }}
            onBlur={(e) => {
              setFieldValue(fieldName, e.target.value?.trim());
            }}
            className={fieldError ? "errorBorder" : ""}
          />
          {fieldError}
        </Form.Group>
      </div>
    );
  };
  return (
    <>
      <div className="ComsetmodlaForm">
        <Row>
          <Col md="12">
            <div
              className="UploadFormcontrolBox"
              style={{ paddingLeft: imagePrev ? "132px" : "0px" }}
            >
              {imagePrev && (
                <div className="UploadFormcontrol-img">
                  <Image width={100} height={100} src={imagePrev} alt="" />
                </div>
              )}
              <h6>{t("upload_your_picture")}</h6>
              <div className="drop-mainset" {...getRootProps({})}>
                <div className="drop-updata">
                  <input {...getInputProps()} />
                  <h5>
                    <BiUpload /> {t("upload")}
                  </h5>
                </div>
              </div>

              <div className="UploadFormcontrol-note">
                <p>
                {t("for_best_img_result_info_1")} <br /> {t("for_best_img_result_info_2")}
                </p>
              </div>
            </div>
          </Col>
          {renderError("docImg") && (
            <Col md="12" className="mb-3" style={{ marginTop: "-35px" }}>
              {renderError("docImg")}
            </Col>
          )}

          <Col md={6}>
            {renderInput(t("fullname") + "*", "fullName", t("your_full_name"))}
          </Col>
          <Col md={6}>
            {renderInput(t("email_address") + "*", "emailAddress", t("email_address"))}
          </Col>
          <Col md={4}>
            <div className="ComsetFormAddIn">
              <Form.Group className="FormInputcovermain" controlId="">
                <Form.Label>{t("mobile_number")}*</Form.Label>
                <div className="MobilCodeformmaincust">
                  <div className="FormComCountrycodeSet">
                    <Select
                      components={animatedComponents}
                      options={countryCodeLookups}
                      classNamePrefix="react-select"
                      value={values?.phoneCode}
                      onChange={(e) => setFieldValue("phoneCode", e)}
                    />
                  </div>
                  <Form.Control
                    className={renderError("mobileNumber") ? "errorBorder" : ""}
                    type="number"
                    placeholder={t("mobile_number")}
                    value={values?.mobileNumber}
                    onChange={(e) =>
                      setFieldValue("mobileNumber", e.target.value)
                    }
                  />
                  {renderError("mobileNumber")}
                </div>
              </Form.Group>
            </div>
          </Col>

          <Col md={4}>
            <div className="ComsetFormAddIn">
              <div className="FormSelectcovermain">
                <p>{t("Gender")}</p>
                <Select
                  components={animatedComponents}
                  classNamePrefix="react-select"
                  options={genderLookups}
                  value={values?.gender}
                  onChange={(e) => setFieldValue("gender", e)}
                />
              </div>
            </div>
          </Col>

          <Col md={4}>
            <div className="ComsetFormAddIn">
              <div className="FormInputcovermain ComsetFormDatepic">
                <p>{t("date_of_birth") + "*"}</p>
                <div className="ComsetFormDateiner">
                  <DatePicker
                    selected={values?.dateOfBirth}
                    onChange={(date) => {
                      setFieldValue("dateOfBirth", date);
                    }}
                    className={
                      "form-control " +
                      (renderError("dateOfBirth") ? "errorBorder" : "")
                    }
                    value={values?.dateOfBirth}
                    showYearDropdown={true}
                    showMonthDropdown
                    dropdownMode="select"
                    maxDate={ELDER_DATE()}
                    dateFormat={DEFAULT_DATE_FORMAT}
                    placeholderText={t("date_of_birth")}
                  />
                  <IoCalendar />
                </div>
                {renderError("dateOfBirth")}
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="ComsetFormAddIn">
              <Form.Group className="FormInputcovermain" controlId="">
                <Form.Label>{t("username") + "*"}</Form.Label>
                <Form.Control
                  className={renderError("userName") ? "errorBorder" : ""}
                  type=""
                  placeholder={t("username")}
                  value={values.userName}
                  onChange={(e) => setFieldValue("userName", e.target.value)}
                  onBlur={(e) =>
                    setFieldValue("userName", e.target.value?.trim())
                  }
                  maxLength={20}
                />
                <p className="noteloginboxcom">
                  {t("user_name_info")}
                </p>
                {renderError("userName")}
              </Form.Group>
            </div>
          </Col>
          <Col md={6}>
            {renderInput(t("license_number") + "*", "licenseNumber", t("license_number"))}
          </Col>
          <Col md={12}>
            <div className="ComsetFormAddIn">
              <Form.Group
                className="FormInputcovermain TextareaFormboxset"
                controlId=""
              >
                <Form.Label>{t("biography") + "*"}</Form.Label>
                <Form.Control
                  className={renderError("bioGraphy") ? "errorBorder" : ""}
                  as="textarea"
                  placeholder={t("biography")}
                  onBlur={(e) =>
                    setFieldValue("bioGraphy", e.target.value?.trim())
                  }
                  value={values.bioGraphy}
                  onChange={(e) => setFieldValue("bioGraphy", e.target.value)}
                />
                {renderError("bioGraphy")}
              </Form.Group>
            </div>
          </Col>
          <Col md={12}>
            <div className="ComsetFormAddIn">
              <div className="FormSelectcovermain">
                <p className="form-label">{t("language") + "*"}</p>
                <Select
                  // defaultValue={[options3[2], options3[3]]}
                  isMulti
                  name="colors"
                  options={languageLookups}
                  className={
                    renderError("languages")
                      ? "react-select errorBorder"
                      : "react-select"
                  }
                  classNamePrefix="select"
                  value={values?.languages}
                  onChange={(val) =>
                    setFieldValue("languages", val?.length ? val : "")
                  }
                />
                {renderError("languages")}
              </div>
            </div>
          </Col>

          <Col md={12}>
            <div className="ComsetBtnSavebox" onClick={setCurrentStep}>
              <Button type="button">{t("next")}</Button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default DoctorBasicDetails;
