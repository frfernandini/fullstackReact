import React from 'react';

interface ItemCarritoProps {
  item: any;
  calcularPrecioFinal: (item: any) => number;
  updateQuantity: (id: number, cantidad: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
}


export const ItemCarrito: React.FC<ItemCarritoProps> = ({
  item, calcularPrecioFinal, updateQuantity, removeFromCart
}) => {
  const precioFinal = calcularPrecioFinal(item);
  const subtotalItem = precioFinal * item.cantidad;

  const handleUpdateQuantity = async (newQuantity: number) => {
    try {
      // Validar que la cantidad sea un número válido
      if (isNaN(newQuantity) || newQuantity < 0) {
        console.warn('Cantidad inválida:', newQuantity);
        return;
      }
      
      // Limitar cantidad máxima
      const validQuantity = Math.min(newQuantity, 99);
      await updateQuantity(item.id, validQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error al actualizar la cantidad del producto');
    }
  };

  const handleRemove = async () => {
    const nombreProducto = item.titulo || item.nombre || 'este producto';
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${nombreProducto}" del carrito?`)) {
      try {
        await removeFromCart(item.id);
      } catch (error) {
        console.error('Error removing item:', error);
        alert('Error al eliminar el producto del carrito');
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value, 10);
    
    // Si el campo está vacío, no hacer nada
    if (value === '') return;
    
    // Solo actualizar si es un número válido
    if (!isNaN(numValue) && numValue >= 0) {
      handleUpdateQuantity(numValue);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-2">
            <img src={item.imagen} alt={item.titulo || item.nombre || 'Producto'} className="img-fluid rounded" />
          </div>
          <div className="col-md-3">
            <h6 className="card-title">{item.titulo || item.nombre || 'Producto sin nombre'}</h6>
            <p className="card-text text-muted">{item.categoria?.nombre ?? ''}</p>
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
              <button 
                className="btn btn-outline-secondary btn-sm" 
                onClick={() => handleUpdateQuantity(Math.max(0, item.cantidad - 1))}
                disabled={item.cantidad <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                className="form-control form-control-sm text-center"
                value={item.cantidad} 
                onChange={handleInputChange}
                min={1}
                max={99}
                onBlur={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (isNaN(value) || value < 1) {
                    handleUpdateQuantity(1);
                  }
                }}
              />
              <button 
                className="btn btn-outline-secondary btn-sm" 
                onClick={() => handleUpdateQuantity(Math.min(99, item.cantidad + 1))}
                disabled={item.cantidad >= 99}
              >
                +
              </button>
            </div>
          </div>
          <div className="col-md-2 text-end">
            <p className="mb-0"><strong>${subtotalItem.toLocaleString()}</strong></p>
            <button className="btn btn-danger btn-sm" onClick={handleRemove}>
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
