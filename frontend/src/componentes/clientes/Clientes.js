import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import Cliente from './Cliente';
import Spinner from '../layout/Spinner';
import { CRMContext } from '../../context/CRMContext';

function Clientes() {
  const [clientes, guardarClientes] = useState([]);
  const [auth] = useContext(CRMContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.auth && !localStorage.getItem('token')) {
      navigate('/iniciar-sesion', { replace: true });
      return;
    }

    const consultarAPI = async () => {
      try {
        const token = auth.token || localStorage.getItem('token');
        const clientesConsulta = await clienteAxios.get('/clientes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        guardarClientes(clientesConsulta.data);
      } catch (error) {
        if (error.response?.status === 500) {
          navigate('/iniciar-sesion', { replace: true });
        }
      }
    };

    consultarAPI();
  }, [auth, navigate]);

  // Función para eliminar el cliente del estado local
  const eliminarDeLista = (idCliente) => {
    const clientesActualizados = clientes.filter((cliente) => cliente._id !== idCliente);
    guardarClientes(clientesActualizados);
  };

  
if (clientes.length === 0) {
  return (
      <div className="no-clientes">
          <Link to={'/clientes/nuevo'} className="btn btn-verde nvo-cliente">
        <i className="fas fa-plus-circle"></i>
        Nuevo Cliente
      </Link>
          <h1 className='center-alert'>No hay Clientes Registrados</h1>
          <Spinner />

      </div>
  ); // Mostrar el spinner junto al mensaje
}

  return (
    <>
      <h2>Clientes</h2>

      <Link to={'/clientes/nuevo'} className="btn btn-verde nvo-cliente">
        <i className="fas fa-plus-circle"></i>
        Nuevo Cliente
      </Link>

      <ul className="listado-clientes">
        {clientes.map((cliente) => (
          <Cliente key={cliente._id} cliente={cliente} eliminarDeLista={eliminarDeLista} />
        ))}
      </ul>
    </>
  );
}

export default Clientes;
