import { Link } from 'react-router-dom';
import '../style/home.css';
import CardProd from '../components/CardProd';
import { useProducts } from '../context/ProductContext';

const Home = () => {
  const { products: productsMap } = useProducts();
  const productos = Object.values(productsMap);

  // Get products with offers
  const productosEnOferta = productos.filter(p => p.oferta).slice(0, 4); // Show up to 4 products

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

      <div className="text-center my-5">
        <h3 className="titulo-ofertas">
          Ofertas Recientes
        </h3>
      </div>
      <div className="container-products">
        {productosEnOferta.length > 0 ? (
          productosEnOferta.map((producto) => (
            <CardProd key={producto.id} producto={producto} />
          ))
        ) : (
          <p className="text-center w-100">No hay ofertas disponibles en este momento.</p>
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
