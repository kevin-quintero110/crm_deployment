import React, { createContext, useState, useEffect } from 'react';

// Crear contexto
export const CRMContext = createContext();

// Componente proveedor de contexto
export const CRMProvider = (props) => {
  const [auth, guardarAuth] = useState({
    token: localStorage.getItem('token'),
    auth: !!localStorage.getItem('token'), // Si hay token, auth es true
  });

  useEffect(() => {
    // Si el token cambia, actualizamos el estado
    if (localStorage.getItem('token')) {
      guardarAuth({
        token: localStorage.getItem('token'),
        auth: true,
      });
    }
  }, []);

  return (
    <CRMContext.Provider value={[auth, guardarAuth]}>
      {props.children}
    </CRMContext.Provider>
  );
};
