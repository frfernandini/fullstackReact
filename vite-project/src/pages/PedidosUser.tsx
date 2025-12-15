import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import { pedidoService } from '../api/pedidoService';
import type { Pedido, EstadoPedido as EstadoPedidoType } from '../components/Pedido';
import { EstadoPedido } from '../components/Pedido';
import '../style/pedidos_user.css';

export default function PedidosUser() {
  const { currentUser } = useUsers();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchPedidos();
  }, [currentUser, navigate]);

  const fetchPedidos = async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      const data = await pedidoService.getPedidosByUsuario(currentUser.id);
      setPedidos(data);
    } catch (err: any) {
      console.error('Error al cargar pedidos:', err);
      
      let errorMessage = 'Error al cargar tus pedidos';
      
      if (err.response?.status === 401) {
        errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente';
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 404) {
        errorMessage = 'No se encontraron pedidos';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoClass = (estado: EstadoPedidoType): string => {
    const classes: Record<EstadoPedidoType, string> = {
      [EstadoPedido.PENDIENTE]: 'estado-pendiente',
      [EstadoPedido.PROCESANDO]: 'estado-procesando',
      [EstadoPedido.ENVIADO]: 'estado-enviado',
      [EstadoPedido.ENTREGADO]: 'estado-entregado',
      [EstadoPedido.CANCELADO]: 'estado-cancelado'
    };
    return classes[estado] || '';
  };

  const getEstadoTexto = (estado: EstadoPedidoType): string => {
    const textos: Record<EstadoPedidoType, string> = {
      [EstadoPedido.PENDIENTE]: 'Pendiente',
      [EstadoPedido.PROCESANDO]: 'Procesando',
      [EstadoPedido.ENVIADO]: 'Enviado',
      [EstadoPedido.ENTREGADO]: 'Entregado',
      [EstadoPedido.CANCELADO]: 'Cancelado'
    };
    return textos[estado] || estado;
  };

  const formatFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="pedidos-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pedidos-container">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h2>Error al cargar pedidos</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/productos')} className="btn-primary">
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pedidos-container">
      <div className="pedidos-header">
        <h1>Mis Pedidos</h1>
        <p className="subtitle">Consulta el estado de tus compras realizadas</p>
      </div>

      {pedidos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No tienes pedidos realizados</h2>
          <p>Explora nuestros productos y realiza tu primera compra</p>
          <button onClick={() => navigate('/productos')} className="btn-primary">
            Ver Productos
          </button>
        </div>
      ) : (
        <div className="pedidos-grid">
          {pedidos.map(pedido => (
            <div key={pedido.id} className="pedido-card">
              <div className="card-header">
                <div className="pedido-info">
                  <span className="pedido-label">Pedido</span>
                  <span className="pedido-number">#{pedido.id}</span>
                </div>
                <span className={`estado-badge ${getEstadoClass(pedido.estado)}`}>
                  {getEstadoTexto(pedido.estado)}
                </span>
              </div>

              <div className="card-fecha">
                <span className="icon">📅</span>
                <span>{formatFecha(pedido.fechaCreacion)}</span>
              </div>

              {/*<div className="card-productos">
                <h4>Productos ({pedido.detalles.length})</h4>
                <div className="productos-lista">
                  {pedido.detalles.map(detalle => (
                    <div key={detalle.id} className="producto-item">
                      <img 
                        src={detalle.producto.imagen} 
                        alt={detalle.producto.titulo}
                        onError={(e) => {
                          e.currentTarget.src = '/img/placeholder.png';
                        }}
                      />
                      <div className="producto-detalle">
                        <p className="producto-nombre">{detalle.producto.titulo}</p>
                        <p className="producto-cantidad">Cantidad: {detalle.cantidad}</p>
                      </div>
                      <div className="producto-precio">
                        ${detalle.subtotal.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>*/}

              <div className="card-productos">
                <h4>Productos ({pedido.detalles.length})</h4>
                <div className="productos-lista">
                  {pedido.detalles.map(detalle => {
                    console.log('Detalle producto:', detalle.producto); // Debug
                    return (
                      <div key={detalle.id} className="producto-item">
                        <img 
                          src={detalle.producto.imagen} 
                          alt={detalle.producto.nombre}
                          onError={(e) => {
                            e.currentTarget.src = '/img/placeholder.png';
                          }}
                        />
                        <div className="producto-detalle">
                          <p className="producto-nombre">
                            {detalle.producto.nombre}
                          </p>
                          <p className="producto-cantidad">Cantidad: {detalle.cantidad}</p>
                        </div>
                        <div className="producto-precio">
                          ${detalle.subtotal.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>


              <div className="card-direccion">
                <span className="icon">📍</span>
                <div>
                  <p className="label">Dirección de envío</p>
                  <p className="texto">{pedido.direccionEnvio}</p>
                </div>
              </div>

              {pedido.notas && pedido.notas.trim() !== '' && (
                <div className="card-notas">
                  <span className="icon">📝</span>
                  <div>
                    <p className="label">Notas del pedido</p>
                    <p className="texto">{pedido.notas}</p>
                  </div>
                </div>
              )}

              <div className="card-footer">
                <span className="total-label">Total</span>
                <span className="total-value">${pedido.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}