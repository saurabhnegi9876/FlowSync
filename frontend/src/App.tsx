
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FlowSyncLanding from "./Pages/Homepage"
import LoginPage from './Pages/Login'
import SignupPage from './Pages/Signup'
function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<FlowSyncLanding />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/Signup' element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
