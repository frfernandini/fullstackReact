import { useState, useEffect, useMemo } from 'react';
import CardProd from '../components/CardProd';
import type { Producto } from '../components/Producto';
import { useProducts } from '../context/ProductContext';
import '../style/lista_productos.css';

const ListaProductos = () => {
  const { products: productsMap } = useProducts();
  const products = useMemo(() => Object.values(productsMap), [productsMap]);

  const [filtro, setFiltro] = useState<string>('Todos');
  
  const categorias = useMemo(() => ['Todos', ...new Set(products.map((p) => p.categoria))], [products]);

  const productosFiltrados = useMemo(() => {
    if (filtro === 'Todos') {
      return products;
    }
    return products.filter((p) => p.categoria === filtro);
  }, [filtro, products]);

  return (
    <main className="container productos-container">
      <h1 className="text-center mb-5" id="titulo-prod">
        PRODUCTOS
      </h1>
      <nav id="navbar-filtro-categorias" className="navbar">
        <span className="navbar-brand">Filtrar por Categoría:</span>
        <div className="dropdown">
          <button className="dropdown-toggle" id="btnDropdownCategoria">
            {filtro}
          </button>
          <ul className="dropdown-menu" id="dropdownCategorias">
            {categorias.map((c) => (
              <li key={c}>
                <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setFiltro(c); }}>
                  {c}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <button id="btnMostrarTodos" className="btn btn-neon" onClick={() => setFiltro('Todos')}>
          Quitar Filtro
        </button>
      </nav>

      <div className="container-products" id="productContainer">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <CardProd key={producto.id} producto={producto} />
          ))
        ) : (
          <p className="text-center w-100">No hay productos en esta categoría.</p>
        )}
      </div>
    </main>
  );
};

export default ListaProductos;
