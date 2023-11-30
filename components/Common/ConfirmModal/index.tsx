import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslate } from "../../../commonModules/translate";

const ConfirmModal = ({
  show,
  onClose,
  info,
  title,
  onConfirm,
  isDisabled,
}: any) => {
  const t = useTranslate();
  return (
    <Modal centered backdrop="static" show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{info}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button type="button" variant="secondary" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={onConfirm}
          disabled={isDisabled ? true : false}
          style={{ background: "var(--secondary-color)" }}
        >
          {t("confirm")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
