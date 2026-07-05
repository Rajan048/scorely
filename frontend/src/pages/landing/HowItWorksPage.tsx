import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Upload, Brain, BarChart3, ArrowRight, CheckCircle, FileText, Zap,
  Loader2, Check, Download, AlertCircle, Plus, Minus, Settings
} from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'

const steps = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload the exam paper',
    desc: 'Drag and drop your question paper. The system reads the document and breaks down the list of questions and their mark weights.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-slate-200',
    details: ['Supports PDF or image files', 'Extracts questions automatically', 'Identifies mark weightage', 'Ready in seconds'],
  },
  {
    step: '02',
    icon: Brain,
    title: 'Review the model answers',
    desc: 'The assistant suggests detailed reference answers based on the subject. You can edit, rewrite, or approve them to set your grading guidelines.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-slate-200',
    details: ['Auto-drafted model answers', 'Edit any text freely', 'Save custom guidelines', 'Sets the grading baseline'],
  },
  {
    step: '03',
    icon: FileText,
    title: 'Drop in student sheets',
    desc: 'Upload student answer sheets in a batch. The app extracts the handwriting or typed text and aligns it with the correct questions.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-slate-200',
    details: ['Upload bulk ZIP or individual PDFs', 'Handwriting extraction (OCR)', 'Name & ID detection', 'Matches answers to questions'],
  },
  {
    step: '04',
    icon: Zap,
    title: 'Smart answer comparison',
    desc: 'The evaluation tool reads the meaning of the student answers and compares it to your model answers. It calculates a similarity score based on strictness.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-slate-200',
    details: ['Meaning-based comparison', 'Adjustable strictness settings', 'Detailed drafting score', 'Transparent comparisons'],
  },
  {
    step: '05',
    icon: BarChart3,
    title: 'Check and export',
    desc: 'Review the draft results. You can override any score manually, write notes for students, and download the grades as a spreadsheet.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-slate-200',
    details: ['Teacher reviews every draft', 'Override marks with one click', 'Add personal feedback', 'Download spreadsheet (CSV)'],
  },
]

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0)

  // Step 1 Simulation states
  const [isUploading, setIsUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  // Step 2 Simulation states
  const [rubricText, setRubricText] = useState(
    'Photosynthesis is the chemical process by which green plants use sunlight, carbon dioxide, and water to synthesize nutrients (glucose) and release oxygen as a byproduct.'
  )
  const [rubricSaved, setRubricSaved] = useState(false)

  // Step 3 Simulation states
  const [scanLogs, setScanLogs] = useState<string[]>([])
  const [scanning, setScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)

  // Step 4 Simulation states
  const [strictness, setStrictness] = useState<'lenient' | 'medium' | 'strict'>('medium')

  // Step 5 Simulation states
  const [studentScore, setStudentScore] = useState(3.5)
  const [feedback, setFeedback] = useState('Good conceptual understanding, but missed mentioning carbon dioxide and water inputs.')
  const [downloaded, setDownloaded] = useState(false)

  // Reset simulator values when switching tabs
  useEffect(() => {
    setUploaded(false)
    setIsUploading(false)
    setRubricSaved(false)
    setScanLogs([])
    setScanning(false)
    setScanComplete(false)
    setDownloaded(false)
  }, [activeStep])

  // Step 1 Trigger
  const startUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      setUploaded(true)
    }, 1200)
  }

  // Step 3 Trigger
  const startScanning = () => {
    setScanning(true)
    setScanLogs([])
    setScanComplete(false)

    const logs = [
      'Scanning biology_midterm_sheets.zip...',
      'Opening batch package...',
      'Processing sheet_1.pdf...',
      'Detected Student Name: Ayush Saini',
      'Extracted handwritten text from Q1 response.',
      'Successfully mapped Q1, Q2, and Q3 answers.',
      'Processing sheet_2.pdf...',
      'Detected Student Name: Priya Patel',
      'Extracted handwritten text from Q1 response.',
      'Batch scan complete. 2 sheets ready for evaluation!'
    ]

    let currentLogIndex = 0
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setScanLogs((prev) => [...prev, logs[currentLogIndex]])
        currentLogIndex++
      } else {
        clearInterval(interval)
        setScanning(false)
        setScanComplete(true)
      }
    }, 500)
  }

  // Step 4 Similarity dynamic math
  const getSimilarityResults = () => {
    if (strictness === 'lenient') {
      return { match: '92%', marks: 4.5, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
    }
    if (strictness === 'medium') {
      return { match: '75%', marks: 3.5, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' }
    }
    return { match: '48%', marks: 2.0, color: 'text-rose-600 bg-rose-50 border-rose-200' }
  }

  // Step 5 CSV Downloader
  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Student Name,Subject,Draft Score,Final Score,Teacher Feedback\n"
      + `Ayush Saini,Biology,3.5,${studentScore},"${feedback.replace(/"/g, '""')}"\n`
      + `Priya Patel,Biology,4.5,4.5,"Excellent work, highly detailed reference points."\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "scorely_grades.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[500px] h-40 bg-primary-100/30 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-750 text-sm font-medium mb-6">
            The Process
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-5">
            How Scorely
            <span className="block bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Works in 5 Steps</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
            From uploading an exam paper to downloading a spreadsheet of final grades — here is a quick look at the workflow.
          </p>
        </div>
      </section>

      {/* Interactive Interactive Step Playground */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Step Progress Tracker Tabs */}
          <div className="flex flex-wrap justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl mb-10 shadow-sm gap-2">
            {steps.map((s, idx) => {
              const Icon = s.icon
              const isActive = activeStep === idx
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm text-left grow sm:grow-0 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {s.step}
                  </span>
                  <div className="hidden sm:block">
                    <p className="text-xs opacity-75 font-semibold uppercase leading-none">Step</p>
                    <p className="font-bold leading-tight mt-0.5">{s.title.split(' ')[0] + ' ' + (s.title.split(' ')[1] ?? '')}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Step Detail Card Layout */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 lg:p-12 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              
              {/* Left Column: Info details */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${steps[activeStep].bg} flex items-center justify-center`}>
                    {(() => {
                      const Icon = steps[activeStep].icon
                      return <Icon size={28} className={steps[activeStep].color} />
                    })()}
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Step {steps[activeStep].step}</span>
                    <h2 className="font-display text-2xl font-bold text-slate-900 mt-0.5">{steps[activeStep].title}</h2>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed text-base">{steps[activeStep].desc}</p>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3.5">Highlights</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {steps[activeStep].details.map((detail) => (
                      <div key={detail} className="flex items-center gap-2.5 text-sm text-slate-700">
                        <CheckCircle size={16} className={`${steps[activeStep].color} shrink-0`} />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {activeStep < 4 ? (
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="inline-flex items-center gap-2 text-primary-600 font-bold text-sm hover:translate-x-1 transition-transform"
                  >
                    See next step <ArrowRight size={16} />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:translate-x-1 transition-transform"
                  >
                    Try the dashboard now <ArrowRight size={16} />
                  </Link>
                )}
              </div>

              {/* Right Column: Step Interactive Simulation Playground */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-inner min-h-[300px] flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Simulator
                </div>

                {/* STEP 1 SIMULATION: Upload exam */}
                {activeStep === 0 && (
                  <div className="text-center space-y-4">
                    {!uploaded ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white border border-dashed border-slate-300 mx-auto flex items-center justify-center shadow-sm">
                          {isUploading ? (
                            <Loader2 size={24} className="text-primary-600 animate-spin" />
                          ) : (
                            <Upload size={24} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">Drag and drop question paper</p>
                          <p className="text-slate-400 text-xs mt-0.5">Supports PDF or Image (Max 10MB)</p>
                        </div>
                        <button
                          onClick={startUpload}
                          disabled={isUploading}
                          className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs shadow-md"
                        >
                          {isUploading ? 'Extracting text...' : 'Select question_paper.pdf'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 text-left p-2">
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-semibold">
                          <Check size={16} /> Question paper successfully processed!
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm">
                          <p className="text-xs uppercase font-bold text-slate-400 border-b pb-2 mb-2">Extracted Questions Baseline</p>
                          <div className="flex justify-between items-center text-xs font-medium text-slate-700 border-b border-slate-50 pb-1.5">
                            <span>Q1. Explain process of photosynthesis</span>
                            <span className="px-2 py-0.5 bg-slate-100 border rounded text-[10px] text-slate-500">5 Marks</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-medium text-slate-700 border-b border-slate-50 pb-1.5">
                            <span>Q2. Define aerobic respiration</span>
                            <span className="px-2 py-0.5 bg-slate-100 border rounded text-[10px] text-slate-500">5 Marks</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-medium text-slate-700">
                            <span>Q3. Compare plant and animal cells</span>
                            <span className="px-2 py-0.5 bg-slate-100 border rounded text-[10px] text-slate-500">10 Marks</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setUploaded(false)}
                          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mx-auto hover:underline"
                        >
                          Upload another paper
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2 SIMULATION: Review model answer */}
                {activeStep === 1 && (
                  <div className="space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-xs uppercase font-bold text-slate-400">Model Answer Draft (Q1)</span>
                        <span className="text-[10px] font-semibold bg-violet-50 text-violet-600 px-2 py-0.5 rounded border border-violet-100">AI Suggested</span>
                      </div>
                      <textarea
                        value={rubricText}
                        onChange={(e) => {
                          setRubricText(e.target.value)
                          setRubricSaved(false)
                        }}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 p-2.5 rounded-lg border border-slate-200 focus:border-violet-500 outline-none resize-none h-24 transition-all"
                        placeholder="Edit reference answer..."
                      />
                    </div>
                    
                    {!rubricSaved ? (
                      <button
                        onClick={() => setRubricSaved(true)}
                        className="btn-primary bg-violet-600 hover:bg-violet-500 w-full py-2.5 text-xs flex items-center justify-center gap-2 shadow-md"
                      >
                        Approve Reference Answer
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 py-2.5 rounded-xl text-xs font-semibold animate-fade-in">
                        <Check size={16} /> Reference Answer Locked as Rubric!
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3 SIMULATION: Drop student sheets */}
                {activeStep === 2 && (
                  <div className="space-y-4">
                    {!scanComplete && scanLogs.length === 0 && (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white border border-dashed border-slate-300 mx-auto flex items-center justify-center shadow-sm">
                          <FileText size={24} className="text-slate-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">Simulate Student Sheets Scan</p>
                          <p className="text-slate-400 text-xs mt-0.5">Loads 2 student sheets with handwritten answers</p>
                        </div>
                        <button
                          onClick={startScanning}
                          className="btn-primary bg-amber-600 hover:bg-amber-500 inline-flex items-center gap-2 px-5 py-2.5 text-xs shadow-md"
                        >
                          Start Scanning Process
                        </button>
                      </div>
                    )}

                    {(scanning || scanLogs.length > 0) && (
                      <div className="space-y-4">
                        <div className="bg-slate-900 rounded-xl p-4 font-mono text-[10px] text-emerald-400 h-40 overflow-y-auto space-y-1 border border-slate-800 shadow-inner">
                          {scanLogs.map((log, i) => (
                            <p key={i} className="leading-relaxed">
                              {log.startsWith('Scanning') || log.startsWith('Processing') ? '> ' : '  '}
                              {log}
                            </p>
                          ))}
                          {scanning && (
                            <div className="flex items-center gap-1 mt-1 text-slate-400">
                              <Loader2 size={10} className="animate-spin text-emerald-400" />
                              <span>processing...</span>
                            </div>
                          )}
                        </div>
                        {scanComplete && (
                          <div className="flex justify-between items-center gap-3">
                            <span className="text-xs text-slate-500">2 documents successfully parsed.</span>
                            <button
                              onClick={() => {
                                setScanLogs([])
                                setScanComplete(false)
                              }}
                              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                            >
                              Restart Scan
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4 SIMULATION: Answer comparison */}
                {activeStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-sm">
                      <p className="text-[10px] uppercase font-bold text-slate-400 border-b pb-1 mb-1">Student Answer (Q1)</p>
                      <p className="text-xs text-slate-700 italic">"Plants make food using sunlight and chlorophyll."</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Strictness Setting</span>
                        <div className="flex gap-1.5">
                          {(['lenient', 'medium', 'strict'] as const).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setStrictness(mode)}
                              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border transition-all ${
                                strictness === mode
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Results gauge */}
                    {(() => {
                      const res = getSimilarityResults()
                      return (
                        <div className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${res.color}`}>
                          <div>
                            <p className="text-[10px] uppercase tracking-wide opacity-80 font-bold">Semantic Match Score</p>
                            <p className="text-2xl font-bold mt-0.5">{res.match} Match</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wide opacity-80 font-bold">Draft Score</p>
                            <p className="text-2xl font-bold mt-0.5">{res.marks} / 5 Marks</p>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* STEP 5 SIMULATION: Check and export */}
                {activeStep === 4 && (
                  <div className="space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-sm">
                      <div className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">Ayush Saini</p>
                          <p className="text-[10px] text-slate-400">Student Paper ID: #1024</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setStudentScore((s) => Math.max(0, s - 0.5))}
                            className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-display font-bold text-slate-800 text-sm w-12 text-center">
                            {studentScore.toFixed(1)} / 5
                          </span>
                          <button
                            onClick={() => setStudentScore((s) => Math.min(5, s + 0.5))}
                            className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400">Teacher Correction Feedback</label>
                        <input
                          type="text"
                          value={feedback}
                          onChange={(e) => {
                            setFeedback(e.target.value)
                            setDownloaded(false)
                          }}
                          className="w-full text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 focus:border-primary-500 outline-none transition"
                        />
                      </div>
                    </div>

                    {!downloaded ? (
                      <button
                        onClick={downloadCSV}
                        className="btn-primary bg-rose-600 hover:bg-rose-500 w-full py-2.5 text-xs flex items-center justify-center gap-2 shadow-md"
                      >
                        <Download size={14} /> Download Grade Marksheet (CSV)
                      </button>
                    ) : (
                      <div className="space-y-2 animate-fade-in">
                        <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 py-2 rounded-xl text-xs font-semibold">
                          <Check size={16} /> scorely_grades.csv successfully downloaded!
                        </div>
                        <button
                          onClick={() => setDownloaded(false)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 block mx-auto underline"
                        >
                          Download again
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-white border-t border-slate-200">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">See It In Action</h2>
        <p className="text-slate-500 mb-8 max-w-lg mx-auto">The best way to understand is to try it. Set up takes under 2 minutes.</p>
        <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-lg shadow-md hover:scale-105 transition-all">
          Try Scorely Free <ArrowRight size={20} />
        </Link>
      </section>

      <Footer />
    </div>
  )
}
