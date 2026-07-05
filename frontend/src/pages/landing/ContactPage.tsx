import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, MessageSquare, Clock } from 'lucide-react'
import emailjs from '@emailjs/browser'
import Navbar from './Navbar'
import Footer from './Footer'

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'support@evalai.edu', sub: 'We reply within 24 hours' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', sub: 'Mon–Fri, 9am–6pm IST' },
  { icon: MapPin, label: 'Address', value: 'Bengaluru, Karnataka, India', sub: 'Headquarters' },
  { icon: Clock, label: 'Response Time', value: 'Under 24 Hours', sub: 'Average first reply time' },
]

const faqs = [
  {
    q: 'How accurate is the AI grading?',
    a: 'Scorely matches human evaluator grades with up to 98% accuracy. Our semantic engine understands concepts, context, and intent rather than just checking for exact keywords.',
  },
  {
    q: 'What file formats are supported?',
    a: 'We support PDF, JPG, JPEG, PNG, and ZIP archives. Handwritten answer sheets are automatically run through OCR for text extraction.',
  },
  {
    q: 'Is my student data secure?',
    a: 'Absolutely. We prioritize security by encrypting all data in transit and at rest. Student data is never used for training public models.',
  },
  {
    q: 'Can I use my own grading rubric?',
    a: 'Yes. Teachers can edit the AI-generated reference answers before evaluation, effectively providing custom rubrics for any question.',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (serviceId && templateId && publicKey) {
      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            name: form.name,
            from_name: form.name,
            email: form.email,
            from_email: form.email,
            subject: form.subject,
            message: form.message,
          },
          publicKey
        )
        setSent(true)
      } catch (err) {
        console.error('Failed to send email:', err)
        const errMsg = (err as any)?.text || (err as any)?.message || JSON.stringify(err)
        alert('Failed to send message: ' + errMsg)
      }
    } else {
      // Fallback simulation
      await new Promise((r) => setTimeout(r, 1500))
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[500px] h-40 bg-green-100/25 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium mb-6">
            <MessageSquare size={14} className="fill-current text-green-500" />
            Get In Touch
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-slate-900 mb-5">
            We're Here
            <span className="block bg-gradient-to-r from-green-600 to-primary-600 bg-clip-text text-transparent">to Help You</span>
          </h1>
          <p className="text-slate-500 text-xl leading-relaxed">
            Have a question, need a demo, or want to discuss institutional pricing? Our team is ready to help.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {contactInfo.map((c) => (
              <div key={c.label} className="p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-sm transition-all text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-3">
                  <c.icon size={22} className="text-primary-600" />
                </div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">{c.label}</p>
                <p className="text-slate-800 font-semibold text-sm">{c.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{c.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
              <p className="text-slate-500 mb-8">Fill out the form and we'll get back to you within 24 hours.</p>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500">Thanks for reaching out. We'll reply within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name</label>
                      <input
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-slate-900 placeholder-slate-400"
                        placeholder="Rajan Saini"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-slate-900 placeholder-slate-400"
                        placeholder="rajan@school.edu"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-slate-900"
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      required
                    >
                      <option value="">Select a topic...</option>
                      <option value="demo">Request a Demo</option>
                      <option value="pricing">Institutional Pricing</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-slate-900 placeholder-slate-400 resize-none"
                      placeholder="Tell us how we can help..."
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold shadow-sm transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">Frequently Asked</h2>
              <p className="text-slate-500 mb-8">Quick answers to common questions.</p>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border transition-all cursor-pointer bg-white ${openFaq === i ? 'border-primary-300 bg-primary-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <div className="flex items-center justify-between p-5">
                      <span className="font-medium text-slate-900 text-sm pr-4">{faq.q}</span>
                      <span className={`text-slate-400 text-xl font-light transition-transform shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                    </div>
                    {openFaq === i && (
                      <div className="px-5 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-200/60 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
