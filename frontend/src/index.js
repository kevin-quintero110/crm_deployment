import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CRMProvider } from "./context/CRMContext";
import { BrowserRouter as Router } from 'react-router-dom'; // Importa Router

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CRMProvider>
    <Router> {/* Envolver la aplicación con Router */}
      <App />
    </Router>
  </CRMProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
