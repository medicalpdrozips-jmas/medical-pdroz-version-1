# CRH Assist Migration Roadmap

Roadmap para evolucionar CRH Health Intelligence Core V1 desde datos demo hacia backend real, PostgreSQL e IA productiva sin romper la interfaz actual.

## Fase 1: Frontend + demoData

### Objetivo
Consolidar la experiencia CRH Health Intelligence con datos locales seguros.

### Estado
- Command Center operativo.
- Paciente 360 operativo.
- Historia Clinica Inteligente operativa.
- Contrato PGP 360 operativo.
- Farmacia Inteligente operativa.
- CRH Assist Rules Engine V1/V2 operativo sobre datos demo.

### Criterio de Salida
La UI consume datos consistentes, muestra evaluaciones CRH Assist y permite validar flujos de negocio.

## Fase 2: API Mock

### Objetivo
Estabilizar el contrato funcional entre UI y backend futuro mediante `crhAssistApiMock`.

### Alcance
- `getPatients()`
- `getPatientById()`
- `getPatientClinicalContext()`
- `getContracts()`
- `getContractById()`
- `getContractPatients()`
- `evaluatePatientCRHAssist()`
- `evaluateContractCRHAssist()`
- `getRuleCatalog()`
- `updateRuleStatus()`

### Criterio de Salida
La UI deja de depender directamente de `demoData` en los flujos CRH Assist principales.

## Fase 3: Backend Node/Express

### Objetivo
Crear API REST real con el mismo contrato documentado para reemplazar gradualmente el mock.

### Alcance
- Endpoints `/api/patients`.
- Endpoints `/api/contracts`.
- Endpoints `/api/crh-assist`.
- Adaptadores de servicio para Rules Engine.
- Manejo uniforme de errores.
- Validacion de payloads.

### Criterio de Salida
El frontend puede alternar entre API mock y API real con una capa de configuracion.

## Frontend Backend Bridge

### Objetivo
Permitir que el frontend consuma Express cuando este disponible y caiga automaticamente a `crhAssistApiMock` cuando no lo este.

### Alcance
- `src/api/crhApiClient.js` como capa unica de acceso.
- Timeout basico y manejo uniforme de errores.
- Normalizacion de respuestas backend hacia el shape actual del frontend.
- Indicador visual de `Backend conectado` o `Modo demo / fallback`.
- Migracion de Dashboard, Paciente 360, Historia Clinica, Contrato PGP, Medicamentos y Reglas hacia el cliente unificado.

### Criterio de Salida
La UI opera con backend encendido o apagado sin romper render, sin tocar el Rules Engine y sin depender directamente del mock desde las paginas puenteadas.

## Fase 4: PostgreSQL

### Objetivo
Persistir entidades clinicas, financieras, reglas, evaluaciones, alertas y acciones recomendadas.

### Alcance
- Tablas dominio: `patients`, `clinical_histories`, `diagnoses`, `medications`, `prescriptions`.
- Tablas PGP/operacion: `contracts_pgp`, `consumptions`, `appointments`, `lab_results`.
- Tablas CRH Assist: `crh_assist_rules`, `crh_assist_evaluations`, `crh_assist_alerts`, `recommended_actions`.
- Migraciones versionadas.
- Seeds demo controlados.

### Criterio de Salida
La API real lee y persiste informacion en PostgreSQL manteniendo respuestas compatibles con el frontend.

## PostgreSQL Integration V1

### Objetivo
Habilitar backend Express con conexion progresiva a PostgreSQL sin perder fallback mock ni romper el contrato actual del frontend.

### Alcance
- `server/src/db/pool.js` con activacion opt-in por `USE_DATABASE`.
- `init.sql` y `seed.sql` para esquema inicial y datos demo.
- Servicios backend con estrategia `database -> mock fallback`.
- Endpoint `/api/db/status` para observar estado real de la integracion.

### Criterio de Salida
Con `USE_DATABASE=false` todo sigue funcionando en mock; con `USE_DATABASE=true` el backend intenta usar PostgreSQL y vuelve al mock si la base no esta disponible o no tiene datos.

## Railway Pilot Deployment V1

### Objetivo
Preparar un primer despliegue piloto en Railway para validar runtime, CORS, variables de entorno y fallback mock sin usar datos reales.

### Alcance
- Opcion backend-only en modo mock seguro.
- Opcion backend + PostgreSQL Railway con fallback mock.
- Guardrails de entorno para local, staging y production.
- Checklist de validacion operacional y post-deploy.

### Criterio de Salida
Railway puede levantar el backend, responder `health`, `runtime` y `db/status`, y seguir operando con datos demo no sensibles aunque PostgreSQL no este activo.

## Fase 5: Autenticacion y Roles

### Objetivo
Proteger acceso por rol y preparar trazabilidad institucional.

### Roles Iniciales
- Administrador.
- Gerencia.
- Medico.
- Enfermeria.
- Farmacia.
- Auditoria.
- Auxiliar administrativo.

### Criterio de Salida
Cada rol accede solo a modulos, datos y acciones permitidas; cambios de reglas quedan auditados.

## Fase 6: Integracion HIS/ERP Real

### Objetivo
Conectar CRH Health Intelligence con fuentes transaccionales reales sin cambiar la experiencia de usuario.

### Alcance
- Pacientes y citas desde HIS.
- Historias, diagnosticos, ordenes y laboratorios desde HIS.
- Medicamentos, inventario y dispensacion desde farmacia/ERP.
- Contratos, costos y consumos desde ERP/BI.
- Jobs de sincronizacion y reconciliacion.

### Criterio de Salida
CRH Assist evalua sobre datos reales normalizados y mantiene trazabilidad de origen.

## Fase 7: IA Real Sobre CRH Assist

### Objetivo
Agregar capacidades IA sobre el motor interpretable sin perder control clinico-financiero.

### Alcance
- Explicaciones asistidas por IA con fuentes y reglas trazables.
- Priorizacion de casos.
- Resumen clinico-financiero por paciente y contrato.
- Deteccion de inconsistencias documentales.
- Simulacion de escenarios PGP.
- Guardrails para no reemplazar criterio clinico.

### Criterio de Salida
La IA opera como capa de asistencia, conserva evidencia, respeta roles y no altera reglas criticas sin aprobacion.
