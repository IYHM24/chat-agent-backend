# API Backend con Express.js

Backend desarrollado con Node.js y Express.js siguiendo las mejores prácticas de arquitectura.

## 📁 Estructura del Proyecto

```
Backend/
├── src/
│   ├── config/          # Configuraciones (DB, env, etc.)
│   ├── controllers/     # Controladores de rutas
│   ├── middlewares/     # Middlewares personalizados
│   ├── models/          # Modelos de datos
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades y helpers
│   └── app.js           # Configuración de Express
├── .env.example         # Ejemplo de variables de entorno
├── .gitignore
├── package.json
└── server.js            # Punto de entrada
```

## 🚀 Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   pnpm install
   ```

3. Crear archivo `.env` basado en `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configurar las variables de entorno en `.env`

## 📦 Scripts Disponibles

```bash
# Desarrollo (con nodemon)
pnpm dev

# Producción
pnpm start
```

## 🔧 Configuración

### Variables de Entorno

Edita el archivo `.env` con tus configuraciones:

- `PORT`: Puerto del servidor (default: 3000)
- `NODE_ENV`: Entorno de ejecución (development/production)
- `DB_URI`: URI de conexión a la base de datos
- `JWT_SECRET`: Clave secreta para JWT
- `CORS_ORIGIN`: Origen permitido para CORS

## 📚 Endpoints Principales

### Autenticación (JWT)
- `POST /api/v1/auth/register` - Registrar usuario y obtener token
- `POST /api/v1/auth/login` - Iniciar sesión y obtener token
- `GET /api/v1/auth/me` - Obtener usuario actual (requiere token)

**Ver documentación completa**: [AUTH_ENDPOINTS.md](AUTH_ENDPOINTS.md)

### Usuarios
- `GET /api/v1/users` - Listar usuarios (requiere admin)
- `GET /api/v1/users/:id` - Obtener usuario por ID
- `POST /api/v1/users` - Crear usuario (requiere admin)
- `PUT /api/v1/users/:id` - Actualizar usuario
- `DELETE /api/v1/users/:id` - Eliminar usuario (requiere admin)

### Health Check
- `GET /health` - Verificar estado del servidor

## 🏗️ Arquitectura

### Capas de la Aplicación

1. **Routes**: Define los endpoints y aplica middlewares
2. **Controllers**: Maneja las peticiones HTTP y respuestas
3. **Services**: Contiene la lógica de negocio
4. **Models**: Define la estructura de datos
5. **Middlewares**: Funciones intermedias (auth, validación, errores)
6. **Utils**: Funciones auxiliares reutilizables

### Patrones Implementados

- **MVC (Model-View-Controller)**: Separación de responsabilidades
- **Service Layer**: Lógica de negocio aislada
- **Error Handling**: Manejo centralizado de errores
- **Async Handler**: Wrapper para funciones asíncronas
- **API Response**: Respuestas consistentes

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para autenticación:

1. El usuario se registra o inicia sesión en `/api/v1/auth/register` o `/api/v1/auth/login`
2. El servidor valida las credenciales y genera un token JWT
3. El servidor devuelve el token junto con la información del usuario
4. El cliente incluye el token en el header de cada petición: `Authorization: Bearer <token>`
5. El middleware `protect` valida el token y busca el usuario en la base de datos
6. Las rutas protegidas tienen acceso al usuario en `req.user`

**Estructura del token JWT:**
```javascript
{
  id: 1,          // ID del usuario
  role: "user",   // Rol del usuario
  iat: 1704710400,  // Timestamp de emisión
  exp: 1705315200   // Timestamp de expiración (7 días)
}
```

**Ejemplo de uso:**
```bash
# 1. Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Respuesta: { "token": "eyJhbGc..." }

# 2. Usar el token
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

**Documentación completa**: [AUTH_ENDPOINTS.md](AUTH_ENDPOINTS.md)

## 🛡️ Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso entre orígenes
- **Validación**: express-validator para validar datos de entrada
- **Password Hashing**: bcryptjs para hashear contraseñas

## 📝 Notas

- Los archivos en `models/` incluyen ejemplos para Mongoose (MongoDB) y Sequelize (PostgreSQL/MySQL)
- Descomenta y configura el código según tu base de datos
- Los servicios están preparados para implementar la lógica de negocio
- Los controladores usan placeholders que debes reemplazar con tu lógica real

## 🚧 Próximos Pasos

1. Instalar las dependencias: `pnpm install`
2. Configurar tu base de datos en `src/config/database.js`
3. Descomentar el código de los modelos según tu DB
4. Implementar la lógica real en servicios y controladores
5. Agregar más rutas según tus necesidades
6. Configurar variables de entorno en `.env`
7. Ejecutar el servidor: `pnpm dev`

## 📄 Licencia

ISC

---

Desarrollado por Nycolt
