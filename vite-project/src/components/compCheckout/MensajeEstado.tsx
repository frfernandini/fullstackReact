import React from "react";
import "../../style/checkout.css";

interface MensajeEstadoProps {
  tipo: "error" | "exito";
  texto: string;
}

export const MensajeEstado: React.FC<MensajeEstadoProps> = ({ tipo, texto }) => (
  <div className={tipo === "error" ? "mensaje-error" : "mensaje-exito"}>
    {tipo === "error" ? "❌" : "✅"} {texto}
  </div>
);
