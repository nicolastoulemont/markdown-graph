import type { Row, Column, Table } from './types'

export function inputHandler(markdownString: string): Table {
  let hasParsedColumnsLine = false
  let rows: Row[] = []
  let columns: Column[] = []

  for (const line of markdownString.split('\n')) {
    // Target a table withing markdown input
    if (line.startsWith('|')) {
      // Remove starting and ending | before splitting  on it
      const content = line.substring(1, line.length - 1)

      // Handle column names
      if (!hasParsedColumnsLine) {
        columns = content
          .split('|')
          .filter(Boolean)
          .map((name) => name.trim())
        hasParsedColumnsLine = true
      } else {
        // Avoid divider line and handle values
        if (!line.includes('---')) {
          const [name, ...rest] = content.split('|').map((value) => value.trim())
          let data: Row = { name }
          for (const [key, value] of rest.map((value, index) => [columns[index + 1], value])) {
            data[key] = parseFloat(value)
          }

          rows.push(data)
        }
      }
    }
  }

  return { rows, columns }
}
