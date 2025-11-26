import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import '../style/registro.css';

const Registro: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmContrasena, setConfirmContrasena] = useState('');
    const [errors, setErrors] = useState({
        nombre: '',
        correo: '',
        contrasena: '',
        confirmContrasena: ''
    });
    const navigate = useNavigate();
    const { addUser } = useUsers();

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors = {
            nombre: '',
            correo: '',
            contrasena: '',
            confirmContrasena: ''
        };
        let isValid = true;

        // Validar nombre
        if (nombre.trim().length < 3) {
            newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
            isValid = false;
        }

        // Validar correo
        if (!correo.trim()) {
            newErrors.correo = 'El correo electrónico es obligatorio';
            isValid = false;
        } else if (!validateEmail(correo)) {
            newErrors.correo = 'El formato del correo es inválido (ejemplo: correo@gmail.com)';
            isValid = false;
        }

        // Validar contraseña
        if (contrasena.length < 6) {
            newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
            isValid = false;
        }

        // Validar confirmación de contraseña
        if (confirmContrasena !== contrasena) {
            newErrors.confirmContrasena = 'Las contraseñas no coinciden';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar formulario antes de enviar
        if (!validateForm()) {
            return;
        }

        try {
            const { success, message } = await addUser({
                nombre,
                email: correo,
                password: contrasena,
            });

            alert(message);
            if (success) {
                navigate('/login');
            }
        } catch (err) {
            console.error('Error during registration:', err);
            alert('Error al registrar usuario. Por favor, intenta de nuevo.');
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
                            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                            id="floatingname"
                            placeholder="Nombre completo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingname">Nombre completo</label>
                        {errors.nombre && (
                            <div className="invalid-feedback d-block">
                                {errors.nombre}
                            </div>
                        )}
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="email"
                            className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                            id="floatingcorreo"
                            placeholder="Correo electronico"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingcorreo">Correo electrónico</label>
                        {errors.correo && (
                            <div className="invalid-feedback d-block">
                                {errors.correo}
                            </div>
                        )}
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            type="password"
                            className={`form-control ${errors.contrasena ? 'is-invalid' : ''}`}
                            id="floatingcontrasena"
                            placeholder="Contraseña"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingcontrasena">Contraseña</label>
                        {errors.contrasena && (
                            <div className="invalid-feedback d-block">
                                {errors.contrasena}
                            </div>
                        )}
                        {!errors.contrasena && contrasena.length > 0 && (
                            <small className="text-muted d-block mt-1">
                                Mínimo 6 caracteres ({contrasena.length}/6)
                            </small>
                        )}
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className={`form-control ${errors.confirmContrasena ? 'is-invalid' : ''}`}
                            id="floatingconfirmcontrasena"
                            placeholder="Confirmar contraseña"
                            value={confirmContrasena}
                            onChange={(e) => setConfirmContrasena(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingconfirmcontrasena">Confirmar contraseña</label>
                        {errors.confirmContrasena && (
                            <div className="invalid-feedback d-block">
                                {errors.confirmContrasena}
                            </div>
                        )}
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
