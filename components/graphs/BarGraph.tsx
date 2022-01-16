import React from 'react'
import { XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Legend } from 'recharts'
import type { GraphProps } from './types'
import { RechartsExtraStyles } from '..'

import { theme } from '@chakra-ui/react'

export function BarGraph({ width, graphContainer, data, config }: GraphProps) {
  return (
    <>
      <BarChart
        width={
          width ? width - 16 : graphContainer?.current?.clientWidth ? graphContainer?.current?.clientWidth - 16 : 0
        }
        height={graphContainer?.current?.clientHeight ? graphContainer?.current?.clientHeight - 100 : 0}
        data={data.rows}
      >
        <XAxis dataKey='name' type='category' />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke='#ccc' />
        {config.columns.map((column, index) => (
          <Bar
            key={`${column}-${index}`}
            type='natural'
            dataKey={column}
            fill={
              config[`${column}-color`] && config[`${column}-intensity`]
                ? // @ts-expect-error
                  theme.colors[config[`${column}-color`]][config[`${column}-intensity`]]
                : theme.colors.black
            }
          />
        ))}
      </BarChart>
      <RechartsExtraStyles />
    </>
  )
}
