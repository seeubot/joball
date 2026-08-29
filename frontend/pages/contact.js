import { PhoneIcon, EnvelopeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function Contact() {
  const phoneNumber = '+918897350151';
  const whatsappLink = `https://wa.me/918897350151?text=${encodeURIComponent('Hi Siddhik, I have a query regarding JobAll.')}`;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Contact Admin</h1>
        <p>For any queries or support, reach out to the developer</p>
      </div>

      <div className="contact-grid">
        {/* Developer Card */}
        <div className="contact-card">
          <div className="card-header">
            <div className="avatar">SR</div>
            <div>
              <h2>SIDDHIK REDDY</h2>
              <p className="role">Developer & Admin</p>
            </div>
          </div>

          <div className="card-body">
            <p className="card-desc">
              Have a question about JobAll? Need help with posting jobs? 
              Feel free to reach out via phone or WhatsApp.
            </p>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="contact-card">
          <h3>Contact Methods</h3>
          
          <div className="contact-methods">
            {/* Phone */}
            <a href={`tel:${phoneNumber}`} className="contact-method">
              <div className="method-icon phone">
                <PhoneIcon className="h-6 w-6" />
              </div>
              <div className="method-details">
                <span className="method-label">Call</span>
                <span className="method-value">+91 88973 50151</span>
              </div>
            </a>

            {/* WhatsApp */}
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-method"
            >
              <div className="method-icon whatsapp">
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
              </div>
              <div className="method-details">
                <span className="method-label">WhatsApp</span>
                <span className="method-value">Chat with Admin</span>
              </div>
            </a>

            {/* Email (optional) */}
            <div className="contact-method">
              <div className="method-icon email">
                <EnvelopeIcon className="h-6 w-6" />
              </div>
              <div className="method-details">
                <span className="method-label">Email</span>
                <span className="method-value">siddhik@joball.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div className="whatsapp-cta">
        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Chat on WhatsApp
        </a>
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

        .contact-grid {
          max-width: 800px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .contact-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 32px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .avatar {
          width: 64px;
          height: 64px;
          background: #4f6ef7;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
        }
        .card-header h2 {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }
        .role {
          color: #6b7280;
          font-size: 14px;
        }

        .card-desc {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
        }

        .contact-card h3 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }

        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-method {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
        }
        .contact-method:hover {
          border-color: #4f6ef7;
          background: #f9fafb;
        }

        .method-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .method-icon.phone {
          background: #eef2ff;
          color: #4f6ef7;
        }
        .method-icon.whatsapp {
          background: #ecfdf5;
          color: #10b981;
        }
        .method-icon.email {
          background: #fef2f2;
          color: #ef4444;
        }

        .method-details {
          display: flex;
          flex-direction: column;
        }
        .method-label {
          font-size: 12px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .method-value {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
        }

        .whatsapp-cta {
          max-width: 800px;
          margin: 24px auto 0;
          text-align: center;
        }

        .whatsapp-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #10b981;
          color: white;
          padding: 14px 32px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          transition: background 0.2s;
        }
        .whatsapp-btn:hover {
          background: #059669;
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 28px;
          }
          .contact-grid {
            grid-template-columns: 1fr;
          }
          .contact-card {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}
