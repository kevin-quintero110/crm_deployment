// En tu frontend, crea un archivo src/config.js
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // En producción, Vercel enruta a /api
  : 'http://localhost:5000';  // En desarrollo local

export default API_URL;