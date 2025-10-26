import React from 'react';
import { Link } from 'react-router-dom';
import '../style/admin-home.css';

const Admin: React.FC = () => {
    return (
        <div className="container-fluid p-4">
            <h1 className="mb-4">Dashboard de Administración</h1>
            
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">
                                <i className="bi bi-people"></i> Gestión de Usuarios
                            </h5>
                            <p className="card-text">Administra los usuarios registrados en el sistema.</p>
                            <Link to="/admin/usuarios" className="btn btn-primary">
                                <i className="bi bi-eye"></i> Ver Usuarios
                            </Link>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">
                                <i className="bi bi-box"></i> Gestión de Productos
                            </h5>
                            <p className="card-text">Administra el catálogo de productos.</p>
                            <div className="btn-group" role="group">
                                <Link to="/admin/productos" className="btn btn-outline-primary">
                                    <i className="bi bi-list"></i> Ver Productos
                                </Link>
                                <Link to="/admin/productos/agregar" className="btn btn-success">
                                    <i className="bi bi-plus"></i> Agregar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
