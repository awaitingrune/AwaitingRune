import { Link } from 'react-router-dom'
import { useQuiz } from '../QuizProvider.jsx'

export default function FinalCta() {
  const { openQuiz } = useQuiz()

  return (
    <section className="container home-section final">
      <div className="card final__panel">
        <span className="eyebrow">Your move</span>
        <h2>Ready to find your Rune?</h2>
        <p>Pick a prebuilt, or design every part yourself with live pricing and compatibility checks.</p>
        <div className="final__actions">
          <Link to="/custom-build" className="btn btn-primary">
            Build your PC &rarr;
          </Link>
          <button type="button" className="btn" onClick={() => openQuiz()}>
            Take the quiz
          </button>
        </div>
      </div>
    </section>
  )
}
