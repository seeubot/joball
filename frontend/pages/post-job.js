import { useState } from 'react';
import { useRouter } from 'next/router';
import Alert from '../components/Alert';

export default function PostJob() {
  const router = useRouter();
  const [jobType, setJobType] = useState('job');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'job',
    jobTitle: '',
    company: '',
    city: 'Hyderabad',
    skills: '',
    applyLink: '',
    expiryDate: '',
    batchEligible: [],
    experience: 'Fresher',
    eventDate: '',
    lastDate: '',
    venue: '',
    timing: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      const finalData = {
        ...formData,
        skills: skillsArray,
        batchEligible: formData.batchEligible
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Job posted successfully!');
        router.push('/');
      } else {
        alert(`Error: ${result.error || 'Failed to post job'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBatchChange = (batch) => {
    setFormData(prev => {
      const batches = prev.batchEligible.includes(batch)
        ? prev.batchEligible.filter(b => b !== batch)
        : [...prev.batchEligible, batch];
      return { ...prev, batchEligible: batches };
    });
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Post a Job Opening</h1>
        <p>Share job opportunities with freshers in Hyderabad and Bengaluru.</p>
      </div>

      <Alert />

      <form onSubmit={handleSubmit} className="post-form">
        {/* Job Type */}
        <div className="form-section">
          <h2>Job Type</h2>
          <div className="job-type-selector">
            <button
              type="button"
              className={`type-option ${jobType === 'job' ? 'selected' : ''}`}
              onClick={() => {
                setJobType('job');
                setFormData({ ...formData, type: 'job' });
              }}
            >
              <span className="type-title">Job Opening</span>
              <span className="type-desc">Regular full-time roles</span>
            </button>
            <button
              type="button"
              className={`type-option ${jobType === 'walkin' ? 'selected' : ''}`}
              onClick={() => {
                setJobType('walkin');
                setFormData({ ...formData, type: 'walkin' });
              }}
            >
              <span className="type-title">Walk-in Drive</span>
              <span className="type-desc">On-site interview events</span>
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-grid">
            <div className="form-group full">
              <label>{jobType === 'walkin' ? 'Job Role' : 'Job Title'} *</label>
              <input
                type="text"
                required
                placeholder="e.g., Software Developer"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., TechCorp"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>City *</label>
              <select
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bengaluru">Bengaluru</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="form-section">
          <h2>Job Details</h2>
          <div className="form-grid">
            <div className="form-group full">
              <label>Skills Required * (comma separated)</label>
              <input
                type="text"
                required
                placeholder="e.g., JavaScript, React, Node.js"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
            </div>
            <div className="form-group full">
              <label>Eligible Batches *</label>
              <div className="batch-checkboxes">
                {['2024', '2025', '2026'].map(batch => (
                  <label key={batch} className="batch-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.batchEligible.includes(batch)}
                      onChange={() => handleBatchChange(batch)}
                    />
                    <span>{batch} Batch</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Conditional Fields */}
        {jobType === 'job' ? (
          <div className="form-section">
            <h2>Application Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Experience *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Fresher"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Expiry Date *</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
              <div className="form-group full">
                <label>Apply Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://company.com/careers"
                  value={formData.applyLink}
                  onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="form-section">
            <h2>Walk-in Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Event Date *</label>
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Event Timing *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                  value={formData.timing}
                  onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                />
              </div>
              <div className="form-group full">
                <label>Venue Address *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Full venue address"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Last Date to Register *</label>
                <input
                  type="date"
                  required
                  value={formData.lastDate}
                  onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Registration Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://forms.google.com/..."
                  value={formData.applyLink}
                  onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Job Opening'}
        </button>
      </form>

      <style jsx>{`
        .page-header {
          text-align: center;
          padding: 40px 20px 20px;
        }
        .page-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }
        .page-header p {
          color: #6b7280;
          font-size: 16px;
        }

        .post-form {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 32px;
          max-width: 800px;
          margin: 0 auto;
        }

        .form-section {
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid #e5e7eb;
        }
        .form-section:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .form-section h2 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }

        .job-type-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .type-option {
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }
        .type-option:hover {
          border-color: #d1d5db;
        }
        .type-option.selected {
          border-color: #4f6ef7;
          background: #eef2ff;
        }
        .type-title {
          display: block;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }
        .type-desc {
          font-size: 13px;
          color: #6b7280;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .form-group.full {
          grid-column: 1 / -1;
        }
        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          color: #374151;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #4f6ef7;
          box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.1);
        }

        .batch-checkboxes {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .batch-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .batch-checkbox input {
          width: 18px;
          height: 18px;
          accent-color: #4f6ef7;
        }
        .batch-checkbox span {
          font-size: 14px;
          color: #374151;
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background: #4f6ef7;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          background: #3b55e6;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .post-form {
            padding: 20px;
          }
          .job-type-selector,
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
