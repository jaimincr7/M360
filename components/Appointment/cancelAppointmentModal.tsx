import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../utils/hooks";
import { CURRENT_USER } from "../../commonModules/localStorege";
import {
  cancelAppointmentAction,
  getAppointmentAction,
} from "../../store/user/appointmentSlice";
import { toast } from "react-toastify";
import { UserType } from "../../utils/constant";
import { useTranslate } from "../../commonModules/translate";

function CancelAppointmentModal(props: {
  show: boolean;
  onHide: any;
  appointmentId: number;
}) {
  const { show, onHide, appointmentId } = props;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const currentUser = CURRENT_USER();

  const t = useTranslate();

  const initVal = {
    remark: "",
  };

  const validationSchema = Yup.object().shape({
    remark: Yup.string().nullable().required(t("remark_required")),
  });

  const handleCancelRequest = (values) => {
    setIsLoading(true);
    dispatch(
      cancelAppointmentAction({
        appointmentCancelledByUserId: currentUser.userId,
        appointmentId,
        remark: values.remark,
        appointmentCancelledByUserType: UserType.User,
      })
    )
      .then((res) => {
        if (res.payload) {
          dispatch(getAppointmentAction(appointmentId));
          toast.success(t("appointment_cancel_success"));
          onHide();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <>
      <Modal
        show={show}
        backdrop="static"
        keyboard={false}
        centered
        className="CustModalComcovermain CancelAppointmentModalcov"
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <h5>{t("CancelAppointment")}</h5>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initVal}
            validationSchema={validationSchema}
            onSubmit={handleCancelRequest}
            enableReinitialize
          >
            {({ handleSubmit, errors, values, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <div className="CanAppoinMintextrembox">
                  <Form.Group className="FormInputcovermain" controlId="">
                    <Form.Label>{t("remark")}*</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={values.remark}
                      placeholder={t("enter_remark")}
                      onChange={(e) => setFieldValue("remark", e.target.value)}
                    />
                    {errors?.remark && (
                      <div style={{ color: "red" }}>{errors.remark}</div>
                    )}
                  </Form.Group>
                  <div className="ComsetBtnSavebox">
                    <Button type="submit" disabled={isLoading}>
                      {t("CancelAppointment")}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CancelAppointmentModal;
