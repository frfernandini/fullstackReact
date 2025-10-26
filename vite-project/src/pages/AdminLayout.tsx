import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SidebarAdmin from '../components/SidebarAdmin';
import Admin from './Admin';
import AdminListadoProductos from './AdminListadoProductos';
import AdminAgregarProducto from './AdminAgregarProducto';
import AdminUsuarios from './AdminUsuarios';
import AdminAgregarUsuario from './AdminAgregarUsuario';

const AdminLayout: React.FC = () => {
    return (
        <div className="d-flex">
            <SidebarAdmin />
            <div className="main-content flex-grow-1">
                <Routes>
                    <Route path="/" element={<Admin />} />
                    <Route path="productos" element={<AdminListadoProductos />} />
                    <Route path="productos/agregar" element={<AdminAgregarProducto />} />
                    <Route path="usuarios" element={<AdminUsuarios />} />
                    <Route path="usuarios/agregar" element={<AdminAgregarUsuario />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminLayout;
