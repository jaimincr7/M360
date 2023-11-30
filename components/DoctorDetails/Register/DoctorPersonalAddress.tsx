import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "react-datepicker/dist/react-datepicker.css";
import { useContext, useEffect, useState } from "react";
import { RegisterDRContext } from "../../../pages/join-as-doctor";
import { ErrorMessage } from "formik";
import { useTranslate } from "../../../commonModules/translate";
import { useAppDispatch } from "../../../utils/hooks";
import { getAllCitiesByStateId } from "../../../store/custom/customSlice";

function DoctorBasicDetails() {
  const registerDrContext: any = useContext(RegisterDRContext);
  const [cityLookups,setCityLookups]=useState([])
  const {
    setCurrentStep,
    stateLookups,
    values,
    setFieldValue,
    errors,
    showError,
  } = registerDrContext;

  const animatedComponents = makeAnimated();
  const t = useTranslate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(values?.state?.value)
    {
      dispatch(getAllCitiesByStateId(values?.state?.value)).then(res=>{
        if(res?.payload?.cities){
          setCityLookups(res.payload.cities?.map((x:any)=>({value:x.cityId,label:x.name})))
        }else{
          setCityLookups([])
        }
       })
    }else{
      setCityLookups([])
    }
  }, [values?.state])
  
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

  const renderError = (fieldName: string) => {
    return (
      errors &&
      errors[fieldName] &&
      showError && <div style={{ color: "red" }}>{errors[fieldName]}</div>
    );
  };

 
  return (
    <>
      <div className="ComsetmodlaForm">
        <Row>
          <Col md={8}>
            {renderInput(
              t("adress_long_discripton"),
              "addressLine1",
              t("address_line_1")
            )}
          </Col>
          <Col md={4}>{renderInput(t("ward") + "*", "ward", t("ward"))}</Col>
          <Col md={4}>{renderInput(t("distric") + "*", "district", t("distric"))}</Col>
          <Col md={4}>
            <div className="ComsetFormAddIn">
              <div className="FormSelectcovermain">
                <p>{t("state")}*</p>
                <Select
                  components={animatedComponents}
                  classNamePrefix="react-select"
                  className={renderError("state") ? "errorBorder" : ""}
                  options={stateLookups}
                  onChange={(e) => {
                    setFieldValue("state", e);
                    setFieldValue("city", null)
                  }}
                  value={values.state}
                />
                {renderError("state")}
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
                  className={renderError("city") ? "errorBorder" : ""}
                  options={cityLookups}
                  onChange={(e) => setFieldValue("city", e)}
                  value={values.city}
                />
                {renderError("city")}
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
