import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { Signup } from './components/auth/Signup'
import LandingPage from './components/landing'
import { AddAgents } from './components/AddAgents'
import { Signin } from './components/auth/SignIn'
import { AssignTask } from './components/AssignTask'

function App() {

  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/signin" element={<Signin/>}/>
            <Route path="/add-agents" element={<AddAgents/>}/>
            <Route path="/add-agents" element={<AddAgents/>}/>
            <Route path="/assign-task" element={<AssignTask/>}/>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
