import { Link } from 'react-router-dom';
import '../style/contacto.css';

const Contacto = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="form-signin w-100 m-auto" style={{ maxWidth: '400px', padding: '2rem' }}>
        <form>
          <img src="/img/Logo-Level-UP.png" alt="" className="d-block mx-auto mb-4" />
          <h1 className="text-center mb-4">Contacto</h1>
          <div className="form-floating mb-3">
            <input type="text" className="form-control" id="InputNombre" placeholder="Nombre completo" />
            <label htmlFor="InputNombre">Nombre completo</label>
          </div>
          <div className="form-floating mb-3">
            <input type="email" className="form-control" id="InputCorreo" placeholder="Correo" />
            <label htmlFor="InputCorreo">Correo</label>
          </div>
          <div className="form-floating mb-3">
            <textarea
              className="form-control"
              id="InputDescripcion"
              placeholder="Descripcion"
              style={{ height: '120px' }}
            ></textarea>
            <label htmlFor="InputDescripcion">Descripción</label>
          </div>
          <button className="btn btn-primary w-100 py-2" type="submit">
            Enviar Mensaje
          </button>
          <div className="text-center mt-3">
            <Link to="/home" className="btn btn-outline-secondary">
              <i className="bi bi-house"></i> Volver al Inicio
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contacto;
