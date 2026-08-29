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
  const [stats, setStats] = useState({
    total: 0,
    walkins: 0,
    regular: 0
  });

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
        setStats({
          total: result.count,
          walkins: result.data.filter(job => job.type === 'walkin').length,
          regular: result.data.filter(job => job.type === 'job').length
        });
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Alert />
      
      <h1 className="title">🎓 Freshers Job Portal</h1>
      <p className="subtitle">Exclusively for 2024 & 2025 Batches in Hyderabad & Bengaluru</p>
      
      {/* Stats */}
      <div className="stats">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Active Jobs</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.walkins}</span>
          <span className="stat-label">Walk-ins</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.regular}</span>
          <span className="stat-label">Regular Jobs</span>
        </div>
      </div>
      
      {/* Filters */}
      <div className="filters">
        <input 
          type="text"
          placeholder="🔍 Search jobs, companies, skills..."
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
          <option value="job">💼 Job Openings</option>
          <option value="walkin">🏃 Walk-in Drives</option>
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
      
      {/* Job Listings */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
          {jobs.length === 0 && (
            <div className="no-jobs">
              <span className="no-jobs-icon">🔍</span>
              <p>No active jobs found matching your criteria.</p>
              <p>Check back later or post a job opening!</p>
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
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
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .stat-number {
          display: block;
          font-size: 32px;
          font-weight: bold;
          color: #667eea;
        }
        .stat-label {
          color: #666;
          font-size: 14px;
        }
        .filters {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .filters select, .filters input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          flex: 1;
          min-width: 150px;
        }
        .search-input {
          flex: 2 !important;
        }
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }
        .loading {
          text-align: center;
          padding: 50px;
          color: #666;
        }
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .no-jobs {
          text-align: center;
          padding: 50px;
          color: #666;
          grid-column: 1 / -1;
        }
        .no-jobs-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
