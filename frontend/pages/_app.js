import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Browse Jobs', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
    { name: 'Post Job', href: '/post-job' },
  ];

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/' && !router.asPath.includes('#');
    if (href === '/post-job') return router.pathname === '/post-job';
    return false;
  };

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      if (router.pathname === path) {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push(href);
      }
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo">
            <span className="logo-icon">J</span>
            <span>JobAll</span>
          </Link>

          <div className="nav-links">
            {navigation.map((item) => (
              item.href.includes('#') ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={isActive(item.href) ? 'active' : ''}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={isActive(item.href) ? 'active' : ''}
                >
                  {item.name}
                </Link>
              )
            ))}
            <Link href="/post-job" className="nav-cta">
              Post Job
            </Link>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            {navigation.map((item) => (
              item.href.includes('#') ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={isActive(item.href) ? 'active' : ''}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={isActive(item.href) ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        )}
      </nav>

      <Component {...pageProps} />

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <Link href="/" className="logo">
                <span className="logo-icon">J</span>
                <span>JobAll</span>
              </Link>
              <p>A community-driven job portal for freshers.</p>
            </div>
            <div className="footer-links">
              <Link href="/">Browse Jobs</Link>
              <a href="/#about">About</a>
              <a href="/#contact">Contact</a>
              <Link href="/post-job">Post Job</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} JobAll. All rights reserved.</p>
            <p className="footer-dev">Developed by SIDDHIK REDDY</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #4f6ef7;
          --primary-dark: #3b55e6;
          --primary-light: #eef2ff;
          --gray-50: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-500: #6b7280;
          --gray-600: #4b5563;
          --gray-700: #374151;
          --gray-900: #111827;
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--gray-50);
          color: var(--gray-900);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        .navbar {
          background: white;
          border-bottom: 1px solid var(--gray-200);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          height: 64px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--gray-900);
          font-weight: 700;
          font-size: 20px;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: var(--primary);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-links a {
          text-decoration: none;
          color: var(--gray-600);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          cursor: pointer;
        }

        .nav-links a:hover {
          background: var(--gray-100);
          color: var(--gray-900);
        }

        .nav-links a.active {
          background: var(--primary-light);
          color: var(--primary);
        }

        .nav-cta {
          background: var(--primary) !important;
          color: white !important;
          padding: 8px 20px !important;
          border-radius: 8px !important;
          font-weight: 500 !important;
        }

        .nav-cta:hover {
          background: var(--primary-dark) !important;
        }

        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .mobile-menu-btn span {
          width: 24px;
          height: 2px;
          background: var(--gray-700);
          border-radius: 2px;
        }

        .mobile-menu {
          display: none;
          padding: 16px;
          border-top: 1px solid var(--gray-200);
          background: white;
        }

        .mobile-menu a {
          display: block;
          padding: 12px;
          text-decoration: none;
          color: var(--gray-600);
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
        }

        .mobile-menu a:hover {
          background: var(--gray-100);
        }

        .mobile-menu a.active {
          background: var(--primary-light);
          color: var(--primary);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 20px;
        }

        .footer {
          background: white;
          border-top: 1px solid var(--gray-200);
          margin-top: 48px;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 20px 24px;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 32px;
          margin-bottom: 32px;
        }

        .footer-brand p {
          color: var(--gray-500);
          margin-top: 12px;
          font-size: 14px;
        }

        .footer-links {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .footer-links a {
          text-decoration: none;
          color: var(--gray-600);
          font-size: 14px;
          cursor: pointer;
        }

        .footer-links a:hover {
          color: var(--primary);
        }

        .footer-bottom {
          border-top: 1px solid var(--gray-200);
          padding-top: 24px;
          text-align: center;
        }

        .footer-bottom p {
          color: var(--gray-500);
          font-size: 14px;
        }

        .footer-dev {
          margin-top: 4px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .mobile-menu-btn {
            display: flex;
          }

          .mobile-menu {
            display: block;
          }

          .footer-content {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default MyApp;
