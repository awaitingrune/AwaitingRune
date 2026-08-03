import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './pages/Landing.jsx'
import CustomBuild from './pages/CustomBuild.jsx'
import Prebuilts from './pages/Prebuilts.jsx'
import About from './pages/About.jsx'
import OrderConfirmed from './pages/OrderConfirmed.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/custom-build" element={<CustomBuild />} />
          <Route path="/prebuilts" element={<Prebuilts />} />
          <Route path="/about" element={<About />} />
          <Route path="/order-confirmed" element={<OrderConfirmed />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
