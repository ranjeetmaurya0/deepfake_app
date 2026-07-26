import React, { useState } from 'react';
import { ContactFormRequest } from '../types';
import { Mail, Send, CheckCircle2, Building, User, ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';

export const ContactEnterpriseForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormRequest>({
    fullName: '',
    email: '',
    organization: '',
    role: 'Researcher',
    subject: 'API Access & Academic Collaboration Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      setErrorMsg('Please fill in all required fields (Name, Email, and Message).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || 'Failed to submit inquiry.');
      }
    } catch (err: any) {
      setErrorMsg('Network error connecting to backend API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">
            Research Collaboration & Enterprise API Inquiries
          </h2>
          <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-500/30">
            DIRECT LAB ACCESS
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Inquire about enterprise REST API keys, private Triton GPU cluster deployments, or research partnerships with Dr. Ranjeet Maurya & the Deepfake Forensics Lab team.
        </p>
      </div>

      {submitted ? (
        <div className="bg-slate-950 p-8 rounded-2xl border border-emerald-500/40 text-center space-y-4 max-w-xl mx-auto py-12">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-mono">Inquiry Received Successfully!</h3>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Thank you, <span className="text-cyan-300 font-bold">{formData.fullName}</span>. Our research team has received your message regarding <span className="text-white font-bold">{formData.subject}</span>. A representative will contact you at <span className="text-cyan-300 font-bold">{formData.email}</span> shortly.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ fullName: '', email: '', organization: '', role: 'Researcher', subject: '', message: '' });
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 hover:text-white cursor-pointer"
          >
            Submit Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Dr. Alex Vance"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Work / Academic Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex.vance@mit.edu"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Organization */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Organization / Institution</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="MIT AI Forensics Research Lab"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Your Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value="Researcher">Academic Researcher / Professor</option>
                <option value="Law Enforcement / Forensics">Law Enforcement / Digital Forensics</option>
                <option value="Enterprise Security">Enterprise Security Officer</option>
                <option value="Student / Educator">Student / Educator</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Inquiry Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="API Access & Collaboration Inquiry"
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Message Details <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your research requirements or enterprise GPU inference throughput needs..."
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              id="submit-contact-inquiry-btn"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending Inquiry...' : 'Submit Enterprise Inquiry'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
