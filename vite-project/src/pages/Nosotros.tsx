import { Link } from 'react-router-dom';
import '../style/nosotros.css';

const Nosotros = () => {
  return (
    <div>
      <section className="about-hero">
        <div className="container">
          <h1 className="hero-title">
            Conoce a <span className="text-gradient">Level Up Gamer</span>
          </h1>
          <p className="hero-subtitle">
            Somos más que una tienda gaming. Somos una comunidad apasionada por llevar tu experiencia de juego al
            siguiente nivel con los mejores productos y el servicio más profesional del mercado.
          </p>
          <div className="stats-container">
            <div className="stat-card">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Gamers Satisfechos</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">500+</span>
              <span className="stat-label">Productos Gaming</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">5</span>
              <span className="stat-label">Años de Experiencia</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Soporte Técnico</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <p className="section-subtitle">
            Nos diferenciamos por nuestro compromiso con la calidad, la innovación y la satisfacción del cliente. Cada
            producto que ofrecemos ha sido cuidadosamente seleccionado para brindarte la mejor experiencia gaming.
          </p>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <h3 className="feature-title">Productos Garantizados</h3>
              <p className="feature-description">
                Todos nuestros productos cuentan con garantía oficial y soporte técnico especializado. Tu inversión está
                protegida con nosotros.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-lightning-charge"></i>
              </div>
              <h3 className="feature-title">Tecnología de Vanguardia</h3>
              <p className="feature-description">
                Ofrecemos los productos más innovadores del mercado gaming, desde las últimas GPUs hasta periféricos de
                última generación.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <h3 className="feature-title">Comunidad Gamer</h3>
              <p className="feature-description">
                Más que clientes, formas parte de nuestra familia gamer. Participa en eventos, torneos y recibe
                consejos de expertos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Nuestros Valores</h2>
          <p className="section-subtitle">
            Los principios que guían cada decisión y nos mantienen como líderes en el mercado gaming.
          </p>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">
                <i className="bi bi-star-fill"></i>
              </div>
              <h3 className="value-title">Excelencia</h3>
              <p className="value-description">
                Buscamos la perfección en cada producto y servicio que ofrecemos, sin comprometer la calidad.
              </p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <i className="bi bi-heart-fill"></i>
              </div>
              <h3 className="value-title">Pasión por el Gaming</h3>
              <p className="value-description">
                Somos gamers auténticos que entienden las necesidades reales de la comunidad.
              </p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <i className="bi bi-arrow-up-circle"></i>
              </div>
              <h3 className="value-title">Innovación</h3>
              <p className="value-description">
                Siempre a la vanguardia de las últimas tendencias y tecnologías del mundo gaming.
              </p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <i className="bi bi-handshake"></i>
              </div>
              <h3 className="value-title">Confianza</h3>
              <p className="value-description">
                Construimos relaciones duraderas basadas en la transparencia y el servicio excepcional.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Nuestro Equipo</h2>
          <p className="section-subtitle">
            Profesionales apasionados por el gaming que trabajan día a día para brindarte la mejor experiencia.
          </p>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">¿Listo para Level Up?</h2>
          <p className="cta-description">
            Únete a miles de gamers que ya confiaron en nosotros para mejorar su setup gaming.
          </p>
          <Link to="/productos" className="btn-cta">
            <i className="bi bi-controller me-2"></i>
            Ver Productos
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Nosotros;
