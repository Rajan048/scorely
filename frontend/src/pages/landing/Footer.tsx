import { Link } from 'react-router-dom'
import { BookOpen, Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src="/logo.jpg" alt="Scorely Logo" className="w-9 h-9 rounded-xl object-cover shadow-sm" />
              <span className="font-display font-bold text-slate-900 text-lg">Scorely</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              AI-powered answer sheet evaluation for modern educational institutions.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition shadow-sm">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display font-semibold text-slate-800 text-sm mb-4">Product</h4>
            <ul className="space-y-2.5">
              {['Features', 'How It Works', 'Pricing', 'Changelog'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-slate-500 hover:text-slate-800 text-sm transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-slate-800 text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {['About', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-slate-500 hover:text-slate-800 text-sm transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-slate-800 text-sm mb-4">Get In Touch</h4>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
              <Mail size={14} />
              <span>support@evalai.edu</span>
            </div>
            <p className="text-slate-500 text-sm">Mon–Fri, 9am–6pm IST</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-sm transition shadow-sm"
            >
              Contact Us →
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2026 Scorely. All rights reserved.</p>
          <p className="text-slate-400 text-sm">Hand-coded by humans using React & Tailwind CSS. No AI builders were used.</p>
        </div>
      </div>
    </footer>
  )
}
