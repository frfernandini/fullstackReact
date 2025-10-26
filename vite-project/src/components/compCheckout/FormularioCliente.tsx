import React from "react";
import "../../style/checkout.css";

interface FormularioClienteProps {
  form: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  deshabilitado?: boolean;
}

export const FormularioCliente: React.FC<FormularioClienteProps> = ({ form, onChange, deshabilitado = false }) => (
  <>
    <div className="form-section-title">Información del cliente</div>
    <div className="form-row">
      <div className="form-group flex-item">
        <label>Nombre*</label>
        <input name="nombre" value={form.nombre} onChange={onChange} required disabled={deshabilitado} />
      </div>
      <div className="form-group flex-item">
        <label>Apellidos*</label>
        <input name="apellidos" value={form.apellidos} onChange={onChange} required disabled={deshabilitado} />
      </div>
    </div>

    <div className="form-group">
      <label>Correo*</label>
      <input type="email" name="correo" value={form.correo} onChange={onChange} required disabled={deshabilitado} />
    </div>

    <div className="form-row">
      <div className="form-group flex-item-large">
        <label>N° Tarjeta*</label>
        <input name="tarjeta" value={form.tarjeta} onChange={onChange} required disabled={deshabilitado} />
      </div>
      <div className="form-group flex-item-small">
        <label>Teléfono</label>
        <input name="telefono" value={form.telefono} onChange={onChange} disabled={deshabilitado} />
      </div>
    </div>

    <div className="form-section-title">Dirección de entrega</div>
    <div className="form-group flex-item-large">
      <label>Calle*</label>
      <input name="calle" value={form.calle} onChange={onChange} required disabled={deshabilitado} />
    </div>

    <div className="form-row">
      <div className="form-group flex-item">
        <label>Región*</label>
        <input name="region" value={form.region} onChange={onChange} required disabled={deshabilitado} />
      </div>
      <div className="form-group flex-item">
        <label>Comuna*</label>
        <input name="comuna" value={form.comuna} onChange={onChange} required disabled={deshabilitado} />
      </div>
    </div>
  </>
);
