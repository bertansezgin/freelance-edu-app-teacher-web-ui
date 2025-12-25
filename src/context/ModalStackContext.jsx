import { createContext, useCallback, useContext, useMemo, useRef } from 'react'

const ModalStackContext = createContext(null)

export function ModalStackProvider({ children }) {
  const stackRef = useRef([])

  const registerModal = useCallback((id, onClose) => {
    stackRef.current = stackRef.current.filter((item) => item.id !== id)
    stackRef.current.push({ id, onClose })

    return () => {
      stackRef.current = stackRef.current.filter((item) => item.id !== id)
    }
  }, [])

  const closeTopModal = useCallback(() => {
    const top = stackRef.current[stackRef.current.length - 1]
    if (!top) return
    top.onClose?.()
  }, [])

  const value = useMemo(
    () => ({
      registerModal,
      closeTopModal,
    }),
    [registerModal, closeTopModal],
  )

  return <ModalStackContext.Provider value={value}>{children}</ModalStackContext.Provider>
}

export function useModalStack() {
  const ctx = useContext(ModalStackContext)
  if (!ctx) {
    throw new Error('useModalStack must be used within ModalStackProvider')
  }
  return ctx
}


