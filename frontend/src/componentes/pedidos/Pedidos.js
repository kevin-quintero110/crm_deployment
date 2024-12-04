import React, { useEffect, useState, useContext } from 'react';
import clienteAxios from '../../config/axios';
import DetallesPedido from './DetallesPedido';
import { useNavigate } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';
import Spinner from '../layout/Spinner';

function Pedidos() {
    const [pedidos, guardarPedidos] = useState([]);
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
                const resultado = await clienteAxios.get('/pedidos', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                guardarPedidos(resultado.data);
            } catch (error) {
                if (error.response?.status === 500) {
                    navigate('/iniciar-sesion', { replace: true });
                }
            }
        };

        consultarAPI();
    }, [auth, navigate]);

    const eliminarPedido = (idPedido) => {
        const pedidosActualizados = pedidos.filter((pedido) => pedido._id !== idPedido);
        guardarPedidos(pedidosActualizados);
    };

    if (pedidos.length === 0) {
        return (
            <div className="no-pedidos">
                <h1 className='center-alert'>No hay pedidos disponibles</h1>
                <Spinner />
            </div>
        ); // Mostrar el spinner junto al mensaje
    }
    return (
        <>
            <h2>Pedidos</h2>
            <ul className="listado-pedidos">
                {pedidos.map(pedido => (
                    <DetallesPedido
                        key={pedido._id}
                        pedido={pedido}
                        eliminarPedido={eliminarPedido}
                    />
                ))}
            </ul>
        </>
    );
}

export default Pedidos;
