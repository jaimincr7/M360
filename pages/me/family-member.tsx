import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { AddMemberIcon } from "../../public/assets";
import BTable from "react-bootstrap/Table";
import { useTable, Column, useSortBy } from "react-table";
import { MdDelete, MdEdit } from "react-icons/md";
import UserProfileLayout from "../../layouts/userProfileLayout";
import Image from "next/image";
import AddMember from "../../components/PatientDetails/AddMember";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePatient,
  getPatients,
  patientDetailsSelector,
} from "../../store/patientDetails/patientDetailsSlice";
import { CURRENT_USER } from "../../commonModules/localStorege";
import { AppDispatch } from "../../utils/store";
import {
  customSelector,
  getAllCountries,
} from "../../store/custom/customSlice";
import ConfirmModal from "../../components/Common/ConfirmModal";
import NoRecordsFound from "../../components/NoRecordsFound";
import { toast } from "react-toastify";
import { useTranslate } from "../../commonModules/translate";

function FamilyMember() {
  const [show, setShow] = useState(false);
  const [dltModalDetail, setDltModalDetail] = useState({
    selectedId: 0,
    show: false,
  });
  const [isEditModal, setIsEditModal] = useState(0);
  const [memberData, setMemberData] = useState({});
  const [countryCodeLookups, setCountryCodeLookups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const dispatch = useDispatch<AppDispatch>();

  const t = useTranslate();

  const patientDetails = useSelector(patientDetailsSelector);
  const customDetails = useSelector(customSelector);
  const cureentUser = CURRENT_USER();

  const getAge = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    dispatch(getAllCountries());
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

  useEffect(() => {
    dispatch(getPatients(cureentUser.userId));
  }, [patientDetails.addPatient.addPatient]);

  useEffect(() => {
    dispatch(getPatients(cureentUser.userId));
  }, [patientDetails.updatePatient.updatePatient]);

  interface dataInterface {
    col1: string;
    col2: string;
  }
  const data = React.useMemo(() => [], []);
  const columns = React.useMemo(() => [] as Column[], []);
  const { getTableProps, getTableBodyProps } = useTable(
    { columns, data },
    useSortBy
  );

  const onAddMember = () => {
    handleShow();
    setMemberData({});
    setIsEditModal(0);
  };

  const handleDlt = () => {
    setIsLoading(true);
    dispatch(deletePatient(dltModalDetail.selectedId))
      .then((res) => {
        if (res?.payload) {
          dispatch(getPatients(cureentUser.userId));
          onDltModalCls();
          toast.success(t("member_delete_success"));
        }
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
  return (
    <>
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
      <div className="FamilyMemberboxCov">
        <div className="FamilyMemberboxTitle">
          <h1>{t("all_members")}</h1>
          <Button onClick={onAddMember}>
            <Image width={35} height={35} src={AddMemberIcon} alt="Member" /> +
            {t("member")}
          </Button>
        </div>
      </div>
      <div className="ComallTblcovlst maxHeight">
        <BTable
          striped
          bordered
          hover
          size="sm"
          {...getTableProps()}
          className="TableaminCust"
        >
          <thead>
            <tr>
              <th>{t("name")}</th>
              <th>{t("uniqueid_and_passportno")}</th>
              <th>{t("relation")}</th>
              <th>{t("Age")}</th>
              <th>{t("Gender")}</th>
              <th className="actdatamainbtn"></th>
            </tr>
          </thead>
          {patientDetails?.data.patient?.length > 0 && (
            <tbody {...getTableBodyProps()}>
              {patientDetails?.data.patient.map((data) => {
                return (
                  <>
                    <tr>
                      <td>{data.fullName}</td>
                      <td>{data.uniqueId}</td>
                      <td>{data.relation}</td>
                      <td>{data.birthDate ? getAge(data.birthDate) : "-"}</td>
                      <td>{data.gender}</td>
                      <td>
                        <Button
                          variant="link"
                          onClick={() => {
                            setIsEditModal(1);
                            setMemberData(data);
                            setShow(true);
                          }}
                          className="EditBtnset"
                        >
                          <MdEdit />
                        </Button>
                        <Button
                          variant="link"
                          className="DeleteBtnset"
                          onClick={() => {
                            setDltModalDetail({
                              selectedId: data.patientId,
                              show: true,
                            });
                          }}
                        >
                          <MdDelete />
                        </Button>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          )}
        </BTable>
        {!patientDetails?.data.patient?.length && <NoRecordsFound />}
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
    </>
  );
}

FamilyMember.PageLayout = UserProfileLayout;

export default FamilyMember;
