import { Link } from 'react-router-dom'
import { Upload, Brain, BarChart3, ArrowRight, CheckCircle, FileText, Zap } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'

const steps = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload Question Paper',
    desc: 'Teacher uploads the exam PDF or image. Our AI instantly extracts all questions, identifies marks distribution, and organizes them.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-slate-200',
    details: ['PDF, PNG, JPG support', 'AI reads printed & scanned text', 'Questions auto-extracted', 'Marks identified per question'],
  },
  {
    step: '02',
    icon: Brain,
    title: 'AI Generates Reference Answers',
    desc: "Advanced AI analyzes each question and generates comprehensive model answers based on the subject context. Teachers can review and edit these.",
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-slate-200',
    details: ['Domain-aware AI answers', 'Subject-context understanding', 'Teacher can edit & approve', 'Stored as grading rubric'],
  },
  {
    step: '03',
    icon: FileText,
    title: 'Upload Student Answer Sheets',
    desc: 'Bulk-upload all student answer sheets (PDF/images/ZIP). The system extracts each student\'s text and maps answers to corresponding questions.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-slate-200',
    details: ['Bulk ZIP or individual files', 'Auto student name detection', 'OCR text extraction', 'Q1, Q2... answer mapping'],
  },
  {
    step: '04',
    icon: Zap,
    title: 'Semantic AI Evaluation',
    desc: 'Our hybrid engine computes semantic similarity between student answers and reference answers using Sentence-Transformers + keyword analysis.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-slate-200',
    details: ['Sentence-Transformers model', 'Keyword + semantic scoring', 'Strictness mode: strict/medium/lenient', 'Per-question marks assigned'],
  },
  {
    step: '05',
    icon: BarChart3,
    title: 'Review Results & Export',
    desc: 'Teachers see detailed per-question breakdowns, similarity scores, AI feedback for each student. Marks can be manually edited and results exported.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-slate-200',
    details: ['Question-wise breakdown view', 'Similarity score per answer', 'Manual mark override', 'CSV export for records'],
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[500px] h-40 bg-primary-100/30 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-750 text-sm font-medium mb-6">
            The Process
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-slate-900 mb-5">
            How Scorely
            <span className="block bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Works in 5 Steps</span>
          </h1>
          <p className="text-slate-500 text-xl leading-relaxed">
            From uploading a question paper to getting fully evaluated results — the entire process is automated and takes just minutes.
          </p>
        </div>
      </section>

      {/* Steps Timeline */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 hidden sm:block" />

            <div className="space-y-12">
              {steps.map((s, idx) => (
                <div key={s.step} className={`relative flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                  {/* Step number - center on desktop */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border border-slate-300 items-center justify-center z-10 shadow-sm">
                    <span className="font-display font-bold text-slate-700 text-sm">{s.step}</span>
                  </div>

                  {/* Card */}
                  <div className={`md:w-5/12 ${idx % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <div className={`p-6 rounded-2xl bg-white border ${s.border} hover:shadow-lg transition-all`}>
                      {/* Mobile step */}
                      <div className="flex items-center gap-3 mb-4 md:hidden">
                        <span className="font-display font-bold text-slate-700 text-2xl">{s.step}</span>
                      </div>
                      <div className={`inline-flex w-12 h-12 rounded-xl ${s.bg} items-center justify-center mb-4 ${idx % 2 === 1 ? 'md:ml-auto' : ''}`}>
                        <s.icon size={24} className={s.color} />
                      </div>
                      <h3 className="font-display text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                      <p className="text-slate-550 text-sm leading-relaxed mb-4 text-slate-500">{s.desc}</p>
                      <ul className={`space-y-1.5 ${idx % 2 === 1 ? 'md:items-end' : ''}`}>
                        {s.details.map((d) => (
                          <li key={d} className={`flex items-center gap-2 text-slate-650 text-xs ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                            <CheckCircle size={12} className={s.color} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Empty space for opposite side */}
                  <div className="hidden md:block md:w-5/12" />
                </div>
              ))}
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
