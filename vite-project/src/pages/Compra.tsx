import React, { useState } from "react";
import { ModalVentana } from "../components/compCheckout/ModalVentana";
import { TablaProductos } from "../components/compCheckout/TablaProductos";
import { FormularioCliente } from "../components/compCheckout/FormularioCliente";
import { MensajeEstado } from "../components/compCheckout/MensajeEstado";
import "../style/checkout.css";

export type ProductoCheckout = {
  id: string; // Mantener como string para compatibilidad con otros componentes
  imagen: string;
  nombre: string;
  precio: number;
  cantidad: number;
};

export type EstadoFlujo = "carrito" | "pago_fallido" | "pago_exitoso";

interface CompraProps {
  productos: ProductoCheckout[];
  onClose: () => void;
  clearCart: (mostrarConfirm?: boolean) => void;
}

export const Compra: React.FC<CompraProps> = ({ productos, onClose, clearCart }) => {
  const [estadoFlujo, setEstadoFlujo] = useState<EstadoFlujo>("carrito");
  const [form, setForm] = useState({
    nombre: "", apellidos: "", correo: "", calle: "",
    telefono: "", region: "", comuna: "", tarjeta: ""
  });
  const [productosResumen, setProductosResumen] = useState<ProductoCheckout[]>(productos);

  const total = productosResumen.reduce((s, p) => s + p.precio * p.cantidad, 0);

  const cambiarForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const procesarPago = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.apellidos || !form.correo || !form.tarjeta || !form.calle || !form.region || !form.comuna) {
      console.error("Faltan campos obligatorios");
      return;
    }

    const exito = Math.random() > 0.5;
    if (exito) {
      setProductosResumen([...productos]);
      setEstadoFlujo("pago_exitoso");
      clearCart(false);
    } else setEstadoFlujo("pago_fallido");
  };

  const reintentarPago = () => setEstadoFlujo("carrito");

  if (estadoFlujo === "carrito")
    return (
      <ModalVentana titulo="Detalles de Pago" onClose={onClose} className="carrito-modal">
        <form onSubmit={procesarPago}>
          <TablaProductos productos={productosResumen} />
          <FormularioCliente form={form} onChange={cambiarForm} />
          <button type="submit" className="btn-success btn-full-width">
            Pagar ${total.toLocaleString()}
          </button>
        </form>
      </ModalVentana>
    );

  if (estadoFlujo === "pago_fallido")
    return (
      <ModalVentana titulo="Error en el Pago" onClose={onClose} className="pago-fallido-modal">
        <MensajeEstado tipo="error" texto="No se pudo realizar el pago" />
        <TablaProductos productos={productosResumen} />
        <FormularioCliente form={form} onChange={cambiarForm} deshabilitado />
        <button className="btn-primary btn-full-width" onClick={reintentarPago}>Reintentar</button>
        <button className="btn-red-secondary" onClick={onClose} style={{ marginTop: "10px" }}>Cerrar</button>
      </ModalVentana>
    );

  if (estadoFlujo === "pago_exitoso")
    return (
      <ModalVentana titulo="Confirmación de Compra" onClose={onClose} className="pago-exitoso-modal">
        <MensajeEstado tipo="exito" texto="Pago exitoso" />
        <FormularioCliente form={form} onChange={cambiarForm} deshabilitado />
        <TablaProductos productos={productosResumen} />
        <div className="acciones-finales">
          <button className="btn-primary" onClick={() => alert("Imprimiendo Boleta...")}>🖨️ Imprimir boleta</button>
          <button className="btn-secondary" onClick={() => alert("Enviando Correo...")}>📧 Enviar boleta</button>
        </div>
        <button className="btn-red btn-full-width" onClick={onClose} style={{ marginTop: "20px" }}>Cerrar</button>
      </ModalVentana>
    );

  return null;
};
