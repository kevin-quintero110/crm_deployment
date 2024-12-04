import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

function NuevoCliente(props) {
  const [auth, guardarAuth] = useContext(CRMContext);
  let navigate = useNavigate();

  // Verificar si está autenticado
  useEffect(() => {
    if (!auth.auth && !localStorage.getItem('token')) {
      navigate('/iniciar-sesion', { replace: true });
    }
  }, [auth, navigate]);

  const [cliente, guardarCliente] = useState({
    nombre: '',
    apellido: '',
    empresa: '',
    email: '',
    telefono: ''
  });

  const actualizarState = (e) => {
    guardarCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  const agregarCliente = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Obtener el token desde localStorage

    clienteAxios
      .post('/clientes', cliente, {
        headers: {
          'Authorization': `Bearer ${token}`, // Asegúrate de enviar el token en el encabezado
        }
      })
      .then((res) => {
        if (res.data.code === 11000) {
          Swal.fire({
            icon: 'error',
            title: 'Ya existe este cliente!',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se agregó el cliente',
            showConfirmButton: false,
            timer: 1500
          });
        }
        navigate('/', { replace: true });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar cliente',
          text: 'No se pudo agregar el cliente. Por favor, intente nuevamente.',
        });
      });
  };

  const validarCliente = () => {
    const { nombre, apellido, email, empresa, telefono } = cliente;
    return !nombre.length || !apellido.length || !email.length || !empresa.length || !telefono.length;
  };

  return (
    <>
      <h2>Nuevo cliente</h2>
      <form onSubmit={agregarCliente}>
        <legend>Llena todos los campos</legend>
        <div className="campo">
          <label>Nombre:</label>
          <input type="text" placeholder="Nombre Cliente" name="nombre" onChange={actualizarState} />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input type="text" placeholder="Apellido Cliente" name="apellido" onChange={actualizarState} />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input type="text" placeholder="Empresa Cliente" name="empresa" onChange={actualizarState} />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input type="email" placeholder="Email Cliente" name="email" onChange={actualizarState} />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input type="tel" placeholder="Teléfono Cliente" name="telefono" onChange={actualizarState} />
        </div>

        <div className="enviar">
          <input type="submit" className="btn btn-azul" value="Agregar Cliente" disabled={validarCliente()} />
        </div>
      </form>
    </>
  );
}

export default NuevoCliente;
