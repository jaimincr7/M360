import React, { useState, useMemo, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { HospitalImgForm } from "../../public/assets";
import { IoClose } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { BiUpload } from "react-icons/bi";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import {
  customSelector,
  getAllCities,
  getAllCitiesByStateId,
  getAllCountries,
  getAllStates,
} from "../../store/custom/customSlice";
import { useAppDispatch } from "../../utils/hooks";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { registerHospital } from "../../store/hospitalsList/hospitalsListSlice";
import { IClinic, ICreateHospital } from "../../commonModules/commonInterfaces";
import {
  HealthRecordUploadFileType,
  HospitalFileType,
} from "../../utils/constant";
import commonService from "../../services/commonService";
import { useTranslate } from "../../commonModules/translate";

const MaxClinicImg = 10;
const MaxClinicDoc = 10;
const MaxClinicDocSizeInMb = 5 * 1024 * 1024;

function RegisterHospital() {
  const animatedComponents = makeAnimated();
  const dispatch = useAppDispatch();
  const customDetails = useSelector(customSelector);

  const formRef: any = useRef(null);

  const [countryCodeLookups, setCountryCodeLookups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [cityLookups, setCityLookups] = useState([]);
  const [stateLookups, setStateLookups] = useState([]);
  const [imagePrev, setimagePrev] = useState("");
  const [pdfPrev, setPdfPrev] = useState("");
  const [imgErrors, setImgErrors] = useState<{ index: number; msg: string }[]>(
    []
  );

  const t = useTranslate();

  const initVal: any = {
    name: "",
    contactNoPhoneCode: "",
    contactNo: "",
    emergencyContactPhoneCode: "",
    emergencyContactNo: "",
    emailAddress: "",
    userName: "",
    licenseNumber: "",
    aboutUs: "",
    ward: "",
    district: "",
    state: "",
    city: "",
    address: "",
    upload1: "", //used for img
    upload2: "", //used for doc
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .nullable()
      .required(t("hp_name_required"))
      .min(6,t("hp_name_6_char_long")),
    contactNo: Yup.number()
      .nullable()
      .required(t("contact_no_required"))
      .min(999999, t("must_be_bw_7_to_15"))
      .max(999999999999999, t("must_be_bw_7_to_15")),
    emergencyContactNo: Yup.number()
      .nullable()
      .required(t("emergency_contact_no_required"))
      .min(999999, t("must_be_bw_7_to_15"))
      .max(999999999999999, t("must_be_bw_7_to_15")),
    emailAddress: Yup.string()
      .nullable()
      .email(t("valid_email"))
      .required(t("email_required")),
    userName: Yup.string()
      .nullable()
      .required(t("username_required"))
      .min(6, t("min_6_char")),
    licenseNumber: Yup.string()
      .nullable()
      .required(t("license_no_required")),
    address: Yup.string().nullable().required(t("address_required")),
    aboutUs: Yup.string().nullable().required(t("about_us_required")),
    ward: Yup.string().nullable().required(t("ward_required")),
    district: Yup.string().nullable().required(t("district_required")),
    state: Yup.mixed().nullable().required(t("state_required")),
    city: Yup.mixed().nullable().required(t("city_required")),
    upload1: Yup.mixed().nullable().required(t("hp_image_required")),
    upload2: Yup.mixed().nullable().required(t("hp_document_required")),
  });

  useEffect(() => {
    if (!customDetails.countries.countries?.length) dispatch(getAllCountries());
    if (!customDetails.cities.cities?.length) dispatch(getAllCities());
    if (!customDetails.states.states?.length) dispatch(getAllStates());
  }, []);

  // useEffect(() => {
  //   if (customDetails.cities.cities?.length) {
  //     setCityLookups(
  //       customDetails.cities.cities.map((x) => ({
  //         value: x.cityId,
  //         label: x.name,
  //       }))
  //     );
  //   }
  // }, [customDetails.cities.cities]);

  useEffect(() => {
    if (customDetails.states.states?.length) {
      setStateLookups(
        customDetails.states.states.map((x) => ({
          value: x.stateId,
          label: x.name,
        }))
      );
    }
  }, [customDetails.states.states]);

  useEffect(() => {
    if (customDetails.countries.countries?.length) {
      const newCountryLookups = customDetails.countries.countries.map((x) => ({
        value: x.phoneCode,
        label: `${x.code}  +${x.phoneCode}`,
        countryId: x.countryId,
        name: x.name,
      }));
      formRef.current?.setFieldValue(
        "contactNoPhoneCode",
        newCountryLookups[0]
      );
      formRef.current?.setFieldValue(
        "emergencyContactPhoneCode",
        newCountryLookups[0]
      );
      setCountryCodeLookups(newCountryLookups);
    }
  }, [customDetails.countries.countries]);

  const {
    acceptedFiles: acceptedHospitalImages,
    getRootProps: hospitalRootProps,
    getInputProps: hospitalInputProps,
    fileRejections: hospitalFileRejections,
  } = useDropzone({
    multiple: true,
    accept: {
      "image/png": [".png"],
      "image/PNG": [".PNG"],
      "image/jpg": [".jpg"],
      "image/JPG": [".JPG"],
      "image/jpeg": [".jpeg"],
      "image/JPEG": [".JPEG"],
    },
    // maxSize: 2 * 1024 * 1024,
  });

  useEffect(() => {
    if (hospitalFileRejections?.length) {
      const newErrors: any[] = [];
      hospitalFileRejections.forEach((element) => {
        if (element.errors?.length) {
          const code = element.errors[0].code;
          if (!newErrors.find((x) => x.code === code))
            newErrors.push({
              code,
              message:
                code === "file-too-large"
                  ? t("file_size_less_than_2mb")
                  : code === "file-invalid-type"
                    ? t("png_jpg_jpeg")
                    : element.errors[0].message,
            });
        }
      });
      toast.error(newErrors.map((x) => x.message).toString());
    }
  }, [hospitalFileRejections]);

  const getNewCities=(state:any)=>{
    if(state?.value)
    {
      dispatch(getAllCitiesByStateId(state?.value)).then(res=>{
        if(res?.payload?.cities){
          setCityLookups(res.payload.cities?.map((x:any)=>({value:x.cityId,label:x.name})))
        }else{
          setCityLookups([])
        }
       })
    }else{
      setCityLookups([])
    }
  }
  const {
    acceptedFiles: acceptedDocuments,
    getRootProps: documentsRootProps,
    getInputProps: documentsInputProps,
    fileRejections: documentsFileRejections,
  } = useDropzone({
    multiple: true,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: MaxClinicDocSizeInMb,
  });

  useEffect(() => {
    if (documentsFileRejections?.length) {
      const newErrors: any[] = [];
      documentsFileRejections.forEach((element) => {
        if (element.errors?.length) {
          const code = element.errors[0].code;
          if (!newErrors.find((x) => x.code === code))
            newErrors.push({
              code,
              message:
                code === "file-too-large"
                  ? t("file_size_less_than_5mb")
                  : code === "file-invalid-type"
                    ? t("only_pdf")
                    : element.errors[0].message,
            });
        }
      });
      toast.error(newErrors.map((x) => x.message).toString());
    }
  }, [documentsFileRejections]);

  useEffect(() => {
    if (acceptedDocuments?.length) {
      // setPdfPrev(acceptedDocuments[0].name);
      // formRef.current?.setFieldValue("upload2", acceptedDocuments);
      // const errors: string[] = [];
      // let newFiles: File[] = acceptedDocuments;

      // newFiles?.forEach((file: any) => {
      //   let reader = new FileReader();
      //   reader.readAsDataURL(file);
      //   reader.onload = async (e: any) => {
      //     let image: any = new window.Image();
      //     image.src = e.target.result;
      //     image.onload = function () {
      //       if (this.height < 300 || this.width < 300) {
      //         errors.push(
      //           "Please upload valid size image, image at least 300px by 300px "
      //         );
      //       }
      //       if (errors?.length) {
      //         toast.error(errors?.toString());
      //       }
      //     };
      //   };
      // });
      let newFiles: File[] = formRef.current?.values?.upload2?.length
        ? formRef.current?.values?.upload2
        : [];
      newFiles = newFiles.concat(acceptedDocuments);
      let size: number = MaxClinicDocSizeInMb;
      newFiles?.forEach((x) => {
        size = size - x.size;
      });
      if (!size || size < 0) {
        toast.error(
         t("file_size_less_than_5mb")
        );
      } else if (newFiles?.length > MaxClinicDoc) {
        toast.error(`${t("Maximum")} ${MaxClinicDoc} ${t("hp_doc_allowed")}`);
      } else {
        formRef.current?.setFieldValue("upload2", newFiles);
      }
    }
  }, [acceptedDocuments]);

  useEffect(() => {
    if (acceptedHospitalImages?.length) {
      const errors: { msg: string; index: number }[] = [];
      let newFiles: File[] = formRef.current?.values?.upload1?.length
        ? formRef.current?.values?.upload1
        : [];
      newFiles = newFiles.concat(acceptedHospitalImages);
      if (newFiles?.length > MaxClinicImg) {
        toast.error(`${t("Maximum")} ${MaxClinicImg} ${t("clinic_img_allowed")}`);
      } else {
        newFiles?.forEach((file: any, index: number) => {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async (e: any) => {
            let image: any = new window.Image();
            image.src = e.target.result;
            image.onload = function () {
              if (this.height !== 300 || this.width !== 300) {
                errors.push({
                  msg: t("img_must_be_300x300"),
                  index: index,
                });
              }
              if (index + 1 === acceptedHospitalImages?.length) {
                if (errors?.length) {
                  setImgErrors(errors);
                } else {
                  setImgErrors(null);
                }
              }
            };
          };
        });
        formRef.current?.setFieldValue("upload1", newFiles);
      }
    }

    // if (acceptedHospitalImages?.length) {
    //   setimagePrev(acceptedHospitalImages[0].name);
    //   formRef.current?.setFieldValue("upload1", acceptedHospitalImages);
    //   const errors: string[] = [];
    //   let newFiles: File[] = acceptedHospitalImages;

    //   newFiles?.forEach((file: any) => {
    //     let reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = async (e: any) => {
    //       let image: any = new window.Image();
    //       image.src = e.target.result;
    //       image.onload = function () {
    //         if (this.height < 300 || this.width < 300) {
    //           errors.push(
    //             "Please upload valid size image, image at least 300px by 300px "
    //           );
    //         }
    //         if (errors?.length) {
    //           toast.error(errors?.toString());
    //         }
    //       };
    //     };
    //   });
    // }
  }, [acceptedHospitalImages]);

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
    values: any
  ) => {
    const fieldError = renderError(fieldName, errors);
    return (
      <div className="ComsetFormAddIn">
        <Form.Group className="FormInputcovermain" controlId="">
          <Form.Label>{label}</Form.Label>
          <Form.Control
            type=""
            placeholder={placeholder}
            value={values[fieldName]}
            onChange={(e) => {
              formRef.current?.setFieldValue(fieldName, e.target.value);
            }}
            onBlur={(e) => {
              formRef.current?.setFieldValue(fieldName, e.target.value?.trim());
            }}
            className={fieldError ? "errorBorder" : ""}
          />
          {renderError(fieldName, errors)}
        </Form.Group>
      </div>
    );
  };
  const onRqsToJoin = () => {
    const { values, validateForm, resetForm, setFieldValue, setFieldTouched } =
      formRef.current;
    validateForm(values).then((res) => {
      if ((res && Object.keys(res).length) || imgErrors?.length) {
        setShowError(true);
      } else {
        const {
          name,
          userName,
          contactNoPhoneCode,
          contactNo,
          emergencyContactPhoneCode,
          emergencyContactNo,
          emailAddress,
          address,
          licenseNumber,
          aboutUs,
          ward,
          district,
          state,
          city,
          upload1,
          upload2,
        } = values;
        setShowError(false);
        // const file1 = upload1[0];
        // const file2 = upload2[0];
        // const fileUrl1 = URL.createObjectURL(file1);
        // const fileUrl2 = URL.createObjectURL(file2);
        // const hospitalFile = {
        //   name: upload1[0]?.name,
        //   filePath: fileUrl1,
        //   hospitalFileType: HealthRecordUploadFileType.Image,
        // };
        // const documentFile = {
        //   name: upload2[0]?.name,
        //   filePath: fileUrl2,
        //   hospitalFileType: HealthRecordUploadFileType.PDF,
        // };
        // const files = [];
        // files.push(hospitalFile);
        // files.push(documentFile);
        const clinic: IClinic = {
          name: name,
          countryId: contactNoPhoneCode.countryId,
          phoneCode: contactNoPhoneCode.value,
          mobileNumber: contactNo,
          emergencyMobileCountryId: emergencyContactPhoneCode.countryId,
          emergencyMobilePhoneCode: emergencyContactPhoneCode.value,
          emergencyMobileNumber: emergencyContactNo,
          licenseNumber: licenseNumber,
          aboutus: aboutUs,
          email: emailAddress,
          address: address,
          ward: ward,
          district: district,
          cityId: city.value,
          stateId: state.value,
          isClinic: false,
          clinicDoctorId: 0,
        };
        setIsLoading(true);

        const payloadDetail: { fileName: string; fileType: number }[] = [];
        const totalFiles: File[] = [];
        upload1?.forEach((file: any) => {
          payloadDetail.push({
            fileName: file.name,
            fileType: HospitalFileType.Image,
          });
          totalFiles.push(file);
        });

        upload2?.forEach((file: any) => {
          payloadDetail.push({
            fileName: file.name,
            fileType: HospitalFileType.Document,
          });
          totalFiles.push(file);
        });

        if (totalFiles?.length) {
          commonService
            .getFileUploadDetails(payloadDetail)
            .then(async (res) => {
              const fileRecordDetails: {
                name: string;
                filePath: string;
                hospitalFileType: number;
                hospitalFileId?: number;
              }[] = [];
              if (res?.data) {
                let index = 0;
                for await (const fileUploadRes of res.data?.fileUploads) {
                  const { uploadUrl, fileHttpUrl } = fileUploadRes;
                  await commonService
                    .uploadFile(uploadUrl, totalFiles[index])
                    .then((res) => {
                      if (res && res.status === 200 && res.ok) {
                        fileRecordDetails.push({
                          name: totalFiles[index].name,
                          filePath: fileHttpUrl,
                          hospitalFileType: payloadDetail[index].fileType,
                        });
                      }
                    });
                  index++;
                }
                if (fileRecordDetails?.length > 0) {
                  clinic.files = clinic?.files?.length
                    ? [...clinic?.files, ...fileRecordDetails]
                    : fileRecordDetails;
                  const payload: ICreateHospital = {
                    doctorId: 0,
                    clinic: clinic,
                    services: null,
                    userName: userName
                  };
                  dispatch(registerHospital(payload))
                    .then((res) => {
                      if (res.payload) {
                        toast.success(
                         t("reg_done_success")
                        );
                        resetForm();
                        setFieldValue(
                          "contactNoPhoneCode",
                          countryCodeLookups[0]
                        );
                        setFieldValue(
                          "emergencyContactPhoneCode",
                          countryCodeLookups[0]
                        );
                      }
                    })
                    .finally(() => {
                      setIsLoading(false);
                    });
                }
              }
            });
        }
      }
    });
  };

  const removeImg = (index: number, values: any) => {
    let existingVal = values.upload1 ? values.upload1 : [];
    const existingImgError: { msg: string; index: number }[] = [];
    imgErrors?.forEach((img, i: number) => {
      if (i !== index) {
        if (i > index) {
          existingImgError.push({ ...img, index: img.index - 1 });
        } else {
          existingImgError.push(img);
        }
      }
    });
    existingVal = existingVal?.filter((x: any, i: number) => i !== index);

    if (existingVal?.length) {
      formRef.current?.setFieldValue("upload1", existingVal);
    } else {
      formRef.current?.setFieldValue("upload1", null);
    }
    setImgErrors(existingImgError);
  };

  const renderImgErrors = (index: number) => {
    if (imgErrors?.length) {
      const errObj = imgErrors?.find((x) => x.index === index);
      return errObj ? (
        <p className="noteimgworg" style={{ color: "red" }}>
          {errObj?.msg}
        </p>
      ) : (
        ""
      );
    } else {
      return "";
    }
  };

  const getClinicImgError = (errors: any, values: any) => {
    return (
      errors?.upload1 &&
      !values?.upload1 &&
      showError && (
        <div className="mb-1" style={{ color: "red" }}>
          {errors.upload1.toString()}
        </div>
      )
    );
  };

  const removeDoc = (index: number, values: any) => {
    let existingVal = values.upload2 ? values.upload2 : [];
    existingVal = existingVal?.filter((x: any, i: number) => i !== index);

    if (existingVal?.length) {
      formRef.current?.setFieldValue("upload2", existingVal);
    } else {
      formRef.current?.setFieldValue("upload2", null);
    }
  };

  const getClinicDocError = (errors: any, values: any) => {
    return (
      errors?.upload2 &&
      !values?.upload2 &&
      showError && (
        <div className="mb-1" style={{ color: "red" }}>
          {errors.upload2.toString()}
        </div>
      )
    );
  };

  return (
    <>
      <div className="FormBgcovmainbox">
        <div className="FormBgcovmaiImg">
          <img src={HospitalImgForm.src} alt="Register Hospital" />
        </div>
        <div className="container">
          <div className="RegithospitFormCov">
            <div className="RegithospitFormLeft">
              <h1>{t("join_as_hosp_title")}</h1>
              <p dangerouslySetInnerHTML={{
                  __html:
                  t("join_as_hosp_desc"),
                }}>
              </p>
            </div>
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
                  <div className="RegithospitFormRight">
                    <div className="RgithositBoxformCard">
                      <div className="ComsetmodlaForm">
                        <Row>
                          <Col md={4}>
                            {renderInput(
                              t("hospital_name") + "*",
                              "name",
                              t("enter_hospital_name"),
                              errors,
                              values
                            )}
                          </Col>
                          <Col md={4}>
                            <div className="ComsetFormAddIn">
                              <Form.Group
                                className="FormInputcovermain"
                                controlId=""
                              >
                                <Form.Label>{t("contact_number") + "*"}</Form.Label>
                                <div className="MobilCodeformmaincust">
                                  <div className="FormComCountrycodeSet">
                                    <Select
                                      components={animatedComponents}
                                      options={countryCodeLookups}
                                      classNamePrefix="react-select"
                                      value={values?.contactNoPhoneCode}
                                      onChange={(e) =>
                                        setFieldValue("contactNoPhoneCode", e)
                                      }
                                    />
                                  </div>
                                  <Form.Control
                                    className={
                                      renderError("contactNo", errors)
                                        ? "errorBorder"
                                        : ""
                                    }
                                    type="number"
                                    placeholder={t("contact_number")}
                                    value={values?.contactNo}
                                    onChange={(e) =>
                                      setFieldValue("contactNo", e.target.value)
                                    }
                                  />
                                </div>
                                {renderError("contactNo", errors)}
                              </Form.Group>
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="ComsetFormAddIn">
                              <Form.Group
                                className="FormInputcovermain"
                                controlId=""
                              >
                                <Form.Label>
                                  {t("emergency_contact_number") + "*"}
                                </Form.Label>
                                <div className="MobilCodeformmaincust">
                                  <div className="FormComCountrycodeSet">
                                    <Select
                                      components={animatedComponents}
                                      options={countryCodeLookups}
                                      classNamePrefix="react-select"
                                      value={values?.emergencyContactPhoneCode}
                                      onChange={(e) =>
                                        setFieldValue(
                                          "emergencyContactPhoneCode",
                                          e
                                        )
                                      }
                                    />
                                  </div>
                                  <Form.Control
                                    type="number"
                                    className={
                                      renderError("emergencyContactNo", errors)
                                        ? "errorBorder"
                                        : ""
                                    }
                                    placeholder={t("emergency_contact_number")}
                                    value={values?.emergencyContactNo}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "emergencyContactNo",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                {renderError("emergencyContactNo", errors)}
                              </Form.Group>
                            </div>
                          </Col>
                          <Col md={4}>
                            {renderInput(
                              t("email_address") + "*",
                              "emailAddress",
                              t("email_address"),
                              errors,
                              values
                            )}
                          </Col>
                          <Col md={4}>
                            <div className="ComsetFormAddIn">
                              <Form.Group
                                className="FormInputcovermain"
                                controlId=""
                              >
                                <Form.Label>{t('username')}*</Form.Label>
                                <Form.Control
                                  type=""
                                  placeholder={t('username')}
                                  value={values.userName}
                                  onChange={(e) =>
                                    setFieldValue("userName", e.target.value)
                                  }
                                  className={
                                    renderError("userName", errors)
                                      ? "errorBorder"
                                      : ""
                                  }
                                  maxLength={20}
                                />
                                <p className="noteloginboxcom">
                                  Min. 6, Max 20 characters, Alphabets & Numeric
                                  Value allowed
                                </p>
                                {renderError("userName", errors)}
                              </Form.Group>
                            </div>
                          </Col>
                          <Col md={4}>
                            {renderInput(
                              t("license_number") + "*",
                              "licenseNumber",
                              t("license_number"),
                              errors,
                              values
                            )}
                          </Col>
                          <Col md={12}>
                            <div className="ComsetFormAddIn">
                              <Form.Group
                                className="FormInputcovermain TextareaFormboxset"
                                controlId=""
                              >
                                <Form.Label>{t("about_us")}*</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  className={
                                    renderError("aboutUs", errors)
                                      ? "errorBorder"
                                      : ""
                                  }
                                  placeholder={t("about_us")}
                                  value={values?.aboutUs}
                                  onChange={(e) =>
                                    setFieldValue("aboutUs", e.target.value)
                                  }
                                  onBlur={(e) =>
                                    setFieldValue(
                                      "aboutUs",
                                      e.target.value?.trim()
                                    )
                                  }
                                />
                              </Form.Group>
                              {renderError("aboutUs", errors)}
                            </div>
                          </Col>
                          <Col md={12}>
                            {renderInput(
                              t("adress_long_discripton"),
                              "address",
                              t("address_line_1"),
                              errors,
                              values
                            )}
                          </Col>
                          <Col md={4}>
                            {renderInput(
                              t("ward") + "*",
                              "ward",
                              t("ward"),
                              errors,
                              values
                            )}
                          </Col>
                          <Col md={4}>
                            {renderInput(
                              t("distric") + "*",
                              "district",
                              t("distric"),
                              errors,
                              values
                            )}
                          </Col>
                          <Col md={4}>
                            <div className="ComsetFormAddIn">
                              <div className="FormSelectcovermain">
                                <p>{t("state")}*</p>
                                <Select
                                  components={animatedComponents}
                                  classNamePrefix="react-select"
                                  options={stateLookups}
                                  onChange={(e) =>{
                                    setFieldValue("state", e);
                                    setFieldValue("city", "");
                                    getNewCities(e)
                                  }}
                                  value={values.state}
                                  className={
                                    renderError("state", errors)
                                      ? "errorBorder"
                                      : ""
                                  }
                                />
                                {renderError("state", errors)}
                              </div>
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="ComsetFormAddIn">
                              <div className="FormSelectcovermain">
                                <p>{t("city")}*</p>
                                <Select
                                  components={animatedComponents}
                                  classNamePrefix="react-select"
                                  options={cityLookups}
                                  onChange={(e) => setFieldValue("city", e)}
                                  value={values.city}
                                  className={
                                    renderError("city", errors)
                                      ? "errorBorder"
                                      : ""
                                  }
                                />
                                {renderError("city", errors)}
                              </div>
                            </div>
                          </Col>

                          <Col md={4}>
                            <div className="UploadFormdataBox">
                              <Form.Label>{t("hospital_image")}*</Form.Label>
                              <div
                                className={
                                  "drop-mainset " +
                                  (getClinicImgError(errors, values)
                                    ? "errorBorder"
                                    : "")
                                }
                                {...hospitalRootProps({})}
                              >
                                <div className="drop-updata">
                                  <input {...hospitalInputProps()} />
                                  <h5>
                                    <BiUpload /> {t("hospital_image")}
                                  </h5>
                                </div>
                              </div>

                              {values?.upload1 &&
                                values?.upload1?.map(
                                  (x: any, index: number) => (
                                    <div
                                      className="UplodeddatalistoCov"
                                      key={`img-${index}`}
                                    >
                                      <h3>
                                        <BsFillFileEarmarkTextFill />
                                        {x.name}{" "}
                                        <a
                                          href="javascript:;"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            removeImg(index, values);
                                          }}
                                        >
                                          <IoIosCloseCircle />
                                        </a>
                                      </h3>
                                      {renderImgErrors(index)}
                                    </div>
                                  )
                                )}
                              {getClinicImgError(errors, values)}
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="UploadFormdataBox">
                              <Form.Label>{t("documents")}*</Form.Label>
                              <div
                                className={
                                  "drop-mainset " +
                                  (getClinicDocError(errors, values)
                                    ? "errorBorder"
                                    : "")
                                }
                                {...documentsRootProps({})}
                              >
                                <div className="drop-updata">
                                  <input {...documentsInputProps()} />
                                  <h5>
                                    <BiUpload /> {t("documents")}
                                  </h5>
                                </div>
                              </div>
                              {values?.upload2 &&
                                values?.upload2?.map(
                                  (x: any, index: number) => (
                                    <div
                                      className="UplodeddatalistoCov"
                                      key={`doc-${index}`}
                                    >
                                      <h3>
                                        <BsFillFileEarmarkTextFill />
                                        {x.name}{" "}
                                        <a
                                          href="javascript:;"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            removeDoc(index, values);
                                          }}
                                        >
                                          <IoIosCloseCircle />
                                        </a>
                                      </h3>
                                    </div>
                                  )
                                )}
                              {getClinicDocError(errors, values)}
                            </div>
                          </Col>

                          <Col md={12}>
                            <div className="ComsetBtnSavebox">
                              <Button
                                type="button"
                                onClick={onRqsToJoin}
                                disabled={isLoading}
                              >
                                {t("request_to_join")}
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterHospital;
