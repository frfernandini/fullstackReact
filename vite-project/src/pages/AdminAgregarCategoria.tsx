import React, { useState } from "react";
import { useCategories } from "../context/CategoryContext";
import type { Categoria } from "../components/Producto";
import { useNavigate } from "react-router-dom";

const AdminAgregarCategoria: React.FC = () => {
    const { addCategory } = useCategories();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState("");
    const [activo, setActivo] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre || !descripcion || !imagen) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        const nuevaCategoria: Omit<Categoria, 'id'> = {
            nombre,
            descripcion,
            imagen,
            activo,
        };

        try {
            setSubmitting(true);
            await addCategory(nuevaCategoria);
            alert("✅ Categoría agregada correctamente");

            // Limpiar formulario
            setNombre("");
            setDescripcion("");
            setImagen("");
            setActivo(true);

            // Opcional: redirigir a agregar producto o a listado de categorías
            navigate('/admin/productos/agregar');
        } catch (error) {
            console.error("Error al agregar categoría:", error);
            alert("❌ Error al agregar la categoría. Revisa la consola para más detalles.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h2 className="card-title mb-0">Agregar Nueva Categoría</h2>
                    <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(-1)}
                    >
                        ← Volver
                    </button>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">
                                Nombre de la Categoría <span className="text-danger">*</span>
                            </label>
                            <input 
                                id="nombre" 
                                className="form-control" 
                                type="text" 
                                placeholder="Ej: Electrónicos, Ropa, Deportes..." 
                                value={nombre} 
                                onChange={(e) => setNombre(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="descripcion" className="form-label">
                                Descripción <span className="text-danger">*</span>
                            </label>
                            <textarea 
                                id="descripcion" 
                                className="form-control" 
                                placeholder="Describe la categoría y qué tipo de productos incluye..." 
                                value={descripcion} 
                                onChange={(e) => setDescripcion(e.target.value)} 
                                rows={4}
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="imagen" className="form-label">
                                URL de Imagen <span className="text-danger">*</span>
                            </label>
                            <input 
                                id="imagen" 
                                className="form-control" 
                                type="text" 
                                placeholder="https://ejemplo.com/imagen-categoria.jpg" 
                                value={imagen} 
                                onChange={(e) => setImagen(e.target.value)} 
                                required 
                            />
                            <small className="form-text text-muted">
                                Esta imagen se usará para representar la categoría en el sitio
                            </small>
                            {imagen && (
                                <div className="mt-3 p-3 border rounded bg-light">
                                    <p className="mb-2 fw-bold">Vista previa:</p>
                                    <img 
                                        src={imagen} 
                                        alt="Vista previa" 
                                        className="img-thumbnail"
                                        style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.currentTarget.src = '/img/placeholder.png';
                                            e.currentTarget.alt = 'Error al cargar imagen';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-check mb-4">
                            <input 
                                id="activo" 
                                className="form-check-input" 
                                type="checkbox" 
                                checked={activo} 
                                onChange={(e) => setActivo(e.target.checked)} 
                            />
                            <label htmlFor="activo" className="form-check-label">
                                Categoría activa (visible en el sitio)
                            </label>
                            <small className="form-text text-muted d-block">
                                Si desactivas la categoría, no será visible para los usuarios
                            </small>
                        </div>

                        <div className="d-grid gap-2">
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg" 
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Guardando...
                                    </>
                                ) : (
                                    '💾 Guardar Categoría'
                                )}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary"
                                onClick={() => navigate(-1)}
                                disabled={submitting}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminAgregarCategoria;