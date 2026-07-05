import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import {
  FileText,
  Upload,
  CheckCircle,
  BarChart3,
  Loader2,
} from 'lucide-react'

export default function TeacherDashboard() {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/teacher/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => setStats({}))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={40} className="animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your evaluations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-650">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Question Papers</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{stats.total_question_papers ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-650">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Evaluated Sheets</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{stats.total_evaluated_sheets ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-650">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Avg Marks</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{stats.average_marks ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/teacher/question-papers"
          className="card hover:border-primary-500 hover:shadow-md transition-all flex items-center gap-4 group"
        >
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-650 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
            <Upload size={28} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-slate-900">Upload Question Paper</h3>
            <p className="text-slate-500 text-sm">Add new exam papers</p>
          </div>
        </Link>

        <Link
          to="/teacher/answer-sheets"
          className="card hover:border-primary-500 hover:shadow-md transition-all flex items-center gap-4 group"
        >
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-650 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            <FileText size={28} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-slate-900">Upload Answer Sheets</h3>
            <p className="text-slate-500 text-sm">Bulk upload PDF, images, ZIP</p>
          </div>
        </Link>

        <Link
          to="/teacher/results"
          className="card hover:border-primary-500 hover:shadow-md transition-all flex items-center gap-4 group"
        >
          <div className="p-3 rounded-xl bg-blue-50 text-blue-650 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <BarChart3 size={28} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-slate-900">View Results</h3>
            <p className="text-slate-500 text-sm">Review and edit marks</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
