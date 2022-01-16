export type Column = string

export interface Row {
  name: string
  [key: Column]: any
}

export interface Table {
  rows: Row[]
  columns: Column[]
}
