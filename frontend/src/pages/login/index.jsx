export function Login() {
  const handleLogin = async () => {
    window.location.href = `${import.meta.env.VITE_APP_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="login-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #f8f9fa;
          --text:     #1a1a1a;
          --muted:    #9aa0a6;
          --gc-blue:  #4a90d9;
          --gc-green: #34a853;
          --gc-yellow:#f9ab00;
          --gc-red:   #ea4335;
        }

        .login-root {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* ── blobs ── */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          opacity: 0.18;
          animation: drift 14s ease-in-out infinite alternate;
          pointer-events: none;
        }
        .blob-1 { width: 600px; height: 600px; background: var(--gc-blue);   top: -160px; left: -160px; animation-delay: 0s; }
        .blob-2 { width: 440px; height: 440px; background: var(--gc-green);  bottom: -100px; right: -100px; animation-delay: -5s; }
        .blob-3 { width: 300px; height: 300px; background: var(--gc-yellow); bottom: 60px;  left: 80px;  animation-delay: -9s; }
        .blob-4 { width: 240px; height: 240px; background: var(--gc-red);    top: 80px;    right: 140px; animation-delay: -3s; }

        @keyframes drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(28px,18px) scale(1.08); }
        }

        /* ── floating cards ── */
        .float-cards {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .fcard {
          position: absolute;
          bottom: -80px;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(0,0,0,0.07);
          backdrop-filter: blur(6px);
          border-radius: 10px;
          padding: 9px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--muted);
          white-space: nowrap;
          opacity: 0;
          animation: floatUp linear infinite;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .fcard-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

        .fcard:nth-child(1) { left:  5%; animation-duration: 22s; animation-delay:  0s; }
        .fcard:nth-child(2) { left: 16%; animation-duration: 19s; animation-delay: -7s; }
        .fcard:nth-child(3) { left: 72%; animation-duration: 24s; animation-delay: -3s; }
        .fcard:nth-child(4) { left: 84%; animation-duration: 20s; animation-delay:-11s; }
        .fcard:nth-child(5) { left: 54%; animation-duration: 18s; animation-delay: -5s; }
        .fcard:nth-child(6) { left: 38%; animation-duration: 21s; animation-delay:-15s; }
        .fcard:nth-child(7) { left: 28%; animation-duration: 23s; animation-delay: -9s; }
        .fcard:nth-child(8) { left: 62%; animation-duration: 17s; animation-delay: -2s; }

        @keyframes floatUp {
          0%   { transform: translateY(0);      opacity: 0; }
          8%   { opacity: 1; }
          88%  { opacity: 1; }
          100% { transform: translateY(-105vh); opacity: 0; }
        }

        /* ── center content ── */
        .center {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .icon-wrap {
          margin-bottom: 22px;
          animation: contentIn 0.7s 0.1s cubic-bezier(0.22,1,0.36,1) both;
        }

        .title {
          font-size: 42px;
          font-weight: 600;
          color: var(--text);
          letter-spacing: -1.2px;
          text-align: center;
          line-height: 1.1;
          margin-bottom: 8px;
          animation: contentIn 0.7s 0.18s cubic-bezier(0.22,1,0.36,1) both;
        }

        .title-sub {
          font-size: 15px;
          font-weight: 400;
          color: var(--muted);
          text-align: center;
          margin-bottom: 40px;
          animation: contentIn 0.7s 0.25s cubic-bezier(0.22,1,0.36,1) both;
        }

        .btn-google {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 13px 28px;
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: var(--text);
          transition: background 0.18s, border-color 0.18s, transform 0.18s, box-shadow 0.18s;
          backdrop-filter: blur(8px);
          animation: contentIn 0.7s 0.32s cubic-bezier(0.22,1,0.36,1) both;
          min-width: 240px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }

        .btn-google:hover {
          background: rgba(255,255,255,0.95);
          border-color: rgba(0,0,0,0.18);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }

        .btn-google:active {
          transform: translateY(0);
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }

        @keyframes contentIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />

      <div className="float-cards">
        {[
          { label: 'Math — Problem Set 3',    color: '#4a90d9' },
          { label: 'Biology — Lab Report',    color: '#34a853' },
          { label: 'History — Essay Draft',   color: '#f9ab00' },
          { label: 'CS — Homework 7',         color: '#ea4335' },
          { label: 'English — Reading Quiz',  color: '#e37400' },
          { label: 'Physics — Final Project', color: '#9334e6' },
          { label: 'Chemistry — Problem Set', color: '#34a853' },
          { label: 'Art — Portfolio Review',  color: '#4a90d9' },
        ].map((c, i) => (
          <div key={i} className="fcard">
            <span className="fcard-dot" style={{ background: c.color }} />
            {c.label}
          </div>
        ))}
      </div>

      <div className="center">
        <div className="icon-wrap">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3C10.34 3 9 4.34 9 6C9 7.66 10.34 9 12 9C13.66 9 15 7.66 15 6C15 4.34 13.66 3 12 3Z" fill="#4a90d9"/>
            <path d="M5.5 8C4.12 8 3 9.12 3 10.5C3 11.88 4.12 13 5.5 13C6.88 13 8 11.88 8 10.5C8 9.12 6.88 8 5.5 8Z" fill="#34a853"/>
            <path d="M18.5 8C17.12 8 16 9.12 16 10.5C16 11.88 17.12 13 18.5 13C19.88 13 21 11.88 21 10.5C21 9.12 19.88 8 18.5 8Z" fill="#ea4335"/>
            <path d="M12 10C9.79 10 7.71 10.84 6.17 12.25C7.1 12.72 7.81 13.56 8.09 14.57C9.23 13.59 10.55 13 12 13C13.45 13 14.77 13.59 15.91 14.57C16.19 13.56 16.9 12.72 17.83 12.25C16.29 10.84 14.21 10 12 10Z" fill="#f9ab00"/>
            <path d="M4 15.5V18.5C4 19.33 4.67 20 5.5 20H8.86C8.34 19.41 8 18.65 8 17.8V15.5H4Z" fill="#34a853"/>
            <path d="M16 15.5V17.8C16 18.65 15.66 19.41 15.14 20H18.5C19.33 20 20 19.33 20 18.5V15.5H16Z" fill="#ea4335"/>
            <path d="M12 14C10.34 14 9 15.34 9 17V20H15V17C15 15.34 13.66 14 12 14Z" fill="#4a90d9"/>
          </svg>
        </div>

        <h1 className="title">Google Classroom</h1>
        <p className="title-sub">Sign in to continue to your classes</p>

        <button className="btn-google" onClick={handleLogin}>
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}