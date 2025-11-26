import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUsers } from '../context/UserContext';
import '../style/header.css';

const Header = () => {
  const { cartCount } = useCart();
  const { currentUser, isLoggedIn, isAdmin, logout } = useUsers();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const getLinkClass = ({ isActive }: { isActive: boolean }) => 
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand ms-3" to="/home">
          <img src="/img/Logo-Level-UP.png" alt="Logo" width="120" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className={getLinkClass} to="/home">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={getLinkClass} to="/productos">
                Productos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={getLinkClass} to="/nosotros">
                Nosotros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={getLinkClass} to="/blogs">
                Blogs
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={getLinkClass} to="/contacto">
                Contacto
              </NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {isLoggedIn ? (
              <>
                <span className="text-light me-3 d-flex align-items-center">
                  {isAdmin ? (
                    <>
                      <span className="admin-badge me-2"></span>
                      <span className="admin-text">Admin {currentUser?.nombre || 'Usuario'}</span>
                    </>
                  ) : (
                    <>
                      <span className="user-badge me-2"></span>
                      <span>Hola, {currentUser?.nombre || 'Usuario'}</span>
                    </>
                  )}
                </span>
                {isAdmin && (
                  <Link to="/admin" className="btn btn-sm btn-outline-warning me-2" title="Panel de Administración">
                    <i className="bi bi-gear"></i>
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline-danger me-2"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <NavLink to="/login" className="btn btn-outline-primary me-2">
                Login
              </NavLink>
            )}
            <NavLink to="/carrito" className="btn btn-outline-light position-relative">
              <i className="bi bi-cart"></i>
              {cartCount > 0 && (
                <span id="cart-count" className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                  <span className="visually-hidden">artículos en carrito</span>
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
