import { FormikProps, useFormikContext } from "formik";
import moment from "moment";
import { useEffect, useState, useTransition } from "react";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import { CURRENT_USER } from "../../commonModules/localStorege";
import {
  appointmentStateSelector,
  getPastConsultations,
} from "../../store/user/appointmentSlice";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { doctorListSelector } from "../../store/promocode/promocodeSlice";
import { useTranslate } from "../../commonModules/translate";

function PatientConsultation() {
  const currentUser = CURRENT_USER();
  const t = useTranslate();
  const dispatch = useAppDispatch();
  const { values, setFieldValue }: FormikProps<any> = useFormikContext();
  const appointmentSelector = useAppSelector(appointmentStateSelector);

  const [pastAppointments, setPastAppointments] = useState<any[]>([]);
  const [showFullDesc, setShowFullDesc] = useState<any>({
    parentId: null,
    childId: null,
  });

  useEffect(() => {
    dispatch(getPastConsultations(currentUser?.userId));
  }, []);

  useEffect(() => {
    if (appointmentSelector?.pastAppointments?.pastAppointments?.length) {
      setPastAppointments(
        appointmentSelector?.pastAppointments?.pastAppointments?.filter(
          (x: any) => x.appointments?.length > 0
        )
      );
    }
  }, [appointmentSelector?.pastAppointments?.pastAppointments]);

  const onSelectAppointment = (appointmentId: number, data: any) => {
    let existingVal = values?.consulationNoteAppointmentIds
      ? [...values?.consulationNoteAppointmentIds]
      : [];
    if (existingVal.includes(appointmentId)) {
      existingVal = existingVal.filter((x) => x !== appointmentId);
      if (
        values?.consulationDrDetails
          ?.map((x) => x.doctorId)
          ?.includes(data.doctorId)
      ) {
        const newConsulationDrDetails = values?.consulationDrDetails?.filter(
          (x) => x.doctorId !== data.doctorId
        );
        setFieldValue("consulationDrDetails", newConsulationDrDetails);
      }
    } else {
      existingVal.push(appointmentId);
      let isAllSelected = true;
      data.appointments.forEach((element) => {
        if (!existingVal.includes(element.appointmentId) && isAllSelected) {
          isAllSelected = isAllSelected && false;
        }
      });
      if (isAllSelected) {
        const drDetailVal = values?.consulationDrDetails
          ? [...values?.consulationDrDetails]
          : [];
        drDetailVal.push(data);
        setFieldValue("consulationDrDetails", drDetailVal);
      }
    }
    setFieldValue("consulationNoteAppointmentIds", existingVal);
  };

  const onHeaderSelectAppointment = (drId: number, data: any) => {
    let existingVal = values?.consulationDrDetails
      ? [...values?.consulationDrDetails]
      : [];
    let existingAppointmentVal = values?.consulationNoteAppointmentIds
      ? [...values?.consulationNoteAppointmentIds]
      : [];
    if (existingVal.map((x) => x.doctorId).includes(drId)) {
      existingVal = existingVal.filter((x) => x.doctorId !== drId);
      data.appointments?.forEach((element) => {
        existingAppointmentVal = existingAppointmentVal.filter(
          (x) => x !== element.appointmentId
        );
      });
    } else {
      existingVal.push(data);
      data?.appointments?.forEach((apt) => {
        if (!existingAppointmentVal.includes(apt.appointmentId)) {
          existingAppointmentVal.push(apt.appointmentId);
        }
      });
    }
    setFieldValue("consulationNoteAppointmentIds", existingAppointmentVal);
    setFieldValue("consulationDrDetails", existingVal);
  };

  return (
    <div>
      {pastAppointments?.length > 0 && (
        <div className="patientdetialCard">
          <h6>{t("share_your_previous_consultation")}</h6>
          <div className="PreviousConsBox">
            <Accordion defaultActiveKey="0">
              {pastAppointments.map((app: any, i: number) => (
                <Accordion.Item
                  eventKey={i.toString()}
                  key={`past-appointment-${i}`}
                >
                  <Accordion.Header>
                    <Form.Check
                      aria-label="option 1"
                      label={`${app.displayName} | ${app.specialities}`}
                      onChange={() => {
                        onHeaderSelectAppointment(app.doctorId, app);
                      }}
                      checked={values?.consulationDrDetails?.find(
                        (x) => x.doctorId === app.doctorId
                      )}
                    />
                  </Accordion.Header>
                  {app.appointments && (
                    <Accordion.Body>
                      <div className="ConsultApointMain">
                        {app.appointments?.map((x, j: number) => {
                          return (
                            <div
                              className="ConsultApointCov"
                              key={`past-child-appointment-${i}-${j}`}
                            >
                              <div className="ConsultApointTitle">
                                <Form.Check
                                  aria-label="option 1"
                                  checked={values?.consulationNoteAppointmentIds?.includes(
                                    x.appointmentId
                                  )}
                                  label={x.appointmentNumber}
                                  onClick={() => {
                                    onSelectAppointment(x.appointmentId, app);
                                  }}
                                />
                                <p>
                                  {moment(x.appointmentDateTime).format(
                                    "DDMMM, YYYY"
                                  )}
                                </p>
                              </div>
                              <div className="ConsultApointIner">
                                <p>
                                  {x.consultationNotes?.length > 100 ? (
                                    showFullDesc.parentId === i &&
                                    showFullDesc.childId === j ? (
                                      <>
                                        {x.consultationNotes}{" "}
                                        <a
                                          href="javascript:;"
                                          onClick={() => {
                                            setShowFullDesc({
                                              parentId: null,
                                              childId: null,
                                            });
                                          }}
                                        >
                                            {t("read_less")}{" "}
                                        </a>{" "}
                                      </>
                                    ) : (
                                      <>
                                        {x.consultationNotes.slice(0, 100)}...
                                        <a
                                          href="javascript:;"
                                          onClick={() => {
                                            setShowFullDesc({
                                              parentId: i,
                                              childId: j,
                                            });
                                          }}
                                        >
                                            {t("read_more")}{" "}
                                        </a>
                                      </>
                                    )
                                  ) : (
                                    <>{x.consultationNotes}</>
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Accordion.Body>
                  )}
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientConsultation;
