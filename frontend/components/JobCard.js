export default function JobCard({ job }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isExpiringSoon = () => {
    const daysLeft = Math.ceil((new Date(job.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3 && daysLeft > 0;
  };

  const daysLeft = () => {
    const days = Math.ceil((new Date(job.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className={`job-card ${job.type === 'walkin' ? 'walkin' : ''}`}>
      <div className="card-header">
        <span className={`badge ${job.type}`}>
          {job.type === 'walkin' ? '🏃 Walk-in' : '💼 Job Opening'}
        </span>
        {isExpiringSoon() && (
          <span className="expiring">⏰ {daysLeft()} days left!</span>
        )}
      </div>
      
      <h3 className="job-title">{job.jobTitle}</h3>
      <p className="company">🏢 {job.company}</p>
      <p className="location">📍 {job.city}</p>
      
      {job.type === 'walkin' ? (
        <div className="walkin-details">
          <p>📅 Event Date: {formatDate(job.eventDate)}</p>
          <p>⏰ Timing: {job.timing}</p>
          <p>📌 Venue: {job.venue}</p>
          <p>🕐 Last Date: {formatDate(job.lastDate)}</p>
        </div>
      ) : (
        <div className="job-details">
          <p>💼 Experience: {job.experience}</p>
          <p>🕐 Apply Before: {formatDate(job.expiryDate)}</p>
        </div>
      )}
      
      <div className="skills">
        {job.skills.map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
      </div>
      
      <div className="batch-eligible">
        <strong>🎓 Eligible Batches:</strong>
        {job.batchEligible.map((batch, index) => (
          <span key={index} className="batch-tag">{batch}</span>
        ))}
      </div>
      
      {job.applyLink && (
        <a 
          href={job.applyLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="apply-btn"
        >
          {job.type === 'walkin' ? 'Register Now' : 'Apply Now'} →
        </a>
      )}
      
      <style jsx>{`
        .job-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: transform 0.3s, box-shadow 0.3s;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }
        .job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }
        .job-card.walkin {
          border-left: 4px solid #ff5722;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .badge {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        .badge.job {
          background: #e3f2fd;
          color: #1976d2;
        }
        .badge.walkin {
          background: #fff3e0;
          color: #f57c00;
        }
        .expiring {
          background: #ffebee;
          color: #d32f2f;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          animation: blink 1s infinite;
          font-weight: bold;
        }
        @keyframes blink {
          50% { opacity: 0.5; }
        }
        .job-title {
          margin: 10px 0;
          color: #333;
          font-size: 20px;
        }
        .company {
          color: #666;
          margin: 5px 0;
          font-weight: 500;
        }
        .location {
          color: #888;
          margin: 5px 0;
          font-size: 14px;
        }
        .walkin-details, .job-details {
          background: #f9f9f9;
          padding: 10px;
          border-radius: 8px;
          margin: 10px 0;
        }
        .walkin-details p, .job-details p {
          margin: 5px 0;
          font-size: 14px;
        }
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin: 10px 0;
        }
        .skill-tag {
          background: #f0f0f0;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
        .batch-eligible {
          margin: 10px 0;
        }
        .batch-eligible strong {
          font-size: 14px;
        }
        .batch-tag {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 12px;
          margin-left: 5px;
        }
        .apply-btn {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          text-decoration: none;
          margin-top: 15px;
          font-weight: bold;
          transition: transform 0.3s;
        }
        .apply-btn:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
