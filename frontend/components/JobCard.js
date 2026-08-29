export default function JobCard({ job, onApply }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysLeft = () => {
    const days = Math.ceil((new Date(job.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const isExpiringSoon = () => {
    const daysLeft = getDaysLeft();
    return daysLeft <= 3 && daysLeft > 0;
  };

  return (
    <div className={`job-card ${job.type === 'walkin' ? 'walkin' : ''}`}>
      <div className="card-header">
        <span className={`badge ${job.type}`}>
          {job.type === 'walkin' ? 'Walk-in Drive' : 'Job Opening'}
        </span>
        {isExpiringSoon() && (
          <span className="expiring">Expires in {getDaysLeft()} days</span>
        )}
      </div>

      <h3 className="job-title">{job.jobTitle}</h3>
      <p className="company">{job.company}</p>

      <div className="job-meta">
        <span className="meta-item">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {job.city}
        </span>

        {job.type === 'walkin' ? (
          <span className="meta-item">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {formatDate(job.eventDate)}
          </span>
        ) : (
          <>
            <span className="meta-item">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              {job.experience}
            </span>
            <span className="meta-item">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Apply by {formatDate(job.expiryDate)}
            </span>
          </>
        )}
      </div>

      {job.type === 'walkin' && job.venue && (
        <p className="venue">{job.venue}</p>
      )}

      <div className="skills">
        {job.skills.map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
      </div>

      <div className="batch-eligible">
        <span className="batch-label">Eligible Batches:</span>
        {job.batchEligible.map((batch, index) => (
          <span key={index} className="batch-tag">{batch}</span>
        ))}
      </div>

      {job.applyLink && (
        <button
          className="apply-btn"
          onClick={() => onApply && onApply(job)}
        >
          {job.type === 'walkin' ? 'Register for Drive' : 'Apply Now'}
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      <style jsx>{`
        .job-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.2s;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .job-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border-color: #4f6ef7;
        }
        .job-card.walkin {
          border-top: 3px solid #f59e0b;
        }
        .job-card:not(.walkin) {
          border-top: 3px solid #4f6ef7;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          gap: 8px;
          flex-wrap: wrap;
        }

        .badge {
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
        }
        .badge.job {
          background: #eef2ff;
          color: #4f6ef7;
        }
        .badge.walkin {
          background: #fffbeb;
          color: #b45309;
        }

        .expiring {
          background: #fef2f2;
          color: #dc2626;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
        }

        .job-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .company {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 12px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #6b7280;
          font-size: 13px;
        }

        .meta-item svg {
          color: #9ca3af;
        }

        .venue {
          color: #6b7280;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }

        .skill-tag {
          background: #f3f4f6;
          color: #374151;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .batch-eligible {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
          margin-top: auto;
        }

        .batch-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .batch-tag {
          background: #ecfdf5;
          color: #047857;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .apply-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #4f6ef7;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          width: 100%;
        }
        .apply-btn:hover {
          background: #3b55e6;
        }
      `}</style>
    </div>
  );
}
