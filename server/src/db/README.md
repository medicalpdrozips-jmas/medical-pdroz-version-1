# CRH DB

Guia operativa para la capa PostgreSQL del backend CRH Health Intelligence Core V1.

## Modo seguro

- `USE_DATABASE=false`: backend 100% mock, sin dependencia de PostgreSQL.
- `USE_DATABASE=true`: backend intenta usar PostgreSQL.
- Si PostgreSQL falla o no esta listo, los servicios vuelven a mock automaticamente.

## Crear base local

```sql
create database crh_health;
```

## Configurar variables

Crear `server/.env` a partir de `server/.env.example`:

```env
PORT=4000
DATABASE_URL=postgres://usuario:password@localhost:5432/crh_health
DB_SSL=false
USE_DATABASE=true
```

## Ejecutar migraciones

La forma recomendada es:

```bash
npm run db:migrate
```

El script:

- crea `public.schema_migrations` si no existe
- ejecuta archivos en `src/db/migrations/`
- evita correr dos veces la misma migracion

## Ejecutar seed demo

El seed demo ya forma parte de las migraciones versionadas.

Si necesitas reprocesarlo en una base vacia:

```bash
npm run db:migrate
```

## Verificar estado de DB

```bash
npm run db:check
```

La revision informa:

- si la DB esta habilitada o no
- version de PostgreSQL
- existencia de tablas principales
- conteo de pacientes, contratos y reglas

## Railway PostgreSQL

1. Crear un servicio PostgreSQL en Railway.
2. Copiar el `DATABASE_URL` generado por Railway.
3. Configurarlo en `server/.env` o en variables del servicio backend.
4. Definir `USE_DATABASE=true`.
5. Si Railway exige SSL, usar `DB_SSL=true`.
6. Ejecutar:

```bash
npm run db:migrate
npm run db:check
```

7. Iniciar backend:

```bash
npm run start
```

## Volver a modo mock

```env
USE_DATABASE=false
```

Con eso el backend vuelve a modo demo sin necesitar PostgreSQL local ni Railway.
