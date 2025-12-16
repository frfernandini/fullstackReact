// src/pages/AdminAgregarProducto.tsx
import React, { useState, useEffect} from "react";
import { useProducts } from "../context/ProductContext";
import { useCategories } from "../context/CategoryContext";
import type { Producto } from "../components/Producto";
import { useNavigate } from "react-router-dom";
import '../style/admin_agregar_producto.css';

const AdminAgregarProducto: React.FC = () => {
    const { addProduct } = useProducts();
    const { categories, loading: loadingCategories, loadCategories } = useCategories();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [categoriaId, setCategoriaId] = useState<number | "">("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState<number | "">("");
    const [imagen, setImagen] = useState("");
    const [oferta, setOferta] = useState(false);
    const [descuento, setDescuento] = useState<number | "">("");
    const [submitting, setSubmitting] = useState(false);

    // Recargar categorías cuando el componente se monta
    useEffect(() => {
        loadCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre || !categoriaId || !descripcion || !precio || !imagen) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        //Buscar la categoría seleccionada
        const categoriaSeleccionada = categories.find(c => c.id === Number(categoriaId));
        
        if (!categoriaSeleccionada) {
            alert("Por favor selecciona una categoría válida");
            return;
        }

        const nuevoProducto: Omit<Producto, 'id'> = {
            nombre, 
            categoria: categoriaSeleccionada,  // Objeto Categoria completo
            descripcion,
            precio: Number(precio),
            imagen,
            oferta,
            descuento: oferta ? Number(descuento) || 0 : 0,
        };

        try {
            setSubmitting(true);
            await addProduct(nuevoProducto as Producto);
            alert("✅ Producto agregado correctamente");

            // Limpiar formulario
            setNombre("");
            setCategoriaId("");
            setDescripcion("");
            setPrecio("");
            setImagen("");
            setOferta(false);
            setDescuento("");
        } catch (error) {
            console.error("Error al agregar producto:", error);
            alert("❌ Error al agregar el producto. Revisa la consola para más detalles.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingCategories) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando categorías...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header">
                    <h2 className="card-title text-center mb-0">Agregar Nuevo Producto</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre del Producto</label>
                            <input 
                                id="nombre" 
                                className="form-control" 
                                type="text" 
                                placeholder="Ej: Camisa de Algodón" 
                                value={nombre} 
                                onChange={(e) => setNombre(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="categoria" className="form-label">Categoría</label>
                            <div className="d-flex gap-2">
                                <select 
                                    id="categoria" 
                                    className="form-select" 
                                    value={categoriaId} 
                                    onChange={(e) => setCategoriaId(Number(e.target.value))} 
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categories.filter(c => c.activo).map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-primary text-nowrap"
                                    onClick={() => navigate('/admin/categorias/agregar')}
                                    title="Crear nueva categoría"
                                >
                                    ➕ Nueva
                                </button>
                            </div>
                            {categories.length === 0 && (
                                <small className="text-warning">
                                    ⚠️ No hay categorías disponibles. Crea una primero.
                                </small>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                            <textarea 
                                id="descripcion" 
                                className="form-control" 
                                placeholder="Describe el producto" 
                                value={descripcion} 
                                onChange={(e) => setDescripcion(e.target.value)} 
                                rows={4}
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="precio" className="form-label">Precio</label>
                            <input 
                                id="precio" 
                                className="form-control" 
                                type="number" 
                                placeholder="Ej: 29990" 
                                value={precio} 
                                onChange={(e) => setPrecio(Number(e.target.value))} 
                                min="0"
                                step="1"
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="imagen" className="form-label">URL de Imagen</label>
                            <input 
                                id="imagen" 
                                className="form-control" 
                                type="text" 
                                placeholder="https://ejemplo.com/imagen.jpg" 
                                value={imagen} 
                                onChange={(e) => setImagen(e.target.value)} 
                                required 
                            />
                            {imagen && (
                                <div className="mt-2">
                                    <img 
                                        src={imagen} 
                                        alt="Vista previa" 
                                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.currentTarget.src = '/img/placeholder.png';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-check mb-3">
                            <input 
                                id="oferta" 
                                className="form-check-input" 
                                type="checkbox" 
                                checked={oferta} 
                                onChange={(e) => setOferta(e.target.checked)} 
                            />
                            <label htmlFor="oferta" className="form-check-label">
                                ¿Producto en oferta?
                            </label>
                        </div>

                        {oferta && (
                            <div className="mb-3">
                                <label htmlFor="descuento" className="form-label">Descuento (%)</label>
                                <input 
                                    id="descuento" 
                                    className="form-control" 
                                    type="number" 
                                    placeholder="Ej: 15" 
                                    value={descuento} 
                                    onChange={(e) => setDescuento(Number(e.target.value))} 
                                    min="0"
                                    max="100"
                                />
                            </div>
                        )}

                        <div className="d-grid">
                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                disabled={submitting}
                            >
                                {submitting ? 'Guardando...' : 'Guardar Producto'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminAgregarProducto;
