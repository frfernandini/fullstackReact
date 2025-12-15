
import React, { useState, useEffect } from 'react';
import { pedidoService } from '../api/pedidoService';
import type { Pedido, EstadoPedido as EstadoPedidoType } from '../components/Pedido';
import { EstadoPedido } from '../components/Pedido';
import '../style/admin_pedido.css'

const AdminPedidos: React.FC = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await pedidoService.getAllPedidos();
            setPedidos(data.sort((a, b) => b.id - a.id)); // Ordenar por más reciente
        } catch (err: any) {
            console.error('Error al cargar pedidos:', err);
            setError(err.response?.data?.message || 'Error al cargar los pedidos');
        } finally {
            setLoading(false);
        }
    };

    const handleCambiarEstado = async (pedidoId: number, nuevoEstado: EstadoPedidoType) => {
        if (!window.confirm(`¿Cambiar el estado del pedido #${pedidoId} a ${nuevoEstado}?`)) {
            return;
        }

        try {
            await pedidoService.updateEstadoPedido(pedidoId, nuevoEstado);
            alert(`Estado del pedido #${pedidoId} actualizado a ${nuevoEstado}`);
            fetchPedidos(); // Recargar la lista
        } catch (err: any) {
            console.error('Error al actualizar estado:', err);
            alert(err.response?.data?.message || 'Error al actualizar el estado del pedido');
        }
    };

    const getEstadoClass = (estado: EstadoPedidoType): string => {
        const classes: Record<EstadoPedidoType, string> = {
            [EstadoPedido.PENDIENTE]: 'badge-pendiente',
            [EstadoPedido.PROCESANDO]: 'badge-procesando',
            [EstadoPedido.ENVIADO]: 'badge-enviado',
            [EstadoPedido.ENTREGADO]: 'badge-entregado',
            [EstadoPedido.CANCELADO]: 'badge-cancelado'
        };
        return classes[estado] || '';
    };

    const pedidosFiltrados = filtroEstado === 'TODOS' 
        ? pedidos 
        : pedidos.filter(p => p.estado === filtroEstado);

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando pedidos...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    <h4>Error</h4>
                    <p>{error}</p>
                    <button onClick={fetchPedidos} className="btn btn-primary">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-pedidos-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Pedidos</h2>
                <button onClick={fetchPedidos} className="btn btn-info">
                    <i className="bi bi-arrow-clockwise"></i> Recargar
                </button>
            </div>

            {/* Filtros */}
            <div className="mb-4">
                <div className="btn-group" role="group">
                    <button 
                        className={`btn ${filtroEstado === 'TODOS' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFiltroEstado('TODOS')}
                    >
                        Todos ({pedidos.length})
                    </button>
                    {Object.values(EstadoPedido).map(estado => (
                        <button 
                            key={estado}
                            className={`btn ${filtroEstado === estado ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFiltroEstado(estado)}
                        >
                            {estado} ({pedidos.filter(p => p.estado === estado).length})
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabla de pedidos */}
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Productos</th>
                            <th>Dirección</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center text-muted">
                                    No hay pedidos {filtroEstado !== 'TODOS' && `con estado ${filtroEstado}`}
                                </td>
                            </tr>
                        ) : (
                            pedidosFiltrados.map(pedido => (
                                <tr key={pedido.id}>
                                    <td><strong>#{pedido.id}</strong></td>
                                    <td>
                                        {pedido.usuario.nombre} {pedido.usuario.apellido}
                                        <br />
                                        <small className="text-muted">{pedido.usuario.email}</small>
                                    </td>
                                    <td>
                                        {new Date(pedido.fechaCreacion).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td>
                                        <strong className="text-success">
                                            ${pedido.total.toLocaleString()}
                                        </strong>
                                    </td>
                                    <td>
                                        <span className={`badge ${getEstadoClass(pedido.estado)}`}>
                                            {pedido.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-info"
                                            data-bs-toggle="modal"
                                            data-bs-target={`#modal-productos-${pedido.id}`}
                                        >
                                            Ver ({pedido.detalles.length})
                                        </button>
                                        
                                        {/* Modal con detalles de productos */}
                                        <div className="modal fade" id={`modal-productos-${pedido.id}`} tabIndex={-1}>
                                            <div className="modal-dialog modal-lg">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Productos del Pedido #{pedido.id}</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <table className="table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Producto</th>
                                                                    <th>Precio Unit.</th>
                                                                    <th>Cantidad</th>
                                                                    <th>Subtotal</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {pedido.detalles.map(detalle => (
                                                                    <tr key={detalle.id}>
                                                                        <td>
                                                                            <img 
                                                                                src={detalle.producto.imagen} 
                                                                                alt={detalle.producto.nombre}
                                                                                style={{ width: '50px', marginRight: '10px' }}
                                                                            />
                                                                            {detalle.producto.nombre}
                                                                        </td>
                                                                        <td>${detalle.precioUnitario.toLocaleString()}</td>
                                                                        <td>{detalle.cantidad}</td>
                                                                        <td><strong>${detalle.subtotal.toLocaleString()}</strong></td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <small>{pedido.direccionEnvio}</small>
                                        {pedido.notas && (
                                            <>
                                                <br />
                                                <small className="text-muted">📝 {pedido.notas}</small>
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        <select 
                                            className="form-select form-select-sm"
                                            value={pedido.estado}
                                            onChange={(e) => handleCambiarEstado(pedido.id, e.target.value as EstadoPedidoType)}
                                        >
                                            {Object.values(EstadoPedido).map(estado => (
                                                <option key={estado} value={estado}>
                                                    {estado}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Resumen */}
            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Total Pedidos</h5>
                            <p className="display-4">{pedidos.length}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Ingresos Totales</h5>
                            <p className="display-6 text-success">
                                ${pedidos.reduce((sum, p) => sum + p.total, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Pendientes</h5>
                            <p className="display-4 text-warning">
                                {pedidos.filter(p => p.estado === EstadoPedido.PENDIENTE).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Entregados</h5>
                            <p className="display-4 text-success">
                                {pedidos.filter(p => p.estado === EstadoPedido.ENTREGADO).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPedidos;