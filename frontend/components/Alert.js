export default function Alert() {
  return (
    <div className="alert">
      <div className="alert-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="alert-content">
        <h3>Important Safety Warning</h3>
        <p>
          Do not give or take any money to anyone for job applications or interviews. 
          We are not responsible for any money transfer activities. 
          Genuine companies never ask for payment. Stay safe!
        </p>
      </div>
      <style jsx>{`
        .alert {
          background: #fffbeb;
          border: 1px solid #fbbf24;
          border-left: 4px solid #f59e0b;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          gap: 12px;
          margin: 20px 0;
        }
        .alert-icon {
          color: #f59e0b;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .alert-content h3 {
          color: #92400e;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .alert-content p {
          color: #92400e;
          font-size: 13px;
          line-height: 1.5;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
