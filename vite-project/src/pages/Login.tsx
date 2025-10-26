import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import '../style/login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { users } = useUsers(); // Get users from context

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const usuarioEncontrado = users.find(
            (user) => user.email === email && user.password === password
        );

        if (usuarioEncontrado) {
            setError('¡Inicio de sesión exitoso! Redirigiendo...');
            // Here you would typically set some global state to indicate the user is logged in
            setTimeout(() => {
                navigate('/home');
            }, 1000);
        } else {
            setError('Correo o contraseña no válidos. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-start min-vh-100" style={{ paddingTop: '5vh' }}>
            <div className="form-signin w-100 m-auto" style={{ maxWidth: '400px', padding: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    <img src="/img/Logo-Level-UP.png" alt="Logo Level-UP" className="d-block mx-auto mb-4" width="150" />
                    <h1 className="h3 mb-3 fw-normal text-center">Iniciar Sesión</h1>
                    
                    <div className="form-floating mb-2">
                        <input
                            type="email"
                            className="form-control"
                            id="CorreoInput"
                            placeholder="Correo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="CorreoInput">Correo electrónico</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="contrasenaInput"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="contrasenaInput">Contraseña</label>
                    </div>
                    
                    <button className="btn btn-primary w-100 py-2" type="submit">Iniciar Sesión</button>
                    
                    {error && <div className={`alert ${error.includes('exitoso') ? 'alert-success' : 'alert-danger'} text-center mt-3`}>{error}</div>}
                    
                    <div className="text-center mt-3">
                        <span>¿No tienes cuenta? </span>
                        <Link to="/registro">Regístrate aquí</Link>
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

export default Login;
