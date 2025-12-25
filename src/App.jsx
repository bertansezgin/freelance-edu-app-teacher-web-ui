import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentsPage from './pages/StudentsPage'
import SchedulePage from './pages/SchedulePage'
import { isAuthenticated } from './utils/auth'
import { ModalStackProvider, useModalStack } from './context/ModalStackContext'
import './App.css'

function AppEscHandler({ children }) {
  const { closeTopModal } = useModalStack()

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      closeTopModal()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeTopModal])

  return children
}

function App() {
  const authed = isAuthenticated()

  return (
    <ModalStackProvider>
      <AppEscHandler>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={authed ? <TeacherDashboard /> : <Navigate to="/login" replace />} />
            <Route path="/students" element={authed ? <StudentsPage /> : <Navigate to="/login" replace />} />
            <Route path="/schedule" element={authed ? <SchedulePage /> : <Navigate to="/login" replace />} />
            <Route path="/" element={<Navigate to={authed ? '/dashboard' : '/login'} replace />} />
          </Routes>
        </BrowserRouter>
      </AppEscHandler>
    </ModalStackProvider>
  )
}

export default App
