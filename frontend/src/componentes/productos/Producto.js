import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';

export default function Producto({ producto, eliminarDeLista }) {
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga

 
  // Función para eliminar un producto
  const eliminarProducto = (idProducto) => {
    // Obtiene el token de autenticación desde el localStorage
    const token = localStorage.getItem('token');

    // Verifica si no hay token
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'No estás autenticado',
        text: 'Por favor, inicia sesión para realizar esta acción',
      });
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esto es irreversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borrar",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true); // Inicia el estado de carga

        // Solicitud DELETE a la API con el token de autenticación
        clienteAxios
          .delete(`/productos/${idProducto}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Enviar el token en los encabezados
            },
          })
          .then((res) => {
            if (res.status === 200) {
              eliminarDeLista(idProducto); // Elimina el producto de la lista local
              Swal.fire({
                title: "Producto eliminado",
                text: res.data.mensaje,
                icon: "success",
              });
            }
          })
          .catch((error) => {
            console.error("Error al eliminar el producto: ", error);
            Swal.fire({
              title: "Error",
              text: "Hubo un problema al eliminar el producto. Intenta nuevamente.",
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false); // Finaliza el estado de carga
          });
      }
    });
  };

  return (
    <li className="producto">
      <div className="info-producto">
        <p className="nombre">{producto.nombre}</p>
        <p className="precio">{producto.precio} </p>
        {producto.imagen ? (
          <img
            alt="imagen producto"
            src={`http://localhost:5000/uploads/${producto.imagen}`}
            
          />
        ) : null}
      </div>
      <div className="acciones">
        <Link to={`/productos/editar/${producto._id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Producto
        </Link>

        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarProducto(producto._id)}
          disabled={loading} // Deshabilita el botón mientras se elimina
        >
          <i className="fas fa-times"></i>
          {loading ? "Eliminando..." : "Eliminar Producto"}
        </button>
      </div>
    </li>
  );
}
