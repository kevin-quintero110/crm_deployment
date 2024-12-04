import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import Producto from './Producto';
import Spinner from '../layout/Spinner';
import { useNavigate } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

function Productos() {
    const [productos, guardarProductos] = useState([]);
    const [auth] = useContext(CRMContext);
    let navigate = useNavigate();

    useEffect(() => {
        if (!auth.auth && !localStorage.getItem('token')) {
            navigate('/iniciar-sesion', { replace: true });
            return;
        }

        const consultarAPI = async () => {
            try {
                const token = auth.token || localStorage.getItem('token');
                const productosConsulta = await clienteAxios.get('/productos', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                guardarProductos(productosConsulta.data);
            } catch (error) {
                if (error.response?.status === 500) {
                    navigate('/iniciar-sesion', { replace: true });
                }
            }
        };

        consultarAPI();
    }, [auth, navigate,  productos.length]);

      // Función para eliminar el cliente del estado local
  const eliminarDeLista = (idProducto) => {
    const productosActualizados = productos.filter((producto) => producto._id !== idProducto);
    guardarProductos(productosActualizados);
  };

  if (productos.length === 0) {
    return (
        <div className="no-productos">
            <Link to={'/productos/nuevo'} className="btn btn-verde nvo-producto">
          <i className="fas fa-plus-circle"></i>
          Nuevo Producto
        </Link>
            <h1 className='center-alert'>No hay Productos Registrados</h1>
            <Spinner />
  
        </div>
    ); // Mostrar el spinner junto al mensaje
  }

    return (
        <>
            <h2>Productos</h2>
            <Link to={"/productos/nuevo"} className="btn btn-verde nvo-cliente">
                <i className="fas fa-plus-circle"></i>
                Nuevo Producto
            </Link>

            <ul className="listado-productos">
                {productos.map((producto) => (
                    <Producto key={producto._id} producto={producto}  eliminarDeLista={eliminarDeLista} />
                ))}
            </ul>
        </>
    );
}

export default Productos;
