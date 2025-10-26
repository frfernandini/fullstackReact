import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Compra } from '../pages/Compra';
import '../style/carrito.css';

const Carrito: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const [mostrarCheckout, setMostrarCheckout] = useState(false);

    const calcularPrecioFinal = (item: any) => {
        const tieneOferta = item.oferta && (item.descuento ?? 0) > 0;
        return tieneOferta
            ? Math.round(item.precio - (item.precio * (item.descuento ?? 0) / 100))
            : item.precio;
    };

    const subtotal = cartItems.reduce((total, item) => total + calcularPrecioFinal(item) * item.cantidad, 0);

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
                            cartItems.map(item => {
                                const precioFinal = calcularPrecioFinal(item);
                                const subtotalItem = precioFinal * item.cantidad;

                                return (
                                    <div key={item.id} className="card mb-3">
                                        <div className="card-body">
                                            <div className="row align-items-center">
                                                <div className="col-md-2">
                                                    <img src={item.imagen} alt={item.titulo} className="img-fluid rounded" />
                                                </div>
                                                <div className="col-md-3">
                                                    <h6 className="card-title">{item.titulo}</h6>
                                                    <p className="card-text text-muted">{item.categoria}</p>
                                                    {item.oferta && <span className="badge bg-success">-{item.descuento}% OFF</span>}
                                                </div>
                                                <div className="col-md-2">
                                                    <p className="mb-0">
                                                        {item.oferta ? (
                                                            <>
                                                                <span className="text-decoration-line-through text-muted">${item.precio.toLocaleString()}</span><br />
                                                                <strong>${precioFinal.toLocaleString()}</strong>
                                                            </>
                                                        ) : (
                                                            <strong>${precioFinal.toLocaleString()}</strong>
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="input-group">
                                                        <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.id, item.cantidad - 1)}>-</button>
                                                        <input type="number" className="form-control form-control-sm text-center" value={item.cantidad}
                                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} min="1" />
                                                        <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.id, item.cantidad + 1)}>+</button>
                                                    </div>
                                                </div>
                                                <div className="col-md-2 text-end">
                                                    <p className="mb-0"><strong>${subtotalItem.toLocaleString()}</strong></p>
                                                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="col-md-4">
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
                </div>
            </div>

            {/* Ventana de Checkout */}
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
                    clearCart={clearCart} // Para vaciar el carrito al finalizar
                />
            )}
        </main>
    );
};

export default Carrito;

