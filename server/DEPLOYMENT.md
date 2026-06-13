# Deployment Guardrails

Guia de despliegue seguro para Railway y ambientes local, staging y production.

## Railway Pilot Deployment V1

Hay dos rutas recomendadas para el piloto.

### Opcion A: Solo backend `server/` en Railway

Usa esta opcion cuando quieres validar que la API Express publica responde bien, pero todavia quieres operar en modo mock seguro.

Variables minimas:

```env
NODE_ENV=production
PORT=4000
USE_DATABASE=false
CORS_ORIGIN=https://tu-frontend.example.com
DATABASE_URL=
DB_SSL=false
```

Pasos:

1. Crear un servicio en Railway apuntando a la carpeta `server/`.
2. Si Railway detecta el repo desde la raiz, configurar Root Directory=`server`.
3. Confirmar que el start command sea `npm run start`.
4. Desplegar.
5. Validar:
   - `GET /api/health`
   - `GET /api/runtime`
   - `GET /api/db/status`

Resultado esperado:

- backend arriba
- `databaseMode=mock`
- fallback mock intacto

### Opcion B: Backend + PostgreSQL Railway

Usa esta opcion cuando quieres probar la integracion progresiva a base de datos sin desactivar el fallback mock.

Variables:

```env
NODE_ENV=production
PORT=4000
USE_DATABASE=true
CORS_ORIGIN=https://tu-frontend.example.com
DATABASE_URL=postgres://...
DB_SSL=true
```

Pasos:

1. Crear servicio backend en Railway.
2. Crear servicio PostgreSQL en Railway.
3. Copiar `DATABASE_URL` del servicio PostgreSQL.
4. Configurar variables del backend.
5. Ejecutar migraciones:

```bash
npm run db:migrate
```

6. Ejecutar verificacion:

```bash
npm run db:check
```

7. Iniciar o redeploy del backend.
8. Validar:
   - `GET /api/health`
   - `GET /api/runtime`
   - `GET /api/db/status`

Resultado esperado:

- si PostgreSQL responde, `databaseMode=database` o `database-pending`
- si PostgreSQL falla, el backend sigue arriba en `fallback-mock`

## Variables requeridas

Base minima:

```env
NODE_ENV=production
PORT=4000
USE_DATABASE=false
CORS_ORIGIN=https://tu-frontend.example.com
DATABASE_URL=
DB_SSL=false
```

Si activas PostgreSQL:

```env
USE_DATABASE=true
DATABASE_URL=postgres://...
DB_SSL=true
```

## Start command

```bash
npm run start
```

## Comandos utiles

```bash
npm run predeploy:check
npm run db:migrate
npm run db:check
```

## Health check

Usar:

```text
/api/health
```

Tambien es util validar:

```text
/api/db/status
/api/runtime
```

## Activar PostgreSQL

1. Configurar `USE_DATABASE=true`.
2. Pegar `DATABASE_URL` de Railway PostgreSQL.
3. Si Railway exige SSL, usar `DB_SSL=true`.
4. Ejecutar migraciones:

```bash
npm run db:migrate
```

5. Verificar:

```bash
npm run db:check
```

## Rollback seguro

Si PostgreSQL falla o quieres volver al modo demo:

```env
USE_DATABASE=false
```

Luego redeploy o reinicia el servicio. El backend vuelve a mock fallback sin tocar frontend ni Rules Engine.
