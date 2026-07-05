import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../services/api'
import {
  Upload,
  Loader2,
  X,
} from 'lucide-react'

interface QuestionPaper {
  id: string
  subject: string
  exam_name: string
  total_marks: number
}

interface EvaluationResult {
  id: string
  student_name: string
  total_marks: number
  created_at: string
}

export default function AnswerSheets() {
  const [searchParams] = useSearchParams()
  const paperId = searchParams.get('paper')
  const [papers, setPapers] = useState<QuestionPaper[]>([])
  const [sheets, setSheets] = useState<EvaluationResult[]>([])
  const [selectedPaper, setSelectedPaper] = useState<string | null>(paperId || null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    loadPapers()
  }, [])

  useEffect(() => {
    if (selectedPaper) loadSheets(selectedPaper)
  }, [selectedPaper])

  useEffect(() => {
    if (paperId) setSelectedPaper(paperId)
  }, [paperId])

  const loadPapers = async () => {
    try {
      const res = await api.get('/api/teacher/question-papers')
      setPapers(res.data)
      if (!selectedPaper && res.data.length) setSelectedPaper(res.data[0].id)
    } catch {
      setPapers([])
    } finally {
      setLoading(false)
    }
  }

  const loadSheets = async (id: string) => {
    try {
      const res = await api.get(`/api/teacher/evaluation-reports/${id}`)
      setSheets(res.data)
    } catch {
      setSheets([])
    }
  }

  const handleUpload = async () => {
    if (!selectedPaper || files.length === 0) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('question_paper_id', selectedPaper.toString())
      files.forEach((f) => fd.append('files', f))
      await api.post('/api/teacher/upload-answer-sheets', fd)
      setFiles([])
      loadSheets(selectedPaper)
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const f = Array.from(e.dataTransfer.files).filter((file) =>
      /\.(pdf|jpg|jpeg|png|zip)$/i.test(file.name)
    )
    setFiles((prev) => [...prev, ...f])
  }

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Answer Sheets</h1>
        <p className="text-slate-500 mt-1">Upload and evaluate student answer sheets</p>
      </div>

      <div className="card">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Select Question Paper</label>
        <select
          value={selectedPaper ?? ''}
          onChange={(e) => setSelectedPaper(e.target.value ? e.target.value : null)}
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

      {selectedPaper && (
        <>
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`card border-2 border-dashed transition-all ${
              dragActive ? 'border-primary-500 bg-primary-50/50' : 'border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <Upload size={24} className="text-primary-600" />
              <div>
                <h3 className="font-display font-semibold text-slate-900">Upload Answer Sheets</h3>
                <p className="text-slate-500 text-sm">Drag & drop or click. PDF, JPG, PNG, ZIP</p>
              </div>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.zip"
              onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files || [])])}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="btn-secondary cursor-pointer inline-block"
            >
              Choose Files
            </label>
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200"
                  >
                    <span className="text-slate-700 text-sm truncate font-medium">{f.name}</span>
                    <button onClick={() => removeFile(i)} className="text-red-500 hover:text-red-750">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="btn-primary mt-2 flex items-center gap-2"
                >
                  {uploading ? <Loader2 size={18} className="animate-spin" /> : 'Upload & Evaluate'}
                </button>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="font-display font-bold text-slate-900 mb-4">Uploaded Sheets</h3>
            {loading ? (
              <Loader2 size={32} className="animate-spin text-primary-600 mx-auto" />
            ) : (
              <div className="overflow-x-auto border border-slate-100 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-slate-500 font-semibold text-sm">Student</th>
                      <th className="text-left py-3 px-4 text-slate-500 font-semibold text-sm">Date</th>
                      <th className="text-left py-3 px-4 text-slate-500 font-semibold text-sm">Marks Obtained</th>
                      <th className="text-left py-3 px-4 text-slate-500 font-semibold text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sheets.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3 px-4 text-slate-800 font-semibold">{s.student_name}</td>
                        <td className="py-3 px-4 text-slate-500 text-sm">
                          {new Date(s.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-primary-655 text-primary-600 font-bold">
                          {s.total_marks.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                            <a
                              href={`/teacher/results?sheet=${String(s.id)}`}
                              className="text-primary-600 hover:text-primary-750 text-sm font-semibold"
                            >
                              View Insights
                            </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
