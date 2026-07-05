import { Link } from 'react-router-dom'
import {
  Brain, Zap, ShieldCheck, BarChart3, FileText, Users,
  ArrowRight, CheckCircle, Star, ChevronRight
} from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'

const stats = [
  { value: '98%', label: 'Evaluation Accuracy' },
  { value: '10x', label: 'Faster Grading' },
  { value: '5000+', label: 'Answer Sheets Graded' },
  { value: '50+', label: 'Institutions Served' },
]

const features = [
  {
    icon: Brain,
    title: 'AI Powered Evaluation',
    desc: 'Leverages advanced AI models to generate reference answers and understand student responses with human-like precision.',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
  },
  {
    icon: Zap,
    title: 'Instant Evaluation',
    desc: 'Evaluate hundreds of answer sheets in minutes. Our semantic similarity engine processes bulk uploads with lightning speed.',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
  {
    icon: ShieldCheck,
    title: 'Plagiarism Detection',
    desc: 'Built-in academic integrity suite cross-checks student answers against each other and web sources automatically.',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    icon: BarChart3,
    title: 'Rich Analytics',
    desc: 'Deep performance insights with class-wide heatmaps, score distributions, and top-performer tracking dashboards.',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
]

const testimonials = [
  {
    name: 'Dr. Anika Sharma',
    role: 'Professor, IIT Delhi',
    text: 'Scorely has completely transformed how we handle exams. What used to take a week now takes under an hour.',
    rating: 5,
  },
  {
    name: 'Prof. Rajan Mehta',
    role: 'Dean of Academics, NIT Trichy',
    text: 'The AI accuracy is remarkable. It catches nuances in student answers that even human evaluators sometimes miss.',
    rating: 5,
  },
  {
    name: 'Ms. Priya Nair',
    role: 'Head of Examinations, DU',
    text: 'Our evaluation turnaround dropped from 2 weeks to 2 days. Students get faster feedback, teachers save hours.',
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -right-32 w-80 h-80 bg-violet-100/40 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-cyan-100/30 rounded-full blur-3xl animate-pulse delay-1000" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-slate-900">
            AI That Grades
            <span className="block bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Like a Master Teacher
            </span>
          </h1>

          <p className="text-slate-555 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 text-slate-600">
            Upload answer sheets. Let Advanced AI evaluate with semantic understanding.
            Get detailed feedback, marks, and analytics — in minutes, not days.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Start Free Trial
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/how-it-works"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-semibold text-lg transition-all shadow-sm"
            >
              See How It Works
            </Link>
          </div>

          {/* Stats Row */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-slate-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="py-24 relative bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">Capabilities</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Everything You Need</h2>
            <p className="text-slate-550 text-lg max-w-xl mx-auto text-slate-500">A complete AI evaluation platform designed for modern educational institutions.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-slate-300 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                  <f.icon size={24} className={f.text} />
                </div>
                <h3 className="font-display font-semibold text-slate-900 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="font-display text-4xl font-bold text-slate-900">Loved by Educators</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:shadow-md transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-650 text-sm leading-relaxed mb-5 text-slate-600">"{t.text}"</p>
                <div>
                  <p className="text-slate-900 font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 overflow-hidden shadow-sm">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary-100/35 blur-3xl rounded-full" />
            <div className="relative">
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                Ready to Automate<br />Your Evaluations?
              </h2>
              <p className="text-slate-500 text-lg mb-8 max-w-lg mx-auto">
                Join thousands of educators saving time with AI-powered grading.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-lg shadow-md hover:scale-105 transition-all"
              >
                Get Started for Free <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
