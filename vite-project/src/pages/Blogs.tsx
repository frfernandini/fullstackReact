import { Link } from 'react-router-dom';
import '../style/blogs.css';

const Blogs = () => {
  return (
    <div>
      <section className="blogs-hero">
        <div className="container">
          <h1 className="hero-title">
            Noticias <span className="text-gradient">Gaming</span>
          </h1>
          <p className="hero-subtitle">
            Mantente al día con las últimas novedades, lanzamientos y noticias más importantes del mundo gaming
          </p>
        </div>
      </section>

      <section className="blogs-section">
        <div className="container">
          <div className="news-grid">
            <article className="news-card featured">
              <div className="row g-0">
                <div className="col-md-6">
                  <div className="news-content">
                    <div className="news-category">noticia</div>
                    <h2>Hollow Knight: Silksong finalmente disponible tras 7 años de espera</h2>
                    <p>
                      La esperadísima secuela desarrollada por Team Cherry ha llegado finalmente, colapsando las tiendas
                      digitales por la alta demanda. Los servidores de Steam, Xbox, Nintendo y PlayStation
                      experimentaron problemas debido al masivo número de descargas simultáneas.
                    </p>
                    <Link to="#" className="btn-news">
                      <i className="bi bi-eye"></i> Leer Más
                    </Link>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="news-image-container">
                    <img src="/img/silksong.jpg" alt="Hollow Knight Silksong" className="news-image" />
                    <div className="image-overlay"></div>
                  </div>
                </div>
              </div>
            </article>

            <article className="news-card featured">
              <div className="row g-0">
                <div className="col-md-6">
                  <div className="news-content">
                    <div className="news-category">Filtración</div>
                    <h2>GTA 6: Rockstar registra dominios que parodian WhatsApp y Uber</h2>
                    <p>
                      Un insider revela varios dominios registrados por Take-Two que apuntan a webs ficticias de GTA 6,
                      incluyendo parodias de aplicaciones populares como Uber, WhatsApp y OnlyFans, además de
                      referencias al estado de Leonida.
                    </p>
                    <Link to="#" className="btn-news">
                      <i className="bi bi-eye"></i> Leer Más
                    </Link>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="news-image-container">
                    <img src="/img/gta6.webp" alt="GTA 6" className="news-image" />
                    <div className="image-overlay"></div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
