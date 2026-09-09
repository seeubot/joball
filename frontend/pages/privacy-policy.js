export default function PrivacyPolicy() {
  return (
    <div className="container">
      <div className="page-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="policy-content">
        <section className="policy-section">
          <h2>Introduction</h2>
          <p>
            Fresher-Bro ("we," "our," or "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information
            when you use our website and mobile application.
          </p>
          <p>
            Fresher-Bro is a job portal designed exclusively for freshers. We provide a
            platform where users can browse job openings, walk-in drives, and access
            career resources without requiring registration.
          </p>
        </section>

        <section className="policy-section">
          <h2>Information We Do NOT Collect</h2>
          <p>
            Fresher-Bro is designed with privacy in mind. We do not collect, store, or
            process any of the following personal information:
          </p>
          <ul className="policy-list">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Physical address</li>
            <li>Government identification</li>
            <li>Financial information</li>
            <li>Photographs or images</li>
            <li>Location data</li>
            <li>Device identifiers</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Information We May Collect</h2>
          <p>
            The following non-personal information may be collected automatically
            for app functionality:
          </p>
          <ul className="policy-list">
            <li>Job posting data submitted by users (job title, company, city, skills)</li>
            <li>Resource files uploaded by users (resume templates, interview guides)</li>
            <li>Anonymous usage statistics for app improvement</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>How We Use Information</h2>
          <p>
            Any information submitted to Fresher-Bro is used solely for:
          </p>
          <ul className="policy-list">
            <li>Displaying job postings to other users</li>
            <li>Providing resource downloads</li>
            <li>Improving app functionality</li>
            <li>Preventing fraudulent job postings</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Job Postings and User Content</h2>
          <p>
            When you post a job opening or upload a resource, you acknowledge that:
          </p>
          <ul className="policy-list">
            <li>The content will be publicly visible to all users</li>
            <li>You have the right to share the information</li>
            <li>The content does not contain personal or sensitive data</li>
            <li>You are responsible for the accuracy of the information</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Third-Party Services</h2>
          <p>
            Fresher-Bro integrates with the following third-party services:
          </p>
          <ul className="policy-list">
            <li>
              <strong>WhatsApp</strong> - For community updates and contact purposes.
              When you click WhatsApp links, you are subject to WhatsApp's privacy policy.
            </li>
            <li>
              <strong>MongoDB Atlas</strong> - For database storage of job postings and resources.
            </li>
            <li>
              <strong>Koyeb</strong> - For backend server hosting.
            </li>
            <li>
              <strong>Vercel</strong> - For website hosting.
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Cookies and Tracking</h2>
          <p>
            Fresher-Bro does not use cookies or tracking technologies for advertising purposes.
            We do not display advertisements and do not share data with advertising networks.
          </p>
        </section>

        <section className="policy-section">
          <h2>Data Security</h2>
          <p>
            While we take reasonable measures to protect the information on our platform,
            no method of transmission over the Internet is 100% secure. We cannot guarantee
            absolute security of your data.
          </p>
        </section>

        <section className="policy-section">
          <h2>Children's Privacy</h2>
          <p>
            Fresher-Bro is not intended for children under the age of 13. We do not knowingly
            collect personal information from children. If you believe a child has provided
            us with information, please contact us immediately.
          </p>
        </section>

        <section className="policy-section">
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify users of any
            changes by posting the new Privacy Policy on this page. You are advised to review
            this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section className="policy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="contact-info">
            <p><strong>Developer:</strong> Siddhik Reddy</p>
            <p><strong>WhatsApp:</strong> +91 88973 50151</p>
            <p><strong>Email:</strong> siddhikreddy@fresherbro.com</p>
          </div>
        </section>

        <section className="policy-section">
          <h2>Disclaimer</h2>
          <p>
            Fresher-Bro is a free community platform. We do not verify the authenticity of
            job postings. Users are advised to exercise caution and never pay money for job
            applications or interviews. We are not responsible for any financial transactions
            between users and third parties.
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
        .contact-info {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          margin-top: 8px;
        }
        .contact-info p {
          margin-bottom: 4px;
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
