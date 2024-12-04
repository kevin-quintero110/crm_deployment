import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';
import Spinner from '../layout/Spinner';

function EditarProducto() {
  const { id } = useParams();
  const [auth, guardarAuth] = useContext(CRMContext);
  const [producto, guardarProducto] = useState({
    nombre: '',
    precio: '',
    imagen: ''
  });
  const [archivo, guardarArchivo] = useState('');
  let navigate = useNavigate();

  // Verificar autenticación y redirigir si no está autenticado
  useEffect(() => {
    if (!auth.auth && !localStorage.getItem('token')) {
      navigate('/iniciar-sesion', { replace: true });
    }

    const consultarAPI = async () => {
      const token = localStorage.getItem('token');
      try {
        const productoConsulta = await clienteAxios.get(`/productos/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        guardarProducto(productoConsulta.data);
      } catch (error) {
        console.error("Error al consultar el producto:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener el producto',
          text: 'Por favor, intente nuevamente.'
        });
      }
    };
    consultarAPI();
  }, [auth, id, navigate]);

  // Editar un producto
  const editarProducto = async e => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    // Crear un formData
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('precio', producto.precio);
    formData.append('imagen', archivo);

    try {
      const res = await clienteAxios.put(`/productos/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Producto editado correctamente",
          showConfirmButton: false,
          timer: 1500
        });
      }

      // Redirigir a la lista de productos
      navigate('/productos', { replace: true });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Hubo un error',
        text: 'Vuelva a intentarlo'
      });
    }
  };

  // Leer datos del formulario
  const leerInformacionProducto = e => {
    guardarProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  // Colocar la imagen en el state
  const leerArchivo = e => {
    guardarArchivo(e.target.files[0]);
  };

  const { nombre, precio, imagen } = producto;

  if (!nombre) return <Spinner />;

  return (
    <>
      <h2>Actualizar Producto</h2>
      <form onSubmit={editarProducto}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Producto"
            name="nombre"
            onChange={leerInformacionProducto}
            value={nombre}
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
            onChange={leerInformacionProducto}
            value={precio}
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          {imagen ? (
            <img src={`http://localhost:5000/${imagen}`} alt="imagen" width="300" />
          ) : null}
          <input
            type="file"
            name="imagen"
            onChange={leerArchivo}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Actualizar Producto"
          />
        </div>
      </form>
    </>
  );
}

export default EditarProducto;
