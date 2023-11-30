import React, { useEffect, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useDispatch } from "react-redux";
import addressSlice, {
  addUserAddress,
  getUserAddresses,
  updateUserAddress,
  UserAddress,
  userAddressSelector,
} from "../../../store/user/addressSlice";
import { CURRENT_USER } from "../../../commonModules/localStorege";
import { AppDispatch } from "../../../utils/store";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../utils/hooks";
import { useTranslate } from "../../../commonModules/translate";
import { getAllCitiesByStateId } from "../../../store/custom/customSlice";

function AddAddressModal(props: {
  show: boolean;
  onHide: any;
  editData: any;
  lookups: { cityLookups: any; countryCodeLookups: any; stateLookups: any };
  onSubmit?: any;
}) {
  const { lookups, onHide, show, editData, onSubmit } = props;
  const [initVal, setInitVal] = useState<any>({
    fullName: "",
    phoneCode: "",
    mobileNumber: "",
    email: "",
    address: "",
    ward: "",
    district: "",
    state: "",
    city: "",
    isDefaultAddress: false,
  });

  const t = useTranslate();
  const [cityLookups, setCityLookups] = useState([]);
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().nullable().required(t("fullname_is_required")),
    mobileNumber: Yup.number()
      .nullable()
      .required(t("mobile_no_required"))
      .min(999999, t("must_be_bw_7_to_15"))
      .max(999999999999999, t("must_be_bw_7_to_15")),
    email: Yup.string()
      .nullable()
      .email(t("valid_email"))
      .required(t("email_required")),
    address: Yup.string().nullable().required(t("address_required")),
    ward: Yup.string().nullable().required(t("ward_required")),
    district: Yup.string().nullable().required(t("district_required")),
    state: Yup.mixed().nullable().required(t("state_required")),
    city: Yup.mixed().nullable().required(t("city_required")),
  });

  const dispatch = useDispatch<AppDispatch>();
  const animatedComponents = makeAnimated();

  const formRef: any = useRef();
  const [showError, setShowError] = useState(false);

  const user = CURRENT_USER();
  const addressSelectorState = useAppSelector(userAddressSelector);
  useEffect(() => {
    if (
      lookups?.countryCodeLookups?.length &&
      formRef?.current &&
      !editData?.userAddressId
    ) {
      const defaultVal = lookups?.countryCodeLookups[0];
      formRef.current.setFieldValue("phoneCode", defaultVal);
    }
  }, [lookups?.countryCodeLookups, formRef]);

  useEffect(() => {
    if (
      editData?.userAddressId &&
      lookups?.countryCodeLookups?.length &&
      lookups?.cityLookups?.length &&
      lookups?.stateLookups?.length
    ) {
      const newInitVal: any = {
        fullName: editData?.fullName,
        phoneCode: lookups?.countryCodeLookups?.find(
          (x: any) => x.countryId === editData?.countryId
        ),
        mobileNumber: editData?.mobileNumber,
        email: editData?.email,
        address: editData?.address,
        ward: editData?.ward,
        district: editData?.district,
        state: lookups.stateLookups?.find(
          (x: any) => x.value === editData?.stateId
        ),
        city: lookups.cityLookups?.find(
          (x: any) => x.value === editData?.cityId
        ),
        isDefaultAddress: editData?.isDefaultAddress,
        country: editData?.country,
      };
      setInitVal(newInitVal);
    }
  }, [editData, lookups]);

  const onSave = () => {
    const { values, validateForm, resetForm, setFieldValue, setFieldTouched } =
      formRef.current;
    validateForm(values).then((res) => {
      if (res && Object.keys(res).length) {
        setShowError(true);
      } else {
        const data: UserAddress = {
          userAddressId: editData?.userAddressId ? editData?.userAddressId : 0,
          userId: user?.userId,
          fullName: values.fullName,
          countryId: values.phoneCode?.countryId,
          phoneCode: values.phoneCode?.value,
          mobileNumber: values.mobileNumber,
          email: values.email,
          address: values.address,
          ward: values.ward,
          district: values.district,
          stateId: values.state?.value,
          cityId: values.city?.value,
          isDefaultAddress: values.isDefaultAddress,
          country: values.country,
        };
        if (editData?.fullName) {
          dispatch(updateUserAddress(data)).then((res) => {
            if (res?.payload) {
              toast.success(
                editData?.userAddressId
                  ? t("address_update_success")
                  : t("address_add_success")
              );
              dispatch(getUserAddresses(user.userId));
              onHide();
            }
          });
        } else {
          dispatch(addUserAddress(data)).then((res) => {
            if (res?.payload) {
              toast.success(
                editData?.userAddressId
                  ? t("address_update_success")
                  : t("address_add_success")
              );
              dispatch(getUserAddresses(user.userId)).then((addRes) => {
                if (onSubmit) {
                  onSubmit(
                    res?.payload,
                    addRes?.payload?.userAddresses?.find(
                      (x: any) => x.userAddressId === res?.payload
                    )
                  );
                }
              });
              onHide();
            }
          });
        }
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

  return (
    <>
      <Modal
        show={show}
        backdrop="static"
        keyboard={false}
        centered
        className="CustModalComcovermain AddressmodlaMain"
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editData?.fullName ? t("edit_address"):t("add_address")}
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
                    <Col md={6}>
                      {renderInput(
                        t("fullname") + "*",
                        "fullName",
                        t("enter_fullname"),
                        errors,
                        values
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="ComsetFormAddIn">
                        <Form.Group className="FormInputcovermain" controlId="">
                          <Form.Label>{t("mobile_number")}*</Form.Label>
                          <div className="MobilCodeformmaincust">
                            <div className="FormComCountrycodeSet">
                              <Select
                                components={animatedComponents}
                                options={lookups.countryCodeLookups}
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
                      {renderInput(
                        t("adress_long_discripton")  + "*",
                        "address",
                        t("address_line_1"),
                        errors,
                        values
                      )}
                    </Col>
                    <Col md={3}>
                      {renderInput(t("ward") + "*", "ward", t("ward"), errors, values)}
                    </Col>
                    <Col md={3}>
                      {renderInput(
                        t("distric") + "*",
                        "district",
                        t("distric"),
                        errors,
                        values
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="ComsetFormAddIn">
                        <div className="FormSelectcovermain">
                          <p>{t("state")}*</p>
                          <Select
                            components={animatedComponents}
                            classNamePrefix="react-select"
                            options={lookups.stateLookups}
                            onChange={(e) =>{
                              setFieldValue("city", "",true);
                              setFieldValue("state", e,true);
                              getNewCities(e)
                            }}
                            value={values.state}
                            className={
                              renderError("state", errors) ? "errorBorder" : ""
                            }
                          />
                          {renderError("state", errors)}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="ComsetFormAddIn">
                        <div className="FormSelectcovermain">
                          <p>{t("city")}*</p>
                          <Select
                            components={animatedComponents}
                            classNamePrefix="react-select"
                            options={cityLookups}
                            onChange={(e) => setFieldValue("city", e)}
                            value={values.city}
                            isDisabled={values?.state ? false : true}
                            className={
                              renderError("city", errors) ? "errorBorder" : ""
                            }
                          />
                          {renderError("city", errors)}
                        </div>
                      </div>
                    </Col>
                    <Col md={12}>
                      <div className="makedeualadder">
                        <Form.Check
                          aria-label="option 1"
                          label={t("default_address_text")}
                          checked={values?.isDefaultAddress}
                          onChange={(e) =>
                            setFieldValue("isDefaultAddress", e.target.checked)
                          }
                        />
                      </div>
                    </Col>
                    <Col md={12}>
                      <div className="ComsetBtnSavebox">
                        <Button
                          type="button"
                          onClick={onSave}
                          disabled={addressSelectorState?.status === 1}
                        >
                          {t("Save")}
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

export default AddAddressModal;
