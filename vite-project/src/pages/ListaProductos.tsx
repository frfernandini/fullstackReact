import { useState, useMemo, useEffect, useRef } from 'react';
import CardProd from '../components/CardProd';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import '../style/lista_productos.css';

const ListaProductos = () => {
  const { products: productsMap, loading: productsLoading, error: productsError } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const products = useMemo(() => Object.values(productsMap), [productsMap]);

  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const [filtro, setFiltro] = useState<string>('Todos');

  const categorias = useMemo(() => {
    const categoryNames = categories.filter(c => c.activo).map(c => c.nombre);
    return ['Todos', ...categoryNames];
  }, [categories]);

  const productosFiltrados = useMemo(() => {
    if (filtro === 'Todos') return products;
    return products.filter((p) => (p.categoria?.nombre ?? 'Sin categoría') === filtro);
  }, [filtro, products]);

  // Ref para cerrar dropdown al hacer click fuera
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (productsLoading || categoriesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Error al cargar productos</h4>
          <p>{productsError}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container productos-container">
      <h1 className="text-center mb-5" id="titulo-prod">
        PRODUCTOS
      </h1>

      <nav id="navbar-filtro-categorias" className="navbar">
        <span className="navbar-brand">Filtrar por Categoría:</span>

        <div className="dropdown" ref={dropdownRef}>
          <button
            className="dropdown-toggle btn btn-secondary"
            id="btnDropdownCategoria"
            onClick={() => setDropdownAbierto(!dropdownAbierto)}
          >
            {filtro}
          </button>

          {dropdownAbierto && (
            <ul className="dropdown-menu show" id="dropdownCategorias">
              {categorias.map((c) => (
                <li key={c}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setFiltro(c);
                      setDropdownAbierto(false);
                    }}
                  >
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button id="btnMostrarTodos" className="btn btn-neon ms-3" onClick={() => setFiltro('Todos')}>
          Quitar Filtro
        </button>
      </nav>

      <div className="container-products" id="productContainer">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => <CardProd key={producto.id} producto={producto} />)
        ) : (
          <p className="text-center w-100">No hay productos en esta categoría.</p>
        )}
      </div>
    </main>
  );
};

export default ListaProductos;
