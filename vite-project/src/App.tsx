import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Blogs from './pages/Blogs';
import Contacto from './pages/Contacto';
import ListaProductos from './pages/ListaProductos';
import ProductoDetalles from './pages/ProductoDetalles';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';
import AdminLayout from './pages/AdminLayout';
import ProtectedRoute from './components/protectedRoute';
import './App.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <main>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/productos" element={<ListaProductos />} />
          <Route path="/productos/:id" element={<ProductoDetalles />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas protegidas solo para usuarios logueados */}
          <Route element={<ProtectedRoute />}>
            <Route path="/carrito" element={<Carrito />} />
          </Route>

          {/* Panel admin → solo admin */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin/*" element={<AdminLayout />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;

