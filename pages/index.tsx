import { useMemo, useRef, useState } from 'react'
import { inputHandler } from '../lib/markdown/table/inputhandler'
import { GraphContainer, GraphConfig, GRAPH_TYPES, GraphType } from '../components/graphs'
import { MultiSelect } from '../components'
import { useDimensions } from '../utils'
import {
  Box,
  Heading,
  Text,
  Textarea,
  theme,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Select,
  Divider,
  FormHelperText,
} from '@chakra-ui/react'

const colorsNotAllowed = ['transparent', 'current', 'white', 'whiteAlpha']

export default function IndexPage() {
  const graphContainer = useRef<HTMLDivElement>(null)
  const [width] = useDimensions(graphContainer)
  const [graphTitle, setGraphTitle] = useState('')
  const [graphConfig, setGraphConfig] = useState<GraphConfig>({ columns: [], type: 'Line' })
  const [markdown, setMarkdown] = useState('')

  const data = useMemo(() => inputHandler(markdown), [markdown])
  const [columnNames, ...multiSelectOptions] = data.columns.map((column, index) => ({
    key: `${index}-${column}`,
    value: column,
    text: column,
  }))

  const colorsOptions = useMemo(
    () =>
      Object.entries(theme.colors)
        .filter(([key]) => colorsNotAllowed.indexOf(key) === -1)
        .map(([key], index) => ({
          key: `${index}-${key}`,
          value: key,
          text: key,
        })),
    []
  )

  const graphTypeOptions = useMemo(
    () =>
      GRAPH_TYPES.map((type, index) => ({
        key: `${index}-${type}`,
        value: type,
        text: type,
      })),
    []
  )

  return (
    <Box as='main' width='100%' maxWidth='1200px' margin='0 auto' pb={10}>
      <Heading as='h1' my={6}>
        Markdown table graph generator
      </Heading>

      <Box width='100%'>
        <FormControl my={6}>
          <FormLabel>Markdown table input</FormLabel>
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={14}
            placeholder='Here is a sample placeholder'
          />
          <FormHelperText>Copy paste your markdown table here</FormHelperText>
        </FormControl>
      </Box>
      <Divider my={12} />
      <Box width='100%'>
        <Heading as='h2' my={6}>
          Graph configuration
        </Heading>
        <Flex align='flex-start' justifyContent='space-between' my={3}>
          <FormControl width='45%'>
            <FormLabel>Graph title (optional)</FormLabel>
            <Input value={graphTitle} onChange={(e) => setGraphTitle(e.target.value)} />
          </FormControl>
          <FormControl width='45%'>
            <FormLabel>Select graph type</FormLabel>
            <Select
              value={graphConfig['type']}
              onChange={(e) => setGraphConfig({ ...graphConfig, type: e.target.value as GraphType })}
              name={'type'}
              placeholder='Select graph type'
            >
              {graphTypeOptions.map(({ key, value, text }) => (
                <option key={key} value={value}>
                  {text}
                </option>
              ))}
            </Select>
          </FormControl>
        </Flex>
        <MultiSelect
          containerWidth='100%'
          state={graphConfig['columns']}
          // @ts-expect-error
          setState={setGraphConfig}
          errors={{}}
          options={multiSelectOptions}
          name='columns'
          label='Select columns to display'
          placeholder='Select columns to display'
          type='text'
        />
        {graphConfig['columns'].length > 0 && (
          <Box width='100%' mt={6}>
            {graphConfig['columns'].map((column, index) => (
              <Flex key={index} width='100%' alignItems='center' justifyContent='space-between' my={3}>
                <FormControl width='45%'>
                  <FormLabel>Select {column} color</FormLabel>
                  <Select
                    value={graphConfig[`${column}-color`]}
                    onChange={(e) => setGraphConfig({ ...graphConfig, [`${column}-color`]: e.target.value })}
                    name={`${column}-color`}
                    placeholder={`Select ${column} color`}
                  >
                    {colorsOptions.map(({ key, value, text }) => (
                      <option key={key} value={value}>
                        {text}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {graphConfig[`${column}-color`] && (
                  <FormControl width='45%'>
                    <FormLabel>Select {column} intensity</FormLabel>
                    <Select
                      value={graphConfig[`${column}-intensity`]}
                      onChange={(e) => setGraphConfig({ ...graphConfig, [`${column}-intensity`]: e.target.value })}
                      name={`${column}-intensity`}
                      placeholder={`Select ${column} intensity`}
                    >
                      {
                        // @ts-expect-error
                        Object.entries(theme.colors[graphConfig[`${column}-color`] as any]).map(([key], index) => (
                          <option key={`${key}-${index}`} value={key}>
                            {key}
                          </option>
                        ))
                      }
                    </Select>
                  </FormControl>
                )}
              </Flex>
            ))}
          </Box>
        )}
      </Box>

      <Divider my={12} />
      <Tabs>
        <Heading as='h2' my={6}>
          Output
        </Heading>
        <TabList>
          <Tab>Graph</Tab>
          <Tab>Input: value</Tab>
          <Tab>JSON representation</Tab>
        </TabList>

        <TabPanels>
          <TabPanel ref={graphContainer} minH={600}>
            <GraphContainer
              graphContainer={graphContainer}
              width={width}
              graphTitle={graphTitle}
              data={data}
              config={graphConfig}
            />
          </TabPanel>
          <TabPanel>
            <Text as='pre' width='100%'>
              {markdown}
            </Text>
          </TabPanel>
          <TabPanel>
            <Text as='pre' width='100%'>
              {JSON.stringify(data, null, 2)}
            </Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
