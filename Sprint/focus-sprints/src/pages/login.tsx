import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FloatingBubbles from '../components/FloatingBubbles';
import TaskCat from '../components/TaskCat';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent form from submitting normally

    try {
      // POST request to the login API
      const response = await axios.post('/api/auth/login', { email, password });
      
      // On success, redirect to focus page
      router.push('/focus');
    } catch (err) {
      // If error, show error message
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen color-changing-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Bubbles Background */}
      <FloatingBubbles />
      
      {/* Floating Cat */}
      <TaskCat remainingTasks={0} />
      
      {/* Login Form */}
      <div className="w-full max-w-md relative z-10">
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/40 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl"></div>
            <div className="absolute top-4 right-4 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-400/10 rounded-full blur-lg"></div>
          </div>
          
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-lg">
              Sign in to continue your productivity journey
            </p>
          </div>
          
          {/* Email Input */}
          <div className="mb-6 relative z-10">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Password Input */}
          <div className="mb-6 relative z-10">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-red-100 to-red-50 border border-red-300 text-red-700 text-center animate-fade-in shadow-sm relative z-10">
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          {/* Login Button */}
          <button 
            type="submit"
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border border-blue-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl relative z-10"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </span>
          </button>
          
          {/* Sign Up Link */}
          <div className="mt-6 text-center relative z-10">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300 underline decoration-blue-600/50 hover:decoration-blue-800">
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute top-1/2 left-0 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse"></div>
    </div>
  );
};

export default Login;
