import Link from 'next/link';

export default function About() {
  return (
    <div className="container">
      <div className="page-header">
        <h1>About JobAll</h1>
        <p>Learn more about our mission and what we do</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>What We Build</h2>
          <p>
            JobAll is a community-driven job portal designed exclusively for freshers. 
            We connect fresh graduates with companies hiring in Hyderabad and Bengaluru, 
            making job discovery simple and accessible for everyone.
          </p>
        </section>

        <section className="about-section">
          <h2>What The Web Helps For</h2>
          <ul className="help-list">
            <li>Find job openings exclusively for freshers</li>
            <li>Discover walk-in drives in Hyderabad and Bengaluru</li>
            <li>Post job openings without registration</li>
            <li>Filter jobs by batch, city, and skills</li>
            <li>Stay safe with our anti-scam warnings</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            To provide a free, transparent platform where freshers can find 
            genuine job opportunities without any barriers. We believe everyone 
            deserves a fair chance to start their career.
          </p>
        </section>

        <section className="about-section">
          <h2>Safety First</h2>
          <p>
            We are committed to protecting job seekers. Our platform includes 
            prominent warnings about job scams and we never charge any fees. 
            Remember: genuine companies never ask for payment.
          </p>
        </section>
      </div>

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

        .about-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .about-section {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 24px;
        }
        .about-section h2 {
          font-size: 22px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }
        .about-section p {
          color: #6b7280;
          font-size: 15px;
          line-height: 1.7;
        }

        .help-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .help-list li {
          padding: 12px 0;
          padding-left: 28px;
          position: relative;
          color: #6b7280;
          font-size: 15px;
        }
        .help-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          background: #4f6ef7;
          border-radius: 50%;
          opacity: 0.2;
        }
        .help-list li::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 6px;
          height: 6px;
          border-right: 2px solid #4f6ef7;
          border-bottom: 2px solid #4f6ef7;
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 28px;
          }
          .about-section {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}
