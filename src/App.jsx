import React, { useState } from 'react';
import { Shield, AlertTriangle, AlertCircle, CheckCircle2, FileText, Loader2, Info, TrendingUp } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Risk level styling configuration
const RISK_STYLES = {
  HIGH_RISK: {
    bgColor:    '#FEF2F2',
    borderColor:'#FECACA',
    textColor:  '#991B1B',
    accentColor:'#DC2626',
    iconColor:  '#DC2626',
    icon:       AlertTriangle,
    barColor:   '#DC2626',
  },
  MEDIUM_RISK: {
    bgColor:    '#FFF7ED',
    borderColor:'#FED7AA',
    textColor:  '#9A3412',
    accentColor:'#EA580C',
    iconColor:  '#EA580C',
    icon:       AlertTriangle,
    barColor:   '#EA580C',
  },
  LOW_RISK: {
    bgColor:    '#FEFCE8',
    borderColor:'#FDE68A',
    textColor:  '#854D0E',
    accentColor:'#CA8A04',
    iconColor:  '#CA8A04',
    icon:       AlertCircle,
    barColor:   '#CA8A04',
  },
  LIKELY_LEGITIMATE: {
    bgColor:    '#F0FDF4',
    borderColor:'#BBF7D0',
    textColor:  '#15803D',
    accentColor:'#16A34A',
    iconColor:  '#16A34A',
    icon:       CheckCircle2,
    barColor:   '#16A34A',
  },
};

