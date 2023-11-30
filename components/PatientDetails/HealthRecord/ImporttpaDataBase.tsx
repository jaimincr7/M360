import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";

import { IoCalendar } from "react-icons/io5";
import { MdInfo } from "react-icons/md";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslate } from "../../../commonModules/translate";

function ImporttpaDataBase(props: { show: boolean; onHide: any }) {
  const animatedComponents = makeAnimated();
  const countrycode = [
    { value: "1", label: "VN +84" },
    { value: "2", label: "US +01" },
    { value: "2", label: "IN +91" },
  ];
  const options3 = [
    { value: "1", label: "Male" },
    { value: "2", label: "female" },
  ];

  const t = useTranslate();

  const [date, setdate] = useState(new Date());
  const onChange = (dates: any) => {
    console.log(dates);
    setdate(dates);
  };

  return (
    <>
      <Modal
        {...props}
        backdrop="static"
        keyboard={false}
        centered
        className="CustModalComcovermain"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("import_tpa_msg")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="ComsetmodlaForm">
            <Row>
              <Col md={12}>
                <div className="ComsetFormAddIn">
                  <div className="FormInputcovermain ComsetFormDatepic">
                    <p>{t("patient_dob")}*</p>
                    <div className="ComsetFormDateiner">
                      <DatePicker
                        selected={date}
                        onChange={onChange}
                        className="form-control"
                      />
                      <IoCalendar />
                    </div>
                  </div>
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
                          options={countrycode}
                          classNamePrefix="react-select"
                          defaultValue={countrycode[0]}
                        />
                      </div>
                      <Form.Control type="" placeholder={t("mobile_number")} />
                    </div>
                  </Form.Group>
                </div>
              </Col>

              <Col md={12}>
                <div className="ComsetFormAddIn">
                  <Form.Group className="FormInputcovermain" controlId="">
                    <Form.Label>{t("case_number")}*</Form.Label>
                    <Form.Control type="" placeholder={t("enter_case_number")} />
                  </Form.Group>
                </div>
              </Col>
              <div className="remarnotecomcsnote">
                <p>
                  <MdInfo /> {t("find_num_sms")}
                </p>
              </div>
              <Col md={12}>
                <div className="ComsetFormAddIn">
                  <Form.Group className="FormInputcovermain" controlId="">
                    <Form.Label>{t("remark")}</Form.Label>
                    <Form.Control type="" placeholder={t("type_remark_here")} />
                  </Form.Group>
                </div>
              </Col>

              <Col md={12}>
                <div className="ComsetBtnSaveFull">
                  <Button>{t("verify")}</Button>
                </div>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ImporttpaDataBase;
