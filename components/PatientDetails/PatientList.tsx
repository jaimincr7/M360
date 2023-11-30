import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { RiEdit2Fill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useAppSelector } from "../../utils/hooks";
import {
  deletePatient,
  getPatients,
  patientDetailsSelector,
} from "../../store/patientDetails/patientDetailsSlice";
import ConfirmModal from "../Common/ConfirmModal";
import AddMember from "./AddMember";
import { useDispatch, useSelector } from "react-redux";
import {
  customSelector,
  getAllCountries,
} from "../../store/custom/customSlice";
import { AppDispatch } from "../../utils/store";
import { CURRENT_USER } from "../../commonModules/localStorege";
import { FormikProps, useFormikContext } from "formik";
import { useTranslate } from "../../commonModules/translate";

function PatientList() {
  const patient = useAppSelector(patientDetailsSelector);
  const currentUser = CURRENT_USER();
  const { values, setFieldValue }: FormikProps<any> = useFormikContext();

  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [isEditModal, setIsEditModal] = useState(0);
  const [memberData, setMemberData] = useState({});
  const [countryCodeLookups, setCountryCodeLookups] = useState([]);
  const [dltModalDetail, setDltModalDetail] = useState({
    selectedId: 0,
    show: false,
  });

  const customDetails = useSelector(customSelector);
  const dispatch = useDispatch<AppDispatch>();

  const t = useTranslate();

  useEffect(() => {
    if (!customDetails.countries.countries?.length) dispatch(getAllCountries());
  }, []);

  useEffect(() => {
    if (customDetails.countries.countries?.length) {
      setCountryCodeLookups(
        customDetails.countries.countries.map((x) => ({
          value: x.phoneCode,
          label: `${x.code}  +${x.phoneCode}`,
          countryId: x.countryId,
        }))
      );
    }
  }, [customDetails.countries.countries]);

  const handleDlt = () => {
    setIsLoading(true);
    dispatch(deletePatient(dltModalDetail.selectedId))
      .then(() => {
        dispatch(getPatients(currentUser.userId));
        onDltModalCls();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onDltModalCls = () => {
    setDltModalDetail({
      selectedId: 0,
      show: false,
    });
  };

  const onAddMember = () => {
    handleShow();
    setMemberData({});
    setIsEditModal(0);
  };

  return (
    <>
      <div className="patientdetialCard">
        <h6>
          {values?.bookedAppointmentDetail?.doctorServiceName} {t("appointment_is_for")}:*
        </h6>
        <div className="hospitdetailsPati">
          {["radio"].map((type: any) => (
            <div className="hospitdetailsIner" key={`default-${type}`}>
              <div className="hopismemeberlist">
                {patient.data.patient?.map((ptn) => (
                  <div
                    className="hopismemeberIn"
                    key={`patient-${ptn.patientId}`}
                  >
                    <div onClick={() => setFieldValue("patientDetail", ptn)}>
                      <Form.Check
                        className="custChboxcov cursorPointer"
                        inline
                        label={ptn?.fullName}
                        name="group1"
                        type={type}
                        id={`inline-${ptn.patientId}-1`}
                        checked={
                          values?.patientDetail?.patientId === ptn.patientId
                        }
                      />
                    </div>
                    <div className="hopismemebereditdelt">
                      <Button
                        variant="link"
                        onClick={() => {
                          setIsEditModal(1);
                          setMemberData(ptn);
                          setShow(true);
                        }}
                        className="EditBtnset"
                      >
                        <RiEdit2Fill />
                      </Button>
                      <Button
                        variant="link"
                        className="DeleteBtnset"
                        onClick={() => {
                          setDltModalDetail({
                            selectedId: ptn.patientId,
                            show: true,
                          });
                        }}
                      >
                        <MdDelete />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="addnewmemberbtn">
            <a href="javascript:;" onClick={onAddMember}>
              <IoMdAdd /> {t("Add_New_Member")}
            </a>
          </div>
        </div>
      </div>
      {dltModalDetail.show && (
        <ConfirmModal
          show={dltModalDetail.show}
          onClose={onDltModalCls}
          info={t("dlt_confirm")}
          title={t("Delete")}
          onConfirm={handleDlt}
          isDisabled={isLoading}
        />
      )}
      {show && (
        <AddMember
          show={show}
          onHide={() => handleClose()}
          isEditModal={isEditModal}
          memberData={memberData}
          setShow={setShow}
          countryCodeLookups={countryCodeLookups}
        />
      )}
    </>
  );
}

export default PatientList;
