import { ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, LayoutDashboard, FileText, ClipboardList, BarChart3, BookOpen } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAdmin = user?.role === 'admin'

  const getLinkClass = (path: string) => {
    const baseClass = "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
    const [pathName, pathSearch] = path.split('?')
    const isActive = pathSearch
      ? location.pathname === pathName && location.search.includes(pathSearch)
      : location.pathname === pathName && (!location.search || location.search === '?tab=overview')

    return isActive 
      ? `${baseClass} bg-primary-50 text-primary-600 shadow-sm border border-primary-100/50` 
      : `${baseClass} text-slate-600 hover:bg-slate-100 hover:text-slate-900`
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2.5">
          <img src="/logo.jpg" alt="Scorely Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm" />
          <div>
            <h1 className="font-display font-bold text-slate-900 leading-none">Scorely</h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-1 block">
              {user?.role} Portal
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {isAdmin ? (
            <>
              <Link to="/admin" className={getLinkClass('/admin')}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link to="/admin?tab=teachers" className={getLinkClass('/admin?tab=teachers')}>
                <ClipboardList size={18} />
                Teachers
              </Link>
              <Link to="/admin?tab=reports" className={getLinkClass('/admin?tab=reports')}>
                <BarChart3 size={18} />
                Reports
              </Link>
            </>
          ) : (
            <>
              <Link to="/teacher" className={getLinkClass('/teacher')}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link to="/teacher/question-papers" className={getLinkClass('/teacher/question-papers')}>
                <FileText size={18} />
                Question Papers
              </Link>
              <Link to="/teacher/answer-sheets" className={getLinkClass('/teacher/answer-sheets')}>
                <ClipboardList size={18} />
                Answer Sheets
              </Link>
              <Link to="/teacher/results" className={getLinkClass('/teacher/results')}>
                <BarChart3 size={18} />
                Results
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 text-sm font-medium transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
