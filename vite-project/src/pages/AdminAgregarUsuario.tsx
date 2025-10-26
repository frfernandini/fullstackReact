// src/components/AdminAgregarUsuario.tsx
import React, { useState } from 'react';

interface Usuario {
    nombre: string;
    apellido: string;
    email: string;
    correo: string;
    password: string;
    region: string;
    ciudad: string;
    fecha: string;
    fechaRegistro: string;
}

const AdminAgregarUsuario: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [region, setRegion] = useState('');
    const [ciudad, setCiudad] = useState('');

    const validarEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const agregarUsuario = () => {
        // Validaciones
    if (!nombre || !apellido || !email || !password || !region || !ciudad) {
        alert('Por favor, complete todos los campos');
        return;
    }

    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (!validarEmail(email)) {
        alert('Por favor, ingrese un email válido');
        return;
    }

    const usuarios: Usuario[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const emailExiste = usuarios.some(usuario => usuario.email === email || usuario.correo === email);

    if (emailExiste) {
        alert('Ya existe un usuario con este email');
        return;
    }

    const nuevoUsuario: Usuario = {
        nombre,
        apellido,
        email,
        correo: email,
        password,
        region,
        ciudad,
        fecha: new Date().toLocaleDateString('es-ES'),
        fechaRegistro: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Usuario agregado exitosamente');

    //Limpiar formulario
    setNombre('');
    setApellido('');
    setEmail('');
    setPassword('');
    setRegion('');
    setCiudad('');
};

return (
<form
    onSubmit={(e) => {
        e.preventDefault();
        agregarUsuario();
    }}
    className="form-agregar-usuario"
    >
    <input
        id="floatingnombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
        required
    />
    <input
        id="floatingapellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        placeholder="Apellido"
        required
    />
    <input
        id="floatingemail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
    />
    <input
        id="floatingpassword"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
    />
    <input
        id="floatingregion"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        placeholder="Región"
        required
    />
    <input
        id="floatingciudad"
        value={ciudad}
        onChange={(e) => setCiudad(e.target.value)}
        placeholder="Ciudad"
        required
    />
    <button type="submit">Agregar Usuario</button>
    </form>
);
};

export default AdminAgregarUsuario;