import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
