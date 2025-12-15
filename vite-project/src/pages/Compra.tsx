import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUsers } from "../context/UserContext";
import { pedidoService } from "../api/pedidoService";
import type { PedidoRequest } from "../components/Pedido";
import { ModalVentana } from "../components/compCheckout/ModalVentana";
import { TablaProductos } from "../components/compCheckout/TablaProductos";
import { FormularioCliente } from "../components/compCheckout/FormularioCliente";
import { MensajeEstado } from "../components/compCheckout/MensajeEstado";
import "../style/checkout.css";

export type ProductoCheckout = {
  id: string;
  imagen: string;
  nombre: string;
  precio: number;
  cantidad: number;
};

export type EstadoFlujo = "carrito" | "procesando" | "pago_fallido" | "pago_exitoso";

interface CompraProps {
  productos: ProductoCheckout[];
  onClose: () => void;
  clearCart: (mostrarConfirm?: boolean) => void;
}

export const Compra: React.FC<CompraProps> = ({ productos, onClose, clearCart }) => {
  const navigate = useNavigate();
  const { currentUser } = useUsers();
  const { cartItems } = useCart(); // ✅ Obtener cartItems del contexto
  
  const [estadoFlujo, setEstadoFlujo] = useState<EstadoFlujo>("carrito");
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    calle: "",
    telefono: "",
    region: "",
    comuna: "",
    tarjeta: ""
  });
  const [productosResumen, setProductosResumen] = useState<ProductoCheckout[]>(productos);
  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const [errorMensaje, setErrorMensaje] = useState<string>("");

  const total = productosResumen.reduce((s, p) => s + p.precio * p.cantidad, 0);

  // ✅ Sincronizar productos con cartItems del contexto
  useEffect(() => {
    if (productos.length === 0 && cartItems.length > 0) {
      const productosCheckout: ProductoCheckout[] = cartItems.map(item => ({
        id: item.id.toString(),
        imagen: item.imagen,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad
      }));
      setProductosResumen(productosCheckout);
    }
  }, [cartItems, productos]);

  // Pre-llenar datos del usuario si está logueado
  useEffect(() => {
    if (currentUser) {
      setForm(prev => ({
        ...prev,
        nombre: currentUser.nombre || "",
        apellidos: currentUser.apellido || "",
        correo: currentUser.email || "",
        telefono: currentUser.telefono || "",
        calle: currentUser.direccion || ""
      }));
    }
  }, [currentUser]);

  // Verificar si el usuario está logueado
  useEffect(() => {
    if (!currentUser) {
      setErrorMensaje("Debes iniciar sesión para realizar una compra");
      setTimeout(() => {
        onClose();
        navigate('/login', { state: { from: '/carrito' } });
      }, 2000);
    }
  }, [currentUser, navigate, onClose]);

  // ✅ Verificar si el carrito está vacío
  useEffect(() => {
    if (productosResumen.length === 0 && estadoFlujo === "carrito") {
      setErrorMensaje("El carrito está vacío");
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [productosResumen, estadoFlujo, onClose]);

  const cambiarForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const procesarPago = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!form.nombre || !form.apellidos || !form.correo || !form.tarjeta || 
        !form.calle || !form.region || !form.comuna) {
      setErrorMensaje("Por favor completa todos los campos obligatorios");
      return;
    }

    if (!currentUser?.id) {
      setErrorMensaje("Debes iniciar sesión para continuar");
      return;
    }

    if (productosResumen.length === 0) {
      setErrorMensaje("El carrito está vacío");
      return;
    }

    setEstadoFlujo("procesando");
    setErrorMensaje("");

    try {
      // Construir dirección completa
      const direccionCompleta = `${form.calle}, ${form.comuna}, ${form.region} - Tel: ${form.telefono}`;

      // Preparar request para el backend
      const pedidoRequest: PedidoRequest = {
        usuarioId: currentUser.id!,
        direccionEnvio: direccionCompleta,
        notas: `Cliente: ${form.nombre} ${form.apellidos} - Email: ${form.correo} - Tarjeta: ****${form.tarjeta.slice(-4)}`,
        items: productosResumen.map(p => ({
          productoId: Number(p.id),
          cantidad: p.cantidad,
          precioUnitario: p.precio
        }))
      };

      console.log('📤 Enviando pedido:', pedidoRequest);

      // Llamar a la API para crear el pedido
      const pedidoCreado = await pedidoService.createPedido(pedidoRequest);

      console.log('✅ Pedido creado:', pedidoCreado);

      // Guardar ID del pedido
      setPedidoId(pedidoCreado.id);
      
      // Cambiar a estado exitoso
      setEstadoFlujo("pago_exitoso");
      
      // Limpiar carrito (sin confirmación)
      await clearCart(false);

    } catch (error: any) {
      console.error('❌ Error al crear pedido:', error);
      
      let mensajeError = "No se pudo procesar el pago. Por favor intenta nuevamente.";
      
      if (error.response?.data?.message) {
        mensajeError = error.response.data.message;
      } else if (error.response?.status === 400) {
        mensajeError = "Verifica que todos los productos tengan stock disponible";
      } else if (error.response?.status === 404) {
        mensajeError = "Algunos productos ya no están disponibles";
      } else if (error.response?.status === 401) {
        mensajeError = "Sesión expirada. Por favor inicia sesión nuevamente";
      }
      
      setErrorMensaje(mensajeError);
      setEstadoFlujo("pago_fallido");
    }
  };

  const reintentarPago = () => {
    setEstadoFlujo("carrito");
    setErrorMensaje("");
  };

  const irAMisPedidos = () => {
    onClose();
    navigate('/mis-pedidos');
  };

  // Vista: Procesando pago
  if (estadoFlujo === "procesando") {
    return (
      <ModalVentana titulo="Procesando Pago" onClose={() => {}} className="procesando-modal">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem' }}>Procesando tu pedido, por favor espera...</p>
        </div>
      </ModalVentana>
    );
  }

  // Vista: Carrito - Formulario de pago
  if (estadoFlujo === "carrito") {
    return (
      <ModalVentana titulo="Detalles de Pago" onClose={onClose} className="carrito-modal">
        <form onSubmit={procesarPago}>
          {errorMensaje && <MensajeEstado tipo="error" texto={errorMensaje} />}
          
          <TablaProductos productos={productosResumen} />
          <FormularioCliente form={form} onChange={cambiarForm} />
          
          <button type="submit" className="btn-success btn-full-width">
            Pagar ${total.toLocaleString()}
          </button>
        </form>
      </ModalVentana>
    );
  }

  // Vista: Pago fallido
  if (estadoFlujo === "pago_fallido") {
    return (
      <ModalVentana titulo="Error en el Pago" onClose={onClose} className="pago-fallido-modal">
        <MensajeEstado tipo="error" texto={errorMensaje || "No se pudo realizar el pago"} />
        <TablaProductos productos={productosResumen} />
        <FormularioCliente form={form} onChange={cambiarForm} deshabilitado />
        
        <button className="btn-primary btn-full-width" onClick={reintentarPago}>
          Reintentar
        </button>
        <button className="btn-red-secondary" onClick={onClose} style={{ marginTop: "10px" }}>
          Cerrar
        </button>
      </ModalVentana>
    );
  }

  // Vista: Pago exitoso
  if (estadoFlujo === "pago_exitoso") {
    return (
      <ModalVentana titulo="¡Compra Exitosa!" onClose={onClose} className="pago-exitoso-modal">
        <MensajeEstado tipo="exito" texto={`¡Pedido #${pedidoId} realizado con éxito!`} />
        
        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <p><strong>Pedido:</strong> #{pedidoId}</p>
          <p><strong>Cliente:</strong> {form.nombre} {form.apellidos}</p>
          <p><strong>Email:</strong> {form.correo}</p>
          <p><strong>Dirección:</strong> {form.calle}, {form.comuna}, {form.region}</p>
        </div>

        <TablaProductos productos={productosResumen} />
        
        <div className="acciones-finales">
          <button className="btn-primary" onClick={irAMisPedidos}>
            📦 Ver Mis Pedidos
          </button>
          <button className="btn-secondary" onClick={() => alert("Enviando confirmación por correo...")}>
            📧 Enviar boleta
          </button>
        </div>
        
        <button className="btn-red btn-full-width" onClick={onClose} style={{ marginTop: "20px" }}>
          Cerrar
        </button>
      </ModalVentana>
    );
  }

  return null;
};

