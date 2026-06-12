import React, { useState } from 'react';
import { Shield, AlertTriangle, AlertCircle, CheckCircle2, FileText, Loader2, Info, TrendingUp, Briefcase, Building2, ListChecks, Gift, DollarSign } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const RISK_STYLES = {
  HIGH_RISK: {
    bgColor: '#FEF2F2', borderColor: '#FECACA', textColor: '#991B1B',
    accentColor: '#DC2626', iconColor: '#DC2626', icon: AlertTriangle, barColor: '#DC2626',
  },
  MEDIUM_RISK: {
    bgColor: '#FFF7ED', borderColor: '#FED7AA', textColor: '#9A3412',
    accentColor: '#EA580C', iconColor: '#EA580C', icon: AlertTriangle, barColor: '#EA580C',
  },
  LOW_RISK: {
    bgColor: '#FEFCE8', borderColor: '#FDE68A', textColor: '#854D0E',
    accentColor: '#CA8A04', iconColor: '#CA8A04', icon: AlertCircle, barColor: '#CA8A04',
  },
  LIKELY_LEGITIMATE: {
    bgColor: '#F0FDF4', borderColor: '#BBF7D0', textColor: '#15803D',
    accentColor: '#16A34A', iconColor: '#16A34A', icon: CheckCircle2, barColor: '#16A34A',
  },
};

const INITIAL_FORM = {
  title: '',
  company_profile: '',
  description: '',
  requirements: '',
  benefits: '',
  salary_range: '',
  has_company_logo: false,
  telecommuting: false,
  has_questions: false,
};

const REAL_EXAMPLE = {
  title: 'Senior Backend Engineer',
  company_profile: 'Acme Corporation is a leading technology company founded in 2015, specializing in cloud infrastructure. Our team of 200+ engineers serves Fortune 500 clients across North America and Europe.',
  description: 'We are seeking an experienced backend engineer to join our Payments Infrastructure team. You will design and implement high-throughput systems that process millions of transactions daily. Work closely with product managers and senior engineers to deliver scalable solutions.',
  requirements: 'Required: 5+ years of experience with distributed systems. Strong proficiency in Go or Java. Deep understanding of database internals (PostgreSQL, MySQL). Experience with Kafka or similar message brokers. Bachelor degree in Computer Science or equivalent.',
  benefits: 'Competitive base salary, equity package, comprehensive health insurance, 401k matching up to 6%, unlimited PTO, annual learning stipend $2000, hybrid work flexibility.',
  salary_range: '$140,000 - $180,000',
  has_company_logo: true,
  telecommuting: false,
  has_questions: true,
};

