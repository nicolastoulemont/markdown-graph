import { Box, Heading } from '@chakra-ui/react'
import React from 'react'
import type { Table } from '../../lib/markdown/table/types'
import type { GraphConfig } from './types'
import { LineGraph } from './LineGraph'
import { BarGraph } from './BarGraph'
import { AreaGraph } from './AreaGraph'

interface ContainerProps {
  width: number | null
  graphTitle: string
  graphContainer: React.RefObject<HTMLDivElement>
  data: Table
  config: GraphConfig
}

export function GraphContainer({ graphContainer, graphTitle, width, data, config }: ContainerProps) {
  return (
    <>
      {graphTitle !== '' && (
        <Box my={3} width='100%'>
          <Heading as='h2' textAlign='center'>
            {graphTitle}
          </Heading>
        </Box>
      )}
      {config.type === 'Line' && (
        <LineGraph graphContainer={graphContainer} width={width} data={data} config={config} />
      )}
      {config.type === 'Bar' && <BarGraph graphContainer={graphContainer} width={width} data={data} config={config} />}
      {config.type === 'Area' && (
        <AreaGraph graphContainer={graphContainer} width={width} data={data} config={config} />
      )}
    </>
  )
}
