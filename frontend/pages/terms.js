export default function Terms() {
  return (
    <div className="container">
      <div className="page-header">
        <h1>Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="policy-content">
        <section className="policy-section">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using Fresher-Bro, you agree to be bound by these Terms of Service.
            If you do not agree with any part of these terms, please do not use our platform.
          </p>
        </section>

        <section className="policy-section">
          <h2>Description of Service</h2>
          <p>
            Fresher-Bro is a free job portal for freshers. We provide a platform for browsing
            job openings, walk-in drives, and career resources. We do not charge any fees for
            using our services.
          </p>
        </section>

        <section className="policy-section">
          <h2>User Responsibilities</h2>
          <ul className="policy-list">
            <li>Post accurate and genuine job information</li>
            <li>Do not post misleading or fraudulent content</li>
            <li>Do not charge money from job seekers</li>
            <li>Do not post personal contact information of others</li>
            <li>Respect intellectual property rights</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Prohibited Activities</h2>
          <ul className="policy-list">
            <li>Posting scam or fraudulent job listings</li>
            <li>Charging fees from job seekers</li>
            <li>Harassing or threatening other users</li>
            <li>Uploading malicious files</li>
            <li>Attempting to hack or disrupt the platform</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Disclaimer</h2>
          <p>
            Fresher-Bro is provided "as is" without warranties. We do not verify job postings
            and are not responsible for any losses resulting from using our platform. Users
            should exercise caution when applying for jobs.
          </p>
        </section>

        <section className="policy-section">
          <h2>Limitation of Liability</h2>
          <p>
            Fresher-Bro and its developers shall not be liable for any direct, indirect,
            incidental, or consequential damages arising from the use of our platform.
          </p>
        </section>

        <section className="policy-section">
          <h2>Contact</h2>
          <p>
            For questions about these terms, contact Siddhik Reddy at +91 88973 50151.
          </p>
        </section>
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px 20px;
        }
        .page-header {
          text-align: center;
          padding: 40px 20px 24px;
        }
        .page-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }
        .page-header p {
          color: #6b7280;
          font-size: 14px;
        }
        .policy-content {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 32px;
        }
        .policy-section {
          margin-bottom: 32px;
        }
        .policy-section:last-child {
          margin-bottom: 0;
        }
        .policy-section h2 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 12px;
        }
        .policy-section p {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 12px;
        }
        .policy-list {
          padding-left: 20px;
          margin: 0;
        }
        .policy-list li {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 8px;
        }
        @media (max-width: 768px) {
          .policy-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
