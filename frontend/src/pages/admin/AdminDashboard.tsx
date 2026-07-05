import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../services/api'
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  BarChart3,
  Plus,
  BookOpen,
  Loader2,
} from 'lucide-react'

interface Teacher {
  teacher_id: string
  name: string
  email: string
  subject: string
  employee_id: string
}

interface Subject {
  id: string
  name: string
  code: string | null
}

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [reports, setReports] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'subjects' | 'reports'>('overview')

  useEffect(() => {
    if (tabParam === 'overview' || tabParam === 'teachers' || tabParam === 'subjects' || tabParam === 'reports') {
      setActiveTab(tabParam)
    } else {
      setActiveTab('overview')
    }
  }, [tabParam])

  const handleTabChange = (tab: 'overview' | 'teachers' | 'subjects' | 'reports') => {
    setActiveTab(tab)
    setSearchParams({ tab })
  }

  const [showTeacherModal, setShowTeacherModal] = useState(false)
  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    subject: '',
    employee_id: '',
    password: '',
  })
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', description: '' })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [tRes, sRes, rRes] = await Promise.all([
        api.get('/api/admin/teachers'),
        api.get('/api/admin/subjects'),
        api.get('/api/admin/reports'),
      ])
      setTeachers(tRes.data)
      setSubjects(sRes.data)
      setReports(rRes.data)
    } catch {
      setReports({})
    } finally {
      setLoading(false)
    }
  }

  const createTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/api/admin/teachers', teacherForm)
      setShowTeacherModal(false)
      setTeacherForm({ name: '', email: '', subject: '', employee_id: '', password: '' })
      loadData()
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed')
    }
  }

  const createSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/api/admin/subjects', subjectForm)
      setShowSubjectModal(false)
      setSubjectForm({ name: '', code: '', description: '' })
      loadData()
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed')
    }
  }

  if (loading && teachers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={40} className="animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage teachers, subjects, and view reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-650">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Total Sheets</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{reports.total_answer_sheets ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-650">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Evaluated</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{reports.evaluated ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-650">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Pending</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{reports.pending ?? 0}</p>
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
              <p className="text-xl font-bold text-slate-800 mt-0.5">{reports.average_marks ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-650">
              <Users size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Teachers</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{reports.total_teachers ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-2 mb-6">
          {(['overview', 'teachers', 'subjects', 'reports'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-655 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-100 shadow-sm">
              <h2 className="font-display text-xl font-bold text-slate-900">Welcome to Scorely Admin Control</h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Here you can manage teachers, setup subjects, and monitor the overall AI answer sheet evaluation process. Use the sidebar or tab links to navigate.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Users className="mx-auto text-primary-600 mb-2" size={24} />
                <h4 className="font-semibold text-slate-800 text-sm">Manage Teachers</h4>
                <p className="text-slate-500 text-xs mt-1">Add new educators and assign subject codes.</p>
                <button onClick={() => handleTabChange('teachers')} className="text-xs text-primary-600 font-semibold mt-3 hover:underline">Go to Teachers →</button>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <BookOpen className="mx-auto text-primary-600 mb-2" size={24} />
                <h4 className="font-semibold text-slate-800 text-sm">Setup Subjects</h4>
                <p className="text-slate-500 text-xs mt-1">Initialize subjects and configure course codes.</p>
                <button onClick={() => handleTabChange('subjects')} className="text-xs text-primary-600 font-semibold mt-3 hover:underline">Go to Subjects →</button>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <BarChart3 className="mx-auto text-primary-600 mb-2" size={24} />
                <h4 className="font-semibold text-slate-800 text-sm">System Reports</h4>
                <p className="text-slate-500 text-xs mt-1">View AI similarity accuracy and evaluation rate metrics.</p>
                <button onClick={() => handleTabChange('reports')} className="text-xs text-primary-600 font-semibold mt-3 hover:underline">Go to Reports →</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg font-bold text-slate-900">Teachers</h2>
              <button
                onClick={() => setShowTeacherModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Add Teacher
              </button>
            </div>
            <div className="overflow-x-auto border border-slate-100 rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-500 font-semibold text-sm">Name</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-semibold text-sm">Email</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-semibold text-sm">Subject</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-semibold text-sm">Employee ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.map((t) => (
                    <tr key={t.teacher_id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 text-slate-800 font-medium">{t.name}</td>
                      <td className="py-3 px-4 text-slate-655 text-slate-600">{t.email}</td>
                      <td className="py-3 px-4 text-slate-655 text-slate-600">{t.subject}</td>
                      <td className="py-3 px-4 text-slate-655 text-slate-600">{t.employee_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'subjects' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg font-bold text-slate-900">Subjects</h2>
              <button
                onClick={() => setShowSubjectModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Add Subject
              </button>
            </div>
            <div className="grid gap-2">
              {subjects.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen size={20} className="text-primary-600" />
                    <span className="text-slate-800 font-medium">{s.name}</span>
                    {s.code && <span className="text-slate-400 text-xs bg-white px-2 py-0.5 rounded border border-slate-200">{s.code}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 mb-4">Reports</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-sm">
                <p className="text-slate-500 text-sm font-medium">Average AI Accuracy</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {((reports.average_ai_accuracy ?? 0) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-sm">
                <p className="text-slate-500 text-sm font-medium">Evaluation Rate</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {reports.total_answer_sheets
                    ? ((reports.evaluated / reports.total_answer_sheets) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showTeacherModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-display text-lg font-bold text-slate-900 mb-4">Create Teacher</h3>
            <form onSubmit={createTeacher} className="space-y-4">
              <input
                className="input-field"
                placeholder="Name"
                value={teacherForm.name}
                onChange={(e) => setTeacherForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                type="email"
                className="input-field"
                placeholder="Email"
                value={teacherForm.email}
                onChange={(e) => setTeacherForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
              <input
                className="input-field"
                placeholder="Subject"
                value={teacherForm.subject}
                onChange={(e) => setTeacherForm((f) => ({ ...f, subject: e.target.value }))}
                required
              />
              <input
                className="input-field"
                placeholder="Employee ID"
                value={teacherForm.employee_id}
                onChange={(e) => setTeacherForm((f) => ({ ...f, employee_id: e.target.value }))}
                required
              />
              <input
                type="password"
                className="input-field"
                placeholder="Password"
                value={teacherForm.password}
                onChange={(e) => setTeacherForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-display text-lg font-bold text-slate-900 mb-4">Add Subject</h3>
            <form onSubmit={createSubject} className="space-y-4">
              <input
                className="input-field"
                placeholder="Subject Name"
                value={subjectForm.name}
                onChange={(e) => setSubjectForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                className="input-field"
                placeholder="Code (optional)"
                value={subjectForm.code}
                onChange={(e) => setSubjectForm((f) => ({ ...f, code: e.target.value }))}
              />
              <input
                className="input-field"
                placeholder="Description (optional)"
                value={subjectForm.description}
                onChange={(e) => setSubjectForm((f) => ({ ...f, description: e.target.value }))}
              />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
