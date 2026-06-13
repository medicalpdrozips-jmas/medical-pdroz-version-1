-- =========================================================
-- MEDICAL PDROZ IPS
-- Esquema inicial PostgreSQL para IPS multisede
-- Preparado para integración futura con API REST y frontend
-- =========================================================

BEGIN;

-- Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Esquema principal
CREATE SCHEMA IF NOT EXISTS medical;

SET search_path TO medical, public;

-- =========================================================
-- 1. SEGURIDAD Y USUARIOS
-- =========================================================

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE roles IS 'Catálogo de roles funcionales de la plataforma.';

CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    nombres VARCHAR(120) NOT NULL,
    apellidos VARCHAR(120) NOT NULL,
    telefono VARCHAR(30),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_acceso_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE usuarios IS 'Usuarios de acceso a la plataforma con autenticación futura.';

CREATE TABLE IF NOT EXISTS usuario_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    rol_id UUID NOT NULL REFERENCES roles(id),
    fecha_asignacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    observaciones TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uq_usuario_rol UNIQUE (usuario_id, rol_id)
);

COMMENT ON TABLE usuario_roles IS 'Relación N a N entre usuarios y roles.';

-- =========================================================
-- 2. SEDES
-- =========================================================

CREATE TABLE IF NOT EXISTS sedes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(120) NOT NULL UNIQUE,
    ciudad VARCHAR(120) NOT NULL,
    direccion VARCHAR(180),
    telefono VARCHAR(30),
    correo VARCHAR(150),
    estado_operativo VARCHAR(50) NOT NULL DEFAULT 'activa',
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE sedes IS 'Sedes físicas de la IPS con cobertura multisede.';

CREATE TABLE IF NOT EXISTS servicios_sede (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sede_id UUID NOT NULL REFERENCES sedes(id),
    codigo_servicio VARCHAR(50) NOT NULL,
    nombre_servicio VARCHAR(120) NOT NULL,
    descripcion TEXT,
    habilitado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uq_servicio_sede UNIQUE (sede_id, codigo_servicio)
);

COMMENT ON TABLE servicios_sede IS 'Servicios habilitados por sede.';

-- =========================================================
-- 3. PACIENTES
-- =========================================================

CREATE TABLE IF NOT EXISTS pacientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sede_id UUID REFERENCES sedes(id),
    tipo_documento VARCHAR(20) NOT NULL,
    numero_documento VARCHAR(40) NOT NULL UNIQUE,
    nombres VARCHAR(120) NOT NULL,
    apellidos VARCHAR(120) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(20),
    genero VARCHAR(50),
    ciudad_residencia VARCHAR(120),
    direccion_residencia VARCHAR(180),
    diagnostico_principal VARCHAR(200),
    estado VARCHAR(50) NOT NULL DEFAULT 'activo',
    observaciones TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE pacientes IS 'Registro maestro de pacientes de la IPS.';

CREATE TABLE IF NOT EXISTS contactos_paciente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id),
    tipo_contacto VARCHAR(40) NOT NULL,
    nombre_contacto VARCHAR(160),
    parentesco VARCHAR(80),
    telefono VARCHAR(30),
    correo VARCHAR(150),
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE contactos_paciente IS 'Contactos personales o de emergencia del paciente.';

CREATE TABLE IF NOT EXISTS aseguramiento_paciente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id),
    eps VARCHAR(150) NOT NULL,
    regimen VARCHAR(80),
    plan_beneficios VARCHAR(120),
    numero_afiliacion VARCHAR(60),
    vigencia_desde DATE,
    vigencia_hasta DATE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE aseguramiento_paciente IS 'Información de afiliación y cobertura del paciente.';

-- =========================================================
-- 4. CITAS
-- =========================================================

