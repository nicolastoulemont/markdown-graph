import { useRef } from 'react'

interface UseKeyBoardListNavigationParams {
  listDisplayController: React.Dispatch<React.SetStateAction<boolean>>
  optionsList: Array<any>
  optionSelectorKey: string
}

export function useKeyBoardListNavigation({
  listDisplayController,
  optionsList,
  optionSelectorKey,
}: UseKeyBoardListNavigationParams) {
  const listContainerRef = useRef(null)
  const inputRef = useRef(null)

  function handleKeyBoardNav(event: React.KeyboardEvent<HTMLDivElement>) {
    // @ts-expect-error
    const target = event.target.id
    const key = event.key
    const optionsDOMReferencesList = listContainerRef.current
      ? // @ts-expect-error
        listContainerRef.current.children
      : []
    // Focus is one of the options
    const optionIndex = optionsList.findIndex((option) => option[optionSelectorKey] === target)
    switch (key) {
      case 'ArrowDown':
        // Set focus to next options
        const nextOptions = optionsDOMReferencesList[optionIndex + 1]
        if (nextOptions) {
          event.preventDefault()
          nextOptions.focus()
        }
        break
      case 'ArrowUp':
        // Set focus on previous element
        const previousOptions = optionsDOMReferencesList[optionIndex - 1]
        if (previousOptions) {
          event.preventDefault()
          previousOptions.focus()
        } else {
          // This is the first option so focus on the input
          // @ts-expect-error
          inputRef.current.focus()
        }
        break
      case 'Tab':
        listDisplayController(false)
        break
      default:
        break
    }
  }

  return { handleKeyBoardNav, listContainerRef, inputRef }
}
