import React from 'react';
import { Link } from 'react-router-dom';
import '../style/home.css';
import CardProd from '../components/CardProd';
import { useProducts } from '../context/ProductContext';
import type { Producto } from '../components/Producto';

const Home = () => {
  const { 
    products: productsMap, 
    featuredProducts, 
    loadFeaturedProducts,
    loading, 
    featuredLoading,
    error, 
    featuredError 
  } = useProducts();
  
  const productos = Object.values(productsMap);

  // Productos de ejemplo para mostrar cuando no hay datos de la API
  const productosEjemplo: Producto[] = [
    {
      id: 1001,
      titulo: "Smartphone Galaxy Pro",
      precio: 899000,
      descripcion: "Último modelo con cámara profesional y pantalla AMOLED",
      categoria: {
        id: 1,
        nombre: "Electrónicos",
        descripcion: "Dispositivos electrónicos",
        imagen: "/img/categoria-electronicos.jpg",
        activo: true
      },
      imagen: "/img/placeholder.webp",
      oferta: true,
      descuento: 15
    },
    {
      id: 1002,
      titulo: "Auriculares Inalámbricos Premium",
      precio: 299000,
      descripcion: "Audio de alta calidad con cancelación de ruido",
      categoria: {
        id: 2,
        nombre: "Audio",
        descripcion: "Dispositivos de audio",
        imagen: "/img/categoria-audio.jpg",
        activo: true
      },
      imagen: "/img/placeholder.webp",
      oferta: true,
      descuento: 25
    },
    {
      id: 1003,
      titulo: "Laptop Gaming Extreme",
      precio: 2499000,
      descripcion: "Potencia máxima para gaming y trabajo profesional",
      categoria: {
        id: 3,
        nombre: "Computadoras",
        descripcion: "Equipos de cómputo",
        imagen: "/img/categoria-computadoras.jpg",
        activo: true
      },
      imagen: "/img/placeholder.webp",
      oferta: true,
      descuento: 10
    },
    {
      id: 1004,
      titulo: "Smartwatch Deportivo",
      precio: 449000,
      descripcion: "Monitoreo completo de salud y fitness",
      categoria: {
        id: 4,
        nombre: "Wearables",
        descripcion: "Dispositivos vestibles",
        imagen: "/img/categoria-wearables.jpg",
        activo: true
      },
      imagen: "/img/placeholder.webp",
      oferta: true,
      descuento: 20
    }
  ];

  // Determinar qué productos mostrar
  let productosEnOferta: Producto[] = [];
  
  if (featuredProducts && featuredProducts.length > 0) {
    // Usar productos destacados de la API
    productosEnOferta = featuredProducts.slice(0, 4);
  } else if (productos.length > 0) {
    // Filtrar productos con oferta de todos los productos
    productosEnOferta = productos.filter(p => p.oferta && (p.descuento ?? 0) > 0).slice(0, 4);
  } else {
    // Usar productos de ejemplo
    productosEnOferta = productosEjemplo;
  }
  
  // Cargar productos destacados cuando se monta el componente
  React.useEffect(() => {
    if (productos.length > 0 && featuredProducts.length === 0 && !featuredLoading) {
      loadFeaturedProducts();
    }
  }, [productos, featuredProducts, featuredLoading, loadFeaturedProducts]);

  if (loading && productosEnOferta.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container-fluid px-0">
        <div id="my-carousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/img/slider1.jpg" className="d-block w-100" alt="Bienvenido a Level-Up" />
              <div className="carousel-caption d-none d-md-block">
                <h2>Bienvenido a Level-Up</h2>
                <p>Encuentra productos únicos y con estilo solo aqui.</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/img/slider2.jpg" className="d-block w-100" alt="Ofertas Exclusivas" />
              <div className="carousel-caption d-none d-md-block">
                <h2>Ofertas Exclusivas</h2>
                <p>Descubre promociones y descuentos especiales cada semana.</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/img/slider3.jpg" className="d-block w-100" alt="Productos de Calidad" />
              <div className="carousel-caption d-none d-md-block">
                <h2>Productos Destacados</h2>
                <p>Lo mejor en gadgets, accesorios y mucho más.</p>
              </div>
            </div>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#my-carousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#my-carousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>

          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#my-carousel"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button type="button" data-bs-target="#my-carousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#my-carousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
        </div>
      </div>

      <div className="ofertas-section">
        <div className="text-center my-5">
          <h3 className="titulo-ofertas">
            🔥 Ofertas Especiales 🔥
          </h3>
          <p className="text-muted">
            Descubre nuestras mejores promociones y descuentos exclusivos
          </p>
          {featuredLoading && (
            <div className="d-flex justify-content-center mt-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Cargando ofertas...</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="container-products">
        {productosEnOferta.length > 0 ? (
          productosEnOferta.map((producto) => (
            <CardProd key={producto.id} producto={producto} />
          ))
        ) : (
          <div className="text-center w-100">
            <div className="alert alert-info mx-auto" style={{ maxWidth: '500px' }}>
              <h5>📦 ¡Próximamente nuevas ofertas!</h5>
              <p className="mb-0">
                Estamos preparando increíbles descuentos para ti. 
                <br />Revisa nuestro catálogo completo mientras tanto.
              </p>
            </div>
          </div>
        )}
        
        {(error || featuredError) && (
          <div className="text-center w-100">
            <div className="alert alert-warning mx-auto" style={{ maxWidth: '500px' }}>
              <h6>⚠️ Problemas de conexión</h6>
              <p className="mb-2">Mostrando productos de ejemplo</p>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={() => window.location.reload()}
              >
                🔄 Reintentar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center my-5">
        <Link to="/productos" className="btn btn-primary btn-lg">
          Ver Todos los Productos
        </Link>
      </div>
    </div>
  );
};

export default Home;
