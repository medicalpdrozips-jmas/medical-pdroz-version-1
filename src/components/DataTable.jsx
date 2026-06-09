export function DataTable({ columns, rows, wrapperClassName = 'table-shell', tableClassName = 'data-table' }) {
  return (
    <div className={wrapperClassName}>
      <table className={tableClassName}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.headerClassName}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id ?? row.orden ?? index}>
              {columns.map((column) => (
                <td key={column.key} data-label={column.label} className={column.cellClassName}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
