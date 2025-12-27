import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentsPage from './pages/StudentsPage'
import StudentAnalyticsPage from './pages/StudentAnalyticsPage'
import MaterialsPage from './pages/MaterialsPage'
import SchedulePage from './pages/SchedulePage'
import HomeworkAnnouncementsPage from './pages/HomeworkAnnouncementsPage'
import ApprovalsPage from './pages/ApprovalsPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import GroupsPage from './pages/GroupsPage'
import QuestionBankPage from './pages/QuestionBankPage'
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
            <Route path="/student-analytics" element={authed ? <StudentAnalyticsPage /> : <Navigate to="/login" replace />} />
            <Route path="/materials" element={authed ? <MaterialsPage /> : <Navigate to="/login" replace />} />
            <Route path="/schedule" element={authed ? <SchedulePage /> : <Navigate to="/login" replace />} />
            <Route path="/homework" element={authed ? <HomeworkAnnouncementsPage /> : <Navigate to="/login" replace />} />
            <Route path="/approvals" element={authed ? <ApprovalsPage /> : <Navigate to="/login" replace />} />
            <Route path="/settings" element={authed ? <SettingsPage /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={authed ? <ProfilePage /> : <Navigate to="/login" replace />} />
            <Route path="/groups" element={authed ? <GroupsPage /> : <Navigate to="/login" replace />} />
            <Route path="/question-bank" element={authed ? <QuestionBankPage /> : <Navigate to="/login" replace />} />
            <Route path="/" element={<Navigate to={authed ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
      </AppEscHandler>
    </ModalStackProvider>
  )
}

export default App
