import { Routes, Route, Link } from "react-router-dom"
import { Home } from "./pages/Home"
import { Parts } from "./pages/Parts"

function App() {
  return (
    <div className="app">
      <header className="app-header container">
        <nav>
          <ul>
            <li><Link to={'/'}><h4>Produkty</h4></Link></li>
            <li><Link to={'/nahradni-dily'}><h4>Náhradní díly</h4></Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route exact path="/" element={<Home />}/>
          <Route exact path="/nahradni-dily" element={<Parts />}/>
        </Routes>
      </main>
    </div>
  )
}
export default App