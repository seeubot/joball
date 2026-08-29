import { useState, useEffect } from 'react';

export default function Resources() {
  const [activeTab, setActiveTab] = useState('resumes');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'resume',
    uploadedBy: ''
  });

  useEffect(() => {
    fetchResources(activeTab);
  }, [activeTab]);

  const fetchResources = async (category) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resources?category=${category}`);
      const result = await response.json();
      if (result.success) {
        setResources(result.data);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Only PDF and DOCX files are allowed.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File size must be less than 2MB.');
      return;
    }

    if (!formData.title) {
      setUploadError('Please enter a title for the resource.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', activeTab === 'resumes' ? 'resume' : 'interview');
    formDataToSend.append('uploadedBy', formData.uploadedBy || 'Anonymous');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resources`, {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUploadSuccess(true);
        setFormData({ title: '', description: '', category: 'resume', uploadedBy: '' });
        e.target.value = '';
        fetchResources(activeTab);
      } else {
        setUploadError(result.error || 'Failed to upload resource.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (resourceId, fileName) => {
    try {
      // Use Vercel proxy URL
      const downloadUrl = `/api/download?id=${resourceId}`;
      
      // Create temporary link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Refresh resources after download to update count
      setTimeout(() => {
        fetchResources(activeTab);
      }, 2000);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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

      {/* Resources Grid */}
      {activeTab !== 'upload' && (
        loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="no-resources">
            <h3>No resources available yet</h3>
            <p>Be the first to share a resource!</p>
          </div>
        ) : (
          <div className="resources-grid">
            {resources.map((resource) => (
              <div key={resource._id} className="resource-card">
                <div className={`resource-icon ${resource.fileType}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    {resource.fileType === 'pdf' ? (
                      <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
                    ) : (
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    )}
                  </svg>
                </div>
                <div className="resource-content">
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <div className="resource-meta">
                    <span className="meta-badge">{resource.fileType.toUpperCase()}</span>
                    <span className="meta-badge">{formatFileSize(resource.fileSize)}</span>
                    <span className="meta-badge">{resource.downloads} downloads</span>
                  </div>
                  <div className="uploaded-by">
                    Uploaded by: {resource.uploadedBy}
                  </div>
                </div>
                <button 
                  className="download-btn"
                  onClick={() => handleDownload(resource._id, resource.fileName)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  Download
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* Upload Resource */}
      {activeTab === 'upload' && (
        <div className="upload-section">
          <div className="upload-card">
            <h2>Share a Resource</h2>
            <p>Upload resume templates or interview preparation materials to help fellow freshers.</p>
            
            <div className="upload-form">
              <div className="form-group">
                <label>Resource Type *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="resume">Resume Template</option>
                  <option value="interview">Interview Preparation</option>
                </select>
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Fresher Resume Template"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of the resource"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Siddhik Reddy"
                  value={formData.uploadedBy}
                  onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
                />
              </div>

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
                  <span>Resource uploaded successfully!</span>
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
        .resource-icon.doc,
        .resource-icon.docx {
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
          margin-bottom: 8px;
        }
        .meta-badge {
          background: #f3f4f6;
          color: #374151;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .uploaded-by {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 16px;
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

        .no-resources {
          text-align: center;
          padding: 48px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }
        .no-resources h3 {
          font-size: 18px;
          color: #111827;
          margin-bottom: 4px;
        }
        .no-resources p {
          color: #6b7280;
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

        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
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
          color: #6b7280;
        }
        .upload-success {
          display: flex;
          align-items: center;
          gap: 8px;
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
