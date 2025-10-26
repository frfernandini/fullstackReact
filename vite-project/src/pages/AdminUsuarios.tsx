import React from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import '../style/admin_usuario.css';

const AdminUsuarios: React.FC = () => {
    const { users, removeUser } = useUsers();

    const handleRemoveUser = (email: string) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario con correo ${email}?`)) {
            removeUser(email);
            alert('Usuario eliminado correctamente.');
        }
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Usuarios Registrados</h2>
                <div>
                    <Link to="/admin" className="btn btn-outline-secondary me-2">
                        <i className="bi bi-house"></i> Dashboard
                    </Link>
                    {/* The "Add User" functionality is handled by the public registration page */}
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-hover" id="tabla-usuarios">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Fecha de registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center text-muted">
                                    No hay usuarios registrados
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.email}>
                                    <td>{user.nombre}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.fechaRegistro).toLocaleDateString()}</td>
                                    <td>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleRemoveUser(user.email)}>
                                            <i className="bi bi-trash"></i> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsuarios;
