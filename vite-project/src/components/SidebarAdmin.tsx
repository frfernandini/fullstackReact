import React from 'react';
import { Link } from 'react-router-dom';
import '../style/sidebar_admin.css';

const SidebarAdmin: React.FC = () => {
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary sidebar-container" style={{ width: '280px', height: '100vh' }}>
            <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                <span className="fs-4">Level-UP</span>
            </Link>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to="/admin" className="nav-link link-body-emphasis">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/admin/productos" className="nav-link link-body-emphasis">
                        Gestionar Productos
                    </Link>
                </li>
                <li>
                    <Link to="/admin/usuarios" className="nav-link link-body-emphasis">
                        Gestionar usuarios
                    </Link>
                </li>
                <li>
                    <Link to="/admin/pedidos" className="nav-link link-body-emphasis">
                        Gestionar Pedidos
                    </Link>
                </li>
            </ul>
            <hr />
            <div>
                <a href="#" className="d-flex align-items-center link-body-emphasis text-decoration-none">
                    <img src="/img/placeholder.webp" alt="" width="32" height="32" className="rounded-circle me-2" />
                    <strong>admin</strong>
                </a>
            </div>
        </div>
    );
};

export default SidebarAdmin;
