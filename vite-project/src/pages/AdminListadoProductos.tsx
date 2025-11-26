// src/pages/AdminListadoProductos.tsx
import React from 'react';
import { useProducts } from '../context/ProductContext';
import '../style/admin_listado_producto.css';

const AdminListadoProductos: React.FC = () => {
    const { products, removeProduct, clearProducts, loading, error } = useProducts();
    
    // Función helper para obtener el título del producto de manera robusta
    const getProductTitle = (producto: any) => {
        return producto?.titulo || producto?.nombre || producto?.title || producto?.name || 'Sin título';
    };
    
    // Función helper para obtener el precio del producto
    const getProductPrice = (producto: any) => {
        const precio = producto?.precio || producto?.price || 0;
        return precio;
    };
    
    // Función helper para obtener la categoría del producto
    const getProductCategory = (producto: any) => {
        if (typeof producto?.categoria === 'object') {
            return producto.categoria?.nombre || producto.categoria?.name || 'Sin categoría';
        }
        return producto?.categoria || 'Sin categoría';
    };

    const handleRemoveProduct = async (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                await removeProduct(id);
                alert('Producto eliminado correctamente');
            } catch (error) {
                alert('Error al eliminar el producto');
                console.error('Error removing product:', error);
            }
        }
    };

    const handleClearAllProducts = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar TODOS los productos? Esta acción no se puede deshacer.')) {
            clearProducts();
            alert('Todos los productos han sido eliminados');
        }
    };

    const productArray = Object.values(products);
    
    // Productos de prueba en caso de que no haya datos de la API
    const testProducts = [
        { 
            id: 1, 
            titulo: 'Producto de Prueba 1', 
            precio: 25000, 
            categoria: { nombre: 'Electrónicos' },
            descripcion: 'Descripción de prueba',
            imagen: '/placeholder.jpg',
            oferta: false
        },
        { 
            id: 2, 
            titulo: 'Producto de Prueba 2', 
            precio: 35000, 
            categoria: { nombre: 'Ropa' },
            descripcion: 'Descripción de prueba 2',
            imagen: '/placeholder.jpg',
            oferta: true,
            descuento: 10
        }
    ];
    
    // Si no hay productos de la API pero tampoco hay error, usar productos de prueba
    const displayProducts = productArray.length > 0 ? productArray : (!loading && !error ? testProducts : []);

    // Debug: Log para verificar datos (remover en producción)
    React.useEffect(() => {
        if (displayProducts.length > 0) {

        }
    }, [displayProducts]);

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando productos...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    <h4>Error al cargar productos</h4>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Listado de Productos</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-2">
                    <button onClick={() => window.location.reload()} className="btn btn-info btn-sm">
                        🔄 Recargar
                    </button>
                </div>
                <button onClick={handleClearAllProducts} className="btn btn-danger">
                    Limpiar Todos los Productos
                </button>
            </div>
            <div className="table-container">
                <div className="table-responsive table-scrollable">
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
                        {displayProducts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-muted">
                                    <div>
                                        <p>No hay productos registrados</p>
                                        {!loading && !error && (
                                            <small className="text-muted">
                                                Mostrando productos de ejemplo para testing.
                                            </small>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            displayProducts.map((producto) => (
                                <tr key={producto.id || Math.random()}>
                                    <td><strong>{producto.id || 'N/A'}</strong></td>
                                    <td>
                                        <div title={getProductTitle(producto)}>
                                            {getProductTitle(producto)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge bg-secondary">
                                            {getProductCategory(producto)}
                                        </span>
                                    </td>
                                    <td>
                                        <strong>
                                            ${getProductPrice(producto) > 0 ? getProductPrice(producto).toLocaleString() : 'N/A'}
                                        </strong>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-danger" 
                                            onClick={() => handleRemoveProduct(producto.id)}
                                            disabled={!producto.id}
                                        >
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
        </div>
    );
};

export default AdminListadoProductos;