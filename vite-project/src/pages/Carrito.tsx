import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Compra } from './Compra';
import { ItemCarrito } from '../components/compCarrito.tsx/ItemCarrito';
import { ResumenPedido } from '../components/compCarrito.tsx/ResumenPedido';
import '../style/carrito.css';

export const Carrito: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [mostrarCheckout, setMostrarCheckout] = useState(false);

  const calcularPrecioFinal = (item: any) => {
    const tieneOferta = item.oferta && (item.descuento ?? 0) > 0;
    return tieneOferta
      ? Math.round(item.precio - (item.precio * (item.descuento ?? 0) / 100))
      : item.precio;
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + calcularPrecioFinal(item) * item.cantidad,
    0
  );

  const abrirCheckout = () => {
    if (cartItems.length === 0) {
      alert("Tu carrito está vacío. Agrega algunos productos antes de proceder al pago.");
      return;
    }
    setMostrarCheckout(true);
  };

  const cerrarCheckout = () => setMostrarCheckout(false);

  return (
    <main className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mi carrito de compras</h1>
        <div>
          <Link to="/productos" className="btn btn-outline-secondary me-2">
            <i className="bi bi-arrow-left"></i> Seguir Comprando
          </Link>
          <button className="btn btn-outline-danger" onClick={clearCart}>
            <i className="bi bi-trash"></i> Vaciar Carrito
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div id="cart-items">
            {cartItems.length === 0 ? (
              <div className="text-center p-4">
                <i className="bi bi-cart-x" style={{ fontSize: '3rem', color: '#ffffff' }}></i>
                <h5 className="mt-3 text-muted">Tu carrito está vacío</h5>
                <p className="text-muted">¡Agrega algunos productos increíbles!</p>
                <Link to="/productos" className="btn btn-primary">Ver Productos</Link>
              </div>
            ) : (
              cartItems.map(item => (
                <ItemCarrito
                  key={item.id}
                  item={item}
                  calcularPrecioFinal={calcularPrecioFinal}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))
            )}
          </div>
        </div>

        <div className="col-md-4">
          <ResumenPedido subtotal={subtotal} abrirCheckout={abrirCheckout} />
        </div>
      </div>

      {mostrarCheckout && (
        <Compra
          productos={cartItems.map(item => ({
            id: parseInt(item.id.replace(/\D/g, "")) || 0,
            imagen: item.imagen,
            nombre: item.titulo,
            precio: calcularPrecioFinal(item),
            cantidad: item.cantidad
          }))}
          onClose={cerrarCheckout}
          clearCart={clearCart}
        />
      )}
    </main>
  );
};

export default Carrito;