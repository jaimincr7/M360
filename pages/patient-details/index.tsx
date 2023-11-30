import { Formik } from "formik";
import { useEffect } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { CURRENT_USER } from "../../commonModules/localStorege";
import PatientAddress from "../../components/PatientDetails/Address/PatientAddressDropdown";
import AppointmentPaymentDetials from "../../components/PatientDetails/AppointmentPaymentDetials";
import HealthRecord from "../../components/PatientDetails/HealthRecord/HealthRecord";
import HospitalAppointmentDetials from "../../components/PatientDetails/HospitalAppointmentDetials";
import PatientConsultation from "../../components/PatientDetails/PatientConsultation";
import PatientList from "../../components/PatientDetails/PatientList";
import { getPatients } from "../../store/patientDetails/patientDetailsSlice";
import { getAllSymptomsListAction } from "../../store/symptomsList/symptomsListSlice";
import { getUserAddresses } from "../../store/user/addressSlice";
import { HealthRecordType } from "../../utils/constant";
import { useAppDispatch } from "../../utils/hooks";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import { clearData } from "../../store/user/userWalletSlice";
import { useTranslate } from "../../commonModules/translate";

function PatientDetails() {
  const initVal: any = {
    healthRecordType: "new", //either new || existing
    symptoms: "",
    healthRecord: "",
    remark: "",
    consulationNoteAppointmentIds: [],
    consulationDrDetails: [],
    bookedAppointmentDetail: {},
    healthRecordFileType: HealthRecordType.Report,
    paymentType: "cod",
    addressDetail: "",
    patientDetail: null,
    isWalletUsed: false,
  };
  const dispatch = useAppDispatch();
  const currentUser = CURRENT_USER();
  const t = useTranslate();

  useEffect(() => {
    dispatch(getPatients(currentUser.userId));
    dispatch(getAllSymptomsListAction());
    dispatch(getUserAddresses(currentUser.userId));
    return () => {
      dispatch(clearData());
    };
  }, []);

  return (
    <>
      <Formik
        initialValues={initVal}
        onSubmit={(values) => {
          console.log("formil values", values);
        }}
        enableReinitialize
      >
        {({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <Breadcrumbs
              details={{
                path: "/patient-details",
                details: [
                  { label: t("doctor_listing"), path: "/doctor-list" },
                  {
                    label: t("doctor_detail"),
                    path: `/doctor-details/${values?.bookedAppointmentDetail?.doctorId}`,
                  },
                  { label: t("patient_detail") },
                ],
              }}
            />
            <div className="container">
              <div className="patientdetialTitle">
                <h1>
                  {/* <MdOutlineArrowBackIosNew /> */}
                  {Number(
                    values?.bookedAppointmentDetail?.followupParentAppointmentId
                  )
                    ? t("follow_up_appointment")
                    : t("patient_detail")}
                </h1>
              </div>

              <div className="patientdetialCover">
                <div className="PatientdeLeft">
                  {!Number(
                    values?.bookedAppointmentDetail?.followupParentAppointmentId
                  ) && <PatientList />}

                  <HealthRecord />

                  {!Number(
                    values?.bookedAppointmentDetail?.followupParentAppointmentId
                  ) && <PatientAddress />}

                  <PatientConsultation />
                </div>

                <div className="PatientdeRight">
                  <div className="patientdetialCard">
                    <div className="DoctHospitright">
                      <HospitalAppointmentDetials />

                      {/* <AppointmentPaymentDetials /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}

export default PatientDetails;
