import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { productos } from '../components/ProductoData';
import type { Producto } from '../components/Producto';
import { useCart } from '../context/CartContext';
import '../style/producto_detalles.css';

const ProductoDetalles: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const [producto, setProducto] = React.useState<Producto | undefined>(productos.find((p: Producto) => p.id === id));
    const [mainImage, setMainImage] = React.useState(producto?.imagen);

    React.useEffect(() => {
        const nuevoProducto = productos.find((p: Producto) => p.id === id);
        setProducto(nuevoProducto);
        setMainImage(nuevoProducto?.imagen);
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        if (producto) {
            addToCart(producto);
        }
    };

    if (!producto) {
        return <h2>Producto no encontrado</h2>;
    }

    const precioFinal = producto.oferta && (producto.descuento ?? 0) > 0
        ? Math.round(producto.precio - (producto.precio * (producto.descuento ?? 0) / 100))
        : producto.precio;

    const relacionados = productos.filter((p: Producto) => p.categoria === producto.categoria && p.id !== producto.id).slice(0, 6);

    return (
        <div className="container my-5">
            <div className="producto-detalle">
                <div className="imagen-principal">
                    <img id="mainImage" src={mainImage} alt={producto.titulo} width="400" />
                    <div className="miniaturas-barra">
                        <img className="miniatura" src={producto.imagen} alt="miniatura" onClick={() => setMainImage(producto.imagen)} />
                        {/* Asumiendo que hay más imágenes en el futuro */}
                    </div>
                </div>
                <div className="info-detalle">
                    <h2>{producto.titulo}</h2>
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
            </div>

            <div className="relacionados-container mt-5">
                <h3>Productos Relacionados</h3>
                <div className="relacionados-barra">
                    {relacionados.length > 0 ? (
                        relacionados.map((rel: Producto) => (
                            <div key={rel.id} className="relacionado">
                                <Link to={`/productos/${rel.id}`}>
                                    <img src={rel.imagen} alt={rel.titulo} />
                                    <p>{rel.titulo}</p>
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
