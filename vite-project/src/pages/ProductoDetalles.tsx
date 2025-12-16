import React from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Producto } from '../components/Producto';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { productoService } from '../api/productoService';
import '../style/producto_detalles.css';

const ProductoDetalles: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const idNum = id ? Number(id) : undefined;
    const { addToCart } = useCart();
    const { products } = useProducts();
    const [producto, setProducto] = React.useState<Producto | undefined>(undefined);
    const [mainImage, setMainImage] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const loadProducto = async () => {
            if (!idNum) return;
            
            try {
                setLoading(true);
                setError(null);
                
                // Primero intentar obtener del contexto (productos ya cargados)
                const productoFromContext = products[idNum];
                if (productoFromContext) {
                    setProducto(productoFromContext);
                    setMainImage(productoFromContext.imagen);
                } else {
                    // Si no está en el contexto, obtener de la API
                    const response = await productoService.getById(idNum);
                    const productoData = response.data;
                    setProducto(productoData);
                    setMainImage(productoData.imagen);
                }
            } catch (error) {
                console.error('Error loading product:', error);
                setError('Error al cargar el producto');
            } finally {
                setLoading(false);
            }
        };

        loadProducto();
        window.scrollTo(0, 0);
    }, [id, idNum, products]);

    const handleAddToCart = async () => {
        if (producto) {

            console.log('🔍 [ProductoDetalles] Producto completo:', producto);
            console.log('🔍 [ProductoDetalles] ID del producto:', producto.id);
            console.log('🔍 [ProductoDetalles] Tipo de ID:', typeof producto.id);
            console.log('🔍 [ProductoDetalles] Precio:', producto.precio);
            console.log('🔍 [ProductoDetalles] Propiedades:', Object.keys(producto));

            try {
                await addToCart(producto);
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando producto...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    <h4>Error al cargar producto</h4>
                    <p>{error}</p>
                    <Link to="/productos" className="btn btn-primary">Volver a productos</Link>
                </div>
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning text-center">
                    <h4>Producto no encontrado</h4>
                    <Link to="/productos" className="btn btn-primary">Volver a productos</Link>
                </div>
            </div>
        );
    }

    const precioFinal = producto.oferta && (producto.descuento ?? 0) > 0
        ? Math.round(producto.precio - (producto.precio * (producto.descuento ?? 0) / 100))
        : producto.precio;

    const allProducts = Object.values(products);
    const relacionados = allProducts.filter((p: Producto) => p.categoria?.id === producto.categoria?.id && p.id !== producto.id).slice(0, 6);

    return (
        <div className="my-container">
            <div className="producto-detalle">
                <div className="imagen-principal">
                    <img id="mainImage" src={mainImage} alt={producto.nombre} />
                </div>
                <div className="info-detalle">
                    <h2>{producto.nombre}</h2>
                    <p className="descripcion">{producto.descripcion}</p>
                    {producto.oferta && (producto.descuento ?? 0) > 0 ? (
                        <div>
                            <p className="precio">
                                <span className="text-muted text-decoration-line-through">${producto.precio.toLocaleString()}</span><br />
                                <span className="fw-bold text-success">${precioFinal.toLocaleString()}</span>
                            </p>
                            <span className="badge bg-danger">-{producto.descuento}% OFF</span>
                        </div>
                    ) : (
                        <p className="precio">${producto.precio.toLocaleString()}</p>
                    )}
                    <button className="btn-agregar" onClick={handleAddToCart}>Agregar al Carrito</button>
                </div>
                <div className="miniaturas-barra">
                    <img className="miniatura" src={producto.imagen} alt="miniatura" onClick={() => setMainImage(producto.imagen)} />
                </div>
            </div>

            <div className="relacionados-container">
                <h3>Productos Relacionados</h3>
                <div className="relacionados-barra">
                    {relacionados.length > 0 ? (
                        relacionados.map((rel: Producto) => (
                            <div key={rel.id} className="relacionado">
                                <Link to={`/productos/${rel.id}`}>
                                    <img src={rel.imagen} alt={rel.nombre} />
                                    <p>{rel.nombre}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <h3 className="no-relacionado">No existen productos relacionados</h3>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductoDetalles;
