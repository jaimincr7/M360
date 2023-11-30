import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FiDownload } from "react-icons/fi";
import { HealthRecordIcon } from "../../public/assets";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Row, Col } from "react-bootstrap";
import AddHealthRecords from "../../components/PatientDetails/HealthRecord/AddHealthRecords";
import ImporttpaDataBase from "../../components/PatientDetails/HealthRecord/ImporttpaDataBase";
import HealthRecordsModal from "../../components/PatientDetails/HealthRecord/HealthRecordsModal";

import UserProfileLayout from "../../layouts/userProfileLayout";
import { CURRENT_USER } from "../../commonModules/localStorege";
import { symptomsListSelector } from "../../store/symptomsList/symptomsListSlice";
import {
  userHealthRecordSelector,
  getUserHealthRecords,
  deleteUserHealthRecord,
  UserHealthRecord,
} from "../../store/user/userHealthRecordSlice";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import moment from "moment";
import ConfirmModal from "../../components/Common/ConfirmModal";
import { DurationFilterOptions } from "../../utils/constant";
import { toast } from "react-toastify";
import NoRecordsFound from "../../components/NoRecordsFound";
import { useTranslate } from "../../commonModules/translate";

function HealthRecords() {
  const animatedComponents = makeAnimated();
  const dispatch = useAppDispatch();
  const currentUser = CURRENT_USER();
  const symptoms = useAppSelector(symptomsListSelector);
  const healthRecordsSlice = useAppSelector(userHealthRecordSelector);
  const [healthRecordLookups, setHealthRecordLookups] = useState<any[]>([]);
  const [deleteDetail, setDeleteDetail] = useState<{
    show: boolean;
    id: number | null;
  }>({ show: false, id: null });
  const [showAddhealthRecord, setShowAddhealthRecord] = useState(false);
  const [showImportTPA, setShowImportTPA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalDetail, setModalDetail] = useState({});
  const [selectedRecord, setSelectedRecord] = useState<UserHealthRecord | null>(
    null
  );
  const t = useTranslate();
  const [selectedDuration, setSelectedDuration] = useState<any>(
    { ...DurationFilterOptions[0], label: t(DurationFilterOptions[0].label) }
  );


  useEffect(() => {
    loadData();
  }, [selectedDuration]);

  const loadData = () => {
    dispatch(
      getUserHealthRecords({
        userId: currentUser?.userId,
        duration: selectedDuration?.value,
      })
    );
  };
  useEffect(() => {
    if (healthRecordsSlice?.userHealthRecordList?.userHealthRecords?.length) {
      setHealthRecordLookups(
        healthRecordsSlice.userHealthRecordList.userHealthRecords.map((x) => ({
          value: x.userHealthRecordId,
          label: x.name,
        }))
      );
    }
  }, [healthRecordsSlice?.userHealthRecordList?.userHealthRecords]);

  const handleAddHealthRecordShow = () => setShowAddhealthRecord(true);

  const handleImportTAPShow = () => setShowImportTPA(true);

  const handleAddHealthRecordClose = () => setShowAddhealthRecord(false);
  const handleImportTPAClose = () => setShowImportTPA(false);

  const handleDlt = () => {
    setIsLoading(true);
    dispatch(deleteUserHealthRecord(Number(deleteDetail.id)))
      .then(() => {
        loadData();
        onDltModalCls();
        toast.success(t("health_record_delete_success"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onDltModalCls = () => {
    setDeleteDetail({
      id: null,
      show: false,
    });
  };

  return (
    <>
      {/* Add Health Records, Import from TPA DataBase, Health Records List Modal */}

      {showAddhealthRecord && (
        <AddHealthRecords
          show={showAddhealthRecord}
          onHide={() => handleAddHealthRecordClose()}
          durationVal={selectedDuration?.value}
        />
      )}
      <ImporttpaDataBase
        show={showImportTPA}
        onHide={() => handleImportTPAClose()}
      />
      {selectedRecord && (
        <HealthRecordsModal
          show={selectedRecord ? true : false}
          onHide={() => {
            setSelectedRecord(null);
          }}
          selectedRecord={selectedRecord}
          loadData={loadData}
        />
      )}

      {/* Add Health Records, Import from TPA DataBase, Health Records List Modal */}
      <div className="HealthRecordsBoxmain">
        <div className="HealthRecordsBoxhed">
          <div className="HealthRecorboxhedLeft">
            <h1>{t("helth_records")}</h1>
          </div>
          <div className="HealthRecorboxhedRight">
            <div className="FormSelectcovermain heltsltboxaminCov">
              <Select
                components={animatedComponents}
                classNamePrefix="react-select"
                options={DurationFilterOptions.map(i => ({ ...i, label: t(i.label) }))}
                onChange={(val: any) => setSelectedDuration(val)}
                value={selectedDuration}
                className=""
              />
            </div>
            <div className="AddHealtrecoBtnset right">
              <Button onClick={handleAddHealthRecordShow}>
                + {t("add_helth_record")}
              </Button>
            </div>
          </div>

          {/* <Button onClick={handleImportTAPShow}><FiDownload />Import from TPA Data Base</Button> 
                    </div> */}
        </div>
        <div className="HealRecodataCov">
          <Row>
            {healthRecordsSlice?.userHealthRecordList?.userHealthRecords
              ?.length ? (
              healthRecordsSlice?.userHealthRecordList?.userHealthRecords?.map(
                (healthRecord, i) => (
                  <Col md={6} key={`health-record-${i}`}>
                    <div className="HealRecodataIner">
                      <p>
                        {t("created_date_time")}:{" "}
                        <span>
                          {moment(healthRecord.createdAt).format(
                            "dddd, hh:MM A"
                          )}
                        </span>
                      </p>
                      <p>
                        {t("record_name")}: <span>{healthRecord.name}</span>
                      </p>
                      <p>
                        {t("remark")}: <span>{healthRecord.remark}</span>
                      </p>
                      {healthRecord?.userHealthRecordFiles?.length > 0 && (
                        <a
                          href=""
                          className="RecodAttachmentcl"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedRecord(healthRecord);
                          }}
                        >
                          {t("attachments")}
                        </a>
                      )}
                      <a
                        href="javascript:;"
                        className="RecodDeletecl"
                        onClick={() =>
                          setDeleteDetail({
                            id: healthRecord.userHealthRecordId,
                            show: true,
                          })
                        }
                      >
                        {t("Delete")}
                      </a>
                    </div>
                  </Col>
                )
              )
            ) : (
              <NoRecordsFound />
            )}
          </Row>
        </div>
        {/* <div className='noHealthdatacomno'>
                                        <img src={HealthRecordIcon} alt="Health Record" />
                                        <p>Sorry, no records shared yet</p>
                                        <Button onClick={handleShow}>+ Add Health Record</Button>
                                    </div> */}
      </div>
      {deleteDetail.show && (
        <ConfirmModal
          show={deleteDetail.show}
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

HealthRecords.PageLayout = UserProfileLayout;
export default HealthRecords;
