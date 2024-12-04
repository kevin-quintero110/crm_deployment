import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2';
import { CRMContext } from '../../context/CRMContext';

function EditarCliente() {
  const { id } = useParams();
  const [auth, guardarAuth] = useContext(CRMContext);
  let navigate = useNavigate();

  const [cliente, datosCliente] = useState({
    nombre: '',
    apellido: '',
    empresa: '',
    email: '',
    telefono: ''
  });

  // Verificar autenticación y redirigir si no está autenticado
  useEffect(() => {
    if (!auth.auth && !localStorage.getItem('token')) {
      navigate('/iniciar-sesion', { replace: true });
    }

    const consultarAPI = async () => {
      const token = localStorage.getItem('token');
      try {
        const clienteConsulta = await clienteAxios.get(`clientes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        datosCliente(clienteConsulta.data);
      } catch (error) {
        console.error("Error al consultar el cliente:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener el cliente',
          text: 'Por favor, intente nuevamente.',
        });
      }
    };
    consultarAPI();
  }, [auth, id, navigate]);

  const actualizarState = e => {
    datosCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  const actualizarCliente = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const res = await clienteAxios.put(`/clientes/${cliente._id}`, cliente, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.data.code === 11000) {
        Swal.fire({
          icon: 'error',
          title: 'Error, algo está mal',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se actualizó el cliente',
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/', { replace: true });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar el cliente',
        text: 'No se pudo actualizar. Intente nuevamente.',
      });
    }
  };

  const validarCliente = () => {
    const { nombre, apellido, email, empresa, telefono } = cliente;
    return !nombre.length || !apellido.length || !email.length || !empresa.length || !telefono.length;
  };

  return (
    <>
      <h2>Editar Cliente</h2>
      <form onSubmit={actualizarCliente}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Cliente"
            name="nombre"
            onChange={actualizarState}
            value={cliente.nombre}
          />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            placeholder="Apellido Cliente"
            name="apellido"
            onChange={actualizarState}
            value={cliente.apellido}
          />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            placeholder="Empresa Cliente"
            name="empresa"
            onChange={actualizarState}
            value={cliente.empresa}
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email Cliente"
            name="email"
            onChange={actualizarState}
            value={cliente.email}
          />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="tel"
            placeholder="Teléfono Cliente"
            name="telefono"
            onChange={actualizarState}
            value={cliente.telefono}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Guardar cambios del Cliente"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </>
  );
}

export default EditarCliente;
