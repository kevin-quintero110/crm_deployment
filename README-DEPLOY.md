Resumen de deploy en Vercel

Variables de entorno necesarias (Configurar en Vercel Project -> Settings -> Environment Variables):

- `DB_URL` : URL de conexión a MongoDB (ej. Mongo Atlas)
- `FRONTEND_URL` : URL del frontend (opcional, para CORS)
- `JWT_SECRET` : secreto para tokens JWT

Notas importantes:
- Las subidas a `/uploads` no persisten en funciones serverless. Para producción usa S3, Cloudinary u otro almacenamiento externo y actualiza el controlador de archivos.
- El frontend consume la API en `/api` por defecto. Para local puedes usar `REACT_APP_API_URL`.

Comandos locales útiles:
```bash
# instalar dependencias raíz (incluye las del backend para funciones)
npm install

# instalar frontend deps y ejecutar en desarrollo
cd frontend && npm install && npm start

# construir frontend localmente
cd frontend && npm run build

# ejecutar vercel dev (requiere vercel CLI)
vercel dev
```
