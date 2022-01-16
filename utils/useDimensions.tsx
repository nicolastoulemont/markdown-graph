import { useEffect, useState } from 'react'

export function useDimensions(ref?: React.MutableRefObject<any>) {
  const [width, setWidth] = useState<number | null>(null)
  const [height, setHeight] = useState<number | null>(null)

  function getDimensions() {
    if (ref?.current) {
      setWidth(ref.current.clientWidth)
      setHeight(ref.current.clientHeight)
    } else if (!ref) {
      if (window) {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
      }
    }
  }

  function handleHotReload(event: any) {
    const message = event.data
    message?.payload?.payload?.hasOwnProperty('rendererID') && getDimensions()
  }

  useEffect(() => {
    if (window) {
      window.addEventListener('load', getDimensions)
      window.addEventListener('message', handleHotReload)
      window.addEventListener('resize', getDimensions)
    }
    return () => {
      if (window) {
        window.removeEventListener('load', getDimensions)
        window.removeEventListener('message', handleHotReload)
        window.removeEventListener('resize', getDimensions)
      }
    }
  }, [ref])

  return [width, height]
}
