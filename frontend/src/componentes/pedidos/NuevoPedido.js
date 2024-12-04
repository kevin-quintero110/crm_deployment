import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import FormBuscarProducto from './FormBuscarProducto';
import Swal from 'sweetalert2';
import FormCantidadProducto from './FormCantidadProducto';
import { CRMContext } from '../../context/CRMContext';

function NuevoPedido() {
  const [auth] = useContext(CRMContext); // No es necesario `guardarAuth` si solo lees el contexto
  const navigate = useNavigate();

  const { id } = useParams();
  const [cliente, guardarCliente] = useState({});
  const [busqueda, guardarBusqueda] = useState('');
  const [productos, guardarProductos] = useState([]);
  const [total, guardarTotal] = useState(0);

  // Verificar si está autenticado y redirigir si no lo está
  useEffect(() => {
    if (!auth?.auth || !auth?.token) {
      Swal.fire({
        icon: 'error',
        title: 'No autenticado',
        text: 'Debes iniciar sesión para continuar.',
      });
      navigate('/iniciar-sesion', { replace: true });
    }
  }, [auth, navigate]);

  // Consultar datos del cliente al cargar el componente
  useEffect(() => {
    const consultarAPI = async () => {
      try {
        const resultado = await clienteAxios.get(`/clientes/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Token para solicitudes protegidas
          },
        });
        guardarCliente(resultado.data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar cliente',
          text: 'Hubo un problema al obtener los datos del cliente.',
        });
        console.error(error);
      }
    };
    consultarAPI();

    actualizarTotal();
  }, [id, auth.token, productos]);

  // Buscar un producto
  const buscarProducto = async (e) => {
    e.preventDefault();
    try {
      const resultadoBusqueda = await clienteAxios.post(
        `/productos/busqueda/${busqueda}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (resultadoBusqueda.data[0]) {
        const productoResultado = resultadoBusqueda.data[0];
        productoResultado.producto = productoResultado._id;
        productoResultado.cantidad = 0;

        // Evitar duplicados
        const existeProducto = productos.some(
          (producto) => producto.producto === productoResultado.producto
        );

        if (!existeProducto) {
          guardarProductos([...productos, productoResultado]);
          actualizarTotal(); // Actualizamos el total cuando se agrega un nuevo producto
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Producto ya agregado',
            text: 'Este producto ya ha sido agregado a la lista.',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'No hay resultados',
          text: `No se encontró el producto: "${busqueda}".`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Leer datos de búsqueda
  const leerDatosBusqueda = (e) => {
    guardarBusqueda(e.target.value);
  };

  // Actualizar cantidad de productos
  const restarProductos = (i) => {
    const todosProductos = [...productos];
    if (todosProductos[i].cantidad === 0) return;
    todosProductos[i].cantidad--;
    guardarProductos(todosProductos);
    actualizarTotal(); // Recalcular el total al modificar la cantidad
  };

  const aumentarProductos = (i) => {
    const todosProductos = [...productos];
    todosProductos[i].cantidad++;
    guardarProductos(todosProductos);
    actualizarTotal(); // Recalcular el total al modificar la cantidad
  };

  const eliminarProductoPedido = (id) => {
    const todosProductos = productos.filter((producto) => producto.producto !== id);
    guardarProductos(todosProductos);
    actualizarTotal(); // Recalcular el total al eliminar el producto
  };

  // Calcular el total
  const actualizarTotal = () => {
    if (productos.length === 0) {
      guardarTotal(0);
      return;
    }

    const nuevoTotal = productos.reduce(
      (acumulado, producto) => acumulado + producto.cantidad * producto.precio,
      0
    );
    guardarTotal(nuevoTotal);
  };

  // Realizar pedido
  const realizarPedido = async (e) => {
    e.preventDefault();

    const pedido = {
      cliente: id,
      pedido: productos,
      total,
    };

    try {
      const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (resultado.status === 200) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Pedido realizado correctamente',
          text: resultado.data.mensaje,
          showConfirmButton: false,
          timer: 1500,
        });

        navigate('/pedidos', { replace: true });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hubo un error',
        text: 'No se pudo realizar el pedido. Inténtalo nuevamente.',
      });
      console.error(error);
    }
  };

  return (
    <>
      <h2>Nuevo Pedido</h2>

      <div className="ficha-cliente">
        <h3>Datos de Cliente</h3>
        <p>Nombre: {cliente.nombre} {cliente.apellido}</p>
        <p>Teléfono: {cliente.telefono}</p>
      </div>

      <FormBuscarProducto
        buscarProducto={buscarProducto}
        leerDatosBusqueda={leerDatosBusqueda}
      />

      <ul className="resumen">
        {productos.map((producto, index) => (
          <FormCantidadProducto
            key={producto.producto}
            producto={producto}
            restarProductos={restarProductos}
            aumentarProductos={aumentarProductos}
            eliminarProductoPedido={eliminarProductoPedido}
            index={index}
          />
        ))}
      </ul>

      <p className="total">Total a pagar: <span>${total}</span></p>

      {total > 0 && (
        <form onSubmit={realizarPedido}>
          <input
            type="submit"
            className="btn btn-verde btn-block"
            value="Realizar Pedido"
          />
        </form>
      )}
    </>
  );
}

export default NuevoPedido;
