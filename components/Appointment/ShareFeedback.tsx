import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  addAppointmentReviewAction,
  getAppointmentAction,
} from "../../store/user/appointmentSlice";
import { useAppDispatch } from "../../utils/hooks";
import { CURRENT_USER } from "../../commonModules/localStorege";
import Image from "next/image";
import { GoodFeedback } from "../../public/assets";
import { useTranslate } from "../../commonModules/translate";

function ShareFeedbackModal(props: {
  show: boolean;
  onHide: any;
  appointmentId: number;
  doctorId: number;
}) {
  const { show, onHide, appointmentId, doctorId } = props;
  const dispatch = useAppDispatch();
  const currentUser = CURRENT_USER();

  const t = useTranslate();

  const [showThanksModal, setShowThankModal] = useState(false);

  const initVal = {
    experience: "",
    rate: 0,
  };

  const validationSchema = Yup.object().shape({
    experience: Yup.string().nullable().required(t("remark_required")),
    rate: Yup.number().nullable().min(1, t("rate_first")),
  });

  const handleCancelRequest = (values) => {
    dispatch(
      addAppointmentReviewAction({
        appointmentId: appointmentId,
        userId: currentUser.userId,
        doctorId: doctorId,
        ratings: values.rate,
        comment: values.experience,
      })
    ).then((res) => {
      if (res.payload) {
        setShowThankModal(true);
        dispatch(getAppointmentAction(Number(appointmentId)));
      }
    });
  };

  return (
    <>
      <Modal
        show={show}
        backdrop="static"
        keyboard={false}
        centered
        className={`CustModalComcovermain ${showThanksModal ? "ThabksFeedbmodlmain" : "ShareFeedbackModal"
          }`}
        onHide={() => {
          if (showThanksModal) {
            setShowThankModal(false);
          }
          onHide();
        }}
      >
        <Modal.Header closeButton>
          {!showThanksModal && (
            <Modal.Title>{t("feedback_modal_title")}</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initVal}
            validationSchema={validationSchema}
            onSubmit={handleCancelRequest}
            enableReinitialize
          >
            {({ handleSubmit, errors, values, submitCount, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                {showThanksModal ? (
                  <div className="ThabksFeedbmodlcov">
                    <Image
                      src={GoodFeedback}
                      alt="Thanks for your feedback"
                      width={80}
                      height={80}
                    />
                    <p>{t("thanks_for_your_feedback")}</p>
                  </div>
                ) : (
                  <div className="ShareFeedbCovmod">
                    <h6> {t("feedback_msg")} </h6>

                    <p>{t("rate_your_experience")}*</p>
                    <div className="feedbackRating">
                      {values.rate > 0 &&
                        Array.from(Array(values.rate), (element, index) => {
                          return (
                            <AiFillStar
                              key={`rate-fill-star-${index}`}
                              onClick={() => setFieldValue("rate", index + 1)}
                              className="fillStar"
                            />
                          );
                        })}
                      {Array.from(Array(5 - values.rate), (element, index) => {
                        return (
                          <AiOutlineStar
                            key={`rate-star-${index}`}
                            onClick={() =>
                              setFieldValue("rate", index + values.rate + 1)
                            }
                            className="outlineStart"
                          />
                        );
                      })}
                      {errors?.rate && submitCount > 0 && (
                        <div style={{ color: "red" }}>{errors.rate}</div>
                      )}
                    </div>
                    <Form.Group className="rateexperredremar" controlId="">
                      <Form.Label>
                        {t("feedback_que")}*
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                          placeholder={t("YourFeedback")}
                        value={values.experience}
                        onChange={(e) =>
                          setFieldValue("experience", e.target.value)
                        }
                      />
                      {errors?.experience && submitCount > 0 && (
                        <div style={{ color: "red" }}>{errors.experience}</div>
                      )}
                    </Form.Group>
                    <div className="submitfidrefullbtn">
                      <Button type="submit">{t("Submit")}</Button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ShareFeedbackModal;