CREATE TABLE IF NOT EXISTS estados_cita (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE estados_cita IS 'Catálogo de estados operativos de las citas.';

CREATE TABLE IF NOT EXISTS citas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sede_id UUID NOT NULL REFERENCES sedes(id),
    paciente_id UUID NOT NULL REFERENCES pacientes(id),
    profesional_id UUID,
    estado_cita_id UUID NOT NULL REFERENCES estados_cita(id),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    motivo TEXT,
    observaciones TEXT,
    canal_agendamiento VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE citas IS 'Agenda asistencial de pacientes por sede y profesional.';

-- =========================================================
-- 5. HISTORIA CLÍNICA
-- =========================================================

CREATE TABLE IF NOT EXISTS historias_clinicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL UNIQUE REFERENCES pacientes(id),
    numero_historia VARCHAR(40) NOT NULL UNIQUE,
    confidencial BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE historias_clinicas IS 'Historia clínica maestra del paciente.';

CREATE TABLE IF NOT EXISTS atenciones_medicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    historia_clinica_id UUID NOT NULL REFERENCES historias_clinicas(id),
    cita_id UUID REFERENCES citas(id),
    profesional_id UUID,
    sede_id UUID REFERENCES sedes(id),
    fecha_atencion TIMESTAMPTZ NOT NULL,
    motivo_consulta TEXT,
    enfermedad_actual TEXT,
    antecedentes TEXT,
    examen_fisico TEXT,
    plan_manejo TEXT,
    formula_medica TEXT,
    ordenes TEXT,
    evolucion TEXT,
    firma_profesional TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE atenciones_medicas IS 'Registro de cada atención clínica realizada.';

CREATE TABLE IF NOT EXISTS diagnosticos_atencion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    atencion_medica_id UUID NOT NULL REFERENCES atenciones_medicas(id),
    codigo_cie10 VARCHAR(20) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    tipo_diagnostico VARCHAR(40) DEFAULT 'principal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE diagnosticos_atencion IS 'Diagnósticos asociados a una atención médica.';

CREATE TABLE IF NOT EXISTS procedimientos_atencion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    atencion_medica_id UUID NOT NULL REFERENCES atenciones_medicas(id),
    codigo_procedimiento VARCHAR(30),
    nombre_procedimiento VARCHAR(180) NOT NULL,
    descripcion TEXT,
    resultado TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE procedimientos_atencion IS 'Procedimientos realizados durante la atención.';

-- =========================================================
-- 6. PERSONAL MÉDICO/ASISTENCIAL
-- =========================================================

CREATE TABLE IF NOT EXISTS profesionales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID UNIQUE REFERENCES usuarios(id),
    sede_id UUID REFERENCES sedes(id),
    tipo_documento VARCHAR(20),
    numero_documento VARCHAR(40) UNIQUE,
    nombres VARCHAR(120) NOT NULL,
    apellidos VARCHAR(120) NOT NULL,
    registro_profesional VARCHAR(80),
    tipo_profesional VARCHAR(80) NOT NULL,
    telefono VARCHAR(30),
    correo VARCHAR(150),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE profesionales IS 'Talento humano médico y asistencial vinculado a la IPS.';

CREATE TABLE IF NOT EXISTS especialidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(40) NOT NULL UNIQUE,
    nombre VARCHAR(120) NOT NULL UNIQUE,
    descripcion TEXT,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE especialidades IS 'Especialidades clínicas y líneas de atención.';

CREATE TABLE IF NOT EXISTS profesional_especialidad (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profesional_id UUID NOT NULL REFERENCES profesionales(id),
    especialidad_id UUID NOT NULL REFERENCES especialidades(id),
    principal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uq_profesional_especialidad UNIQUE (profesional_id, especialidad_id)
);

COMMENT ON TABLE profesional_especialidad IS 'Relación entre profesionales y especialidades.';

-- =========================================================
-- 7. FARMACIA
-- =========================================================

CREATE TABLE IF NOT EXISTS medicamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(180) NOT NULL,
    presentacion VARCHAR(120),
    concentracion VARCHAR(80),
    unidad_medida VARCHAR(50),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE medicamentos IS 'Catálogo maestro de medicamentos.';

CREATE TABLE IF NOT EXISTS inventario_medicamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sede_id UUID NOT NULL REFERENCES sedes(id),
    medicamento_id UUID NOT NULL REFERENCES medicamentos(id),
    lote VARCHAR(80),
    fecha_vencimiento DATE,
    stock_actual NUMERIC(14,2) NOT NULL DEFAULT 0,
    stock_minimo NUMERIC(14,2) NOT NULL DEFAULT 0,
    stock_maximo NUMERIC(14,2),
    ubicacion VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE inventario_medicamentos IS 'Existencias de medicamentos por sede y lote.';

CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventario_medicamento_id UUID NOT NULL REFERENCES inventario_medicamentos(id),
    tipo_movimiento VARCHAR(30) NOT NULL,
    cantidad NUMERIC(14,2) NOT NULL,
    fecha_movimiento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    referencia VARCHAR(100),
    observaciones TEXT,
    usuario_id UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE movimientos_inventario IS 'Entradas, salidas y ajustes del inventario farmacéutico.';

CREATE TABLE IF NOT EXISTS dispensaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id),
    atencion_medica_id UUID REFERENCES atenciones_medicas(id),
    medicamento_id UUID NOT NULL REFERENCES medicamentos(id),
    sede_id UUID REFERENCES sedes(id),
    fecha_dispensacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dosis VARCHAR(80),
    frecuencia VARCHAR(80),
    duracion VARCHAR(80),
    estado_entrega VARCHAR(50) NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE dispensaciones IS 'Registro de entregas de medicamentos a pacientes.';

