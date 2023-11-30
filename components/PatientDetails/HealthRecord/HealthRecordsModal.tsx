import Image from "next/image";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { AiFillEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { CURRENT_USER } from "../../../commonModules/localStorege";
import { useTranslate } from "../../../commonModules/translate";
import {
  HealthRecordDemo1,
  HealthRecordDemo2,
  PdfImg,
} from "../../../public/assets";
import { deleteUserHealthRecordFile } from "../../../store/user/userDetailsSlice";
import {
  getUserHealthRecords,
  UserHealthRecord,
  userHealthRecordSelector,
} from "../../../store/user/userHealthRecordSlice";
import { HealthRecordUploadFileType } from "../../../utils/constant";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import ConfirmModal from "../../Common/ConfirmModal";

function HealthRecordsModal(props: {
  show: boolean;
  onHide: any;
  selectedRecord: UserHealthRecord;
  loadData: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { show, onHide, selectedRecord, loadData } = props;
  const dispatch = useAppDispatch();
  const healthRecordsSlice = useAppSelector(userHealthRecordSelector);

  const [dltModalDetail, setDltModalDetail] = useState({
    show: false,
    id: 0,
  });
  const [detail, setDetail] = useState<UserHealthRecord | null>(null);

  const t = useTranslate();

  useEffect(() => {
    if (selectedRecord) {
      setDetail(selectedRecord);
    }
  }, [selectedRecord]);

  useEffect(() => {
    if (healthRecordsSlice?.userHealthRecordList?.userHealthRecords?.length) {
      const selectedDetail =
        healthRecordsSlice.userHealthRecordList.userHealthRecords.find(
          (x) => x.userHealthRecordId === selectedRecord.userHealthRecordId
        );
      if (selectedDetail?.userHealthRecordFiles?.length) {
        setDetail(selectedDetail);
      } else {
        onHide();
      }
    }
  }, [healthRecordsSlice?.userHealthRecordList?.userHealthRecords]);

  const onDeleteHealthRecordFileConfirm = () => {
    setIsLoading(true);
    dispatch(deleteUserHealthRecordFile(dltModalDetail.id))
      .then((res) => {
        if (res?.payload?.isSuccess) {
          setDltModalDetail({ show: false, id: 0 });
          toast.success(t("health_record_attachment_delete_success"));
          loadData();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onDlt = (id: number) => {
    setDltModalDetail({
      show: true,
      id,
    });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        backdrop="static"
        keyboard={false}
        centered
        className="CustModalComcovermain"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("helth_records")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="HealthRecordListdata">
            {detail?.userHealthRecordFiles?.map((x) => {
              return (
                <div
                  className="HealthRecordListIner"
                  key={`file-health-${x.userHealthRecordFileId}`}
                >
                  <Image
                    alt={x.name}
                    src={
                      x.fileType === HealthRecordUploadFileType.PDF
                        ? PdfImg
                        : x.filePath
                    }
                    quality={0.2}
                    width={30}
                    height={20}
                  />
                  <div className="Deleteviewboximg">
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        onDlt(x.userHealthRecordFileId);
                      }}
                      className="DeleteImgBtn"
                    >
                      <MdDelete />
                    </a>
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(x.filePath, "_blank");
                      }}
                      className="ViewImgBtn"
                    >
                      <AiFillEye />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>
      {dltModalDetail.show && (
        <ConfirmModal
          show={dltModalDetail.show}
          onClose={() => {
            setDltModalDetail({ show: false, id: 0 });
          }}
          info={t("dlt_confirm")}
          title={t("Delete")}
          onConfirm={onDeleteHealthRecordFileConfirm}
          isDisabled={isLoading}
        />
      )}
    </>
  );
}

export default HealthRecordsModal;
