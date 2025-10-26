import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import '../style/registro.css';

const Registro: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmContrasena, setConfirmContrasena] = useState('');
    const navigate = useNavigate();
    const { addUser } = useUsers();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (contrasena !== confirmContrasena) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const { success, message } = addUser({
            nombre,
            email: correo,
            password: contrasena,
        });

        alert(message);
        if (success) {
            navigate("/login");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="form-signin w-100 m-auto" style={{ maxWidth: '400px', padding: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    <img src="/img/Logo-Level-UP.png" alt="Logo" className="d-block mx-auto mb-4" width="150" />
                    <h1 className="h3 mb-3 fw-normal text-center">Crear cuenta</h1>
                    
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            id="floatingname"
                            placeholder="Nombre completo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingname">Nombre completo</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="email"
                            className="form-control"
                            id="floatingcorreo"
                            placeholder="Correo electronico"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingcorreo">Correo electrónico</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingcontrasena"
                            placeholder="Contraseña"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingcontrasena">Contraseña</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingconfirmcontrasena"
                            placeholder="Confirmar contraseña"
                            value={confirmContrasena}
                            onChange={(e) => setConfirmContrasena(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingconfirmcontrasena">Confirmar contraseña</label>
                    </div>
                    
                    <button className="btn btn-primary w-100 py-2" type="submit">Registrar</button>
                    
                    <div className="text-center mt-3">
                        <span>¿Ya tienes cuenta? </span>
                        <Link to="/login">Inicia sesión aquí</Link>
                    </div>
                    <div className="text-center mt-3">
                        <Link to="/" className="btn btn-outline-secondary btn-sm">
                            <i className="bi bi-house"></i> Volver al Inicio
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Registro;
