import { useEffect, useRef } from 'react'
import QuizFlow from './QuizFlow.jsx'
import './QuizModal.css'

// The quiz as a popup over the current page.
export default function QuizModal({ onClose, initialUse = null }) {
  const panelRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="qmodal" role="dialog" aria-modal="true" aria-label="Find your PC quiz" onClick={onClose}>
      <div className="qmodal__panel card" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="qmodal__close" aria-label="Close quiz" onClick={onClose}>
          &times;
        </button>
        <QuizFlow onClose={onClose} initialUse={initialUse} />
      </div>
    </div>
  )
}
