import { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import Alert from '../components/Alert';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    skill: '',
    batch: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  useEffect(() => {
    const count = Object.values(filters).filter(v => v !== '').length;
    setActiveFilterCount(count);
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

  const clearFilters = () => {
    setFilters({
      city: '',
      type: '',
      skill: '',
      batch: '',
      search: ''
    });
    setShowFilters(false);
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Find Your First Job</h1>
        <p>Discover job openings and walk-in drives exclusively for freshers in Hyderabad and Bengaluru.</p>
      </section>

      <Alert />

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            placeholder="Search jobs, companies, skills..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>

        <button 
          className={`filter-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="filter-count">{activeFilterCount}</span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button className="clear-btn" onClick={clearFilters}>
            Clear All
          </button>
        )}
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label>City</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
              >
                <option value="">All Cities</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bengaluru">Bengaluru</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Job Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">All Types</option>
                <option value="job">Job Openings</option>
                <option value="walkin">Walk-in Drives</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Batch</label>
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

            <div className="filter-group">
              <label>Skill</label>
              <input
                type="text"
                placeholder="e.g., JavaScript, React"
                value={filters.skill}
                onChange={(e) => setFilters({...filters, skill: e.target.value})}
              />
            </div>
          </div>

          <div className="filters-actions">
            <button className="apply-filters-btn" onClick={() => setShowFilters(false)}>
              Apply Filters
            </button>
            <button className="reset-filters-btn" onClick={clearFilters}>
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && !showFilters && (
        <div className="active-filters">
          {filters.search && (
            <span className="active-filter-chip">
              Search: {filters.search}
            </span>
          )}
          {filters.city && (
            <span className="active-filter-chip">
              {filters.city}
            </span>
          )}
          {filters.type && (
            <span className="active-filter-chip">
              {filters.type === 'job' ? 'Job Opening' : 'Walk-in Drive'}
            </span>
          )}
          {filters.batch && (
            <span className="active-filter-chip">
              {filters.batch} Batch
            </span>
          )}
          {filters.skill && (
            <span className="active-filter-chip">
              Skill: {filters.skill}
            </span>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="results-info">
        <span>{jobs.length} jobs found</span>
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

        .search-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          align-items: center;
        }

        .search-input-wrapper {
          flex: 1;
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }
        .search-input-wrapper input {
          width: 100%;
          padding: 10px 14px 10px 40px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .search-input-wrapper input:focus {
          border-color: #4f6ef7;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .filter-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }
        .filter-btn.active {
          background: #4f6ef7;
          color: white;
          border-color: #4f6ef7;
        }

        .filter-count {
          background: #4f6ef7;
          color: white;
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
        }
        .filter-btn.active .filter-count {
          background: white;
          color: #4f6ef7;
        }

        .clear-btn {
          padding: 10px 16px;
          background: none;
          border: none;
          color: #ef4444;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
        }
        .clear-btn:hover {
          text-decoration: underline;
        }

        .filters-panel {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .filter-group label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }
        .filter-group select,
        .filter-group input {
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .filter-group select:focus,
        .filter-group input:focus {
          border-color: #4f6ef7;
        }

        .filters-actions {
          display: flex;
          gap: 12px;
        }
        .apply-filters-btn {
          padding: 10px 20px;
          background: #4f6ef7;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .apply-filters-btn:hover {
          background: #3b55e6;
        }
        .reset-filters-btn {
          padding: 10px 20px;
          background: white;
          color: #6b7280;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .reset-filters-btn:hover {
          background: #f9fafb;
        }

        .active-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }
        .active-filter-chip {
          background: #eef2ff;
          color: #4f6ef7;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 500;
        }

        .results-info {
          margin-bottom: 16px;
          color: #6b7280;
          font-size: 14px;
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
          .search-bar {
            flex-wrap: wrap;
          }
          .search-input-wrapper {
            min-width: 100%;
          }
          .filters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