-- =========================================================
-- 8. LABORATORIO CLÍNICO
-- =========================================================

CREATE TABLE IF NOT EXISTS examenes_laboratorio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(40) NOT NULL UNIQUE,
    nombre VARCHAR(180) NOT NULL,
    descripcion TEXT,
    unidad_resultado VARCHAR(50),
    valor_referencia TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE examenes_laboratorio IS 'Catálogo de exámenes de laboratorio.';

CREATE TABLE IF NOT EXISTS ordenes_laboratorio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_orden VARCHAR(40) NOT NULL UNIQUE,
    paciente_id UUID NOT NULL REFERENCES pacientes(id),
    atencion_medica_id UUID REFERENCES atenciones_medicas(id),
    sede_id UUID REFERENCES sedes(id),
    fecha_orden TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    observaciones TEXT,
    archivo_adjunto TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE ordenes_laboratorio IS 'Órdenes clínicas de laboratorio generadas por atención.';

CREATE TABLE IF NOT EXISTS resultados_laboratorio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_laboratorio_id UUID NOT NULL REFERENCES ordenes_laboratorio(id),
    examen_laboratorio_id UUID NOT NULL REFERENCES examenes_laboratorio(id),
    fecha_resultado TIMESTAMPTZ,
    valor_resultado TEXT,
    interpretacion TEXT,
    estado VARCHAR(50) NOT NULL DEFAULT 'en_proceso',
    alerta VARCHAR(100),
    validado_por UUID REFERENCES profesionales(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE resultados_laboratorio IS 'Resultados emitidos por examen y orden de laboratorio.';

-- =========================================================
-- 9. PRODUCTIVIDAD Y OPERACIÓN
-- =========================================================

CREATE TABLE IF NOT EXISTS indicadores_operacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sede_id UUID REFERENCES sedes(id),
    nombre_indicador VARCHAR(120) NOT NULL,
    categoria VARCHAR(80),
    periodo DATE NOT NULL,
    valor NUMERIC(14,2) NOT NULL,
    unidad VARCHAR(30),
    observaciones TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE indicadores_operacion IS 'Indicadores operativos por sede y periodo.';

CREATE TABLE IF NOT EXISTS metas_sede (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sede_id UUID NOT NULL REFERENCES sedes(id),
    nombre_meta VARCHAR(120) NOT NULL,
    periodo DATE NOT NULL,
    valor_meta NUMERIC(14,2) NOT NULL,
    unidad VARCHAR(30),
    observaciones TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE metas_sede IS 'Metas institucionales definidas por sede.';

CREATE TABLE IF NOT EXISTS alertas_operacionales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sede_id UUID REFERENCES sedes(id),
    categoria VARCHAR(80) NOT NULL,
    prioridad VARCHAR(30) NOT NULL,
    titulo VARCHAR(160) NOT NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(40) NOT NULL DEFAULT 'abierta',
    fecha_alerta TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    responsable_id UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE alertas_operacionales IS 'Alertas gerenciales y operativas de seguimiento.';

-- =========================================================
-- 10. AUDITORÍA
-- =========================================================

CREATE TABLE IF NOT EXISTS auditoria_eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id),
    modulo VARCHAR(80) NOT NULL,
    entidad VARCHAR(80) NOT NULL,
    entidad_id UUID,
    accion VARCHAR(40) NOT NULL,
    detalle JSONB,
    direccion_ip INET,
    user_agent TEXT,
    fecha_evento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE auditoria_eventos IS 'Trazabilidad de eventos relevantes de la plataforma.';

-- =========================================================
-- 11. PROGRAMAS CLÍNICOS Y SEGUIMIENTO LONGITUDINAL
-- =========================================================

CREATE TABLE IF NOT EXISTS programas_clinicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    descripcion TEXT,
    tipo_programa VARCHAR(80),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE programas_clinicos IS 'Líneas especiales de atención clínica y programas institucionales.';

CREATE TABLE IF NOT EXISTS paciente_programa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id),
    programa_clinico_id UUID NOT NULL REFERENCES programas_clinicos(id),
    fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
    estado VARCHAR(50) NOT NULL DEFAULT 'activo',
    nivel_riesgo VARCHAR(20) NOT NULL DEFAULT 'BAJO',
    observaciones TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uq_paciente_programa UNIQUE (paciente_id, programa_clinico_id),
    CONSTRAINT chk_paciente_programa_riesgo CHECK (nivel_riesgo IN ('BAJO', 'MEDIO', 'ALTO', 'CRITICO'))
);

