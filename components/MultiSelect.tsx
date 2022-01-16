import React, { useState, useEffect, useRef } from 'react'
import { panelBgColor, shadow, bgColor } from '../theme/colors'
import { CheckIcon } from '@chakra-ui/icons'
import { useKeyBoardListNavigation, keyValidation } from '../utils'
import { motion } from 'framer-motion'
import { useClickAway } from 'react-use'

import {
  Input,
  Box,
  Flex,
  Text,
  useColorMode,
  Tag,
  TagCloseButton,
  TagLabel,
  FormControl,
  FormLabel,
  FormHelperText,
  Image,
  Icon,
  chakra,
} from '@chakra-ui/react'

const MotionBox = chakra(motion.div)

interface Option {
  key: string
  value: string | number
  text: string
  iconUrl?: string
}

interface MultiSelectProps {
  options: Array<Option>
  state: any
  setState: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any
    }>
  >
  errors: { [key: string]: string }
  setErrors?: React.Dispatch<
    | React.SetStateAction<{
        [key: string]: any
      }>
    | undefined
  >
  name: string
  placeholder: string
  type: string
  label: string
  containerWidth?: string
  styles?: any
  required?: boolean
  withIcon?: boolean
  multi?: boolean
  showHelper?: boolean
  helperText?: string
}