const FAKE_EXAMPLE = {
  title: 'EARN BIG MONEY FROM HOME!!!',
  company_profile: '',
  description: 'Earn $5000 per week from home! No experience needed. Easy work, flexible hours. Just check emails and forward documents. We provide everything. Anyone can do this job! Just send us your full name, address, and bank account details to start receiving payments immediately. Limited spots available!',
  requirements: '',
  benefits: '',
  salary_range: '',
  has_company_logo: false,
  telecommuting: true,
  has_questions: false,
};

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = form.title.trim().length >= 3 && form.description.trim().length >= 50;

  const handleAnalyze = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

      setTimeout(() => {
        const resultPanel = document.getElementById('result-panel');
        if (resultPanel) resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err.message || 'Failed to connect to API. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (type) => {
    setForm(type === 'real' ? REAL_EXAMPLE : FAKE_EXAMPLE);
    setResult(null);
    setError(null);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setResult(null);
    setError(null);
  };

  const risk = result ? RISK_STYLES[result.risk_level] : null;
  const RiskIcon = risk?.icon;

  return (
    <div style={{ minHeight: '100vh', background: '#F4F6F8', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Source+Serif+Pro:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'IBM Plex Sans', sans-serif; }
        .sans { font-family: 'IBM Plex Sans', sans-serif; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .serif { font-family: 'Source Serif Pro', Georgia, serif; }
        input:focus, textarea:focus { outline: none; border-color: #1B3A57 !important; box-shadow: 0 0 0 3px rgba(27,58,87,0.08); }
        .btn-primary:hover:not(:disabled) { background: #0F2438 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(27,58,87,0.25); }
        .btn-primary:disabled { background: #94A3B8 !important; cursor: not-allowed; }
        .btn-secondary:hover { background: #E8EEF3 !important; border-color: #1B3A57 !important; }
        .checkbox-card:hover { border-color: #1B3A57 !important; background: #F8FAFC !important; }
        .checkbox-card.checked { border-color: #1B3A57 !important; background: #E8EEF3 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @media (max-width: 900px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .checkbox-grid { grid-template-columns: 1fr !important; }
          h1 { font-size: 32px !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '20px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: '#1B3A57', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={22} color="#FFFFFF" strokeWidth={2.2} />
            </div>
            <div>
              <div className="serif" style={{ fontSize: '20px', fontWeight: 700, color: '#0F2438', letterSpacing: '-0.01em' }}>JobGuard</div>
              <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>Fraud Detection System</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 32px 32px' }}>
        <div style={{ maxWidth: '760px' }}>
          <div style={{ display: 'inline-block', background: '#E8EEF3', color: '#1B3A57', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '20px' }}>
            POWERED BY MACHINE LEARNING
          </div>
          <h1 className="serif" style={{ fontSize: '44px', fontWeight: 700, color: '#0F2438', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '20px' }}>
            Verify job postings before you apply.
          </h1>
          <p style={{ fontSize: '17px', color: '#475569', lineHeight: 1.6 }}>
            Fill in the job posting details below. Our model uses all 13 features — including text content, metadata indicators, and structural completeness — for accurate fraud detection.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px 64px' }}>
        <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', alignItems: 'start' }}>

          {/* LEFT: FORM */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '32px' }}>

            {/* Form header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={18} color="#1B3A57" />
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0F2438' }}>Job Posting Details</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" onClick={() => loadExample('real')}
                  style={{ padding: '6px 12px', fontSize: '12px', color: '#1B3A57', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>
                  Load Real
                </button>
                <button className="btn-secondary" onClick={() => loadExample('fake')}
                  style={{ padding: '6px 12px', fontSize: '12px', color: '#1B3A57', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>
                  Load Fake
                </button>
                <button className="btn-secondary" onClick={resetForm}
                  style={{ padding: '6px 12px', fontSize: '12px', color: '#64748B', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>
                  Reset
                </button>
              </div>
            </div>

            {/* Text fields */}
            <FormField label="Job Title" required icon={<Briefcase size={14} />} hint={`${form.title.length}/200`}>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                maxLength={200}
                style={inputStyle}
              />
            </FormField>

            <FormField label="Company Profile" optional icon={<Building2 size={14} />} hint="Background information about the company">
              <textarea
                value={form.company_profile}
                onChange={(e) => updateField('company_profile', e.target.value)}
                placeholder="Brief description of the company, its mission, size, industry..."
                rows={3}
                maxLength={5000}
                style={textareaStyle}
              />
            </FormField>

            <FormField label="Job Description" required icon={<FileText size={14} />} hint={`${form.description.length}/10000 (min 50)`}>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Detailed description of responsibilities, day-to-day tasks, and what the role involves..."
                rows={5}
                maxLength={10000}
                style={textareaStyle}
              />
            </FormField>

            <FormField label="Requirements" optional icon={<ListChecks size={14} />} hint="Qualifications, skills, experience needed">
              <textarea
                value={form.requirements}
                onChange={(e) => updateField('requirements', e.target.value)}
                placeholder="Years of experience, education, skills, certifications..."
                rows={3}
                maxLength={5000}
                style={textareaStyle}
              />
            </FormField>

            <FormField label="Benefits" optional icon={<Gift size={14} />} hint="Compensation, perks, work arrangement">
              <textarea
                value={form.benefits}
                onChange={(e) => updateField('benefits', e.target.value)}
                placeholder="Health insurance, retirement plan, PTO, equity, learning budget..."
                rows={2}
                maxLength={2000}
                style={textareaStyle}
              />
            </FormField>

            <FormField label="Salary Range" optional icon={<DollarSign size={14} />}>
              <input
                type="text"
                value={form.salary_range}
                onChange={(e) => updateField('salary_range', e.target.value)}
                placeholder="e.g. $80,000 - $120,000 / Rp 15-25 juta"
                maxLength={200}
                style={inputStyle}
              />
            </FormField>

            {/* Checkboxes */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                Posting Attributes <span style={{ color: '#DC2626' }}>*</span>
              </div>
              <div className="checkbox-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <CheckboxCard
                  label="Company logo"
                  checked={form.has_company_logo}
                  onChange={(v) => updateField('has_company_logo', v)}
                  description="Displayed on the posting"
                />
                <CheckboxCard
                  label="Remote / WFH"
                  checked={form.telecommuting}
                  onChange={(v) => updateField('telecommuting', v)}
                  description="Remote work allowed"
                />
                <CheckboxCard
                  label="Screening questions"
                  checked={form.has_questions}
                  onChange={(v) => updateField('has_questions', v)}
                  description="Application has questions"
                />
              </div>
            </div>

            {/* Submit button */}
            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-primary"
                onClick={handleAnalyze}
                disabled={loading || !isFormValid}
                style={{ padding: '13px 32px', fontSize: '14px', fontWeight: 600, color: '#FFFFFF', background: '#1B3A57', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.01em' }}
              >
                {loading ? (<><Loader2 size={16} className="spin" />Analyzing...</>) : 'Analyze Posting'}
              </button>
            </div>
          </div>

          {/* RIGHT: RESULTS */}
          <div id="result-panel" style={{ position: 'sticky', top: '20px' }}>
            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#991B1B', marginBottom: '4px' }}>Connection Error</div>
                    <div style={{ fontSize: '13px', color: '#7F1D1D', lineHeight: 1.5 }}>{error}</div>
                  </div>
                </div>
              </div>
            )}

            {!result && !loading && !error && (
              <div style={{ background: '#FFFFFF', border: '1px dashed #CBD5E1', borderRadius: '8px', padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', background: '#F1F5F9', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Info size={24} color="#94A3B8" />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Awaiting Analysis</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>Fill in the form and click Analyze to receive a fraud risk assessment based on all 13 model features.</p>
              </div>
            )}

            {loading && (
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '48px 32px', textAlign: 'center' }}>
                <Loader2 size={32} className="spin" color="#1B3A57" style={{ marginBottom: '14px' }} />
                <p style={{ fontSize: '14px', color: '#475569' }}>Running model...</p>
              </div>
            )}

            {result && !loading && risk && (
              <div className="fade-in" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                {/* Risk header */}
                <div style={{ padding: '24px', background: risk.bgColor, borderBottom: `1px solid ${risk.borderColor}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <RiskIcon size={22} color={risk.iconColor} strokeWidth={2.2} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: risk.accentColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {result.risk_label}
                    </span>
                  </div>
                  <div className="serif" style={{ fontSize: '28px', fontWeight: 700, color: risk.textColor, lineHeight: 1.2, marginBottom: '8px' }}>
                    {(result.fake_probability * 100).toFixed(1)}% Fraud Probability
                  </div>
                  <p style={{ fontSize: '13px', color: risk.textColor, lineHeight: 1.5, opacity: 0.85 }}>
                    {result.risk_message}
                  </p>
                </div>

                {/* Probability bars */}
                <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>Probability Distribution</h4>

                  <ProbBar label="Real" pct={result.real_probability * 100} color="#16A34A" />
                  <ProbBar label="Fake" pct={result.fake_probability * 100} color={risk.barColor} />
                </div>

                {/* Flags */}
                <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Key Signals Detected</h4>
                  <ul style={{ listStyle: 'none' }}>
                    {result.flags.map((flag, i) => (
                      <li key={i} style={{ fontSize: '13px', color: '#334155', padding: '8px 0', borderBottom: i < result.flags.length - 1 ? '1px solid #F1F5F9' : 'none', display: 'flex', alignItems: 'flex-start', gap: '10px', lineHeight: 1.5 }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: risk.accentColor, marginTop: '8px', flexShrink: 0 }} />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Feature summary */}
                <div style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Features Analyzed</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <FeatureRow label="Word count" value={result.features_summary.total_words} />
                    <FeatureRow label="Uppercase chars" value={result.features_summary.uppercase_count} />
                    <FeatureRow label="Exclamation marks" value={result.features_summary.exclamation_marks} />
                    <FeatureRow label="Company profile" value={result.features_summary.has_company_profile ? '✓' : '✗'} highlight={!result.features_summary.has_company_profile} />
                    <FeatureRow label="Requirements" value={result.features_summary.has_requirements ? '✓' : '✗'} highlight={!result.features_summary.has_requirements} />
                    <FeatureRow label="Benefits" value={result.features_summary.has_benefits ? '✓' : '✗'} highlight={!result.features_summary.has_benefits} />
                    <FeatureRow label="Salary range" value={result.features_summary.has_salary_range ? '✓' : '✗'} highlight={!result.features_summary.has_salary_range} />
                    <FeatureRow label="Company logo" value={result.features_summary.has_company_logo ? '✓' : '✗'} highlight={!result.features_summary.has_company_logo} />
                    <FeatureRow label="Remote/WFH" value={result.features_summary.telecommuting ? '✓' : '✗'} />
                    <FeatureRow label="Has questions" value={result.features_summary.has_questions ? '✓' : '✗'} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#FFFFFF', borderTop: '1px solid #E2E8F0', padding: '32px 0', marginTop: '32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: '#64748B' }}>
            JobGuard is a screening aid, not a final verdict. Always verify postings through additional channels.
          </p>
          <p className="mono" style={{ fontSize: '12px', color: '#94A3B8' }}>v3.0 · 13 Features Active</p>
        </div>
      </footer>
    </div>
  );
}

// ===== Sub-components =====

const inputStyle = {
  width: '100%', padding: '11px 14px', fontSize: '14px',
  fontFamily: "'IBM Plex Sans', sans-serif", color: '#1E293B',
  background: '#FAFBFC', border: '1.5px solid #E2E8F0', borderRadius: '5px',
  transition: 'all 0.15s ease'
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical', lineHeight: 1.55, minHeight: '60px'
};

function FormField({ label, required, optional, icon, hint, children }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
          {icon && <span style={{ color: '#1B3A57' }}>{icon}</span>}
          {label}
          {required && <span style={{ color: '#DC2626', fontSize: '13px' }}>*</span>}
          {optional && <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 400, marginLeft: '4px' }}>optional</span>}
        </label>
        {hint && <span className="mono" style={{ fontSize: '11px', color: '#94A3B8' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function CheckboxCard({ label, checked, onChange, description }) {
  return (
    <label
      className={`checkbox-card ${checked ? 'checked' : ''}`}
      style={{
        display: 'block', padding: '12px 14px',
        border: `1.5px solid ${checked ? '#1B3A57' : '#E2E8F0'}`,
        background: checked ? '#E8EEF3' : '#FAFBFC',
        borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ marginTop: '2px', accentColor: '#1B3A57', cursor: 'pointer', width: '15px', height: '15px' }}
        />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F2438', marginBottom: '2px' }}>{label}</div>
          <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.4 }}>{description}</div>
        </div>
      </div>
    </label>
  );
}

function ProbBar({ label, pct, color }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', color: '#1E293B', fontWeight: 500 }}>{label}</span>
        <span className="mono" style={{ fontSize: '13px', color: '#1E293B' }}>{pct.toFixed(1)}%</span>
      </div>
      <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.6s ease-out' }} />
      </div>
    </div>
  );
}

function FeatureRow({ label, value, highlight }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '6px 10px', background: highlight ? '#FEF3C7' : '#F8FAFC',
      borderRadius: '4px'
    }}>
      <span style={{ color: '#64748B' }}>{label}</span>
      <span className="mono" style={{ color: highlight ? '#92400E' : '#0F2438', fontWeight: 600 }}>{value}</span>
    </div>
  );
}