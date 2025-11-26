import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import '../style/login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useUsers();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                setError('¡Inicio de sesión exitoso! Redirigiendo...');

                // Redirigir según rol (comprobación flexible)
                setTimeout(() => {
                    const roleStr = String(result.role || '').toUpperCase();
                    if (roleStr.includes('ADMIN')) {
                        navigate('/admin');
                    } else {
                        navigate('/home');
                    }
                }, 800);
            } else {
                setError(result.message);
            }
        } catch (err: any) {
            console.error('Login error', err);
            const msg = err?.message || 'Error al iniciar sesión';
            setError(String(msg));
        } finally {
            setLoading(false);
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
                    
                    <button className="btn btn-primary w-100 py-2" type="submit" disabled={loading}>
                        {loading ? 'Validando...' : 'Iniciar Sesión'}
                    </button>
                    
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
