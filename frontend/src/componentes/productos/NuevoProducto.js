import React, { useState, useContext, useEffect } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

function NuevoProducto() {
  const [auth, guardarAuth] = useContext(CRMContext);
  let navigate = useNavigate();

  // Verificar si está autenticado
  useEffect(() => {
    if (!auth.auth || !auth.token) {
      Swal.fire({
        icon: 'error',
        title: 'No autenticado',
        text: 'Debes iniciar sesión para agregar productos.',
      });
      navigate('/iniciar-sesion', { replace: true });
    }
  }, [auth, navigate]);

  const [producto, guardarProducto] = useState({
    nombre: '',
    precio: '',
  });

  const [archivo, guardarArchivo] = useState('');

  // Leer datos del formulario
  const actualizarState = (e) => {
    guardarProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  // Coloca la imagen en el state
  const leerArchivo = (e) => {
    guardarArchivo(e.target.files[0]);
  };

  // Agregar producto
  const agregarProducto = async (e) => {
    e.preventDefault();

    // Crear un formData
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('precio', producto.precio);
    formData.append('imagen', archivo);

    try {
      const res = await clienteAxios.post('/productos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.token}`, // Asegurar que se envíe el token
        },
      });

      if (res.status === 200) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se agregó correctamente',
          showConfirmButton: false,
          timer: 1500,
        });
      }

      // Redirigir a la lista de productos
      navigate('/productos', { replace: true });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Hubo un error',
        text: 'Vuelve a intentarlo',
      });
    }
  };

  const validarProducto = () => !producto.nombre || !producto.precio || !archivo;

  return (
    <>
      <h2>Nuevo Producto</h2>

      <form onSubmit={agregarProducto}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Producto"
            name="nombre"
            onChange={actualizarState}
            value={producto.nombre}
          />
        </div>

        <div className="campo">
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            min="0.00"
            step="1"
            placeholder="Precio"
            onChange={actualizarState}
            value={producto.precio}
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          <input type="file" name="imagen" onChange={leerArchivo} />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Agregar Producto"
            disabled={validarProducto()}
          />
        </div>
      </form>
    </>
  );
}

export default NuevoProducto;
