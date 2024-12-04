import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';

export default function Cliente({ cliente, eliminarDeLista }) {
  const { _id, nombre, apellido, empresa, email, telefono } = cliente;
  const [auth] = useContext(CRMContext);
  const navigate = useNavigate();

  // Eliminar cliente
  const eliminarCliente = (idCliente) => {
    if (!auth.auth && !localStorage.getItem('token')) {
      Swal.fire({
        icon: 'error',
        title: 'No estás autenticado',
        text: 'Por favor, inicia sesión para realizar esta acción',
      });
      navigate('/iniciar-sesion');
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
        clienteAxios
          .delete(`/clientes/${idCliente}`, {
            headers: {
              Authorization: `Bearer ${auth.token || localStorage.getItem('token')}`,
            },
          })
          .then((response) => {
            // Verificar que la eliminación fue exitosa
            if (response.status === 200) {
              // Actualizar el estado local eliminando el cliente
              eliminarDeLista(idCliente);
              Swal.fire({
                title: "Borrado",
                text: "El cliente ha sido eliminado.",
                icon: "success",
              });
            }
          })
          .catch((error) => {
            // Verificar el error para mostrar detalles
            console.error("Error al eliminar el cliente: ", error);
            Swal.fire({
              title: "Error",
              text: "Hubo un problema al eliminar el cliente. Intenta nuevamente.",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <li className="cliente">
      <div className="info-cliente">
        <p className="nombre">{nombre} {apellido}</p>
        <p className="empresa">{empresa}</p>
        <p>{email}</p>
        <p>Tel: {telefono}</p>
      </div>
      <div className="acciones">
        <Link to={`/clientes/editar/${_id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Cliente
        </Link>

        <Link to={`/pedidos/nuevo/${_id}`} className="btn btn-amarillo">
          <i className="fas fa-plus"></i>
          Nuevo Pedido
        </Link>

        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarCliente(_id)}
        >
          <i className="fas fa-times"></i>
          Eliminar Cliente
        </button>
      </div>
    </li>
  );
}
