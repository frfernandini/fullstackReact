import React from 'react';
import { Link } from 'react-router-dom';
import type { Producto } from './Producto';
import { useCart } from '../context/CartContext';

type CardProdProps = {
  producto: Producto;
};

export const CardProd: React.FC<CardProdProps> = ({ producto }) => {
  const { addToCart } = useCart();
  const tieneOferta = producto.oferta && (producto.descuento ?? 0) > 0;

  const precioOriginal = producto.precio;
  const precioFinal = tieneOferta
    ? Math.round(precioOriginal - (precioOriginal * (producto.descuento ?? 0) / 100))
    : precioOriginal;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(producto);
  };

  return (
    <Link to={`/productos/${producto.id}`} className="card-product" role="link">
      <img src={producto.imagen} alt={producto.titulo} />

      <div className="card-content">
        <h3 className="card-titulo">{producto.titulo}</h3>

        {!tieneOferta ? (
          <p className="card-precio">${precioOriginal.toLocaleString()}</p>
        ) : (
          <div className="card-precio">
            <p>
              <span className="text-muted text-decoration-line-through">${precioOriginal.toLocaleString()}</span>
              <br />
              <span className="fw-bold text-success">${precioFinal.toLocaleString()}</span>
            </p>
            <span className="badge bg-danger">-{producto.descuento}% OFF</span>
          </div>
        )}

        <p className="card-desc">{producto.descripcion}</p>
      </div>

      <button className="btn-agregar" onClick={handleAddToCart}>
        <i className="bi bi-cart-plus" /> Agregar al Carrito
      </button>
    </Link>
  );
};

export default CardProd;
