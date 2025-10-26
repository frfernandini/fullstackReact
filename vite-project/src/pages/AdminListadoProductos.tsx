// src/pages/AdminListadoProductos.tsx
import React from 'react';
import { useProducts } from '../context/ProductContext';
import '../style/admin_listado_producto.css';

const AdminListadoProductos: React.FC = () => {
    const { products, removeProduct, clearProducts } = useProducts();

    const handleRemoveProduct = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            removeProduct(id);
            alert('Producto eliminado correctamente');
        }
    };

    const handleClearAllProducts = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar TODOS los productos? Esta acción no se puede deshacer.')) {
            clearProducts();
            alert('Todos los productos han sido eliminados');
        }
    };

    const productArray = Object.values(products);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Listado de Productos</h2>
            <div className="d-flex justify-content-end mb-3">
                <button onClick={handleClearAllProducts} className="btn btn-danger">
                    Limpiar Todos los Productos
                </button>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-hover" id="tabla-productos">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productArray.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-muted">
                                    No hay productos registrados
                                </td>
                            </tr>
                        ) : (
                            productArray.map((producto) => (
                                <tr key={producto.id}>
                                    <td><strong>{producto.id}</strong></td>
                                    <td>{producto.titulo}</td>
                                    <td><span className="badge bg-secondary">{producto.categoria}</span></td>
                                    <td><strong>${producto.precio.toLocaleString()}</strong></td>
                                    <td>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleRemoveProduct(producto.id)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminListadoProductos;