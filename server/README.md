# CRH Health Intelligence Backend

Backend skeleton para CRH Health Intelligence Core V1. Esta fase prepara una API Node/Express compatible con el contrato tecnico documentado, sin conectar todavia PostgreSQL real ni reemplazar `crhAssistApiMock`.

## Estado Actual

- Modo: mock/API skeleton.
- Framework: Node.js + Express.
- Datos: reutiliza datos demo y Rules Engine existentes del frontend.
- PostgreSQL: solo borrador inicial en `src/db/schema.sql`.

## PostgreSQL Integration V1

La integracion V1 es progresiva y segura:

- Si `USE_DATABASE=false`, el backend funciona completamente en modo mock.
- Si `USE_DATABASE=true` pero la base no existe, no responde o no tiene datos, los servicios hacen fallback automatico al mock.
- El frontend no necesita cambios para seguir consumiendo la API.

### 1. Crear la base `crh_health`

```sql
create database crh_health;
```

### 2. Ejecutar el esquema inicial

```bash
npm run db:migrate
```

### 3. Cargar datos demo

```bash
npm run db:migrate
```

### 4. Configurar variables

Copiar `.env.example` a `.env` y ajustar valores:

```env
NODE_ENV=development
PORT=4000
USE_DATABASE=true
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=postgres://usuario:password@localhost:5432/crh_health
DB_SSL=false
```

### 5. Volver a modo mock

Solo cambia:

```env
USE_DATABASE=false
```

Con eso el backend vuelve a servir datos mock sin requerir PostgreSQL.

## Instalacion

```bash
cd server
npm install
```

## Ejecutar

Comando local:

```bash
npm run dev
```

o:

```bash
npm run start
```

Por defecto escucha en `http://localhost:4000`. Se puede cambiar con `PORT=4001`.

## Endpoints Disponibles

- `GET /api/health`
- `GET /api/db/status`
- `GET /api/runtime`
- `GET /api/patients`
- `GET /api/patients/:id`
- `GET /api/patients/:id/clinical-context`
- `GET /api/contracts`
- `GET /api/contracts/:id`
- `GET /api/contracts/:id/patients`
- `GET /api/crh-assist/rules`
- `GET /api/crh-assist/patient/:id`
- `GET /api/crh-assist/contract/:id`
- `POST /api/crh-assist/evaluate`
- `PATCH /api/crh-assist/rules/:id/status`

## Railway PostgreSQL Pilot Setup

1. Crear un servicio PostgreSQL en Railway.
2. Copiar el `DATABASE_URL` generado por Railway.
3. Crear `server/.env` o configurar variables del backend con:

```env
DATABASE_URL=postgres://...
USE_DATABASE=true
DB_SSL=true
PORT=4000
CORS_ORIGIN=https://tu-frontend.example.com
```

4. Ejecutar migraciones:

```bash
npm run db:migrate
```

5. Verificar estado de la base:

```bash
npm run db:check
```

6. Iniciar backend:

```bash
npm run start
```

7. Si necesitas volver a modo seguro demo:

```env
USE_DATABASE=false
```

## Railway Variables Minimas

Backend-only piloto:

```env
NODE_ENV=production
PORT=4000
USE_DATABASE=false
CORS_ORIGIN=https://tu-frontend.example.com
DATABASE_URL=
DB_SSL=false
```

Backend + PostgreSQL piloto:

```env
NODE_ENV=production
PORT=4000
USE_DATABASE=true
CORS_ORIGIN=https://tu-frontend.example.com
DATABASE_URL=postgres://...
DB_SSL=true
```

## Deploy Command

```bash
npm run predeploy:check
npm run start
```

## Validacion Post-Deploy

- `GET /api/health`
- `GET /api/runtime`
- `GET /api/db/status`
- Confirmar que el frontend use `VITE_CRH_API_URL`
- Confirmar que el fallback mock siga disponible si PostgreSQL no esta activo
- No usar datos reales ni historias clinicas reales en esta fase

## Deployment

La guia de despliegue y guardrails para Railway vive en [DEPLOYMENT.md](./DEPLOYMENT.md).

## Siguiente Paso

Conectar `server/src/db/pool.js` a PostgreSQL real, crear migraciones versionadas basadas en `src/db/schema.sql` y sustituir gradualmente los servicios mock por queries/repositorios.
