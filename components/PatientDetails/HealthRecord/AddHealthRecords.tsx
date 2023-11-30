import { Formik } from "formik";
import Modal from "react-bootstrap/Modal";
import { useTranslate } from "../../../commonModules/translate";
import { HealthRecordType } from "../../../utils/constant";
import HealthRecord from "./HealthRecord";

function AddHealthRecords(props: {
  show: boolean;
  onHide: any;
  durationVal: number;
}) {
  const initVal = {
    healthRecordType: "new",
    healthRecordFileType: HealthRecordType.Report,
    recordName: "",
    remark: "",
  };

  const t = useTranslate();

  return (
    <Modal
      {...props}
      backdrop="static"
      keyboard={false}
      centered
      className="CustModalComcovermain"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t("add_health_records")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="ComsetmodlaForm">
          <Formik
            initialValues={initVal}
            onSubmit={(values) => {
              console.log("formil values", values);
            }}
            enableReinitialize
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <HealthRecord
                  isForModal={true}
                  onComplete={props.onHide}
                  durationVal={props.durationVal}
                />
              </form>
            )}
          </Formik>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddHealthRecords;