export function MultiSelect({
  options,
  state,
  setState,
  setErrors,
  errors,
  name,
  placeholder,
  type,
  label,
  containerWidth = '200px',
  styles,
  required = false,
  withIcon = false,
  multi = true,
  showHelper = true,
  helperText,
}: MultiSelectProps) {
  const [internalChoices, setInternalChoices] = useState<Array<any>>([])
  const [internalOptions, setInternalOptions] = useState<Array<Option>>([])
  const [internalOptionsLookup, setInternalOptionsLookup] = useState<{
    [key: string]: Option
  }>({})
  const [showOptions, setShowOptions] = useState(false)
  const [textValue, setTextValue] = useState('')
  const internalTagsContainerRef = useRef<HTMLDivElement>(null)
  const { handleKeyBoardNav, listContainerRef, inputRef } = useKeyBoardListNavigation({
    listDisplayController: setShowOptions,
    optionsList: internalOptions,
    optionSelectorKey: 'value',
  })
  const containerRef = useRef<HTMLDivElement>(null)
  useClickAway(containerRef, () => setShowOptions(false))

  const { colorMode } = useColorMode()

  // Map options to internal and create lookup object
  useEffect(() => {
    options && setInternalOptions(options)
    options &&
      setInternalOptionsLookup(
        options.reduce((acc: Record<string | number, any>, option) => {
          acc[option.value] = option
          return acc
        }, {})
      )
  }, [options])

  // Map provided selected values to internal
  useEffect(() => {
    if (state && state !== internalChoices) {
      setInternalChoices(state)
    }
  }, [state])

  useEffect(() => {
    if (internalOptions.length === 0 && showOptions) {
      setShowOptions(false)
    }
  }, [internalOptions])

  function handleLocalChange(event: React.ChangeEvent<any>) {
    setTextValue(event.target.value)
    if (event.target.value === '') {
      setInternalOptions(options)
    } else {
      const matchingValues = options.filter((option) =>
        option.text.toLowerCase().includes(event.target.value.toLowerCase())
      )
      if (matchingValues.length > 0 && !showOptions) {
        setShowOptions(true)
      }
      setInternalOptions(matchingValues)
    }
  }

  function handleLocalOptionClick(option: Option) {
    if (!internalChoices.includes(option.value)) {
      setInternalChoices(multi ? [...internalChoices, option.value] : [option.value])
      setState((state) => ({
        ...state,
        [name]: multi ? [...internalChoices, option.value] : [option.value],
      }))
      textValue !== '' && setTextValue('')
      setErrors && setErrors((errors) => ({ ...errors, [name]: undefined }))
      !multi && setShowOptions(false)
    } else {
      const otherChoices = internalChoices.filter((choice) => choice !== option.value)
      setInternalChoices(otherChoices)
      setState((state) => ({ ...state, [name]: otherChoices }))
      setErrors && setErrors((errors) => ({ ...errors, [name]: undefined }))
      !multi && setShowOptions(false)
    }
  }

  function handleRemoveClick(choice: any) {
    const newValues = internalChoices.filter((internalChoice) => internalChoice !== choice)
    setInternalChoices(newValues)
    setState((state) => ({ ...state, [name]: newValues }))
    setErrors && setErrors((errors) => ({ ...errors, [name]: undefined }))
  }

  return (
    <FormControl
      flex='1'
      isRequired={required}
      zIndex={showOptions ? 999 : 1}
      {...styles}
      onKeyDown={handleKeyBoardNav}
      ref={containerRef}
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Box zIndex={3} position='relative' boxSizing='border-box' width={containerWidth}>
        {internalChoices.length > 0 && (
          <Flex
            position='absolute'
            left='5px'
            top='7px'
            ref={internalTagsContainerRef}
            maxWidth='100%'
            overflowX='hidden'
          >
            {internalChoices.map((choice) => (
              <Tag zIndex={2} size='sm' mr={1} key={choice} px={2} py='0.2rem' colorScheme='green'>
                <TagLabel>{internalOptionsLookup[choice]?.text}</TagLabel>
                <TagCloseButton onClick={() => handleRemoveClick(choice)} />
              </Tag>
            ))}
          </Flex>
        )}
        <Input
          type={type}
          name={name}
          id={name}
          ref={inputRef}
          value={textValue}
          aria-describedby={name}
          placeholder={internalChoices.length > 0 ? undefined : placeholder}
          variant='outline'
          onChange={handleLocalChange}
          isInvalid={!!errors[name]}
          onFocus={() => !showOptions && setShowOptions(true)}
          zIndex={1}
          pl={
            internalTagsContainerRef.current && internalChoices.length > 0
              ? internalTagsContainerRef.current.clientWidth + 5
              : 3
          }
        />
        {errors[name] && !showOptions && showHelper && <FormHelperText>{errors[name]}</FormHelperText>}
        {helperText && !showOptions && <FormHelperText>{helperText}</FormHelperText>}
        {showOptions && (
          <MotionBox
            position='absolute'
            top='40px'
            left='0'
            minWidth='100%'
            maxHeight='300px'
            display='block'
            zIndex={9999}
            borderRadius='4px'
            boxSizing='border-box'
            overflowY='auto'
            boxShadow={shadow[colorMode]}
            backgroundColor={panelBgColor[colorMode]}
            my={2}
            initial='pageInitial'
            animate='pageAnimate'
            variants={{
              pageInitial: {
                opacity: 0,
              },
              pageAnimate: {
                opacity: 1,
              },
            }}
          >
            <Flex
              align='left'
              justify='center'
              direction='column'
              height='100%'
              width='100%'
              zIndex='inherit'
              position='relative'
              ref={listContainerRef}
            >
              {internalOptions.map((option) => (
                <Box
                  key={option.key}
                  id={String(option.value)}
                  onClick={() => handleLocalOptionClick(option)}
                  _hover={{
                    cursor: 'pointer',
                    backgroundColor: bgColor[colorMode],
                  }}
                  _focus={{
                    backgroundColor: bgColor[colorMode],
                  }}
                  width='100%'
                  backgroundColor={panelBgColor[colorMode]}
                  p={2}
                  zIndex='inherit'
                  position='relative'
                  display='flex'
                  alignItems='center'
                  justifyContent='left'
                  tabIndex={0}
                  role='button'
                  onKeyDown={(event) => keyValidation(event) && handleLocalOptionClick(option)}
                >
                  {withIcon && <Image src={option.iconUrl} width='20px' mr={2} />}
                  <Text>{option.text}</Text>
                  {internalChoices.includes(option.value) && (
                    <Icon as={CheckIcon as any} color='green.500' pos='absolute' top='8px' right='10%' boxSize='22px' />
                  )}
                </Box>
              ))}
            </Flex>
          </MotionBox>
        )}
      </Box>
    </FormControl>
  )
}
