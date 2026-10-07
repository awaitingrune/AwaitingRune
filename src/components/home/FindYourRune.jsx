import QuizFlow from '../QuizFlow.jsx'

// The "find your PC" quiz, built straight into the homepage.
export default function FindYourRune() {
  return (
    <section className="container home-section find" id="find-your-rune">
      <div className="home-section__head">
        <span className="eyebrow">Not sure what you need?</span>
        <h2>Find your Rune</h2>
        <p>Tell us what you play, what you want to spend and what matters most.</p>
      </div>

      <div className="card find__panel">
        <QuizFlow inline />
      </div>
    </section>
  )
}
