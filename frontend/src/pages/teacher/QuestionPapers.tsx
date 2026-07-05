import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { FileText, Plus, Loader2, ChevronRight, Trash2 } from 'lucide-react'

interface QuestionPaper {
  id: string
  subject: string
  exam_name: string
  created_at: string
}

export default function QuestionPapers() {
  const [papers, setPapers] = useState<QuestionPaper[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    subject: '',
    exam_name: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadPapers()
  }, [])

  const loadPapers = async () => {
    try {
      const res = await api.get('/api/teacher/question-papers')
      setPapers(res.data)
    } catch {
      setPapers([])
    } finally {
      setLoading(false)
    }
  }

  const deletePaper = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    if (!window.confirm('Are you sure you want to delete this question paper?')) return
    try {
      await api.delete(`/api/teacher/question-papers/${id}`)
      loadPapers()
    } catch (err: any) {
      alert('Failed to delete paper')
    }
  }

  const createPaper = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('subject', form.subject)
      fd.append('exam_name', form.exam_name)
      if (!file) {
          alert("Please upload a PDF Question Paper.")
          return
      }
      fd.append('file', file)
      
      await api.post('/api/teacher/upload-question-paper', fd, {
          timeout: 60000 // Give AI some time to parse
      })
      
      setShowModal(false)
      setForm({ subject: '', exam_name: '' })
      setFile(null)
      loadPapers()
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create question paper')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Question Papers</h1>
          <p className="text-slate-500 mt-1">Manage your exam papers</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          New Paper
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={40} className="animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="grid gap-4">
          {papers.map((p) => (
            <Link
              key={p.id}
              to={`/teacher/question-papers/${p.id}`}
              className="card flex items-center justify-between hover:border-primary-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-slate-800 group-hover:text-primary-600 transition">
                    {p.exam_name}
                  </h3>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {p.subject}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => deletePaper(e, p.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete Question Paper"
                >
                  <Trash2 size={18} />
                </button>
                <ChevronRight size={18} className="text-slate-400 group-hover:text-primary-600 transition" />
              </div>
            </Link>
          ))}
          {papers.length === 0 && (
            <div className="card text-center py-12 text-slate-500">
              <FileText size={48} className="mx-auto mb-4 opacity-30 text-slate-400" />
              <p>No question papers yet. Create one to get started.</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-display text-lg font-bold text-slate-900 mb-4">Create Question Paper</h3>
            <form onSubmit={createPaper} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-650 font-medium mb-1.5">Subject</label>
                <input
                  className="input-field"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g. Computer Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-655 font-medium mb-1.5">Exam Name</label>
                <input
                  className="input-field"
                  value={form.exam_name}
                  onChange={(e) => setForm((f) => ({ ...f, exam_name: e.target.value }))}
                  placeholder="e.g. Mid-Term 2024"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-655 font-medium mb-1.5">
                  Upload Question Paper PDF
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-8 h-8 mb-2 text-slate-400" />
                      <p className="mb-1 text-sm text-slate-600">
                        <span className="font-semibold text-primary-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-400">
                        PDF, PNG, JPG (Required reference file)
                      </p>
                      {file && (
                        <p className="mt-2 text-sm font-semibold text-green-600">
                          Selected: {file.name}
                        </p>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={uploading || !file} className="btn-primary flex-1">
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Parsing with AI...
                    </span>
                  ) : (
                    'Run AI Extraction'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
