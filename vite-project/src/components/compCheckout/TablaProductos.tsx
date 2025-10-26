import React from "react";
import type { ProductoCheckout } from "../../pages/Compra";
import "../../style/checkout.css";

interface TablaProductosProps {
  productos: ProductoCheckout[];
}

export const TablaProductos: React.FC<TablaProductosProps> = ({ productos }) => {
  const total = productos.reduce((suma, p) => suma + p.precio * p.cantidad, 0);

  return (
    <div className="compra-table-container">
      <h4 style={{ marginTop: "20px", marginBottom: "10px", fontSize: "1.1em" }}>Resumen de Productos</h4>
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
          {productos.map((p) => (
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
            <td colSpan={4} style={{ textAlign: "right", fontWeight: "bold" }}>Total:</td>
            <td style={{ fontWeight: "bold" }}>${total.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
