import React, { useState } from "react";
import "../style/checkout.css"; 

// Tipos
export type ProductoCheckout = {
  id: number;
  imagen: string;
  nombre: string;
  precio: number;
  cantidad: number;
};

// Estados del flujo de pago
export type EstadoFlujo = "carrito" | "pago_fallido" | "pago_exitoso";

interface CompraProps {
  productos: ProductoCheckout[];
  onClose: () => void; // cerrar ventana
  clearCart: (mostrarConfirm?: boolean) => void; // vaciar carrito al finalizar
}


// Componente Checkout 
export const Compra: React.FC<CompraProps> = ({ productos, onClose, clearCart }) => {
  const [estadoFlujo, setEstadoFlujo] = useState<EstadoFlujo>("carrito");

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    calle: "",
    telefono: "",
    region: "",
    comuna: "",
    tarjeta: ""
  });
  // Se inicializa una const que actuara para guardar el resumen de productos después del pago,
  // ya que el prop productos se sobreescribe al vaciar el carrito.
  // Evitando perder la información para el resumen final
  const [productosResumen, setProductosResumen] = useState<ProductoCheckout[]>(productos);
  // Cálculo del total
  const total = productosResumen.reduce((suma, p) => suma + p.precio * p.cantidad, 0);

  const cambiarForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const procesarPago = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas (Asegurar que los campos requeridos estén llenos)
    if (!form.nombre || !form.apellidos || !form.correo || !form.tarjeta || !form.calle || !form.region || !form.comuna) {
        console.error("Faltan campos obligatorios");
        return; 
    }
    
    // Simulación del proceso de pago
    // Cambié la probabilidad para que haya más fallos para simular el reintento
    const exito: boolean = Math.random() > 0.5; 
    
    if (exito) {
      setProductosResumen([...productos]);
      setEstadoFlujo("pago_exitoso");
      clearCart(false); // vaciar carrito al pagar
    } else {
      setEstadoFlujo("pago_fallido");
    }
  };

  const reintentarPago = () => setEstadoFlujo("carrito");

  const renderTablaProductos = () => (
    <div className="compra-table-container">
        <h4 style={{marginTop: '20px', marginBottom: '10px', fontSize: '1.1em'}}>Resumen de Productos</h4>
        <table className="compra-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {productosResumen.map((p) => (
                    <tr key={p.id}>
                        <td><img src={p.imagen} alt={p.nombre} /></td>
                        <td>{p.nombre}</td>
                        <td>${p.precio.toLocaleString()}</td>
                        <td>{p.cantidad}</td>
                        <td>${(p.precio * p.cantidad).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={4} style={{textAlign: 'right', fontWeight: 'bold'}}>Total:</td>
                    <td style={{fontWeight: 'bold'}}>${total.toLocaleString()}</td>
                </tr>
            </tfoot>
        </table>
    </div>
  );

  const renderFormularioCliente = (deshabilitado: boolean = false) => (
    <>
      <div className="form-section-title">Información del cliente</div>
      <div className="form-row">
        <div className="form-group flex-item">
          <label>Nombre*</label>
          <input name="nombre" value={form.nombre} onChange={cambiarForm} required disabled={deshabilitado} />
        </div>
        <div className="form-group flex-item">
          <label>Apellidos*</label>
          <input name="apellidos" value={form.apellidos} onChange={cambiarForm} required disabled={deshabilitado} />
        </div>
      </div>
      <div className="form-group">
          <label>Correo*</label>
          <input type="email" name="correo" value={form.correo} onChange={cambiarForm} required disabled={deshabilitado} />
      </div>
      <div className="form-row">
        <div className="form-group flex-item-large">
            <label>N° Tarjeta*</label>
            <input name="tarjeta" value={form.tarjeta} onChange={cambiarForm} required disabled={deshabilitado} />
        </div>
        <div className="form-group flex-item-small">
          <label>Telefono</label>
          <input name="telefono" value={form.telefono} onChange={cambiarForm} disabled={deshabilitado} />
        </div>
      </div>
      
      <div className="form-section-title">Dirección de entrega</div>
      <div className="form-group flex-item-large">
        <label>Calle*</label>
        <input name="calle" value={form.calle} onChange={cambiarForm} required disabled={deshabilitado} />
      </div>
      <div className="form-row">
        <div className="form-group flex-item">
          <label>Región*</label>
          <input name="region" value={form.region} onChange={cambiarForm} required disabled={deshabilitado} />
        </div>
        <div className="form-group flex-item">
          <label>Comuna*</label>
          <input name="comuna" value={form.comuna} onChange={cambiarForm} required disabled={deshabilitado} />
        </div>
      </div>
    </>
  );

  const renderVent = (titulo: string, contenido: React.ReactNode, className: string = "") => (
    <div className="modal-overlay">
      <div className={`modal-content ${className}`}>
        <div className="modal-header">
            <h2>{titulo}</h2>
            <button onClick={onClose} className="close-btn" aria-label="Cerrar modal">X</button>
        </div>
        <div className="modal-body">
            {contenido}
        </div>
      </div>
    </div>
  );
  
  // --- Flujo: Carrito (Formulario) ---
  if (estadoFlujo === "carrito") {
    const contenido = (
      <form onSubmit={procesarPago}>
        {renderTablaProductos()} 
        {renderFormularioCliente(false)}
        <button type="submit" className="btn-success btn-full-width">Pagar ${total.toLocaleString()}</button>
      </form>
    );
    return renderVent("Detalles de Pago", contenido, "carrito-modal");
  }

  // --- Flujo: Pago Fallido ---
  if (estadoFlujo === "pago_fallido") {
    const contenido = (
      <>
        <div className="mensaje-error">
            ❌ No se pudo realizar el pago
        </div>
        {renderTablaProductos()}
        {renderFormularioCliente(true)}
        <button className="btn-primary btn-full-width" onClick={reintentarPago}>Reintentar</button>
        <button className="btn-red-secondary" onClick={onClose} style={{marginTop: '10px'}}>Cerrar</button>
      </>
    );
    return renderVent("Error en el Pago", contenido, "pago-fallido-modal");
  }

  // --- Flujo: Pago Exitoso (Incluye botones de boleta) ---
  if (estadoFlujo === "pago_exitoso") {
    const contenido = (
      <>
        <div className="mensaje-exito">
            ✅ Pago exitoso
        </div>
        {renderFormularioCliente(true)}
        {renderTablaProductos()}
        <div className="acciones-finales">
            <button className="btn-primary" onClick={() => alert("Imprimiendo Boleta...")}>
                <i className="bi bi-printer"></i> Imprimir boleta en PDF
            </button>
            <button className="btn-secondary" onClick={() => alert("Enviando Correo...")}>
                <i className="bi bi-envelope"></i> Enviar boleta por email
            </button>
        </div>
        <button className="btn-red btn-full-width" onClick={onClose} style={{marginTop: '20px'}}>Cerrar</button>
      </>
    );
    return renderVent("Confirmación de Compra", contenido, "pago-exitoso-modal");
  }

  return null; 
};
