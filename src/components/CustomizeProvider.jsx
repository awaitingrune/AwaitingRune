import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import CustomizeModal from './CustomizeModal.jsx'

const CustomizeContext = createContext({ openCustomize: () => {} })

export function useCustomize() {
  return useContext(CustomizeContext)
}

// Lets any page open the "zoom into this PC" customiser for a prebuilt
// without leaving the page it is on.
export default function CustomizeProvider({ children }) {
  const [preset, setPreset] = useState(null)

  const openCustomize = useCallback((next) => setPreset(next), [])
  const close = useCallback(() => setPreset(null), [])
  const value = useMemo(() => ({ openCustomize }), [openCustomize])

  return (
    <CustomizeContext.Provider value={value}>
      {children}
      {preset && <CustomizeModal key={preset.id} preset={preset} onClose={close} />}
    </CustomizeContext.Provider>
  )
}
