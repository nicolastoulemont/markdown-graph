import { Table } from '../../lib/markdown/table/types'

export type GraphColumns = string[]

export type GraphType = 'Bar' | 'Line' | 'Area'

export interface GraphConfig {
  columns: GraphColumns
  type: GraphType
  [key: string]: any
}

export interface GraphProps {
  width: number | null
  graphContainer: React.RefObject<HTMLDivElement>
  data: Table
  config: GraphConfig
}
