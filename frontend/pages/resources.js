import { useState } from 'react';

export default function Resources() {
  const [activeTab, setActiveTab] = useState('resumes');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const resumeTemplates = [
    {
      id: 1,
      title: 'Fresher Resume Template',
      description: 'Simple and clean template for fresh graduates with no work experience.',
      format: 'PDF',
      size: '245 KB',
      downloads: 1240
    },
    {
      id: 2,
      title: 'Technical Resume Template',
      description: 'Best for IT and software engineering freshers with skills section.',
      format: 'DOCX',
      size: '180 KB',
      downloads: 980
    },
    {
      id: 3,
      title: 'Walk-in Interview Resume',
      description: 'Quick one-page resume format ideal for walk-in drives.',
      format: 'PDF',
      size: '150 KB',
      downloads: 2150
    },
    {
      id: 4,
      title: 'ATS-Friendly Resume',
      description: 'Optimized for Applicant Tracking Systems used by MNCs.',
      format: 'DOCX',
      size: '210 KB',
      downloads: 1675
    }
  ];

  const interviewResources = [
    {
      id: 1,
      title: 'Common Interview Questions',
      description: 'Top 50 questions asked in fresher interviews with sample answers.',
      format: 'PDF',
      size: '320 KB',
      downloads: 1890
    },
    {
      id: 2,
      title: 'Technical Interview Guide',
      description: 'Covers data structures, algorithms, and coding interview prep.',
      format: 'PDF',
      size: '450 KB',
      downloads: 1430
    },
    {
      id: 3,
      title: 'HR Interview Tips',
      description: 'How to handle HR round questions about salary, relocation, and goals.',
      format: 'DOCX',
      size: '160 KB',
      downloads: 1120
    },
    {
      id: 4,
      title: 'Group Discussion Guide',
      description: 'Preparation tips and common GD topics for freshers.',
      format: 'PDF',
      size: '280 KB',
      downloads: 890
    },
    {
      id: 5,
      title: 'Aptitude Test Preparation',
      description: 'Practice questions for quantitative, logical, and verbal aptitude.',
      format: 'PDF',
      size: '520 KB',
      downloads: 2340
    },
    {
      id: 6,
      title: 'Communication Skills Guide',
      description: 'Improve English speaking and professional communication.',
      format: 'DOCX',
      size: '195 KB',
      downloads: 760
    }
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Only PDF and DOCX files are allowed.');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File size must be less than 2MB.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    // Simulate upload (replace with actual API call)
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      e.target.value = '';
    }, 2000);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Resources</h1>
        <p>Free resume templates and interview preparation materials for freshers</p>
      </div>

      {/* Tab Navigation */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'resumes' ? 'active' : ''}`}
          onClick={() => setActiveTab('resumes')}
        >
          Resume Templates
        </button>
        <button
          className={`tab ${activeTab === 'interview' ? 'active' : ''}`}
          onClick={() => setActiveTab('interview')}
        >
          Interview Preparation
        </button>
        <button
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Share Resource
        </button>
      </div>

      {/* Resume Templates */}
      {activeTab === 'resumes' && (
        <div className="resources-grid">
          {resumeTemplates.map((resource) => (
            <div key={resource.id} className="resource-card">
              <div className="resource-icon pdf">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
                </svg>
              </div>
              <div className="resource-content">
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <div className="resource-meta">
                  <span className="meta-badge">{resource.format}</span>
                  <span className="meta-badge">{resource.size}</span>
                  <span className="meta-badge">{resource.downloads} downloads</span>
                </div>
              </div>
              <button className="download-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Download
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Interview Resources */}
      {activeTab === 'interview' && (
        <div className="resources-grid">
          {interviewResources.map((resource) => (
            <div key={resource.id} className="resource-card">
              <div className="resource-icon doc">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
              </div>
              <div className="resource-content">
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <div className="resource-meta">
                  <span className="meta-badge">{resource.format}</span>
                  <span className="meta-badge">{resource.size}</span>
                  <span className="meta-badge">{resource.downloads} downloads</span>
                </div>
              </div>
              <button className="download-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Download
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Resource */}
      {activeTab === 'upload' && (
        <div className="upload-section">
          <div className="upload-card">
            <h2>Share a Resource</h2>
            <p>Upload resume templates or interview preparation materials to help fellow freshers.</p>
            
            <div className="upload-area">
              <label className="upload-label" htmlFor="file-upload">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                </svg>
                <span className="upload-text">Choose a file to upload</span>
                <span className="upload-hint">PDF or DOCX, max 2MB</span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>

            {uploading && (
              <div className="upload-status">
                <div className="spinner"></div>
                <span>Uploading...</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="upload-success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Resource uploaded successfully! It will be available after review.</span>
              </div>
            )}

            {uploadError && (
              <div className="upload-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <span>{uploadError}</span>
              </div>
            )}

            <div className="upload-requirements">
              <h3>Requirements:</h3>
              <ul>
                <li>Supported formats: PDF, DOCX</li>
                <li>Maximum file size: 2MB</li>
                <li>Content should be relevant to freshers</li>
                <li>No copyrighted material</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page-header {
          text-align: center;
          padding: 48px 20px 24px;
        }
        .page-header h1 {
          font-size: 36px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }
        .page-header p {
          color: #6b7280;
          font-size: 18px;
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 2px solid #e5e7eb;
          overflow-x: auto;
        }
        .tab {
          padding: 12px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          color: #6b7280;
          white-space: nowrap;
          position: relative;
          transition: color 0.2s;
        }
        .tab:hover {
          color: #111827;
        }
        .tab.active {
          color: #4f6ef7;
        }
        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: #4f6ef7;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .resource-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: all 0.2s;
        }
        .resource-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border-color: #4f6ef7;
        }

        .resource-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .resource-icon.pdf {
          background: #fef2f2;
          color: #ef4444;
        }
        .resource-icon.doc {
          background: #eef2ff;
          color: #4f6ef7;
        }

        .resource-content {
          flex: 1;
        }
        .resource-content h3 {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }
        .resource-content p {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 12px;
          line-height: 1.5;
        }

        .resource-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }
        .meta-badge {
          background: #f3f4f6;
          color: #374151;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .download-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #4f6ef7;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .download-btn:hover {
          background: #3b55e6;
        }

        .upload-section {
          max-width: 600px;
          margin: 0 auto;
        }
        .upload-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 32px;
        }
        .upload-card h2 {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }
        .upload-card > p {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 24px;
        }

        .upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          transition: all 0.2s;
          cursor: pointer;
        }
        .upload-area:hover {
          border-color: #4f6ef7;
          background: #f9fafb;
        }
        .upload-label {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #9ca3af;
        }
        .upload-text {
          font-size: 16px;
          font-weight: 500;
          color: #374151;
        }
        .upload-hint {
          font-size: 13px;
          color: #9ca3af;
        }

        .upload-status {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
          color: #6b7280;
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-top-color: #4f6ef7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .upload-success {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 12px;
          background: #ecfdf5;
          color: #047857;
          border-radius: 8px;
          font-size: 14px;
        }

        .upload-error {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 12px;
          background: #fef2f2;
          color: #dc2626;
          border-radius: 8px;
          font-size: 14px;
        }

        .upload-requirements {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }
        .upload-requirements h3 {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }
        .upload-requirements ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .upload-requirements li {
          font-size: 13px;
          color: #6b7280;
          padding: 4px 0;
          padding-left: 20px;
          position: relative;
        }
        .upload-requirements li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          background: #4f6ef7;
          border-radius: 50%;
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 28px;
          }
          .resources-grid {
            grid-template-columns: 1fr;
          }
          .upload-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
