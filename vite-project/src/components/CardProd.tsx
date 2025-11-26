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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(producto);
    } catch (error) {
      console.error('Error in CardProd addToCart:', error);
    }
  };

  return (
    <Link to={`/productos/${producto.id}`} className={`card-product ${tieneOferta ? 'card-oferta' : ''}`} role="link">
      {tieneOferta && (
        <div className="oferta-badge">
          <span>🔥 OFERTA 🔥</span>
          <span className="descuento">-{producto.descuento}%</span>
        </div>
      )}
      
      <img src={producto.imagen} alt={producto.titulo} />

      <div className="card-content">
        <h3 className="card-titulo">{producto.titulo}</h3>

        {!tieneOferta ? (
          <p className="card-precio">${precioOriginal.toLocaleString()}</p>
        ) : (
          <div className="card-precio-oferta">
            <div className="precio-original">
              <span className="text-decoration-line-through">${precioOriginal.toLocaleString()}</span>
            </div>
            <div className="precio-final">
              <span className="precio-grande">${precioFinal.toLocaleString()}</span>
            </div>
            <div className="ahorro">
              <small>¡Ahorras ${(precioOriginal - precioFinal).toLocaleString()}!</small>
            </div>
          </div>
        )}

        <p className="card-desc">{producto.descripcion}</p>
      </div>

      <button className="btn-agregar" onClick={handleAddToCart}>
        <i className="bi bi-cart-plus" /> {tieneOferta ? '🛒 ¡Aprovecha la Oferta!' : 'Agregar al Carrito'}
      </button>
    </Link>
  );
};

export default CardProd;
