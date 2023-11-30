import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import { IoCalendar } from "react-icons/io5";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IAddPatient } from "../../commonModules/commonInterfaces";
import { useDispatch, useSelector } from "react-redux";
import {
  addPatient,
  getPatients,
  patientDetailsSelector,
  updatePatient,
} from "../../store/patientDetails/patientDetailsSlice";
import { AppDispatch } from "../../utils/store";
import { CURRENT_USER } from "../../commonModules/localStorege";
import {
  customSelector,
  getAllRelations,
} from "../../store/custom/customSlice";
import moment from "moment";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useAppSelector } from "../../utils/hooks";
import { useTranslate } from "../../commonModules/translate";

function AddMember(props: {
  show: boolean;
  onHide: any;
  isEditModal: number;
  memberData: any;
  setShow: any;
  countryCodeLookups: any;
}) {
  const { show, onHide, isEditModal, memberData, setShow, countryCodeLookups } =
    props;
  const animatedComponents = makeAnimated();
  const dispatch = useDispatch<AppDispatch>();
  const patientSelector = useAppSelector(patientDetailsSelector);
  const t = useTranslate();
  const genderOptions = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
  ];

  const [initVal, setInitVal] = useState<any>({
    fullName: "",
    email: "",
    phoneCode: "",
    mobileNumber: "",
    uniqueId: "",
    zaloNumber: "",
    relation: "",
    gender: "",
    dateOfBirth: "",
  });

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().nullable().required(t("fullname_is_required")),
    email: Yup.string()
      .nullable()
      .email(t("valid_email"))
      .required(t("email_required")),
    mobileNumber: Yup.number()
      .nullable()
      .required(t("mobile_no_required"))
      .min(999999, t("must_be_bw_7_to_15"))
      .max(999999999999999, t("must_be_bw_7_to_15")),
    uniqueId: Yup.number()
      .nullable()
      .required(t("uniqueId_passport_required"))
      .min(1, t("uniqueId_passport_required"))
      .typeError(t("must_number")),
    relation: Yup.mixed().nullable().required(t("relation_required")),
    gender: Yup.mixed().nullable().required(t("gender_required")),
    dateOfBirth: Yup.date().nullable().required(t("dob_required")),
  });

  const formRef: any = useRef();
 

  const [relationLookups, setRelationLookups] = useState([]);
  const [showError, setShowError] = useState(false);
  const customDetails = useSelector(customSelector);

  useEffect(() => {
    if (!customDetails.relations.relations?.length) dispatch(getAllRelations());
    if (customDetails.relations.relations?.length) {
      setRelationLookups(
        customDetails.relations.relations.map((x) => ({
          value: x.relationId,
          label: x.name,
        }))
      );
    }
  }, []);

  useEffect(() => {
    if (countryCodeLookups?.length) {
      setInitVal({ ...initVal, phoneCode: countryCodeLookups[0] });
    }
  }, [countryCodeLookups]);

  useEffect(() => {
    if (customDetails.relations.relations?.length) {
      setRelationLookups(
        customDetails.relations.relations.map((x) => ({
          value: x.relationId,
          label: x.name,
        }))
      );
    }
  }, [customDetails.relations.relations]);

  useEffect(() => {
    if (customDetails.relations.relations?.length && memberData?.patientId) {
      setInitVal({
        fullName: memberData?.fullName,
        email: memberData?.email,
        phoneCode: countryCodeLookups?.find(
          (x: any) => x.value?.toString() === memberData?.phoneCode?.toString()
        ),
        mobileNumber: memberData?.mobileNumber,
        uniqueId: memberData?.uniqueId,
        zaloNumber: memberData?.zaloNumber,
        relation: {
          value: memberData?.relationId,
          label: memberData?.relation,
        },
        gender: genderOptions.find((x) => x.value === memberData?.gender),
        dateOfBirth: memberData?.birthDate ? new Date(memberData?.birthDate) : null,
      });
    }
  }, [memberData, customDetails.relations.relations]);

  const user: any = CURRENT_USER();
  const handleFormSubmit = () => {
    const { values, validateForm, resetForm, setFieldValue, setFieldTouched } =
      formRef.current;
    validateForm(values).then((res) => {
      if (res && Object.keys(res).length) {
        setShowError(true);
      } else {
        const data: IAddPatient = {
          userId: user?.userId,
          patientId: props.memberData?.patientId,
          fullName: values.fullName,
          email: values.email,
          phoneCode: values.phoneCode?.value,
          countryId: values.phoneCode?.countryId,
          mobileNumber: values.mobileNumber,
          uniqueId: values.uniqueId,
          zaloNumber: values.zaloNumber,
          relationId: values.relation?.value,
          birthDate: values?.dateOfBirth,
          gender: values?.gender?.value,
        };
        if (props.memberData?.patientId) {
          dispatch(updatePatient(data)).then((res) => {
            if (res?.payload) {
              toast.success(t("member_add_success"));
              setShow(false);
              dispatch(getPatients(user.userId));
            }
          });
        } else {
          dispatch(addPatient(data)).then((res) => {
            if (res?.payload) {
              toast.success(t("member_update_success"));
              setShow(false);
              dispatch(getPatients(user.userId));
            }
          });
        }
        //
      }
    });
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
      <Modal
        {...props}
        backdrop="static"
        keyboard={false}
        centered
        className="CustModalComcovermain AddnewMemmodalcov"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {props.isEditModal == 1 ? t("edit_details") : t("Add_New_Member")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                <div className="ComsetmodlaForm">
                  <Row>
                    <Col md={12}>
                      {renderInput(
                        t("fullname") + "*",
                        "fullName",
                        t("enter_fullname"),
                        errors,
                        values
                      )}
                    </Col>
                    <Col md={6}>
                      {renderInput(
                        t("email_address") + "*",
                        "email",
                        t("email_address"),
                        errors,
                        values
                      )}
                    </Col>
                    <Col md={6}>
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
                                options={props.countryCodeLookups}
                                classNamePrefix="react-select"
                                value={values?.phoneCode}
                                onChange={(e) => {
                                  setFieldValue("phoneCode", e);
                                }}
                              />
                            </div>
                            <Form.Control
                              type="number"
                              placeholder={t("mobile_number")}
                              className={
                                renderError("mobileNumber", errors)
                                  ? "errorBorder"
                                  : ""
                              }
                              value={values?.mobileNumber}
                              onChange={(e) =>
                                setFieldValue("mobileNumber", e.target.value)
                              }
                            />
                          </div>
                          {renderError("mobileNumber", errors)}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col md={12}>
                      {renderInput(
                        t("uniqueid_and_passportno") + "*",
                        "uniqueId",
                        t("enter_unique_id"),
                        errors,
                        values,
                        true
                      )}
                    </Col>
                    <Col md={12}>
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
                      <div className="ComsetFormAddIn">
                        <Form.Group
                          className="FormSelectcovermain"
                          controlId="relation"
                        >
                          <Form.Label>{t("relation")}*</Form.Label>
                          <Select
                            components={animatedComponents}
                            options={relationLookups}
                            classNamePrefix="react-select"
                            onChange={(e) => setFieldValue("relation", e)}
                            value={values.relation}
                            isDisabled={props.isEditModal && memberData?.relation ? true : false}
                            className={
                              renderError("relation", errors)
                                ? "errorBorder"
                                : ""
                            }
                          />
                          {renderError("relation", errors)}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col md={6}>
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
                              selected={values?.dateOfBirth}
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

                    <Col md={6}>
                      <div className="ComsetFormAddIn">
                        <div className="FormSelectcovermain">
                          <p>{t("Gender")}</p>
                          <Select
                            components={animatedComponents}
                            classNamePrefix="react-select"
                            options={genderOptions}
                            onChange={(e) => setFieldValue("gender", e)}
                            value={values.gender}
                            isDisabled={props.isEditModal && memberData?.gender ? true : false}
                            className={
                              renderError("gender", errors) ? "errorBorder" : ""
                            }
                          />
                          {renderError("gender", errors)}
                        </div>
                      </div>
                    </Col>

                    <Col md={12}>
                      <div className="ComsetBtnSaveFull">
                        <Button
                          type="button"
                          onClick={handleFormSubmit}
                          disabled={
                            patientSelector.addPatient.status === "loading" ||
                            patientSelector.updatePatient.status === "loading"
                          }
                        >
                          {props.isEditModal === 1
                            ? t("Save")
                            : t("add_member")}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddMember;
