import React, { useState } from 'react';
import { MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import InformationalPageLayout from './InformationalPageLayout';

const Feedback = ({ setActiveTab }) => {
  const [submitted, setSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState('general');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate network request. (No actual backend exists for this yet).
    setTimeout(() => {
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <InformationalPageLayout
        title="Thank You!"
        subtitle="Your feedback helps us train better AI models and improve the CurrencyAI experience."
        icon={CheckCircle}
        breadcrumbCurrent="Feedback"
        setActiveTab={setActiveTab}
      >
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <button onClick={() => setActiveTab('home')} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600 }}>
            Return to Scanner
          </button>
        </div>
      </InformationalPageLayout>
    );
  }

  return (
    <InformationalPageLayout
      title="Feedback & Reporting"
      subtitle="Help us improve CurrencyAI. Report incorrect recognitions, request features, or report bugs."
      icon={MessageSquare}
      breadcrumbCurrent="Feedback"
      setActiveTab={setActiveTab}
    >
      <div className="info-section" style={{ display: 'flex', justifyContent: 'center' }}>
        
        <form className="feedback-form" onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', background: feedbackType === 'general' ? 'rgba(99, 102, 241, 0.1)' : 'var(--surface)', borderColor: feedbackType === 'general' ? 'var(--primary)' : 'var(--border)' }}>
              <input type="radio" name="type" checked={feedbackType === 'general'} onChange={() => setFeedbackType('general')} style={{ width: 'auto' }} />
              General Feedback
            </label>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', background: feedbackType === 'incorrect' ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface)', borderColor: feedbackType === 'incorrect' ? 'var(--danger)' : 'var(--border)' }}>
              <input type="radio" name="type" checked={feedbackType === 'incorrect'} onChange={() => setFeedbackType('incorrect')} style={{ width: 'auto' }} />
              <AlertCircle size={16} color="var(--danger)" /> Report Error
            </label>
          </div>

          {feedbackType === 'general' ? (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--muted)' }}>Feedback Type</label>
                <select required>
                  <option value="">Select an option...</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feature">Feature Request</option>
                  <option value="ui">UI/UX Suggestion</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--muted)' }}>Name (Optional)</label>
                  <input type="text" placeholder="Jane Doe" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--muted)' }}>Email (Optional)</label>
                  <input type="email" placeholder="jane@example.com" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--muted)' }}>Message</label>
                <textarea rows={5} placeholder="Tell us what's on your mind..." required></textarea>
              </div>
            </>
          ) : (
            <>
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', fontSize: '13px', color: 'var(--text)' }}>
                Reporting false positives helps us retrain the AI. The image you captured will NOT be uploaded automatically for privacy reasons unless you explicitly attach it.
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--muted)' }}>Detected Currency (What AI said)</label>
                  <input type="text" placeholder="e.g. USD 100" required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--muted)' }}>Expected Currency (What it actually is)</label>
                  <input type="text" placeholder="e.g. CAD 100" required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--muted)' }}>Additional Details</label>
                <textarea rows={3} placeholder="Was the note folded? Was lighting poor?"></textarea>
              </div>
            </>
          )}

          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </InformationalPageLayout>
  );
};

export default Feedback;
