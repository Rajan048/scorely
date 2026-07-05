import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../../services/api'
import { ChevronLeft, Loader2, Edit2, Save, X } from 'lucide-react'

interface Question {
  id: string
  text: string
  marks: number
  ref_answer: string | null
}

interface QuestionPaper {
  id: string
  subject: string
  exam_name: string
  total_marks: number
  num_questions: number
  file_path?: string
  questions: Question[]
}

export default function QuestionPaperDetail() {
  const { id } = useParams()
  const [paper, setPaper] = useState<QuestionPaper | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedQuestions, setEditedQuestions] = useState<Question[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) loadPaper(id)
  }, [id])

  const loadPaper = async (paperId: string) => {
    try {
      const res = await api.get(`/api/teacher/question-papers/${paperId}`)
      setPaper(res.data)
    } catch {
      setPaper(null)
    } finally {
      setLoading(false)
    }
  }

  const handleStartEdit = () => {
    if (paper?.questions) {
      setEditedQuestions(JSON.parse(JSON.stringify(paper.questions)))
      setIsEditing(true)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    if (!paper) return
    setSaving(true)
    try {
      const payload = {
        questions: editedQuestions.map(q => ({
          id: q.id,
          question_text: q.text,
          marks: q.marks
        }))
      }
      await api.put(`/api/teacher/question-papers/${paper.id}/questions`, payload)
      await loadPaper(paper.id)
      setIsEditing(false)
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update questions')
    } finally {
      setSaving(false)
    }
  }

  const handleQuestionChange = (index: number, field: 'text' | 'marks', value: any) => {
    const updated = [...editedQuestions]
    if (field === 'marks') {
      updated[index].marks = parseFloat(value) || 0
    } else {
      updated[index].text = value
    }
    setEditedQuestions(updated)
  }

  if (loading || !paper) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={40} className="animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/teacher/question-papers" className="text-slate-500 hover:text-slate-900 transition">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">{paper.exam_name}</h1>
          <p className="text-slate-500">{paper.subject} • {paper.total_marks} marks</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="font-display text-lg font-bold text-slate-900">Extracted Questions</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Marks
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="btn-secondary flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            </>
          ) : (
            <>
              {paper.questions && paper.questions.length > 0 && (
                <button
                  onClick={handleStartEdit}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Edit2 size={18} />
                  Edit Marks
                </button>
              )}
              <Link
                to={`/teacher/answer-sheets?paper=${paper.id}`}
                className="btn-primary flex items-center gap-2"
              >
                Go to Answer Sheets
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {isEditing ? (
          editedQuestions.map((q, idx) => (
            <div key={q.id} className="card space-y-3">
              <div className="flex gap-4 items-start">
                <span className="text-primary-600 font-bold mt-2">Q{idx + 1}</span>
                <div className="flex-1 space-y-2">
                  <textarea
                    value={q.text}
                    onChange={(e) => handleQuestionChange(idx, 'text', e.target.value)}
                    rows={2}
                    className="input-field w-full font-medium"
                    placeholder="Question Text"
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-slate-500 text-sm font-semibold">Marks:</label>
                    <input
                      type="number"
                      value={q.marks}
                      onChange={(e) => handleQuestionChange(idx, 'marks', e.target.value)}
                      className="input-field w-24"
                      min={0}
                      step={0.5}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          paper.questions?.map((q, idx) => (
            <div key={q.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary-600 font-semibold">Q{idx + 1}</span>
                    <span className="text-slate-400 text-sm">({q.marks} marks)</span>
                  </div>
                  <p className="text-slate-800 font-medium mb-3">{q.text}</p>
                  {q.ref_answer && (
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">AI Reference Answer</p>
                      <p className="text-slate-655 text-sm whitespace-pre-wrap text-slate-600">{q.ref_answer}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {(!paper.questions || paper.questions.length === 0) && (
          <div className="card text-center py-12 text-slate-400">
            <p>Could not extract questions from this paper.</p>
          </div>
        )}
      </div>
    </div>
  )
}
