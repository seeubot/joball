import { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import Alert from '../components/Alert';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    skill: '',
    batch: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      ).toString();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs?${queryString}`);
      const result = await response.json();

      if (result.success) {
        setJobs(result.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Find Your First Job</h1>
        <p>Discover job openings and walk-in drives exclusively for freshers in Hyderabad and Bengaluru.</p>
      </section>

      <Alert />

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search jobs, companies, skills..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          className="search-input"
        />

        <select
          value={filters.city}
          onChange={(e) => setFilters({...filters, city: e.target.value})}
        >
          <option value="">All Cities</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Bengaluru">Bengaluru</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="">All Types</option>
          <option value="job">Job Openings</option>
          <option value="walkin">Walk-in Drives</option>
        </select>

        <select
          value={filters.batch}
          onChange={(e) => setFilters({...filters, batch: e.target.value})}
        >
          <option value="">All Batches</option>
          <option value="2024">2024 Batch</option>
          <option value="2025">2025 Batch</option>
          <option value="2026">2026 Batch</option>
        </select>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
          {jobs.length === 0 && (
            <div className="no-jobs">
              <h3>No jobs found</h3>
              <p>Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .hero {
          text-align: center;
          padding: 48px 20px;
        }
        .hero h1 {
          font-size: 36px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
        }
        .hero p {
          font-size: 18px;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
        }

        .filters {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .filters select,
        .filters input {
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          color: #374151;
          outline: none;
          transition: border-color 0.2s;
        }
        .filters select:focus,
        .filters input:focus {
          border-color: #4f6ef7;
        }
        .search-input {
          flex: 2;
          min-width: 200px;
        }
        .filters select {
          flex: 1;
          min-width: 150px;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .loading {
          display: flex;
          justify-content: center;
          padding: 48px;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #4f6ef7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .no-jobs {
          grid-column: 1 / -1;
          text-align: center;
          padding: 48px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }
        .no-jobs h3 {
          font-size: 18px;
          color: #111827;
          margin-bottom: 4px;
        }
        .no-jobs p {
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .hero h1 { font-size: 28px; }
          .hero p { font-size: 16px; }
          .jobs-grid {
            grid-template-columns: 1fr;
          }
          .filters {
            flex-direction: column;
          }
          .search-input,
          .filters select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
