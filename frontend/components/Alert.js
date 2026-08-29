export default function Alert() {
  return (
    <div className="alert">
      <span className="alert-icon">🚨</span>
      <div className="alert-content">
        <strong>⚠️ IMPORTANT WARNING:</strong>
        <p>
          Do not give or take any money to anyone for job applications or interviews. 
          We are not responsible for any money transfer activities. 
          Genuine companies never ask for payment. Stay safe!
        </p>
      </div>
      <style jsx>{`
        .alert {
          background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
          border: 2px solid #ffc107;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          display: flex;
          align-items: center;
          gap: 15px;
          animation: pulse 2s infinite;
          box-shadow: 0 4px 6px rgba(255, 193, 7, 0.2);
        }
        .alert-icon {
          font-size: 32px;
          animation: shake 0.5s infinite;
        }
        .alert-content strong {
          color: #856404;
          display: block;
          margin-bottom: 5px;
          font-size: 16px;
        }
        .alert-content p {
          margin: 0;
          color: #856404;
          font-size: 14px;
          line-height: 1.5;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