COMMENT ON TABLE paciente_programa IS 'Relación de pacientes vinculados a programas clínicos.';

CREATE TABLE IF NOT EXISTS seguimientos_paciente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id),
    programa_clinico_id UUID REFERENCES programas_clinicos(id),
    profesional_id UUID REFERENCES profesionales(id),
    sede_id UUID REFERENCES sedes(id),
    fecha_seguimiento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tipo_seguimiento VARCHAR(80) NOT NULL,
    descripcion TEXT,
    resultado TEXT,
    recomendaciones TEXT,
    fecha_proximo_control DATE,
    requiere_alerta BOOLEAN NOT NULL DEFAULT FALSE,
    estado VARCHAR(50) NOT NULL DEFAULT 'registrado',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE seguimientos_paciente IS 'Seguimiento longitudinal clínico y operativo por paciente y programa.';

CREATE TABLE IF NOT EXISTS riesgos_paciente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id),
    categoria_riesgo VARCHAR(80) NOT NULL,
    puntaje NUMERIC(10,2) NOT NULL DEFAULT 0,
    clasificacion VARCHAR(20) NOT NULL,
    factores JSONB NOT NULL DEFAULT '{}'::JSONB,
    fecha_calculo TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_riesgos_paciente_clasificacion CHECK (clasificacion IN ('BAJO', 'MEDIO', 'ALTO'))
);

COMMENT ON TABLE riesgos_paciente IS 'Motor base de riesgo clínico para analítica predictiva futura.';

CREATE TABLE IF NOT EXISTS alertas_clinicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id),
    programa_clinico_id UUID REFERENCES programas_clinicos(id),
    tipo_alerta VARCHAR(100) NOT NULL,
    prioridad VARCHAR(20) NOT NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'abierta',
    fecha_generacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_cierre TIMESTAMPTZ,
    responsable_id UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_alertas_clinicas_prioridad CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA', 'CRITICA'))
);

COMMENT ON TABLE alertas_clinicas IS 'Alertas clínicas y asistenciales generadas por reglas o analítica futura.';

-- =========================================================
-- AJUSTE DE FK DIFERIDA ENTRE CITAS Y PROFESIONALES
-- =========================================================

ALTER TABLE citas
    ADD CONSTRAINT fk_citas_profesional
    FOREIGN KEY (profesional_id) REFERENCES profesionales(id);

ALTER TABLE atenciones_medicas
    ADD CONSTRAINT fk_atenciones_profesional
    FOREIGN KEY (profesional_id) REFERENCES profesionales(id);

