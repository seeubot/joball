import { useRouter } from 'next/router';
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo">
            🎓 JobAll
          </Link>
          <div className="nav-links">
            <Link href="/" className={router.pathname === '/' ? 'active' : ''}>
              Browse Jobs
            </Link>
            <Link href="/post-job" className={router.pathname === '/post-job' ? 'active' : ''}>
              Post Job
            </Link>
          </div>
        </div>
      </nav>
      
      <Component {...pageProps} />
      
      <footer className="footer">
        <p>© 2024 JobAll - Freshers Job Portal | Made with ❤️ for freshers</p>
      </footer>
      
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: #f5f5f5;
          color: #333;
          line-height: 1.6;
        }
        .navbar {
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          text-decoration: none;
          color: #333;
        }
        .nav-links {
          display: flex;
          gap: 20px;
        }
        .nav-links a {
          text-decoration: none;
          color: #666;
          padding: 8px 16px;
          border-radius: 20px;
          transition: all 0.3s;
        }
        .nav-links a:hover {
          background: #f0f0f0;
        }
        .nav-links a.active {
          background: #667eea;
          color: white;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          margin-top: 40px;
          background: white;
          color: #666;
        }
      `}</style>
    </div>
  );
}

export default MyApp;
