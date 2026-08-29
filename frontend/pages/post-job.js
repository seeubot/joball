import { useState } from 'react';
import { useRouter } from 'next/router';
import Alert from '../components/Alert';

export default function PostJob() {
  const router = useRouter();
  const [jobType, setJobType] = useState('job');
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
  const [submitting, setSubmitting] = useState(false);

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        alert('✅ Job posted successfully!');
        router.push('/');
      } else {
        alert(`❌ Error: ${result.error || 'Failed to post job'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Network error. Please try again.');
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
      <Alert />
      <h1 className="title">📝 Post a Job Opening</h1>
      <p className="subtitle">Share job opportunities with freshers</p>
      
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label>Job Type *</label>
            <select 
              value={jobType}
              onChange={(e) => {
                setJobType(e.target.value);
                setFormData({...formData, type: e.target.value});
              }}
              required
              className="form-input"
            >
              <option value="job">💼 Job Opening</option>
              <option value="walkin">🏃 Walk-in Drive</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>{jobType === 'walkin' ? 'Job Role' : 'Job Title'} *</label>
            <input 
              type="text"
              placeholder={jobType === 'walkin' ? 'e.g., Software Developer' : 'e.g., Software Developer, Data Analyst'}
              required
              value={formData.jobTitle}
              onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Company Name *</label>
            <input 
              type="text"
              placeholder="e.g., Google, TCS, Infosys"
              required
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>City *</label>
            <select 
              required
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="form-input"
            >
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Job Details</h2>
          
          <div className="form-group">
            <label>Skills Required * (comma separated)</label>
            <input 
              type="text"
              placeholder="e.g., JavaScript, React, Node.js, Python"
              required
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Eligible Batches *</label>
            <div className="checkbox-group">
              {['2024', '2025', '2026'].map(batch => (
                <label key={batch} className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={formData.batchEligible.includes(batch)}
                    onChange={() => handleBatchChange(batch)}
                  />
                  {batch} Batch
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {jobType === 'job' ? (
          <div className="form-section">
            <h2>Application Details</h2>
            
            <div className="form-group">
              <label>Experience Required *</label>
              <input 
                type="text"
                placeholder="e.g., 0-1 years, Fresher"
                required
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Apply Link *</label>
              <input 
                type="url"
                placeholder="https://company.com/careers"
                required
                value={formData.applyLink}
                onChange={(e) => setFormData({...formData, applyLink: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Expiry Date *</label>
              <input 
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                className="form-input"
              />
            </div>
          </div>
        ) : (
          <div className="form-section">
            <h2>Walk-in Details</h2>
            
            <div className="form-group">
              <label>Event Date *</label>
              <input 
                type="date"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Event Timing *</label>
              <input 
                type="text"
                placeholder="e.g., 9:00 AM - 5:00 PM"
                required
                value={formData.timing}
                onChange={(e) => setFormData({...formData, timing: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Venue Address *</label>
              <textarea 
                placeholder="Full venue address"
                required
                rows="3"
                value={formData.venue}
                onChange={(e) => setFormData({...formData, venue: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Last Date to Register *</label>
              <input 
                type="date"
                required
                value={formData.lastDate}
                onChange={(e) => setFormData({...formData, lastDate: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Registration Link (Optional)</label>
              <input 
                type="url"
                placeholder="https://forms.google.com/..."
                value={formData.applyLink}
                onChange={(e) => setFormData({...formData, applyLink: e.target.value})}
                className="form-input"
              />
            </div>
            
            {/* Set expiry date to event date for walk-ins */}
            <input 
              type="hidden" 
              value={formData.eventDate}
              onChange={() => setFormData({...formData, expiryDate: formData.eventDate})}
            />
          </div>
        )}
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={submitting}
        >
          {submitting ? '⏳ Posting...' : '🚀 Post Job Opening'}
        </button>
      </form>
      
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .title {
          text-align: center;
          margin: 20px 0;
          font-size: 32px;
        }
        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
        }
        .post-form {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .form-section {
          margin-bottom: 30px;
          padding-bottom: 30px;
          border-bottom: 1px solid #eee;
        }
        .form-section h2 {
          margin-bottom: 20px;
          color: #333;
          font-size: 20px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }
        .form-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }
        .checkbox-group {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .checkbox-label input {
          width: auto;
        }
        .submit-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 30px;
          border: none;
          border-radius: 25px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
          transition: transform 0.3s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: scale(1.02);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
