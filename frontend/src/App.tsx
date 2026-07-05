import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdminDashboard from './pages/admin/AdminDashboard'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherQuestionPapers from './pages/teacher/QuestionPapers'
import QuestionPaperDetail from './pages/teacher/QuestionPaperDetail'
import TeacherAnswerSheets from './pages/teacher/AnswerSheets'
import TeacherResults from './pages/teacher/Results'
import Layout from './components/Layout'

// Landing Pages
import HomePage from './pages/landing/HomePage'
import FeaturesPage from './pages/landing/FeaturesPage'
import HowItWorksPage from './pages/landing/HowItWorksPage'
import AboutPage from './pages/landing/AboutPage'
import ContactPage from './pages/landing/ContactPage'

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/teacher'} replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      {/* ── Landing Pages (public) ── */}
      <Route path="/" element={<HomePage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* ── Auth Pages ── */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ── Admin (protected) ── */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <Routes>
                <Route index element={<AdminDashboard />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ── Teacher (protected) ── */}
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Layout>
              <Routes>
                <Route index element={<TeacherDashboard />} />
                <Route path="question-papers" element={<TeacherQuestionPapers />} />
                <Route path="question-papers/:id" element={<QuestionPaperDetail />} />
                <Route path="answer-sheets" element={<TeacherAnswerSheets />} />
                <Route path="results" element={<TeacherResults />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
