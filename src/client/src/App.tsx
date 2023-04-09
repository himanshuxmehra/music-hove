import { Route, Routes } from "react-router-dom"
import SessionPage from "./components/SessionPage"
import Home from "./Home"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/session" element={<SessionPage />} />
    </Routes>
  )
}

export default App
