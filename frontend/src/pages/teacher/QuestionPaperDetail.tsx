import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../../services/api'
import { ChevronLeft, Loader2 } from 'lucide-react'

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
          <Link
            to={`/teacher/answer-sheets?paper=${paper.id}`}
            className="btn-primary flex items-center gap-2"
          >
            Go to Answer Sheets
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {paper.questions?.map((q, idx) => (
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
        ))}
        {(!paper.questions || paper.questions.length === 0) && (
          <div className="card text-center py-12 text-slate-400">
            <p>Could not extract questions from this paper.</p>
          </div>
        )}
      </div>
    </div>
  )
}
