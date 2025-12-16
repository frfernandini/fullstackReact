import React from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import '../style/admin_usuario.css';

const AdminUsuarios: React.FC = () => {
    const { users, removeUser, currentUser } = useUsers();

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
                </div>
            </div>
            <div className="table-container">
                <div className="table-responsive table-scrollable">
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
                                        <td title={user.email}>{user.email}</td>
                                        <td>{new Date(user.fechaCreacion).toLocaleDateString()}</td>
                                        <td className="text-center">
                                            {currentUser?.email === user.email ? (
                                                <span className="text-muted">No permitido</span>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleRemoveUser(user.email)}
                                                >
                                                    Eliminar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsuarios;
