import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import QuizModal from './QuizModal.jsx'
import './QuizModal.css'

const QuizContext = createContext({ openQuiz: () => {} })

export function useQuiz() {
  return useContext(QuizContext)
}

// How long someone has been browsing (tab visible) before we offer the quiz.
const PROMPT_AFTER_SECONDS = 120
const SEEN_KEY = 'ar-quiz-prompt-seen'
// Pages where an interruption would be unwelcome.
const QUIET_PATHS = ['/order-confirmed']

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function writeSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    // Storage can be blocked; the prompt will simply be allowed to show again.
  }
}

export default function QuizProvider({ children }) {
  const { pathname } = useLocation()
  const [quizOpen, setQuizOpen] = useState(false)
  const [promptOpen, setPromptOpen] = useState(false)

  const seconds = useRef(0)
  const seen = useRef(readSeen())
  const pathRef = useRef(pathname)
  const quizOpenRef = useRef(false)

  pathRef.current = pathname
  quizOpenRef.current = quizOpen

  const markSeen = useCallback(() => {
    seen.current = true
    writeSeen()
  }, [])

  const openQuiz = useCallback(() => {
    markSeen()
    setPromptOpen(false)
    setQuizOpen(true)
  }, [markSeen])

  const closeQuiz = useCallback(() => setQuizOpen(false), [])

  const dismissPrompt = useCallback(() => {
    markSeen()
    setPromptOpen(false)
  }, [markSeen])

  useEffect(() => {
    if (seen.current) return undefined
    const id = setInterval(() => {
      if (document.hidden) return
      seconds.current += 1
      if (
        seconds.current >= PROMPT_AFTER_SECONDS &&
        !quizOpenRef.current &&
        !QUIET_PATHS.includes(pathRef.current)
      ) {
        setPromptOpen(true)
        clearInterval(id)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const value = useMemo(() => ({ openQuiz }), [openQuiz])

  return (
    <QuizContext.Provider value={value}>
      {children}

      {promptOpen && !quizOpen && (
        <aside className="qprompt card" role="dialog" aria-label="Need help choosing a PC?">
          <button type="button" className="qprompt__close" aria-label="Dismiss" onClick={dismissPrompt}>
            &times;
          </button>
          <h3>Need help?</h3>
          <p>Take a quiz for the perfect PC.</p>
          <div className="qprompt__actions">
            <button type="button" className="btn btn-primary" onClick={openQuiz}>
              Take the quiz
            </button>
            <button type="button" className="btn" onClick={dismissPrompt}>
              No thanks
            </button>
          </div>
        </aside>
      )}

      {quizOpen && <QuizModal onClose={closeQuiz} />}
    </QuizContext.Provider>
  )
}
