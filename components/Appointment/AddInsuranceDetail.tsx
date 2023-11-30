import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { IoCalendar } from "react-icons/io5";
import { BiUpload } from "react-icons/bi";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import DatePicker from "react-datepicker";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  customSelector,
  getAllCountries,
} from "../../store/custom/customSlice";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import {
  createInsuranceClaimAction,
  getAllInsuranceCompaniesAction,
  ICreateInsuranceClaims,
  insuranceClaimsSelector,
} from "../../store/insurance/insuranceClaimsSlice";
import { toast } from "react-toastify";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import { HealthRecordUploadFileType } from "../../utils/constant";
import commonService from "../../services/commonService";
import { getAppointmentAction } from "../../store/user/appointmentSlice";
import { useTranslate } from "../../commonModules/translate";

function AddInsuranceDetail(props: {
  show: boolean;
  onHide: any;
  appointmentId: number;
  doctorId: number;
}) {
  const { show, onHide, doctorId, appointmentId } = props;
  const animatedComponents = makeAnimated();

  const formRef = useRef<any>(null);

  const [showError, setShowError] = useState(false);

  const t = useTranslate();

  const initVal: {
    insuranceCompany: string;
    insuredName: string;
    dob: any;
    eventDate: any;
    policyNo: string;
    phoneCode: string;
    reasonForRequest: string;
    mobileNumber: string;
    passportFrontFile: any;
    passportBackFile: any;
    termsAndConditionChecked: boolean;
    email: string;
    medicalProviderName: string;
    claimsAmount: string;
    uniqueIdOrPassport: string;
  } = {
    insuranceCompany: "",
    insuredName: "",
    dob: "",
    eventDate: "",
    policyNo: "",
    reasonForRequest: "",
    phoneCode: "",
    mobileNumber: "",
    passportFrontFile: null,
    passportBackFile: null,
    termsAndConditionChecked: false,
    email: "",
    medicalProviderName: "",
    claimsAmount: "",
    uniqueIdOrPassport: "",
  };

  const validationSchema = Yup.object().shape({
    insuranceCompany: Yup.mixed()
      .nullable()
      .required(t("insurance_comp_required")),
    insuredName: Yup.string().nullable().required(t("insure_name_required")),
    policyNo: Yup.string().nullable().required(t("policy_no_required")),
    mobileNumber: Yup.number()
      .nullable()
      .required(t("mobile_no_required"))
      .min(999999, t("must_be_bw_7_to_15"))
      .max(999999999999999, t("must_be_bw_7_to_15")),
    reasonForRequest: Yup.string()
      .nullable()
      .required(t("reason_for_request_required")),
    uniqueIdOrPassport: Yup.string()
      .nullable()
      .required(t("uniqueId_passport_required")),
    passportFrontFile: Yup.mixed()
      .nullable()
      .required(t("uploadId_passport_front_required")),
    passportBackFile: Yup.mixed()
      .nullable()
      .required(t("uploadId_passport_back_required")),
    email: Yup.string()
      .nullable()
      .email(t("valid_email"))
      .required(t("email_required")),
    medicalProviderName: Yup.string()
      .nullable()
      .required(t("med_provider_name_required")),
    claimsAmount: Yup.number().nullable().required(t("claim_amt_required")),
    dob: Yup.date().nullable().required(t("dob_required")),
    eventDate: Yup.date().nullable().required(t("event_date_required")),
    // .test({
    //     message: 'Please enter only number.', test: (val: string) => {
    //         return false
    //     }
    // }),
  });

  const dispatch = useAppDispatch();
  const customDetails = useAppSelector(customSelector);
  const insuranceClaimsState = useAppSelector(insuranceClaimsSelector);
  const [countryCodeLookups, setCountryCodeLookups] = useState<any>([]);
  const [insuranceCompanyLookups, setInsuranceCompanyLookups] = useState<any>(
    []
  );
  const [isRecordCreating, setIsRecordCreating] = useState<boolean>(false);

  useEffect(() => {
    if (!insuranceClaimsState.getAllInsuranceCompanies.data?.length) {
      dispatch(getAllInsuranceCompaniesAction());
    }
    if (!customDetails.countries.countries?.length) {
      dispatch(getAllCountries());
    }
  }, []);

  useEffect(() => {
    if (customDetails.countries.countries?.length) {
      const newLookups = customDetails.countries.countries.map((x) => ({
        value: x.countryId,
        label: `${x.code}  +${x.phoneCode}`,
        countryCode: x.phoneCode,
      }));
      setCountryCodeLookups(newLookups);
      formRef.current?.setFieldValue("phoneCode", newLookups[0]);
    }
  }, [customDetails.countries.countries]);

  useEffect(() => {
    if (insuranceClaimsState.getAllInsuranceCompanies.data?.length) {
      const newLookups = insuranceClaimsState.getAllInsuranceCompanies.data.map(
        (x) => ({ value: x.insuranceCompanyId, label: x.companyName })
      );
      setInsuranceCompanyLookups(newLookups);
      // formRef.current?.setFieldValue('insuranceCompany', newLookups[0])
    }
  }, [insuranceClaimsState.getAllInsuranceCompanies.data]);

  const {
    acceptedFiles: acceptedPassportFrontFiles,
    getRootProps: passportFrontRootProps,
    getInputProps: passportFrontInputProps,
    fileRejections: passportFrontFileRejections,
  } = useDropzone({
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/PNG": [".PNG"],
      "image/jpg": [".jpg"],
      "image/JPG": [".JPG"],
      "image/jpeg": [".jpeg"],
      "image/JPEG": [".JPEG"],
      "application/pdf": [".pdf"],
    },
    // maxSize: 2 * 1024 * 1024,
  });

  const {
    acceptedFiles: acceptedPassportBackFiles,
    getRootProps: passportBackRootProps,
    getInputProps: passportBackInputProps,
    fileRejections: passportBackFileRejections,
  } = useDropzone({
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/PNG": [".PNG"],
      "image/jpg": [".jpg"],
      "image/JPG": [".JPG"],
      "image/jpeg": [".jpeg"],
      "image/JPEG": [".JPEG"],
      "application/pdf": [".pdf"],
    },
    // maxSize: 2 * 1024 * 1024,
  });

  useEffect(() => {
    if (passportFrontFileRejections?.length) {
      const newErrors: any[] = [];
      passportFrontFileRejections.forEach((element) => {
        if (element.errors?.length) {
          const code = element.errors[0].code;
          if (!newErrors.find((x) => x.code === code))
            newErrors.push({
              code,
              message:
                code === "file-too-large"
                  ? t("file_size_less_than_2mb")
                  : code === "file-invalid-type"
                  ? t("png_jpg_jpeg_pdf_download")
                  : element.errors[0].message,
            });
        }
      });
      toast.error(newErrors.map((x) => x.message).toString());
    }
  }, [passportFrontFileRejections]);

  useEffect(() => {
    if (passportBackFileRejections?.length) {
      const newErrors: any[] = [];
      passportBackFileRejections.forEach((element) => {
        if (element.errors?.length) {
          const code = element.errors[0].code;
          if (!newErrors.find((x) => x.code === code))
            newErrors.push({
              code,
              message:
                code === "file-too-large"
                  ? t("file_size_less_than_2mb")
                  : code === "file-invalid-type"
                  ? t("png_jpg_jpeg_pdf_download")
                  : element.errors[0].message,
            });
        }
      });
      toast.error(newErrors.map((x) => x.message).toString());
    }
  }, [passportBackFileRejections]);

  useEffect(() => {
    if (acceptedPassportFrontFiles?.length) {
      const acceptedFileExt = acceptedPassportFrontFiles?.map((x) =>
        x.name?.split(".")?.pop()?.toString()?.toLowerCase()
      );
      const filteredExt = acceptedFileExt.filter(function (obj) {
        return ["jpg", "jpeg", "png", "pdf"].indexOf(obj) == -1;
      });
      if (filteredExt?.length) {
        toast.error(t("png_jpg_jpeg_pdf_download"));
      } else {
        formRef.current?.setFieldValue(
          "passportFrontFile",
          acceptedPassportFrontFiles
        );
      }
    }
  }, [acceptedPassportFrontFiles]);

  useEffect(() => {
    if (acceptedPassportBackFiles?.length) {
      // const newFiles = values?.documentFile?.length ? [...values?.documentFile, ...acceptedPassportBackFiles] : [...acceptedPassportBackFiles];
      const acceptedFileExt = acceptedPassportBackFiles?.map((x) =>
        x.name?.split(".")?.pop()?.toString()?.toLowerCase()
      );
      const filteredExt = acceptedFileExt.filter(function (obj) {
        return ["jpg", "jpeg", "png", "pdf"].indexOf(obj) == -1;
      });
      if (filteredExt?.length) {
        toast.error(t("png_jpg_jpeg_pdf_download"));
      } else {
        formRef.current?.setFieldValue(
          "passportBackFile",
          acceptedPassportBackFiles
        );
      }
    }
  }, [acceptedPassportBackFiles]);

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
    setFieldValue: any,
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
              setFieldValue(fieldName, e.target.value);
            }}
            onBlur={(e) => {
              if (!isNumber) setFieldValue(fieldName, e.target.value?.trim());
            }}
            className={fieldError ? "errorBorder" : ""}
          />
          {fieldError}
        </Form.Group>
      </div>
    );
  };

  const onRemoveFile = (isForBack: boolean, index: number) => {
    const { values, setFieldValue } = formRef.current;
    let existingFiles = isForBack
      ? values?.passportBackFile
      : values?.passportFrontFile;
    existingFiles = existingFiles ? existingFiles : [];
    existingFiles = existingFiles?.filter((x: any, i: number) => index !== i);
    setFieldValue(
      isForBack ? "passportBackFile" : "passportFrontFile",
      existingFiles?.length ? existingFiles : null
    );
  };

  const handleClaimInsurance = () => {
    const { values, validateForm } = formRef.current;

    validateForm(values).then((res) => {
      if (res && Object.keys(res).length) {
        setShowError(true);
      } else {
        setShowError(false);
        if (values.termsAndConditionChecked) {
          const {
            insuranceCompany,
            insuredName,
            dob,
            eventDate,
            policyNo,
            reasonForRequest,
            phoneCode,
            mobileNumber,
            uniqueIdOrPassport,
            passportFrontFile,
            passportBackFile,
            termsAndConditionChecked,
            medicalProviderName,
            email,
            claimsAmount,
          } = values;
          setIsRecordCreating(true);
          const payloadDetail: { fileName: string; fileType: number }[] = [];
          const uploadedFiles = [...passportFrontFile, ...passportBackFile];
          uploadedFiles.forEach((element) => {
            if (element.type === "application/pdf") {
              payloadDetail.push({
                fileName: element.name,
                fileType: HealthRecordUploadFileType.PDF,
              });
            } else {
              payloadDetail.push({
                fileName: element.name,
                fileType: HealthRecordUploadFileType.Image,
              });
            }
          });
          try {
            commonService
              .getFileUploadDetails(payloadDetail)
              .then(async (res) => {
                const fileDataForHealthRecord: string[] = [];
                if (res?.data) {
                  let index = 0;
                  for await (const fileUploadRes of res.data?.fileUploads) {
                    const { uploadUrl, fileHttpUrl } = fileUploadRes;
                    await commonService
                      .uploadFile(uploadUrl, uploadedFiles[index])
                      .then((res) => {
                        if (res && res.status === 200 && res.ok) {
                          fileDataForHealthRecord.push(fileHttpUrl);
                        }
                      });
                    index++;
                  }
                  if (fileDataForHealthRecord?.length > 0) {
                    const payload: ICreateInsuranceClaims = {
                      insuranceCompanyId: insuranceCompany.value,
                      appointmentId,
                      insuredName,
                      policyNumber: policyNo,
                      birthDate: dob,
                      uniqueId: uniqueIdOrPassport,
                      passportFrontSideFilePath: fileDataForHealthRecord[0],
                      passportBackSideFilePath: fileDataForHealthRecord[1],
                      countryId: phoneCode.value,
                      phoneCode: phoneCode.countryCode,
                      mobileNumber: mobileNumber,
                      email,
                      reasonForRequest,
                      eventDate,
                      medicalProvidersName: medicalProviderName,
                      claimAmount: claimsAmount,
                      isTermsAndConditionAccepted: termsAndConditionChecked,
                    };
                    dispatch(createInsuranceClaimAction(payload))
                      .then((res) => {
                        if (Number(res.payload)) {
                          onHide();
                          dispatch(getAppointmentAction(Number(appointmentId)));
                          toast.success(
                            t("insurance_claim_success")
                          );
                          setIsRecordCreating(false);
                        }
                      })
                      .finally(() => {
                        setIsRecordCreating(false);
                      });
                  }
                }
              });
          } catch (error) {
            setIsRecordCreating(false);
            toast.error(t("went_wrong"));
          }
        } else {
          toast.error(t("accept_term_condition"));
        }
      }
    });
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={onHide}
        // backdrop="static"
        // keyboard={false}
        centered
        className="CustModalComcovermain InsuranceDetailModalbox"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("add_insurance_detail")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            innerRef={formRef}
            initialValues={initVal}
            validationSchema={validationSchema}
            onSubmit={() => {}}
          >
            {({
              handleSubmit,
              errors,
              values,
              setFieldValue,
              validateForm,
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="ComsetmodlaForm">
                  <Row>
                    <Col md={12}>
                      <div className="ComsetFormAddIn">
                        <div className="FormSelectcovermain">
                          <p>{t("insurance_company")}*</p>
                          <Select
                            components={animatedComponents}
                            classNamePrefix="react-select"
                            onChange={(val) =>
                              setFieldValue("insuranceCompany", val)
                            }
                            className={
                              renderError("insuranceCompany", errors)
                                ? "react-select errorBorder"
                                : "react-select"
                            }
                            options={insuranceCompanyLookups}
                            value={values?.insuranceCompany}
                          />
                          {renderError("insuranceCompany", errors)}
                        </div>
                      </div>
                    </Col>
                    <Col md={12}>
                      {renderInput(
                        t("insured_name") + "*",
                        "insuredName",
                        t("insured_name"),
                        errors,
                        values,
                        setFieldValue
                      )}
                    </Col>
                    <Col md={6}>
                      {renderInput(
                        t("policy_number") + "*",
                        "policyNo",
                        t("policy_number"),
                        errors,
                        values,
                        setFieldValue
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="ComsetFormAddIn">
                        <div className="FormInputcovermain ComsetFormDatepic">
                          <p>{t("date_of_birth")}*</p>
                          <div className="ComsetFormDateiner ">
                            <DatePicker
                              onChange={(date) => setFieldValue("dob", date)}
                              className={
                                "form-control " +
                                (renderError("dob", errors)
                                  ? "errorBorder"
                                  : "")
                              }
                              selected={values?.dob}
                              dateFormat={"dd/MM/yyyy"}
                              placeholderText={t("date_of_birth")}
                              maxDate={new Date()}
                            />
                            <IoCalendar />
                          </div>
                          {renderError("dob", errors)}
                        </div>
                      </div>
                    </Col>
                    <Col md={12}>
                      {renderInput(
                        t("IDPassportNo") + "*",
                        "uniqueIdOrPassport",
                        t("IDPassportNo"),
                        errors,
                        values,
                        setFieldValue
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="uploaddocfileComcov">
                        <Form.Label>{t("UplodIdPassportFrontSide")}*</Form.Label>
                        <div
                          className={
                            "drop-mainset " +
                            (renderError("passportFrontFile", errors)
                              ? "errorBorder"
                              : "")
                          }
                          {...passportFrontRootProps({})}
                        >
                          <div className="drop-updata">
                            <input {...passportFrontInputProps()} />
                            <h5>
                              <BiUpload /> {t("upload")}{" "}
                            </h5>
                          </div>
                        </div>
                        <p className="noteupldtext">
                          {t("supports_file_type")}
                        </p>
                        {values?.passportFrontFile?.length > 0 &&
                          values?.passportFrontFile?.map(
                            (x: any, index: number) => (
                              <div
                                className="UplodeddatalistoCov"
                                title={x?.name}
                                key={`license-file-${index}`}
                              >
                                <h3>
                                  <BsFillFileEarmarkTextFill /> {x?.name}
                                  <a
                                    href="javascript:;"
                                    onClick={() => onRemoveFile(false, index)}
                                  >
                                    <IoIosCloseCircle />
                                  </a>
                                </h3>
                              </div>
                            )
                          )}
                        {renderError("passportFrontFile", errors)}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="uploaddocfileComcov">
                        <Form.Label>{t("UplodIdPassportBackSide")}*</Form.Label>
                        <div
                          className={
                            "drop-mainset " +
                            (renderError("passportBackFile", errors)
                              ? "errorBorder"
                              : "")
                          }
                          {...passportBackRootProps({})}
                        >
                          <div className="drop-updata">
                            <input {...passportBackInputProps()} />
                            <h5>
                              <BiUpload /> {t("upload")}{" "}
                            </h5>
                          </div>
                        </div>
                        <p className="noteupldtext">
                          {t("supports_file_type")}
                        </p>
                        {values?.passportBackFile?.length > 0 &&
                          values?.passportBackFile?.map(
                            (x: any, index: number) => (
                              <div
                                className="UplodeddatalistoCov"
                                title={x?.name}
                                key={`license-file-${index}`}
                              >
                                <h3>
                                  <BsFillFileEarmarkTextFill /> {x?.name}
                                  <a
                                    href="javascript:;"
                                    onClick={() => onRemoveFile(true, index)}
                                  >
                                    <IoIosCloseCircle />
                                  </a>
                                </h3>
                              </div>
                            )
                          )}
                        {renderError("passportBackFile", errors)}
                      </div>
                    </Col>
                    <Col md={6}>
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
                              className={
                                renderError("mobileNumber", errors)
                                  ? "errorBorder"
                                  : ""
                              }
                              type="number"
                              placeholder={t("mobile_number") }
                              value={values?.mobileNumber}
                              onChange={(e) =>
                                setFieldValue("mobileNumber", e.target.value)
                              }
                            />
                            {renderError("mobileNumber", errors)}
                          </div>
                        </Form.Group>
                      </div>
                    </Col>
                    <Col md={6}>
                      {renderInput(
                        t("email_address") + "*",
                        "email",
                        t("email_address"),
                        errors,
                        values,
                        setFieldValue
                      )}
                    </Col>
                    <Col md={12}>
                      {renderInput(
                        t("ResoneForRequest"),
                        "reasonForRequest",
                        t("enter_reason_for_request"),
                        errors,
                        values,
                        setFieldValue
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="ComsetFormAddIn">
                        <div className="FormInputcovermain ComsetFormDatepic">
                          <p>{t("EventDate")}</p>
                          <div className="ComsetFormDateiner">
                            <DatePicker
                              onChange={(date) =>
                                setFieldValue("eventDate", date)
                              }
                              className={
                                "form-control " +
                                (renderError("eventDate", errors)
                                  ? "errorBorder"
                                  : "")
                              }
                              selected={values?.eventDate}
                              dateFormat={"dd/MM/yyyy"}
                              placeholderText={t("event_date")}
                            />
                            <IoCalendar />
                          </div>
                          {renderError("eventDate", errors)}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      {renderInput(
                        t("medical_providers_name"),
                        "medicalProviderName",
                        t("medical_providers_name"),
                        errors,
                        values,
                        setFieldValue
                      )}
                    </Col>
                    <Col md={12}>
                      {renderInput(
                        t("claims_amount") + "*",
                        "claimsAmount",
                        t("claims_amount"),
                        errors,
                        values,
                        setFieldValue,
                        true
                      )}
                    </Col>
                    <Col md={12}>
                      <div className="ClamInsunceTncbox">
                        <Form.Check
                          aria-label="option 1"
                          label=""
                          checked={values.termsAndConditionChecked}
                          onClick={() => {
                            setFieldValue(
                              "termsAndConditionChecked",
                              values.termsAndConditionChecked ? false : true
                            );
                          }}
                        />
                        <p>
                          {t("accept")} <a href="javascript:;">{t("TermsConditions")}*</a>
                        </p>
                      </div>
                    </Col>
                    <div className="ComsetBtnSaveFull">
                      <Button
                        type="button"
                        onClick={handleClaimInsurance}
                        disabled={isRecordCreating}
                      >
                        {t("CalimInsurence")}
                      </Button>
                    </div>
                  </Row>
                </div>
              </form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddInsuranceDetail;