-- =========================================================
-- ÍNDICES BÁSICOS
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuario_roles_usuario ON usuario_roles(usuario_id);
CREATE INDEX IF NOT EXISTS idx_servicios_sede_sede ON servicios_sede(sede_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_documento ON pacientes(numero_documento);
CREATE INDEX IF NOT EXISTS idx_pacientes_sede ON pacientes(sede_id);
CREATE INDEX IF NOT EXISTS idx_contactos_paciente_paciente ON contactos_paciente(paciente_id);
CREATE INDEX IF NOT EXISTS idx_aseguramiento_paciente_paciente ON aseguramiento_paciente(paciente_id);
CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas(fecha);
CREATE INDEX IF NOT EXISTS idx_citas_paciente ON citas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_citas_sede ON citas(sede_id);
CREATE INDEX IF NOT EXISTS idx_atenciones_historia ON atenciones_medicas(historia_clinica_id);
CREATE INDEX IF NOT EXISTS idx_diagnosticos_atencion ON diagnosticos_atencion(atencion_medica_id);
CREATE INDEX IF NOT EXISTS idx_procedimientos_atencion ON procedimientos_atencion(atencion_medica_id);
CREATE INDEX IF NOT EXISTS idx_profesionales_sede ON profesionales(sede_id);
CREATE INDEX IF NOT EXISTS idx_profesional_especialidad_profesional ON profesional_especialidad(profesional_id);
CREATE INDEX IF NOT EXISTS idx_inventario_sede_medicamento ON inventario_medicamentos(sede_id, medicamento_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_inventario_item ON movimientos_inventario(inventario_medicamento_id);
CREATE INDEX IF NOT EXISTS idx_dispensaciones_paciente ON dispensaciones(paciente_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_laboratorio_paciente ON ordenes_laboratorio(paciente_id);
CREATE INDEX IF NOT EXISTS idx_resultados_laboratorio_orden ON resultados_laboratorio(orden_laboratorio_id);
CREATE INDEX IF NOT EXISTS idx_indicadores_operacion_sede_periodo ON indicadores_operacion(sede_id, periodo);
CREATE INDEX IF NOT EXISTS idx_metas_sede_sede_periodo ON metas_sede(sede_id, periodo);
CREATE INDEX IF NOT EXISTS idx_alertas_operacionales_sede ON alertas_operacionales(sede_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_eventos_usuario_fecha ON auditoria_eventos(usuario_id, fecha_evento);
CREATE INDEX IF NOT EXISTS idx_paciente_programa_paciente ON paciente_programa(paciente_id);
CREATE INDEX IF NOT EXISTS idx_paciente_programa_programa ON paciente_programa(programa_clinico_id);
CREATE INDEX IF NOT EXISTS idx_paciente_programa_riesgo ON paciente_programa(nivel_riesgo);
CREATE INDEX IF NOT EXISTS idx_seguimientos_paciente_paciente ON seguimientos_paciente(paciente_id);
CREATE INDEX IF NOT EXISTS idx_seguimientos_paciente_programa ON seguimientos_paciente(programa_clinico_id);
CREATE INDEX IF NOT EXISTS idx_seguimientos_paciente_fecha ON seguimientos_paciente(fecha_seguimiento);
CREATE INDEX IF NOT EXISTS idx_riesgos_paciente_paciente ON riesgos_paciente(paciente_id);
CREATE INDEX IF NOT EXISTS idx_riesgos_paciente_clasificacion ON riesgos_paciente(clasificacion);
CREATE INDEX IF NOT EXISTS idx_riesgos_paciente_fecha ON riesgos_paciente(fecha_calculo);
CREATE INDEX IF NOT EXISTS idx_alertas_clinicas_paciente ON alertas_clinicas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_alertas_clinicas_programa ON alertas_clinicas(programa_clinico_id);
CREATE INDEX IF NOT EXISTS idx_alertas_clinicas_prioridad ON alertas_clinicas(prioridad);
CREATE INDEX IF NOT EXISTS idx_alertas_clinicas_fecha ON alertas_clinicas(fecha_generacion);

-- =========================================================
-- 12. VISTA EJECUTIVA DE PROGRAMAS
-- =========================================================

CREATE OR REPLACE VIEW v_dashboard_programas AS
SELECT
    pc.id AS programa_clinico_id,
    pc.nombre AS programa,
    COUNT(DISTINCT pp.paciente_id) FILTER (WHERE pp.deleted_at IS NULL) AS total_pacientes,
    COUNT(DISTINCT pp.paciente_id) FILTER (
        WHERE pp.deleted_at IS NULL
          AND LOWER(COALESCE(pp.estado, '')) = 'activo'
    ) AS pacientes_activos,
    COUNT(DISTINCT pp.paciente_id) FILTER (
        WHERE pp.deleted_at IS NULL
          AND pp.nivel_riesgo IN ('ALTO', 'CRITICO')
    ) AS riesgo_alto,
    COUNT(DISTINCT sp.id) FILTER (
        WHERE sp.deleted_at IS NULL
          AND sp.fecha_proximo_control IS NOT NULL
          AND sp.fecha_proximo_control <= CURRENT_DATE
          AND LOWER(COALESCE(sp.estado, '')) NOT IN ('cerrado', 'completado', 'cancelado')
    ) AS seguimientos_pendientes
FROM programas_clinicos pc
LEFT JOIN paciente_programa pp
    ON pp.programa_clinico_id = pc.id
LEFT JOIN seguimientos_paciente sp
    ON sp.programa_clinico_id = pc.id
GROUP BY pc.id, pc.nombre;

COMMENT ON VIEW v_dashboard_programas IS 'Vista ejecutiva para dashboard de programas clínicos.';

-- =========================================================
-- DATOS BASE MOCK
-- =========================================================

INSERT INTO sedes (codigo, nombre, ciudad, estado_operativo)
VALUES
    ('SEDE-CAL', 'Cali', 'Cali', 'activa'),
    ('SEDE-POP', 'Popayán', 'Popayán', 'activa'),
    ('SEDE-PAS', 'Pasto', 'Pasto', 'activa'),
    ('SEDE-PER', 'Pereira', 'Pereira', 'activa'),
    ('SEDE-FLO', 'Florencia', 'Florencia', 'activa'),
    ('SEDE-NEI', 'Neiva', 'Neiva', 'activa')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO servicios_sede (sede_id, codigo_servicio, nombre_servicio)
SELECT s.id, x.codigo_servicio, x.nombre_servicio
FROM sedes s
CROSS JOIN (
    VALUES
        ('MED-GEN', 'Medicina General'),
        ('ESP', 'Especialidades'),
        ('ODO', 'Odontología'),
        ('LAB-CLI', 'Laboratorio Clínico'),
        ('ENF', 'Enfermería'),
        ('PYP', 'Promoción y Prevención')
) AS x(codigo_servicio, nombre_servicio)
ON CONFLICT (sede_id, codigo_servicio) DO NOTHING;

INSERT INTO roles (codigo, nombre, descripcion)
VALUES
    ('ADMIN', 'Administrador', 'Acceso transversal institucional'),
    ('MEDICO', 'Médico', 'Acceso clínico asistencial'),
    ('ENFERMERIA', 'Enfermería', 'Soporte asistencial y seguimiento'),
    ('AUX-ADM', 'Auxiliar administrativo', 'Operación administrativa'),
    ('FARMACIA', 'Farmacia', 'Gestión farmacéutica'),
    ('LAB', 'Laboratorio', 'Procesos de laboratorio clínico'),
    ('GERENCIA', 'Gerencia', 'Seguimiento ejecutivo'),
    ('AUDITORIA', 'Auditoría', 'Control y trazabilidad')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO estados_cita (codigo, nombre, descripcion)
VALUES
    ('PROGRAMADA', 'Programada', 'Cita agendada y pendiente de atención'),
    ('ATENDIDA', 'Atendida', 'Cita finalizada con atención prestada'),
    ('CANCELADA', 'Cancelada', 'Cita cancelada previamente'),
    ('NO_ASISTIO', 'No asistió', 'Paciente ausente a la cita'),
    ('REPROGRAMADA', 'Reprogramada', 'Cita reprogramada para una nueva fecha')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO especialidades (codigo, nombre, descripcion)
VALUES
    ('REU', 'Reumatología', 'Atención de patologías reumatológicas'),
    ('DER', 'Dermatología', 'Atención especializada dermatológica'),
    ('VIH', 'VIH / Pacientes Vida', 'Programa integral de atención VIH'),
    ('MI', 'Medicina interna', 'Atención por medicina interna'),
    ('ENF', 'Enfermería', 'Seguimiento y apoyo asistencial'),
    ('APD', 'Apoyo diagnóstico', 'Servicios de apoyo diagnóstico')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO programas_clinicos (codigo, nombre, descripcion, tipo_programa)
VALUES
    ('VIH-VIDA', 'VIH / Pacientes Vida', 'Programa integral de seguimiento y control para pacientes VIH.', 'especial'),
    ('REUMA', 'Reumatología', 'Seguimiento especializado para patologías reumatológicas.', 'especialidad'),
    ('DERMA', 'Dermatología', 'Programa clínico de control dermatológico y terapéutico.', 'especialidad'),
    ('CRONICOS', 'Pacientes crónicos', 'Gestión longitudinal de pacientes con enfermedades crónicas.', 'cronico'),
    ('PYP', 'Promoción y prevención', 'Intervenciones preventivas y educación en salud.', 'preventivo'),
    ('FARMA', 'Seguimiento farmacológico', 'Monitoreo de adherencia, dispensación y alertas de medicamentos.', 'farmacologico')
ON CONFLICT (codigo) DO NOTHING;

COMMIT;
