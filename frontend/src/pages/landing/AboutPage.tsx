import { Link } from 'react-router-dom'
import { Brain, Target, Users, Award, ArrowRight, CheckCircle } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'

const team = [
  { name: 'Dr. Anika Sharma', role: 'AI Research Lead', initials: 'AS', color: 'from-violet-500 to-purple-700' },
  { name: 'Rajan Saini', role: 'Full-Stack Engineer', initials: 'RS', color: 'from-indigo-550 to-indigo-650' },
  { name: 'Priya Mehta', role: 'Product Designer', initials: 'PM', color: 'from-rose-500 to-pink-600' },
  { name: 'Arjun Reddy', role: 'ML Engineer', initials: 'AR', color: 'from-amber-500 to-orange-600' },
]

const values = [
  {
    icon: Target,
    title: 'Accuracy First',
    desc: 'We obsess over evaluation precision. Every model update is benchmarked against human graders to ensure reliability.',
    color: 'text-indigo-600', bg: 'bg-indigo-50',
  },
  {
    icon: Users,
    title: 'Teacher-Centric',
    desc: 'Teachers are at the heart of everything we build. Every feature is designed to reduce workload, not add complexity.',
    color: 'text-violet-600', bg: 'bg-violet-50',
  },
  {
    icon: Brain,
    title: 'AI with Transparency',
    desc: 'Our AI always shows its reasoning. Teachers can see similarity scores, reference answers, and override any decision.',
    color: 'text-emerald-600', bg: 'bg-emerald-50',
  },
  {
    icon: Award,
    title: 'Student Success',
    desc: 'Faster feedback means students can learn and improve quickly. Our platform directly contributes to better academic outcomes.',
    color: 'text-amber-600', bg: 'bg-amber-50',
  },
]

const milestones = [
  { year: '2023', event: 'Scorely founded with a mission to automate academic evaluation' },
  { year: 'Early 2024', event: 'First version launched with basic PDF evaluation' },
  { year: 'Mid 2024', event: 'Integrated advanced AI for semantic understanding' },
  { year: 'Late 2024', event: 'Reached 1,000+ answer sheets evaluated' },
  { year: '2025', event: 'Launched admin portal, bulk upload, and plagiarism detection' },
  { year: '2026', event: 'Now serving 50+ institutions across India' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[500px] h-40 bg-violet-100/30 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-755 text-sm font-medium mb-6">
            Our Story
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-slate-900 mb-5">
            We Believe Grading
            <span className="block bg-gradient-to-r from-violet-600 to-indigo-650 bg-clip-text text-transparent">Shouldn't Take Days</span>
          </h1>
          <p className="text-slate-500 text-xl leading-relaxed">
            Scorely was born from a simple frustration: brilliant teachers spending weeks grading instead of teaching. We built the solution we wished existed.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-slate-900 mb-5">Our Mission</h2>
              <p className="text-slate-550 leading-relaxed mb-5 text-lg text-slate-650">
                We're building the future of academic evaluation — where AI handles the repetitive grading work and teachers focus on what they do best: inspiring students.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Our platform doesn't just give a score. It provides detailed feedback per question, similarity analysis, and helps identify areas where students are struggling — giving educators actionable insights they never had before.
              </p>
              <div className="mt-8 space-y-3">
                {['100% transparent AI scoring', 'Teachers always in control', 'Student privacy first', 'Continuous model improvement'].map((p) => (
                  <div key={p} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle size={18} className="text-primary-600 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: '98%', label: 'Accuracy vs human graders', color: 'text-indigo-600' },
                { val: '10x', label: 'Speed improvement', color: 'text-violet-600' },
                { val: '50+', label: 'Institutions trust us', color: 'text-emerald-600' },
                { val: '5000+', label: 'Sheets evaluated', color: 'text-amber-600' },
              ].map((s) => (
                <div key={s.label} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                  <p className={`font-display text-4xl font-bold ${s.color} mb-2`}>{s.val}</p>
                  <p className="text-slate-500 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-slate-900 mb-3">Our Values</h2>
            <p className="text-slate-500 text-lg">The principles that guide every decision we make.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center mb-4`}>
                  <v.icon size={24} className={v.color} />
                </div>
                <h3 className="font-display font-bold text-slate-900 text-lg mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-slate-900 mb-3">Our Journey</h2>
            <p className="text-slate-500 text-lg">From idea to platform trusted by institutions.</p>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-8">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-6 pl-12 relative">
                  <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-primary-600" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-primary-600 text-sm">{m.year}</span>
                    <p className="text-slate-600 mt-1">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-slate-900 mb-3">Meet the Team</h2>
            <p className="text-slate-500 text-lg">The people building Scorely.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((t) => (
              <div key={t.name} className="text-center group">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-display font-bold text-xl mx-auto mb-4 group-hover:scale-105 transition-transform shadow-md`}>
                  {t.initials}
                </div>
                <p className="font-semibold text-slate-900">{t.name}</p>
                <p className="text-slate-500 text-sm mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center border-t border-slate-200 bg-white">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">Join Us on This Mission</h2>
        <p className="text-slate-500 mb-8">Start evaluating smarter today.</p>
        <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-lg shadow-md hover:scale-105 transition-all">
          Get Started Free <ArrowRight size={20} />
        </Link>
      </section>

      <Footer />
    </div>
  )
}
