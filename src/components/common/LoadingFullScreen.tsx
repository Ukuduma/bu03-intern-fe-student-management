import React from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface Props {
  isShow: boolean;
}
const LoadingFullScreen = ({ isShow }: Props) => {
  const { t } = useTranslation();
  return (
    <Modal
      show={isShow}
      dialogClassName="modal-dialog-centered"
      contentClassName="bg-transparent"
    >
      <Modal.Body>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="text-center mt-3">{`${t("Loading")}...`}</div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoadingFullScreen;
