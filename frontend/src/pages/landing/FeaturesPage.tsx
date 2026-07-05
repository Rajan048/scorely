import { Link } from 'react-router-dom'
import {
  Brain, Zap, ShieldCheck, BarChart3, FileText, Users,
  CheckCircle, ArrowRight
} from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'

const mainFeatures = [
  {
    icon: Brain,
    title: 'AI Reference Answer Generation',
    desc: 'Upload any question paper PDF. Advanced AI automatically reads each question and generates comprehensive reference answers with domain-specific knowledge.',
    points: ['PDF & image upload support', 'Instant AI-generated answers', 'Subject-aware generation', 'Edit and refine references'],
    gradient: 'from-indigo-500 to-indigo-700',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-slate-200',
  },
  {
    icon: Zap,
    title: 'Semantic Similarity Evaluation',
    desc: 'Our hybrid engine combines advanced AI models with Sentence-Transformers to understand meaning, not just keywords — evaluating like a subject matter expert.',
    points: ['Meaning-based scoring', 'Keyword + semantic hybrid', 'Configurable strictness levels', 'Per-question marks'],
    gradient: 'from-amber-500 to-amber-700',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-slate-200',
  },
  {
    icon: FileText,
    title: 'Bulk Answer Sheet Processing',
    desc: 'Upload hundreds of PDF or image answer sheets at once. Our pipeline extracts handwritten/typed text, maps answers to questions, and evaluates automatically.',
    points: ['PDF, JPG, PNG, ZIP support', 'Drag & drop interface', 'Auto student name detection', 'Batch processing pipeline'],
    gradient: 'from-emerald-500 to-emerald-700',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-slate-200',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    desc: 'Real-time dashboards give teachers and admins full visibility into class performance, evaluation progress, and AI accuracy metrics.',
    points: ['Class performance heatmaps', 'Per-student breakdowns', 'AI similarity scores', 'Exportable CSV reports'],
    gradient: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-slate-200',
  },
  {
    icon: ShieldCheck,
    title: 'Plagiarism Detection',
    desc: 'Automatically scan all student submissions for similarity against each other and web sources. Get flagged reports before finalizing marks.',
    points: ['Cross-student comparison', 'Web source scanning', 'Similarity percentage scoring', 'Integrity audit trail'],
    gradient: 'from-rose-500 to-rose-700',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-slate-200',
  },
  {
    icon: Users,
    title: 'Role-Based Access Control',
    desc: 'Separate admin and teacher portals with JWT authentication. Admins manage the system; teachers manage their own exams and students.',
    points: ['Admin & teacher roles', 'JWT secure authentication', 'Per-teacher data isolation', 'Audit logs & activity trail'],
    gradient: 'from-slate-500 to-slate-700',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-primary-100/30 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-755 text-sm font-medium mb-6">
            All Features
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-slate-900 mb-5">
            Everything you need
            <span className="block bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">to speed up grading</span>
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
            Simple, practical tools designed by developers who respect a teacher's time.
          </p>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((f) => (
              <div
                key={f.title}
                className="card flex flex-col hover:shadow-lg transition-all duration-300 border-slate-200/80 bg-white"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5 shadow-sm`}>
                  <f.icon size={22} className={f.text} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{f.desc}</p>
                <ul className="space-y-2 mt-auto pt-5 border-t border-slate-100">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                      <CheckCircle size={14} className={f.text} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center border-t border-slate-200 bg-white">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">Ready to Experience All Features?</h2>
        <p className="text-slate-500 mb-8">Get started free — no credit card required.</p>
        <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-lg shadow-md hover:scale-105 transition-all">
          Start Now <ArrowRight size={20} />
        </Link>
      </section>

      <Footer />
    </div>
  )
}
