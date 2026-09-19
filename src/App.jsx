import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import QuizProvider from './components/QuizProvider.jsx'
import Landing from './pages/Landing.jsx'
import CustomBuild from './pages/CustomBuild.jsx'
import Prebuilts from './pages/Prebuilts.jsx'
import About from './pages/About.jsx'
import OrderConfirmed from './pages/OrderConfirmed.jsx'
import Support from './pages/Support.jsx'

// New page -> back to the top; links with a #hash -> scroll to that section.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <QuizProvider>
      <ScrollManager />
      <NavBar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/custom-build" element={<CustomBuild />} />
          <Route path="/prebuilts" element={<Prebuilts />} />
          <Route path="/support" element={<Support />} />
          <Route path="/about" element={<About />} />
          <Route path="/order-confirmed" element={<OrderConfirmed />} />
        </Routes>
      </main>
      <Footer />
      </QuizProvider>
    </BrowserRouter>
  )
}
