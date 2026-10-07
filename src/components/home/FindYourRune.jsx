import RuneGlyph from '../RuneGlyph.jsx'
import { useQuiz } from '../QuizProvider.jsx'

const OPTIONS = [
  { use: 'gaming', rune: 'tiwaz', title: 'Gaming', body: 'Frame rates, resolution and the games you play.' },
  { use: 'stream', rune: 'ansuz', title: 'Streaming', body: 'Play and broadcast at the same time.' },
  { use: 'create', rune: 'kenaz', title: 'Creation', body: 'Editing, 3D, music, design and code.' },
  { use: 'work', rune: 'fehu', title: 'Work', body: 'Quick, quiet and dependable every day.' },
]

export default function FindYourRune() {
  const { openQuiz } = useQuiz()

  return (
    <section className="container home-section find">
      <div className="home-section__head">
        <span className="eyebrow">Not sure what you need?</span>
        <h2>Find your Rune</h2>
        <p>Tell us what you play, what you want to spend and what matters most. Start with what the PC is for.</p>
      </div>

      <div className="find__grid">
        {OPTIONS.map((o) => (
          <button key={o.use} type="button" className="card find__tile" onClick={() => openQuiz(o.use)}>
            <span className="find__rune" aria-hidden="true">
              <RuneGlyph name={o.rune} size={30} />
            </span>
            <strong>{o.title}</strong>
            <span className="find__body">{o.body}</span>
            <span className="find__go">Find my PC &rarr;</span>
          </button>
        ))}
      </div>
    </section>
  )
}
