import React from "react";
import "../../style/checkout.css";

interface ModalVentanaProps {
  titulo: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const ModalVentana: React.FC<ModalVentanaProps> = ({ titulo, onClose, children, className = "" }) => (
  <div className="modal-overlay">
    <div className={`modal-content ${className}`}>
      <div className="modal-header">
        <h2>{titulo}</h2>
        <button onClick={onClose} className="close-btn" aria-label="Cerrar modal">X</button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);