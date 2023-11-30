import React, { useState, useMemo, useEffect, useRef } from "react";

import { DoctorImgForm } from "../../public/assets";
import { RiCheckboxCircleFill } from "react-icons/ri";
import DoctorBasicDetails from "../../components/DoctorDetails/Register/DoctorBasicDetails";
import DoctorDocuments from "../../components/DoctorDetails/Register/DoctorDocuments";
import DoctorPersonalAddress from "../../components/DoctorDetails/Register/DoctorPersonalAddress";
import { useSelector } from "react-redux";
import {
  customSelector,
  getAllCountries,
  getAllCities,
  getAllStates,
  getAllLanguages,
} from "../../store/custom/customSlice";
import { useAppDispatch } from "../../utils/hooks";
import { Formik } from "formik";
import * as Yup from "yup";
import { ELDER_DATE } from "../../utils/constant";
import { useTranslate } from "../../commonModules/translate";

export const RegisterDRContext: any = React.createContext(null);

function RegisterDoctor() {
  const [currentStep, setCurrentStep] = useState(1);
  const [countryCodeLookups, setCountryCodeLookups] = useState([]);
  const [cityLookups, setCityLookups] = useState([]);
  const [stateLookups, setStateLookups] = useState([]);
  const [languageLookups, setLanguageLookups] = useState([]);
  const [showError, setShowError] = useState(false);
  const formRef: any = useRef(null);
  const dispatch = useAppDispatch();
  const customDetails = useSelector(customSelector);
  const t = useTranslate();

  const genderLookups = [
    { value: "M", label:t("Male") },
    { value: "F", label: t("Female") },
  ];

  const initVal = {
    fullName: "",
    emailAddress: "",
    phoneCode: "",
    mobileNumber: "",
    gender: genderLookups[0],
    dateOfBirth: null,
    userName: "",
    licenseNumber: "",
    bioGraphy: "",
    languages: "",
    addressLine1: "",
    ward: "",
    district: "",
    state: "",
    city: "",
    licenseFile: "",
    documentFile: "",
  };

  const validationSchema = Yup.object().shape({
    docImg: Yup.mixed().nullable().required(t("picture_required")),
    fullName: Yup.string().nullable().required(t("fullname_is_required")),
    emailAddress: Yup.string()
      .nullable()
      .email(t("valid_email"))
      .required(t("email_required")),
    mobileNumber: Yup.number()
      .nullable()
      .required(t("mobile_no_required"))
      .min(999999, t("must_be_bw_7_to_15"))
      .max(999999999999999, t("must_be_bw_7_to_15")),
    userName: Yup.string()
      .nullable()
      .required(t("username_required"))
      .min(6, t("min_6_char")),
    licenseNumber: Yup.string()
      .nullable()
      .required(t("license_no_required")),
    bioGraphy: Yup.string().nullable().required(t("biography_required")),
    languages: Yup.mixed().nullable().required(t("language_required")),
    addressLine1: Yup.string().nullable().required(t("address_line_required")),
    ward: Yup.string().nullable().required(t("ward_required")),
    district: Yup.string().nullable().required(t("district_required")),
    state: Yup.mixed().nullable().required(t("state_required")),
    city: Yup.mixed().nullable().required(t("city_required")),
    licenseFile: Yup.mixed().nullable().required(t("add_license")),
    documentFile: Yup.mixed().nullable().required(t("add_documents")),
    dateOfBirth: Yup.date()
      .nullable()
      .max(ELDER_DATE(), t("more_than_25_yr"))
      .required(t("dob_required")),
  });

  useEffect(() => {
    if (!customDetails.countries.countries?.length) dispatch(getAllCountries());
    if (!customDetails.cities.cities?.length) dispatch(getAllCities());
    if (!customDetails.states.states?.length) dispatch(getAllStates());
    dispatch(getAllLanguages());
  }, []);

  useEffect(() => {
    if (customDetails.cities.cities?.length) {
      setCityLookups(
        customDetails.cities.cities.map((x) => ({
          value: x.cityId,
          label: x.name,
        }))
      );
    }
  }, [customDetails.cities.cities]);

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
      formRef.current?.setFieldValue("phoneCode", newCountryLookups[0]);
      setCountryCodeLookups(newCountryLookups);
    }
  }, [customDetails.countries.countries]);

  useEffect(() => {
    if (customDetails.language.language?.length) {
      setLanguageLookups(
        customDetails.language.language.map((x) => ({
          value: x.languageId,
          label: x.name,
        }))
      );
    }
  }, [customDetails.language.language]);

  const onPageChange = (validateForm: any, values: any) => {
    let isValid = true;
    setShowError(true);
    validateForm(values).then((res) => {
      if (res) {
        Object.keys(res).forEach((key) => {
          if (currentStep === 1) {
            if (
              [
                "fullName",
                "emailAddress",
                "phonecode",
                "mobileNumber",
                "userName",
                "licenseNumber",
                "bioGraphy",
                "languages",
                "docImg",
              ].includes(key) &&
              res[key]
            ) {
              isValid = false;
            }
          } else if (currentStep === 2) {
            if (
              ["addressLine1", "ward", "district", "state", "city"].includes(
                key
              ) &&
              res[key]
            ) {
              isValid = false;
            }
          }
        });
      }
      if (isValid) {
        setShowError(false);
        setCurrentStep(currentStep + 1 > 3 ? 1 : currentStep + 1);
      }
    });
  };

  const onStepChange = (stepNumber: number) => {
    if (currentStep > stepNumber) setCurrentStep(stepNumber);
  };
  return (
    <>
      <div className="FormBgcovmainbox">
        <div className="FormBgcovmaiImg Doctorimgsetmainvbox">
          <img src={DoctorImgForm.src} alt="Register Doctor" />
        </div>
        <div className="container">
          <div className="RegithospitFormCov">
            <div className="RegithospitFormLeft">
              <h1>{t("join_as_doctor_title")}</h1>
              <p dangerouslySetInnerHTML={{
                  __html:
                  t("join_as_doctor_desc"),
                }}>
              </p>
            </div>
            <div className="RegithospitFormRight">
              <div className="RgithositBoxformCard">
                <div className="RegirDoctdataStepbox">
                  <div className="RegirDoctdataStepmain">
                    <div
                      className={`RegirDoctdataStepIner  ${currentStep >= 1
                        ? "ActiveStep cursorPointer"
                        : "rightBorderStep"
                        }`}
                      onClick={() => onStepChange(1)}
                    >
                      <RiCheckboxCircleFill />
                      <p>{t("basic_details")}</p>
                    </div>
                    <div
                      className={`RegirDoctdataStepIner rightBorderStep ${currentStep > 1
                        ? "ActiveStep cursorPointer"
                        : "rightBorderStep"
                        }`}
                      onClick={() => onStepChange(2)}
                    >
                      <RiCheckboxCircleFill />
                      <p>{t("personal_address")}</p>
                    </div>
                    <div
                      className={`RegirDoctdataStepIner rightBorderStep ${currentStep > 2
                        ? "ActiveStep cursorPointer"
                        : "rightBorderStep"
                        }`}
                      onClick={() => onStepChange(3)}
                    >
                      <RiCheckboxCircleFill />
                      <p>{t("documents")}</p>
                    </div>
                  </div>
                </div>
                <Formik
                  initialValues={initVal}
                  innerRef={formRef}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    console.log("formil values", values);
                  }}
                >
                  {({
                    handleSubmit,
                    values,
                    setFieldValue,
                    validateForm,
                    errors,
                    resetForm,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <RegisterDRContext.Provider
                        value={{
                          setCurrentStep: () =>
                            onPageChange(validateForm, values),
                          countryCodeLookups,
                          cityLookups,
                          stateLookups,
                          genderLookups,
                          languageLookups,
                          values: values ?? {},
                          setFieldValue: setFieldValue,
                          errors,
                          showError: showError,
                          resetForm,
                        }}
                      >
                        {currentStep === 1 && <DoctorBasicDetails />}
                        {currentStep === 2 && <DoctorPersonalAddress />}
                        {currentStep === 3 && <DoctorDocuments />}
                      </RegisterDRContext.Provider>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterDoctor;
