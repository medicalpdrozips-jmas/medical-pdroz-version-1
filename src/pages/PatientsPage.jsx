import { Badge } from '../components/Badge'
import { DataTable } from '../components/DataTable'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'
import { patients } from '../data/demoData'

const columns = [
  { key: 'numeroDocumento', label: 'Documento', headerClassName: 'patient-table__documento', cellClassName: 'patient-table__documento' },
  { key: 'nombres', label: 'Nombres', headerClassName: 'patient-table__nombres', cellClassName: 'patient-table__nombres' },
  { key: 'apellidos', label: 'Apellidos', headerClassName: 'patient-table__apellidos', cellClassName: 'patient-table__apellidos' },
  { key: 'edad', label: 'Edad', headerClassName: 'patient-table__edad', cellClassName: 'patient-table__edad' },
  { key: 'eps', label: 'EPS', headerClassName: 'patient-table__eps', cellClassName: 'patient-table__eps' },
  { key: 'sede', label: 'Sede', headerClassName: 'patient-table__sede', cellClassName: 'patient-table__sede' },
  { key: 'diagnostico', label: 'Diagnóstico principal', headerClassName: 'patient-table__diagnostico', cellClassName: 'patient-table__diagnostico' },
  {
    key: 'estado',
    label: 'Estado',
    headerClassName: 'patient-table__estado',
    cellClassName: 'patient-table__estado',
    render: (value) => <Badge tone={value === 'Activo' ? 'success' : 'warning'}>{value}</Badge>,
  },
]

export function PatientsPage() {
  const selected = patients[0]

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Pacientes"
        title="Gestión de pacientes"
        description="Consulta, filtro y visualización de ficha básica con datos demo anonimizados."
        action={<button className="primary-button">Nuevo paciente</button>}
      />

      <SectionCard title="Buscador y filtros" subtitle="Listo para futura integración con API y paginación">
        <div className="filters-grid">
          <input className="field" placeholder="Buscar por nombre o documento" />
          <select className="field"><option>Sede</option><option>Cali</option><option>Pasto</option></select>
          <select className="field"><option>EPS</option><option>Nueva EPS</option><option>Sura</option></select>
          <select className="field"><option>Estado</option><option>Activo</option><option>Control</option></select>
          <select className="field"><option>Diagnóstico</option><option>Artritis reumatoide</option><option>VIH</option></select>
        </div>
      </SectionCard>

      <section className="split-grid split-grid--wide">
        <SectionCard title="Tabla de pacientes" subtitle="Vista principal adaptable para escritorio y móvil">
          <DataTable columns={columns} rows={patients} wrapperClassName="patient-table-wrapper" tableClassName="patient-table" />
        </SectionCard>

        <SectionCard title="Ficha del paciente" subtitle="Resumen clínico-administrativo inicial">
          <div className="detail-card">
            <div className="detail-card__identity">
              <div className="avatar-chip">{selected.nombres[0]}{selected.apellidos[0]}</div>
              <div>
                <strong>{selected.nombres} {selected.apellidos}</strong>
                <p>{selected.tipoDocumento} {selected.numeroDocumento}</p>
              </div>
            </div>
            <dl className="detail-grid">
              <div><dt>Fecha de nacimiento</dt><dd>{selected.fechaNacimiento}</dd></div>
              <div><dt>Edad</dt><dd>{selected.edad} años</dd></div>
              <div><dt>Sexo</dt><dd>{selected.sexo}</dd></div>
              <div><dt>Teléfono</dt><dd>{selected.telefono}</dd></div>
              <div><dt>Dirección</dt><dd>{selected.direccion}</dd></div>
              <div><dt>Ciudad</dt><dd>{selected.ciudad}</dd></div>
              <div><dt>EPS</dt><dd>{selected.eps}</dd></div>
              <div><dt>Sede asignada</dt><dd>{selected.sede}</dd></div>
              <div><dt>Diagnóstico</dt><dd>{selected.diagnostico}</dd></div>
              <div><dt>Estado</dt><dd>{selected.estado}</dd></div>
            </dl>
          </div>
        </SectionCard>
      </section>
    </div>
  )
}
