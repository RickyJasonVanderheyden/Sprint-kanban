import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import FloatingBubbles from '../components/FloatingBubbles';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          // User is authenticated, redirect to focus page
          router.push('/focus');
        } else {
          // User is not authenticated, show landing page
          setIsChecking(false);
        }
      } catch (error) {
        // Error checking auth, show landing page
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center color-changing-bg">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-xl">
          <div className="text-lg text-gray-600 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen color-changing-bg relative overflow-hidden">
      {/* Floating Bubbles */}
      <FloatingBubbles />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in hero-title relative">
              <span className="hero-gradient-text hero-glow">
                Focus Sprints
              </span>
              <div className="hero-blur-effect">
                Focus Sprints
              </div>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 animate-fade-in-up">
              Boost your productivity with energy-matched tasks and kanban boards. 
              Organize your work, focus on what matters, and achieve more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Link 
                href="/register" 
                className="group relative bg-white/30 hover:bg-white/40 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border border-white/40 hover:border-white/60 hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link 
                href="/login" 
                className="group relative bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold border border-white/40 hover:border-white/60 transition-all duration-300 backdrop-blur-md hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group bg-white/30 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-white/40 hover:bg-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up">
              <div className="mb-6 flex justify-center">
                <svg width="48" height="48" viewBox="0 0 128 128" className="group-hover:scale-110 transition-transform duration-300">
                  <path d="M34.02 20.35v88.57c0 7.92 13.42 14.34 29.98 14.34c16.56 0 29.98-6.42 29.98-14.34V20.35H34.02z" fill="#8dcc47"/>
                  <path d="M94 20.36c0 9.44-15.79 15.37-29.98 15.37c-13.82 0-29.02-5.96-29.98-15.37c-1.03-10.14 13.42-17.1 29.98-17.1S94 10.92 94 20.36z" fill="#9ee350"/>
                  <ellipse cx="64.2" cy="17.55" rx="23.64" ry="11.43" fill="#d9d9d9"/>
                  <path d="M76.56 6.44v.66c.03-.41 0-.66 0-.66z" fill="#9e9e9e"/>
                  <path d="M76.99 51.54c0-.66-.25-1.06-.86-1.3c-.57-.23-1.4.01-2.25.23c-1.68.42-3.41.66-4.97.64c-.63-.01-.57-.61-.57-1.16v-5.48c0-.6-.07-1.36-1.18-1.36c-.67 0-1.48.18-3.17.2c-1.69-.01-2.5-.2-3.17-.2c-1.11 0-1.18.76-1.18 1.36v5.48c0 .55.06 1.15-.57 1.16c-1.56.02-3.29-.22-4.97-.64c-.86-.21-1.68-.45-2.25-.23c-.61.25-.86.64-.86 1.3l-.03 5.09c.28.79.57 1.36.89 1.53c.94.49 2.99 1.24 6.27 1.4c.65.03 1.38-.19 1.53.52c.07.35 0 4.67 0 6.42c0 1.59 2.3 1.76 3.54 1.86c.27.02 1.35.02 1.61 0c1.23-.11 3.54-.27 3.54-1.86c0-1.75-.07-6.07 0-6.42c.15-.71.87-.49 1.53-.52c3.28-.16 5.33-.92 6.27-1.4c.31-.16.61-.73.89-1.53l-.04-5.09z" fill="#ffffff"/>
                  <path d="M75.07 102.56s-3.85 1.17-11.07 1.17s-11.07-1.17-11.07-1.17c-1.37-.2-1.95.87-1.95 1.95v4.22c0 1 .65 1.93 1.81 2.5c2.39 1.18 6.25 1.98 10.87 1.93c.12 0 .23-.01.35-.01c.12 0 .23.01.35.01c4.63.05 8.48-.75 10.87-1.93c1.16-.57 1.81-1.5 1.81-2.5v-4.22c-.01-1.08-.6-2.15-1.97-1.95z" fill="#ffffff"/>
                  <path d="M58.59 27.81c1.6-1.54-4.16-2.87-6.88-3.8c-3.42-1.17-7-3.23-8.09-7.26c-.82-3.04-2.25-2.09-2.51-1.73c-.37.51-1.8 3.49.95 6.8c1.89 2.28 4.95 4.01 7.56 4.89c3.57 1.21 7.91 2.12 8.97 1.1z" fill="#f5f5f5"/>
                  <path d="M56 13.18c.33-1.12 3.23-1.81 4.99-1.83c3.01-.04 6.11 2.27 6.57 3.06c1.29 2.2-1.65 2.98-6.79 2.53c-3.46-.3-5.1-2.63-4.77-3.76z" fill="#f5f5f5"/>
                  <path d="M73.11 15.01c-.35-.62-.71-1.27-1.05-1.9c-.36-.65-.35.05-.43.32c-.41 1.42-1.22 2.05-1.79 2.36c-1.72.92-3.78 1.36-5.83 1.33c-2.06.02-4.11-.41-5.83-1.33c-.58-.31-1.38-.94-1.79-2.36c-.08-.28-.07-.97-.43-.32c-.35.63-.7 1.28-1.05 1.9c-.9 1.58-.12 3.33 1.03 4.45c2.01 1.95 5.13 2.85 8.08 2.85s6.07-.9 8.08-2.85c1.14-1.13 1.91-2.88 1.01-4.45z" fill="#9e9e9e"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Energy-Based Tasks</h3>
              <p className="text-white leading-relaxed">
                Match tasks to your energy levels for optimal productivity throughout the day.
              </p>
            </div>
            
            <div className="group bg-white/30 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-white/40 hover:bg-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="mb-6 flex justify-center">
                <svg width="48" height="48" viewBox="0 0 64 64" className="group-hover:scale-110 transition-transform duration-300">
                  <path d="M35.7 62.2c-1.4 2.1-4.4 2.4-6.8.7l-27-19C.1 42.6-.5 40.1.7 38.3L24.4 2C25.6.2 28.2-.5 30.3.4l30.6 13.5c2.7 1.2 3.9 3.9 2.5 6L35.7 62.2" fill="#d3976e"/>
                  <path fill="#ffffff" d="M31.4 59.8L3.5 40.7L28 3.3l31.1 14.2z"/>
                  <path d="M49 14.8c-.4.6-1.3.8-2.1.4L35.3 9.7c-.7-.3-.9-1-.5-1.6l1.8-2.8c.4-.6 1.2-.8 1.9-.5l11.9 5.3c.8.3 1 1.1.7 1.7l-2.1 3" fill="#94989b"/>
                  <path d="M46.8 11.1l-7.5-3.4l1.9-2.8c.4-.6 1.2-.8 1.9-.5l5 2.2c.7.3 1 1.1.6 1.6l-1.9 2.9" fill="#333"/>
                  <g fill="#83bf4f">
                    <path d="M47.3 26.6l-15.6-8.1l.8-1.2l15.7 7.9z"/>
                    <path d="M26.7 17.7c-.2.1-.4 0-.4-.1l-1-2.8c-.1-.2.1-.4.3-.4l.4-.1c.2 0 .4.1.5.2L27 16c.1.2.3.2.4.1l2.9-1.6c.2-.1.4-.1.5.1l.2.3c.1.2.1.4-.1.5l-4.2 2.3"/>
                  </g>
                  <g fill="#b0bdc6">
                    <path d="M42.2 34.4l-15.4-8.5l.9-1.3l15.4 8.5z"/>
                    <path d="M23.9 26.2l-4.5-2.6l2.6-4l4.6 2.5z"/>
                    <path d="M37.1 42.2l-15.1-9l.9-1.2L38 40.9z"/>
                    <path d="M19.1 33.5l-4.4-2.7l2.6-4l4.5 2.6z"/>
                    <path d="M32 50.1l-14.8-9.5l.8-1.3l14.8 9.4z"/>
                    <path d="M14.4 40.8L10 37.9l2.6-4l4.4 2.8z"/>
                  </g>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Kanban Boards</h3>
              <p className="text-white leading-relaxed">
                Visualize your workflow with customizable kanban boards that sync across devices.
              </p>
            </div>
            
            <div className="group bg-white/30 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-white/40 hover:bg-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="mb-6 flex justify-center">
                <svg width="48" height="48" viewBox="0 0 59 59" className="group-hover:scale-110 transition-transform duration-300">
                  <path style={{fill: 'none', stroke: '#BDC3C7', strokeWidth: 2, strokeMiterlimit: 10}} d="M29.5,1c-5.523,0-10,3.134-10,7
                    c0,3.134,2.943,5.786,7,6.679V11h6v3.679c4.057-0.892,7-3.544,7-6.679C39.5,4.134,35.023,1,29.5,1z"/>
                  <path style={{fill: '#38454F'}} d="M33.5,11h-8c-1.1,0-2-0.9-2-2v0c0-1.1,0.9-2,2-2h8c1.1,0,2,0.9,2,2v0C35.5,10.1,34.6,11,33.5,11z"/>
                  <rect x="26.5" y="11" style={{fill: '#D1D4D1'}} width="6" height="7.741"/>
                  <path style={{fill: '#ECF0F1'}} d="M29.5,59c-11.579,0-21-9.421-21-21s9.421-21,21-21s21,9.421,21,21S41.079,59,29.5,59z"/>
                  <circle style={{fill: '#FFFFFF'}} cx="29.5" cy="38" r="16"/>
                  <g>
                    <path style={{fill: '#546A79'}} d="M31.687,35.453C31.184,35.173,30.615,35,30,35c-1.93,0-3.5,1.57-3.5,3.5S28.07,42,30,42
                      s3.5-1.57,3.5-3.5c0-0.615-0.173-1.184-0.453-1.687c0.053-0.036,0.113-0.059,0.16-0.106l6.5-6.5c0.391-0.391,0.391-1.023,0-1.414
                      s-1.023-0.391-1.414,0l-6.5,6.5C31.746,35.34,31.723,35.399,31.687,35.453z M30,40c-0.827,0-1.5-0.673-1.5-1.5S29.173,37,30,37
                      s1.5,0.673,1.5,1.5S30.827,40,30,40z"/>
                    <path style={{fill: '#D1D4D1'}} d="M41.548,49.979C44.606,46.904,46.5,42.67,46.5,38c0-9.374-7.626-17-17-17
                      c-4.67,0-8.904,1.894-11.979,4.952c-0.013,0.011-0.029,0.015-0.041,0.027s-0.016,0.028-0.027,0.041
                      C14.394,29.096,12.5,33.33,12.5,38s1.894,8.904,4.952,11.979c0.011,0.013,0.015,0.029,0.027,0.041s0.028,0.016,0.041,0.027
                      C20.596,53.106,24.83,55,29.5,55s8.904-1.894,11.979-4.952c0.013-0.011,0.029-0.015,0.041-0.027S41.536,49.992,41.548,49.979z
                       M44.449,37H41.5c-0.553,0-1,0.447-1,1s0.447,1,1,1h2.949c-0.225,3.383-1.569,6.457-3.674,8.861l-2.083-2.083
                      c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l2.083,2.083c-2.404,2.105-5.478,3.449-8.861,3.674V50c0-0.553-0.447-1-1-1
                      s-1,0.447-1,1v2.949c-3.383-0.225-6.457-1.569-8.861-3.674l2.083-2.083c0.391-0.391,0.391-1.023,0-1.414s-1.023-0.391-1.414,0
                      l-2.083,2.083c-2.105-2.404-3.449-5.478-3.674-8.861H17.5c0.553,0,1-0.447,1-1s-0.447-1-1-1h-2.949
                      c0.225-3.383,1.569-6.457,3.674-8.861l2.083,2.083c0.195,0.195,0.451,0.293,0.707,0.293s0.512-0.098,0.707-0.293
                      c0.391-0.391,0.391-1.023,0-1.414l-2.083-2.083c2.404-2.105,5.478-3.449,8.861-3.674V26c0,0.553,0.447,1,1,1s1-0.447,1-1v-2.949
                      C37.973,23.547,43.953,29.527,44.449,37z"/>
                  </g>
                  <path style={{fill: '#38454F'}} d="M45.993,25.043l1.811-1.811c0.976-0.976,0.976-2.559,0-3.536c-0.976-0.976-2.559-0.976-3.535,0
                    l-1.811,1.811C43.772,22.542,44.958,23.728,45.993,25.043z"/>
                  <path style={{fill: '#38454F'}} d="M12.595,25.594c0.993-1.349,2.13-2.584,3.41-3.661l-2.237-2.237c-0.976-0.976-2.559-0.976-3.536,0v0
                    c-0.976,0.976-0.976,2.559,0,3.535L12.595,25.594z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Focus Timer</h3>
              <p className="text-white leading-relaxed">
                Stay focused with built-in timers and track your productive sessions.
              </p>
            </div>
          </div>

          {/* Additional Features Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-12 animate-fade-in">
              Everything You Need to Stay Productive
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/25 backdrop-blur-md rounded-xl p-6 border border-white/40 hover:bg-white/35 transition-all duration-300 animate-fade-in-up shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <g transform="translate(0 -1028.4)">
                        <path d="m5 1038.4c0 1.6 1.3431 3 3 3s3-1.4 3-3h-6z" fill="#ecf0f1"/>
                        <g fill="#f39c12">
                          <path d="m-22 26 21.758 13.438-22.516 12.124z" transform="matrix(-.34914 -.11287 -.10444 .40601 18.034 1017.3)"/>
                          <path d="m-22 26 21.758 13.438-22.516 12.124z" transform="matrix(.34914 -.11287 .10444 .40601 5.9657 1017.3)"/>
                          <path d="m22 13a10 9 0 1 1 -20 0 10 9 0 1 1 20 0z" transform="translate(0 1028.4)"/>
                        </g>
                        <g fill="#f1c40f">
                          <path d="m22 13a10 9 0 1 1 -20 0 10 9 0 1 1 20 0z" transform="matrix(.9 0 0 .88889 1.2 1029.8)"/>
                          <path d="m-22 26 21.758 13.438-22.516 12.124z" transform="matrix(.34914 -.11287 .10444 .40601 7.9657 1019.3)"/>
                          <path d="m-22 26 21.758 13.438-22.516 12.124z" transform="matrix(-.34914 -.11287 -.10444 .40601 16.034 1019.3)"/>
                        </g>
                        <g fill="#e67e22">
                          <path d="m11 1042.4v2c0 1.1-0.895 2-2 2-1.1046 0-2-0.9-2-2h-1c0 1.6 1.3431 3 3 3 1.657 0 3-1.4 3-3v-2h-1z"/>
                          <path d="m13 1042.4v2c0 1.1 0.895 2 2 2s2-0.9 2-2h1c0 1.6-1.343 3-3 3s-3-1.4-3-3v-2h1z"/>
                          <path d="m0 11.531v0.781l6 2.313-6-0.031v0.718l6.0312 0.032h0.0626l-6.0938 2.344v0.781l9-3.469-9-3.469z" transform="translate(0 1028.4)"/>
                          <path d="m24 1039.9v0.8l-6 2.3h6v0.7h-6.031-0.063l6.094 2.3v0.8l-9-3.4 9-3.5z"/>
                        </g>
                        <path d="m8 1036.4c-1.6569 0-3 1.3-3 3 0 1.6 1.3431 3 3 3s3-1.4 3-3c0-1.7-1.3431-3-3-3z" fill="#ecf0f1"/>
                        <path d="m8 1037.4c-1.1046 0-2 0.9-2 2s0.8954 2 2 2 2-0.9 2-2-0.8954-2-2-2z" fill="#2c3e50"/>
                        <path d="m8 1037.4c-0.5523 0-1 0.4-1 1 0 0.5 0.4477 1 1 1s1-0.5 1-1c0-0.6-0.4477-1-1-1z" fill="#ecf0f1"/>
                        <path d="m16 1036.4c-1.657 0-3 1.3-3 3 0 1.6 1.343 3 3 3s3-1.4 3-3c0-1.7-1.343-3-3-3z" fill="#ecf0f1"/>
                        <path d="m16 1037.4c-1.105 0-2 0.9-2 2s0.895 2 2 2 2-0.9 2-2-0.895-2-2-2z" fill="#2c3e50"/>
                        <path d="m16 1037.4c-0.552 0-1 0.4-1 1 0 0.5 0.448 1 1 1s1-0.5 1-1c0-0.6-0.448-1-1-1z" fill="#ecf0f1"/>
                        <path d="m10.219 1041.4c-0.2764 0-0.5002 0.2-0.5002 0.5 0 0.1 0.0345 0.2 0.125 0.3 0.0452 0.1 0.0964 0.1 0.1562 0.1l1.531 1.6 0.094 0.1c0.092 0.1 0.222 0.2 0.375 0.2s0.283-0.1 0.375-0.2l0.094-0.1 1.531-1.6c0.06 0 0.111 0 0.156-0.1 0.091-0.1 0.125-0.2 0.125-0.3 0-0.3-0.224-0.5-0.5-0.5h-1.781-1.781z" fill="#c0392b"/>
                      </g>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">TaskCat Companion</h3>
                </div>
                <p className="text-white">
                  Your cute draggable companion that shows your remaining tasks and keeps you motivated.
                </p>
              </div>
              
              <div className="bg-white/25 backdrop-blur-md rounded-xl p-6 border border-white/40 hover:bg-white/35 transition-all duration-300 animate-fade-in-up shadow-2xl" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 -0.5 26 26" fill="none">
                      <rect x="11.9141" y="15.4102" width="1.58679" height="5.59554" fill="url(#paint0_linear_103_1804)"/>
                      <path d="M5.89393 3.5979H1C1 7.393 1.29104 9.57603 6.69821 9.57603" stroke="#FFDD66" strokeWidth="2"/>
                      <path d="M19.8636 8.56848C19.8636 12.5379 16.6458 15.7557 12.6764 15.7557C8.70707 15.7557 5.48926 12.5379 5.48926 8.56848C5.48926 4.59911 8.70707 1.3813 12.6764 1.3813C16.6458 1.3813 19.8636 4.59911 19.8636 8.56848Z" fill="#FFDD66"/>
                      <path d="M12.6764 20.7262C9.74579 20.7262 7.37002 21.5833 7.37002 22.6406H17.9829C17.9829 21.5833 15.6071 20.7262 12.6764 20.7262Z" fill="#FFDD66"/>
                      <path d="M5.48926 0H19.8636V8.23263H5.48926V0Z" fill="#FFDD66"/>
                      <path d="M17.9829 23.01H7.37002V22.607H17.9829V23.01Z" fill="#FFDD66"/>
                      <path d="M19.6603 3.5979H24.5542C24.5542 7.393 24.2632 9.57603 18.856 9.57603" stroke="#DE9300" strokeWidth="2"/>
                      <path d="M19.8634 8.56843C19.8634 12.5378 16.6456 15.7556 12.6762 15.7556C12.6762 15.7556 12.6762 12.5378 12.6762 8.56843C12.6762 4.59905 12.6762 1.38124 12.6762 1.38124C16.6456 1.38124 19.8634 4.59905 19.8634 8.56843Z" fill="url(#paint1_linear_103_1804)"/>
                      <path d="M12.6762 20.7262C12.6762 20.7262 12.6762 21.5833 12.6762 22.6405H17.9826C17.9826 21.5833 15.6069 20.7262 12.6762 20.7262Z" fill="url(#paint2_linear_103_1804)"/>
                      <path d="M12.6762 0.000488281H19.8634V8.23258H12.6762V0.000488281Z" fill="url(#paint3_linear_103_1804)"/>
                      <path d="M17.9826 23.01H12.6762C12.6762 23.01 12.6643 22.7639 12.6762 22.6069C12.8331 20.5406 17.9826 22.6069 17.9826 22.6069V23.01Z" fill="url(#paint4_linear_103_1804)"/>
                      <circle cx="12.8176" cy="7.76846" r="4.30105" fill="#DCAE0C"/>
                      <circle cx="12.8088" cy="7.71544" r="3.12686" fill="#DE9300" stroke="#FFE176" strokeWidth="4.55437"/>
                      <path d="M12.8087 4.17944L13.8984 6.35885L16.0778 6.63128L14.5812 8.30942L14.9881 10.7177L12.8087 9.62796L10.6293 10.7177L11.0397 8.30942L9.53955 6.63128L11.719 6.35885L12.8087 4.17944Z" fill="#FFF4BC"/>
                      <path d="M13.2559 3.95584L12.8087 3.06141L12.3614 3.95584L11.3914 5.8959L9.47753 6.13514L8.53113 6.25344L9.16678 6.96451L10.5063 8.46298L10.1364 10.6337L9.97064 11.606L10.8529 11.1649L12.8087 10.187L14.7645 11.1649L15.6451 11.6052L15.4811 10.6344L15.1143 8.46295L16.4509 6.96406L17.0848 6.25327L16.1398 6.13514L14.2259 5.8959L13.2559 3.95584Z" stroke="#C98500" strokeOpacity="0.7"/>
                      <rect x="5" y="23" width="15" height="2" fill="#DE9300"/>
                      <defs>
                        <linearGradient id="paint0_linear_103_1804" x1="12.7075" y1="15.4102" x2="12.7075" y2="21.0057" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#C07F00"/>
                          <stop offset="1" stopColor="#DE9300"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_103_1804" x1="19.8139" y1="7.24836" x2="12.6085" y2="7.24836" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#DE9300"/>
                          <stop offset="1" stopColor="#FFBC11"/>
                        </linearGradient>
                        <linearGradient id="paint2_linear_103_1804" x1="19.8139" y1="7.24836" x2="12.6085" y2="7.24836" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#DE9300"/>
                          <stop offset="1" stopColor="#FFBC11"/>
                        </linearGradient>
                        <linearGradient id="paint3_linear_103_1804" x1="19.8139" y1="7.24836" x2="12.6085" y2="7.24836" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#DE9300"/>
                          <stop offset="1" stopColor="#FFBC11"/>
                        </linearGradient>
                        <linearGradient id="paint4_linear_103_1804" x1="19.8139" y1="7.24836" x2="12.6085" y2="7.24836" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#DE9300"/>
                          <stop offset="1" stopColor="#FFBC11"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Achievement System</h3>
                </div>
                <p className="text-white">
                  Track your productivity streaks and celebrate your accomplishments with floating achievements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
