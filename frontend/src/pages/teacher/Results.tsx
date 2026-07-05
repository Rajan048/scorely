import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { FileText, Loader2, ChevronLeft, Edit2, Save } from 'lucide-react'

interface QuestionPaper {
  id: string
  subject: string
  exam_name: string
  total_marks: number
}

interface EvaluationDetail {
  id?: string
  question: string
  reference_answer: string | null
  max_marks: number
  student_answer: string
  similarity_score: number
  marks_obtained: number
}

interface EvaluationResult {
  id: string
  student_name: string
  total_marks: number
  created_at: string
  exam_name?: string
  details?: EvaluationDetail[]
}

export default function Results() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sheetId = searchParams.get('sheet')
  const paperId = searchParams.get('paper')
  const [papers, setPapers] = useState<QuestionPaper[]>([])
  const [selectedPaper, setSelectedPaper] = useState<string | null>(paperId || null)
  const [sheet, setSheet] = useState<EvaluationResult | null>(null)
  const [sheets, setSheets] = useState<EvaluationResult[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedMarks, setEditedMarks] = useState<{ [key: string]: number }>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPapers()
  }, [])

  useEffect(() => {
    if (sheetId) loadSheet(sheetId)
    else if (selectedPaper) loadAllSheets(selectedPaper)
    else setSheets([]) // Clear sheets if no paper selected
  }, [sheetId, selectedPaper])

  const loadPapers = async () => {
    try {
      const res = await api.get('/api/teacher/question-papers')
      setPapers(res.data)
      if (!selectedPaper && !sheetId && res.data.length > 0) {
        setSelectedPaper(res.data[0].id)
      }
    } catch {
      setPapers([])
    }
  }

  const loadSheet = async (id: string) => {
    setLoading(true)
    try {
      const res = await api.get(`/api/teacher/evaluation-reports/detail/${id}`)
      setSheet({ id, ...res.data })
    } catch {
      setSheet(null)
    } finally {
      setLoading(false)
    }
  }

  const loadAllSheets = async (pid: string) => {
    setLoading(true)
    try {
      const res = await api.get(`/api/teacher/evaluation-reports/${pid}`)
      setSheets(res.data)
      setSheet(null)
    } catch {
      setSheets([])
    } finally {
      setLoading(false)
    }
  }

  const handleEditToggle = () => {
    if (!editing && sheet?.details) {
      const currentMarks: { [key: string]: number } = {}
      sheet.details.forEach((d) => {
        if (d.id) currentMarks[d.id] = d.marks_obtained
      })
      setEditedMarks(currentMarks)
    }
    setEditing(!editing)
  }

  const handleSaveMarks = async () => {
    if (!sheet) return
    setSaving(true)
    try {
      await api.put(`/api/teacher/evaluation-reports/${sheet.id}/marks`, { marks: editedMarks })
      await loadSheet(sheet.id)
      setEditing(false)
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update marks')
    } finally {
      setSaving(false)
    }
  }

  if (loading && !sheet && sheets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={40} className="animate-spin text-primary-600" />
      </div>
    )
  }

  if (sheetId && sheet) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/teacher/results" className="text-slate-500 hover:text-slate-900 transition">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">{sheet.student_name}</h1>
            <p className="text-slate-500">Evaluation Results</p>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Marks Obtained</p>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-2xl font-bold text-slate-900">
                  {sheet.total_marks.toFixed(2)}
                </p>
                <button 
                  onClick={editing ? handleSaveMarks : handleEditToggle}
                  disabled={saving}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm ${editing ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : editing ? <Save size={16} /> : <Edit2 size={16} />}
                  {editing ? 'Save Changes' : 'Edit Marks'}
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Exam</p>
              <p className="text-slate-800 font-bold mt-0.5">{sheet.exam_name}</p>
            </div>
          </div>

          {sheet.details && sheet.details.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-slate-900">Question-wise Breakdown</h3>
              {sheet.details.map((a, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-655 font-bold text-slate-900">Question {idx + 1}</span>
                    <span className="text-primary-655 text-primary-600 font-bold whitespace-nowrap flex items-center gap-2">
                      {editing && a.id ? (
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max={a.max_marks}
                          value={editedMarks[a.id] !== undefined ? editedMarks[a.id] : a.marks_obtained}
                          onChange={(e) => setEditedMarks({...editedMarks, [a.id as string]: parseFloat(e.target.value) || 0})}
                          className="w-20 px-2 py-1 bg-white border border-slate-350 rounded text-right text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      ) : (
                        <span>{a.marks_obtained}</span>
                      )}
                      <span>/ {a.max_marks} marks</span>
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-slate-800 font-medium text-sm mb-1">{a.question}</p>
                    {a.reference_answer && (
                      <div className="p-2.5 mt-2 bg-white rounded border border-slate-200 shadow-sm">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Reference Answer:</span>
                        <p className="text-slate-600 text-xs leading-relaxed">{a.reference_answer}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-slate-200 pt-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Student's Answer:</span>
                    {a.student_answer ? (
                      <p className="text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">{a.student_answer}</p>
                    ) : (
                      <p className="text-slate-400 text-sm italic">No answer mapped</p>
                    )}
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-1 rounded">
                      Similarity: {(a.similarity_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-slate-500">
              <FileText className="mx-auto mb-2 opacity-30" size={32} />
              <p>No details found.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Results</h1>
        <p className="text-slate-500 mt-1">Review and edit evaluation results</p>
      </div>

      {!sheetId && (
        <div className="card">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Question Paper</label>
          <select
            value={selectedPaper ?? ''}
            onChange={(e) => {
               const val = e.target.value ? e.target.value : null
               setSelectedPaper(val)
               if (!val) setSheets([])
            }}
            className="input-field max-w-md"
          >
            <option value="">-- Select --</option>
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.exam_name} ({p.subject})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-4">
        {sheets.map((s) => (
          <Link
            key={s.id}
            to={`/teacher/results?sheet=${s.id}`}
            className="card flex items-center justify-between hover:border-primary-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-50 text-indigo-650">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-slate-800 group-hover:text-primary-600 transition">
                  {s.student_name}
                </h3>
                <p className="text-slate-550 text-sm mt-0.5 text-slate-500">
                  {s.total_marks.toFixed(2)} marks obtained
                </p>
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-primary-600 font-semibold transition text-sm">View Details →</span>
          </Link>
        ))}
          {selectedPaper && sheets.length === 0 && (
            <div className="card text-center py-12 text-slate-500 bg-white">
              <FileText size={48} className="mx-auto mb-4 opacity-30 text-slate-400" />
              <p>No evaluated answer sheets yet for this paper.</p>
              <Link to={`/teacher/answer-sheets?paper=${selectedPaper}`} className="text-primary-600 font-semibold mt-2 inline-block hover:text-primary-750">
                Upload and evaluate sheets
              </Link>
            </div>
          )}
          {!selectedPaper && (
            <div className="card text-center py-12 text-slate-500 bg-white">
              <FileText size={48} className="mx-auto mb-4 opacity-30 text-slate-400" />
              <p>Please select a Question Paper from the dropdown above to view its results.</p>
            </div>
          )}
        </div>
      </div>
    )
  }
