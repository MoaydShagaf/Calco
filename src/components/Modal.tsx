import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  content,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <div className="modal-content">{content}</div>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>
            إلغاء
          </button>
          <button className="modal-btn confirm" onClick={onConfirm}>
            تأكيد
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
