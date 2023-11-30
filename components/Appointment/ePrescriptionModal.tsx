import { usePdf } from "@mikecousins/react-pdf";
import { useRef } from "react";
import { Spinner } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useTranslate } from "../../commonModules/translate";

function EPrescriptionModal(props: {
  show: boolean;
  onHide: any;
  prescriptionURL: string;
}) {
  const { show, onHide, prescriptionURL } = props;
  const ref: any = useRef();

  const { pdfDocument } = usePdf({
    file: prescriptionURL,
    canvasRef: ref,
  });

  const t=useTranslate()
  return (
    <>
      <Modal
        show={show}
        backdrop="static"
        keyboard={false}
        className="ComMainclboxmodalCov eprescriptionmodalCov"
        centered
        onHide={onHide}
      >
        <Modal.Header closeButton>
          {/* <Modal.Title></Modal.Title> */}
        </Modal.Header>
        <Modal.Body className="p-1">
          {pdfDocument ? (
            <canvas ref={ref} />
          ) : (
            <div className="eprescription-loader">
              {" "}
              <Spinner animation="border" role="status">
                <span className="visually-hidden">{t("loading")}...</span>
              </Spinner>
            </div>
          )}
          
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EPrescriptionModal;
