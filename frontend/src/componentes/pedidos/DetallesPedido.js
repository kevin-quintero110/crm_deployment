import React, { useState } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';

export default function DetallesPedido({ pedido, eliminarPedido }) {
  const [loading, setLoading] = useState(false);

  const eliminarPedidoAPI = (idPedido) => {
    const token = localStorage.getItem('token');

    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'No estás autenticado',
        text: 'Por favor, inicia sesión para realizar esta acción',
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esto eliminará el pedido de forma permanente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);

        clienteAxios
          .delete(`/pedidos/${idPedido}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              eliminarPedido(idPedido); // Actualiza la lista de pedidos en el padre
              Swal.fire({
                title: 'Pedido eliminado',
                text: res.data.mensaje,
                icon: 'success',
              });
            }
          })
          .catch((error) => {
            console.error('Error al eliminar el pedido:', error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar el pedido. Intenta nuevamente.',
              icon: 'error',
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  return (
    <li className="pedido">
      <div className="info-pedido">
        <p className="id">ID: {pedido._id}</p>
        <p className="nombre">
          Cliente: {pedido.cliente?.nombre} {pedido.cliente?.apellido}
        </p>
        <div className="articulos-pedido">
          <p className="productos">Artículos del Pedido:</p>
          <ul>
            {pedido.pedido.map((articulos) => (
              <li key={`${pedido._id}-${articulos.producto._id}`}>
                <p>{articulos.producto.nombre}</p>
                <p>Precio: ${articulos.producto.precio}</p>
                <p>Cantidad: {articulos.cantidad}</p>
              </li>
            ))}
          </ul>
        </div>
        <p className="total">Total: ${pedido.total || 'Total no disponible'}</p>
      </div>
      <div className="acciones">
        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarPedidoAPI(pedido._id)}
          disabled={loading}
        >
          <i className="fas fa-times"></i>
          {loading ? 'Eliminando...' : 'Eliminar Pedido'}
        </button>
      </div>
    </li>
  );
}
