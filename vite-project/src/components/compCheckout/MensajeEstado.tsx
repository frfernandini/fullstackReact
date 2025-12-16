import React from "react";
import "../../style/checkout.css";

interface MensajeEstadoProps {
  tipo: "error" | "exito";
  texto?: string;
  mensaje?: string; // Añadir para compatibilidad
}

export const MensajeEstado: React.FC<MensajeEstadoProps> = ({ tipo, texto, mensaje }) => {
  const textoMostrar = texto || mensaje || "";
  
  return (
    <div className={tipo === "error" ? "mensaje-error" : "mensaje-exito"}>
      {tipo === "error" ? "❌" : "✅"} {textoMostrar}
    </div>
  );
};
