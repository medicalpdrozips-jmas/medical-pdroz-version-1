# CRH Railway Pilot Checklist

- Backend desplegado en Railway.
- `GET /api/health` responde `ok`.
- `GET /api/runtime` responde sin exponer secretos.
- `GET /api/db/status` responde con modo correcto.
- El frontend usa `VITE_CRH_API_URL`.
- El fallback mock fue validado.
- PostgreSQL esta desactivado o activado segun la fase del piloto.
- Solo se usan datos demo no sensibles.
- No usar historias clinicas reales todavia.
- Confirmar `CORS_ORIGIN` correcto para el frontend del piloto.
- Confirmar `USE_DATABASE=false` si el piloto es backend-only.
- Si el piloto usa PostgreSQL, correr `npm run db:migrate`.
- Si el piloto usa PostgreSQL, correr `npm run db:check`.
