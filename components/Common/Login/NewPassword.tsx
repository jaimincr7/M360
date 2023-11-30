import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useTranslate } from "../../../commonModules/translate";

function NewPassword(props: { show: boolean; onHide: any }) {
  const t = useTranslate();
  const animatedComponents = makeAnimated();
  const countrycode = [
    { value: "1", label: "+84" },
    { value: "2", label: "+01" },
    { value: "2", label: "+81" },
    { value: "3", label: "+03" },
    { value: "3", label: "+1234" },
  ];
  return (
    <>
      <Modal
        {...props}
        backdrop="static"
        keyboard={false}
        centered
        className="CustModalComcovermain ComLoginmainModalsetcov"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("New_password")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="LoginFormmaincov">
            <div className="ComsetmodlaForm">
              <div className="ComsetFormAddIn">
                <Form.Group className="FormInputcovermain" controlId="">
                  <Form.Label>{t('create_new_password')}*</Form.Label>
                  <div className="passboxincovbtn">
                    <Form.Control type="" placeholder="new password" />
                    <p className="noteloginboxcom">
                      {t("password_mustbe_six_char")}
                    </p>
                    <a href="" className="PassShow">
                      <AiOutlineEye />
                    </a>
                    {/* <a href="" className="PassHide"><AiOutlineEyeInvisible /></a> */}
                  </div>
                </Form.Group>
              </div>
              <div className="ComsetFormAddIn">
                <Form.Group className="FormInputcovermain" controlId="">
                  <Form.Label>{t('confirm_your_password')}*</Form.Label>
                  <div className="passboxincovbtn">
                    <Form.Control type="" placeholder="Confirm your password" />
                    <a href="" className="PassShow">
                      <AiOutlineEye />
                    </a>
                    {/* <a href="" className="PassHide"><AiOutlineEyeInvisible /></a> */}
                  </div>
                </Form.Group>
              </div>

              <div className="SaveButtonComsetbox">
                <Button>{t('save_and_change')}</Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NewPassword;
