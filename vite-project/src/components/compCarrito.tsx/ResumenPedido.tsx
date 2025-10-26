import React from 'react';

interface ResumenPedidoProps {
  subtotal: number;
  abrirCheckout: () => void;
}

export const ResumenPedido: React.FC<ResumenPedidoProps> = ({ subtotal, abrirCheckout }) => (
  <div className="order-summary sticky-top">
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Resumen del Pedido</h4>
        <hr />
        <div className="d-flex justify-content-between mb-3">
          <span>Subtotal:</span>
          <span id="subtotal-price">$ {subtotal.toLocaleString()}</span>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <span>Envío:</span>
          <span className="text-success">Gratis</span>
        </div>
        <hr />
        <div className="d-flex justify-content-between mb-3">
          <h5>Total:</h5>
          <h5 className="total-price" id="total-price" style={{ color: 'rgb(4, 129, 20)' }}>
            $ {subtotal.toLocaleString()}
          </h5>
        </div>
        <button className="btn btn-success w-100 py-2" onClick={abrirCheckout}>
          <i className="bi bi-credit-card"></i> PAGAR
        </button>
        <p className="text-muted text-center mt-2 small">
          <i className="bi bi-shield-check"></i> Pago 100% seguro
        </p>
      </div>
    </div>
  </div>
);
