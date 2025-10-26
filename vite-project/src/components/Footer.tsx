import { Link } from 'react-router-dom';
import '../style/footer.css';

const Footer = () => {
  return (
    <footer className="footer-modern">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-section">
            <div className="footer-brand">
              <img src="/img/Logo-Level-UP.png" alt="Level Up Logo" className="footer-logo" />
              <h3 className="brand-title">
                Level Up <span className="text-accent">Gamer</span>
              </h3>
              <p className="brand-description">
                Tu tienda gaming de confianza. Los mejores productos para llevar tu setup al siguiente nivel.
              </p>
              <div className="social-links">
                <a href="#" className="social-link" title="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="social-link" title="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="social-link" title="Twitter">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="social-link" title="YouTube">
                  <i className="bi bi-youtube"></i>
                </a>
                <a href="#" className="social-link" title="Discord">
                  <i className="bi bi-discord"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-section">
            <h4 className="section-title">Navegación</h4>
            <ul className="footer-links">
              <li>
                <Link to="/home">
                  <i className="bi bi-house"></i> Home
                </Link>
              </li>
              <li>
                <Link to="/productos">
                  <i className="bi bi-controller"></i> Productos
                </Link>
              </li>
              <li>
                <Link to="/nosotros">
                  <i className="bi bi-people"></i> Nosotros
                </Link>
              </li>
              <li>
                <Link to="/blogs">
                  <i className="bi bi-journal-text"></i> Blogs
                </Link>
              </li>
              <li>
                <Link to="/contacto">
                  <i className="bi bi-envelope"></i> Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="section-title">Categorías</h4>
            <ul className="footer-links">
              <li>
                <a href="#">
                  <i className="bi bi-cpu"></i> Computadores Gaming
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="bi bi-headset"></i> Accesorios
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="bi bi-display"></i> Consolas
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="bi bi-mouse"></i> Periféricos
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="bi bi-chair"></i> Sillas Gaming
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="section-title">Recibe Informacion</h4>
            <p className="newsletter-text">¡Suscríbete y recibe las últimas noticias y ofertas exclusivas!</p>
            <div className="newsletter-form">
              <input type="email" className="newsletter-input" placeholder="tu@email.com" aria-label="Email" />
              <button className="newsletter-btn" type="button">
                <i className="bi bi-send"></i>
              </button>
            </div>
            <div className="payment-methods">
              <h5>Métodos de pago</h5>
              <div className="payment-icons">
                <div className="payment-card">
                  <i className="bi bi-credit-card"></i>
                  <span>Visa</span>
                </div>
                <div className="payment-card">
                  <i className="bi bi-credit-card-2-front"></i>
                  <span>Mastercard</span>
                </div>
                <div className="payment-card">
                  <i className="bi bi-paypal"></i>
                  <span>PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2025 Level Up Gamer. Todos los derechos reservados.</p>
          </div>
          <div className="footer-legal">
            <a href="#">Términos y Condiciones</a>
            <a href="#">Política de Privacidad</a>
            <a href="#">Política de Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