export default function App() {
  const [jobText, setJobText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!jobText.trim() || jobText.length < 50) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: jobText })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to API. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadExample = (type) => {
    if (type === 'real') {
      setJobText('Senior Software Engineer at Acme Corporation. We are seeking an experienced backend engineer with 5+ years of experience in distributed systems. Required: Python, PostgreSQL, AWS, Docker. Bachelor degree in Computer Science or equivalent. Responsibilities include designing scalable microservices, code reviews, mentoring junior engineers. Competitive salary based on experience, health insurance, 401k matching.');
    } else {
      setJobText('Earn $5000/week from home! No experience needed. Easy work, flexible hours. Just check emails and forward them. We provide everything. Contact us now with your bank details to receive your first paycheck. Limited spots available!');
    }
    setResult(null);
    setError(null);
  };

  // Get risk style based on result
  const risk = result ? RISK_STYLES[result.risk_level] : null;
  const RiskIcon = risk?.icon;

  return (
    <div style={{ minHeight: '100vh', background: '#F4F6F8', fontFamily: "'Source Serif Pro', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Source+Serif+Pro:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'IBM Plex Sans', sans-serif; }
        .sans { font-family: 'IBM Plex Sans', sans-serif; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .serif { font-family: 'Source Serif Pro', Georgia, serif; }
        textarea:focus { outline: none; border-color: #1B3A57 !important; box-shadow: 0 0 0 3px rgba(27,58,87,0.08); }
        .btn-primary:hover:not(:disabled) { background: #0F2438 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(27,58,87,0.25); }
        .btn-primary:disabled { background: #94A3B8 !important; cursor: not-allowed; }
        .btn-example:hover { background: #E8EEF3 !important; border-color: #1B3A57 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @media (max-width: 900px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .trust-strip { grid-template-columns: 1fr !important; }
          .trust-item { border-right: none !important; padding: 12px 0 !important; border-bottom: 1px solid #F1F5F9; }
          .trust-item:last-child { border-bottom: none; }
          h1 { font-size: 32px !important; }
        }
      `}</style>

      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: '#1B3A57', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={22} color="#FFFFFF" strokeWidth={2.2} />
            </div>
            <div>
              <div className="serif" style={{ fontSize: '20px', fontWeight: 700, color: '#0F2438', letterSpacing: '-0.01em' }}>JobGuard</div>
              <div className="sans" style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>Fraud Detection System</div>
            </div>
          </div>
        </div>
      </header>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 32px 32px' }}>
        <div style={{ maxWidth: '720px' }}>
          <div className="sans" style={{ display: 'inline-block', background: '#E8EEF3', color: '#1B3A57', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '20px' }}>
            POWERED BY MACHINE LEARNING
          </div>
          <h1 className="serif" style={{ fontSize: '44px', fontWeight: 700, color: '#0F2438', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '20px' }}>
            Verify job postings before you apply.
          </h1>
          <p className="sans" style={{ fontSize: '17px', color: '#475569', lineHeight: 1.6, fontWeight: 400 }}>
            Our machine learning model analyzes job descriptions to detect fraudulent postings — trained on thousands of real and fake listings to help you avoid scams.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px 64px' }}>
        <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px' }}>

          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={18} color="#1B3A57" />
                <h2 className="sans" style={{ fontSize: '16px', fontWeight: 600, color: '#0F2438' }}>Job Posting Analysis</h2>
              </div>
              <span className="mono" style={{ fontSize: '12px', color: '#94A3B8' }}>{jobText.length} chars</span>
            </div>

            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Paste the full job posting here — including title, company description, requirements, and benefits. Minimum 50 characters."
              style={{
                width: '100%',
                minHeight: '280px',
                padding: '16px',
                fontSize: '14px',
                fontFamily: "'IBM Plex Sans', sans-serif",
                lineHeight: 1.6,
                color: '#1E293B',
                background: '#FAFBFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '6px',
                resize: 'vertical',
                transition: 'all 0.15s ease'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="btn-example sans" onClick={() => handleLoadExample('real')}
                  style={{ padding: '8px 14px', fontSize: '13px', color: '#1B3A57', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '5px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' }}>
                  Try Real Example
                </button>
                <button className="btn-example sans" onClick={() => handleLoadExample('fake')}
                  style={{ padding: '8px 14px', fontSize: '13px', color: '#1B3A57', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '5px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' }}>
                  Try Fake Example
                </button>
              </div>
              <button className="btn-primary sans" onClick={handleAnalyze} disabled={loading || jobText.length < 50}
                style={{ padding: '12px 28px', fontSize: '14px', fontWeight: 600, color: '#FFFFFF', background: '#1B3A57', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.01em' }}>
                {loading ? (<><Loader2 size={16} className="spin" />Analyzing...</>) : 'Analyze Posting'}
              </button>
            </div>
          </div>

          <div>
            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div className="sans" style={{ fontSize: '13px', fontWeight: 600, color: '#991B1B', marginBottom: '4px' }}>Connection Error</div>
                    <div className="sans" style={{ fontSize: '13px', color: '#7F1D1D', lineHeight: 1.5 }}>{error}</div>
                  </div>
                </div>
              </div>
            )}

            {!result && !loading && !error && (
              <div style={{ background: '#FFFFFF', border: '1px dashed #CBD5E1', borderRadius: '8px', padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', background: '#F1F5F9', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Info size={24} color="#94A3B8" />
                </div>
                <h3 className="sans" style={{ fontSize: '15px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Awaiting Analysis</h3>
                <p className="sans" style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>Paste a job posting and click Analyze to receive a fraud risk assessment.</p>
              </div>
            )}

            {loading && (
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '48px 32px', textAlign: 'center' }}>
                <Loader2 size={32} className="spin" color="#1B3A57" style={{ marginBottom: '14px' }} />
                <p className="sans" style={{ fontSize: '14px', color: '#475569' }}>Running model...</p>
              </div>
            )}

            {result && !loading && risk && (
              <div className="fade-in" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                {/* RISK HEADER */}
                <div style={{ padding: '24px', background: risk.bgColor, borderBottom: `1px solid ${risk.borderColor}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <RiskIcon size={22} color={risk.iconColor} strokeWidth={2.2} />
                    <span className="sans" style={{ fontSize: '11px', fontWeight: 600, color: risk.accentColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {result.risk_label}
                    </span>
                  </div>
                  <div className="serif" style={{ fontSize: '28px', fontWeight: 700, color: risk.textColor, lineHeight: 1.2, marginBottom: '8px' }}>
                    {(result.fake_probability * 100).toFixed(1)}% Fraud Probability
                  </div>
                  <p className="sans" style={{ fontSize: '13px', color: risk.textColor, lineHeight: 1.5, opacity: 0.85 }}>
                    {result.risk_message}
                  </p>
                </div>

                {/* PROBABILITY BARS */}
                <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9' }}>
                  <h4 className="sans" style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>Probability Distribution</h4>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="sans" style={{ fontSize: '13px', color: '#1E293B', fontWeight: 500 }}>Real</span>
                      <span className="mono" style={{ fontSize: '13px', color: '#1E293B' }}>{(result.real_probability * 100).toFixed(1)}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${result.real_probability * 100}%`, background: '#16A34A', borderRadius: '3px', transition: 'width 0.6s ease-out' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="sans" style={{ fontSize: '13px', color: '#1E293B', fontWeight: 500 }}>Fake</span>
                      <span className="mono" style={{ fontSize: '13px', color: '#1E293B' }}>{(result.fake_probability * 100).toFixed(1)}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${result.fake_probability * 100}%`, background: risk.barColor, borderRadius: '3px', transition: 'width 0.6s ease-out' }} />
                    </div>
                  </div>
                </div>

                {/* FLAGS */}
                <div style={{ padding: '24px' }}>
                  <h4 className="sans" style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Key Signals Detected</h4>
                  <ul style={{ listStyle: 'none' }}>
                    {result.flags.map((flag, i) => (
                      <li key={i} className="sans" style={{ fontSize: '13px', color: '#334155', padding: '8px 0', borderBottom: i < result.flags.length - 1 ? '1px solid #F1F5F9' : 'none', display: 'flex', alignItems: 'flex-start', gap: '10px', lineHeight: 1.5 }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: risk.accentColor, marginTop: '8px', flexShrink: 0 }} />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="trust-strip" style={{ marginTop: '48px', padding: '32px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { icon: TrendingUp, label: 'Algorithm', value: 'LinearSVC' },
            { icon: Shield, label: 'Features', value: '5,000 terms' },
            { icon: CheckCircle2, label: 'Method', value: 'TF-IDF + ML' }
          ].map((stat, i) => (
            <div key={i} className="trust-item" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: i < 2 ? '0 24px 0 0' : '0', borderRight: i < 2 ? '1px solid #F1F5F9' : 'none' }}>
              <div style={{ width: '40px', height: '40px', background: '#E8EEF3', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={18} color="#1B3A57" />
              </div>
              <div>
                <div className="sans" style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: '2px' }}>{stat.label}</div>
                <div className="serif" style={{ fontSize: '22px', fontWeight: 700, color: '#0F2438' }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ background: '#FFFFFF', borderTop: '1px solid #E2E8F0', padding: '32px 0', marginTop: '32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p className="sans" style={{ fontSize: '13px', color: '#64748B' }}>
            JobGuard is a screening aid, not a final verdict. Always verify postings through additional channels.
          </p>
          <p className="mono" style={{ fontSize: '12px', color: '#94A3B8' }}>v2.0 · Machine Learning Project 2026</p>
        </div>
      </footer>
    </div>
  );
}