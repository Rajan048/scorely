import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { Mail, Loader2, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/api/auth/forgot-password', { email })
      setSent(true)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-100 px-4">
        <div className="w-full max-w-md card text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border border-green-200 text-green-600 mb-4 shadow-sm">
            <Mail size={32} />
          </div>
          <h2 className="font-display text-xl font-semibold text-slate-900">Check your email</h2>
          <p className="text-slate-500 mt-2">
            We've sent an OTP to <strong className="text-slate-900">{email}</strong>
          </p>
          <Link
            to="/reset-password"
            state={{ email }}
            className="btn-primary mt-6 inline-block"
          >
            Enter OTP
          </Link>
          <Link to="/login" className="flex items-center justify-center gap-2 mt-4 text-slate-500 hover:text-slate-900 transition">
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-slate-900">Forgot Password</h1>
          <p className="text-slate-500 mt-1">Enter your email to receive OTP</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-650 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Send OTP'}
          </button>

          <Link to="/login" className="flex items-center justify-center gap-2 text-slate-550 hover:text-slate-900 transition text-slate-500">
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </form>
      </div>
    </div>
  )
}
