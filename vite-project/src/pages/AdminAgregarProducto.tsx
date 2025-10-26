// src/pages/AdminAgregarProducto.tsx
import React, { useState } from "react";
import { useProducts } from "../context/ProductContext";
import type { Producto } from "../components/Producto";
import '../style/admin_agregar_producto.css';

const AdminAgregarProducto: React.FC = () => {
    const { addProduct } = useProducts();

    const [titulo, setTitulo] = useState("");
    const [categoria, setCategoria] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState<number | "">("");
    const [imagen, setImagen] = useState("");
    const [oferta, setOferta] = useState(false);
    const [descuento, setDescuento] = useState<number | "">("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!titulo || !categoria || !descripcion || !precio || !imagen) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        const id = "PR" + Date.now().toString().slice(-4);

        const nuevoProducto: Producto = {
            id,
            titulo,
            categoria,
            descripcion,
            precio: Number(precio),
            imagen,
            oferta,
            descuento: oferta ? Number(descuento) || 0 : 0,
        };

        addProduct(nuevoProducto);
        alert("Producto agregado correctamente");

        // Limpiar formulario
        setTitulo("");
        setCategoria("");
        setDescripcion("");
        setPrecio("");
        setImagen("");
        setOferta(false);
        setDescuento("");
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header">
                    <h2 className="card-title text-center mb-0">Agregar Nuevo Producto</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="titulo" className="form-label">Título</label>
                            <input id="titulo" className="form-control" type="text" placeholder="Ej: Camisa de Algodón" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="categoria" className="form-label">Categoría</label>
                            <input id="categoria" className="form-control" type="text" placeholder="Ej: Ropa" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                            <textarea id="descripcion" className="form-control" placeholder="Describe el producto" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="precio" className="form-label">Precio</label>
                            <input id="precio" className="form-control" type="number" placeholder="Ej: 29.99" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} required />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="imagen" className="form-label">URL de Imagen</label>
                            <input id="imagen" className="form-control" type="text" placeholder="https://ejemplo.com/imagen.jpg" value={imagen} onChange={(e) => setImagen(e.target.value)} required />
                        </div>

                        <div className="form-check mb-3">
                            <input id="oferta" className="form-check-input" type="checkbox" checked={oferta} onChange={(e) => setOferta(e.target.checked)} />
                            <label htmlFor="oferta" className="form-check-label">¿Producto en oferta?</label>
                        </div>

                        {oferta && (
                            <div className="mb-3">
                                <label htmlFor="descuento" className="form-label">Descuento (%)</label>
                                <input id="descuento" className="form-control" type="number" placeholder="Ej: 15" value={descuento} onChange={(e) => setDescuento(Number(e.target.value))} />
                            </div>
                        )}

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">Guardar Producto</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminAgregarProducto;