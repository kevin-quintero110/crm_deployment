import React, { Fragment, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from './componentes/layout/Header';
import Navegacion from "./componentes/layout/Navegacion";
import Clientes from "./componentes/clientes/Clientes";
import NuevoCliente from "./componentes/clientes/NuevoCliente";
import EditarCliente from "./componentes/clientes/EditarCliente";
import Productos from "./componentes/productos/Productos";
import NuevoProducto from './componentes/productos/NuevoProducto';
import EditarProducto from './componentes/productos/EditarProducto';
import Pedidos from "./componentes/pedidos/Pedidos";
import NuevoPedido from "./componentes/pedidos/NuevoPedido";
import Login from "./componentes/auth/Login";
import { CRMContext } from "./context/CRMContext";

function App() {
  const [auth] = useContext(CRMContext);

  return (
    <Fragment>
      <Header />
      <div className="grid contenedor contenido-principal">
        <Navegacion />
        <main className="caja-contenido col-9">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/iniciar-sesion" element={<Login />} />

            {/* Rutas privadas */}
            <Route
              path="/"
              element={auth.auth || localStorage.getItem("token") ? <Clientes /> : <Navigate to="/iniciar-sesion" />}
            />
            <Route
              path="/clientes/nuevo"
              element={auth.auth || localStorage.getItem("token") ? <NuevoCliente /> : <Navigate to="/iniciar-sesion" />}
            />
            <Route
              path="/clientes/editar/:id"
              element={auth.auth || localStorage.getItem("token") ? <EditarCliente /> : <Navigate to="/iniciar-sesion" />}
            />
            <Route
              path="/productos"
              element={auth.auth || localStorage.getItem("token") ? <Productos /> : <Navigate to="/iniciar-sesion" />}
            />
            <Route
              path="/productos/nuevo"
              element={auth.auth || localStorage.getItem("token") ? <NuevoProducto /> : <Navigate to="/iniciar-sesion" />}
            />
            <Route
              path="/productos/editar/:id"
              element={auth.auth || localStorage.getItem("token") ? <EditarProducto /> : <Navigate to="/iniciar-sesion" />}
            />
            <Route
              path="/pedidos"
              element={auth.auth || localStorage.getItem("token") ? <Pedidos /> : <Navigate to="/iniciar-sesion" />}
            />
            <Route
              path="/pedidos/nuevo/:id"
              element={auth.auth || localStorage.getItem("token") ? <NuevoPedido /> : <Navigate to="/iniciar-sesion" />}
            />

            {/* Ruta para manejar cualquier ruta no definida */}
            <Route path="*" element={<Navigate to="/iniciar-sesion" />} />
          </Routes>
        </main>
      </div>
    </Fragment>
  );
}

export default App;
