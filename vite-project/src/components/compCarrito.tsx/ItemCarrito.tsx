import React from 'react';

interface ItemCarritoProps {
  item: any;
  calcularPrecioFinal: (item: any) => number;
  updateQuantity: (id: string, cantidad: number) => void;
  removeFromCart: (id: string) => void;
}

export const ItemCarrito: React.FC<ItemCarritoProps> = ({
  item, calcularPrecioFinal, updateQuantity, removeFromCart
}) => {
  const precioFinal = calcularPrecioFinal(item);
  const subtotalItem = precioFinal * item.cantidad;

  return (
    <div className="card mb-3">
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
              <input type="number" className="form-control form-control-sm text-center"
                     value={item.cantidad} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                     min={1} />
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
};
