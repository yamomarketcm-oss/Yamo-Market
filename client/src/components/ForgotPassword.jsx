import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await fetch('https://yamo-market-server.vercel.app/api/market/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      toast.success('Check your email for reset instructions!', {
        className: 'bg-green-50 text-green-900 border border-green-200 rounded-xl',
        progressClassName: 'bg-green-500'
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message, {
        className: 'bg-red-50 text-red-900 border border-red-200 rounded-xl',
        progressClassName: 'bg-red-500'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <Link to="/" className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors mb-6">
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-semibold">Back to Login</span>
        </Link>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-300 to-green-600 rounded-2xl p-3">
              <Bus className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-300 to-green-600 bg-clip-text text-transparent mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600 text-sm">
            No worries! We'll send you instructions to reset your password.
          </p>
        </div>

        <div className="bg-white py-10 px-8 shadow-2xl rounded-2xl border border-gray-100">
          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="h-5 w-5 text-blue-500 absolute left-4 top-3.5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enter the email address associated with your account
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-300 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs text-green-700">
                  <strong>💡 Tip:</strong> If you don't see the email, check your spam or junk folder. It may take a few moments to arrive.
                </p>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h3>
                <p className="text-gray-600 text-sm mb-4">
                  We've sent a password reset link to <span className="font-semibold break-all">{email}</span>
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-amber-800">
                    <strong>⏱️ Link expires in 1 hour</strong><br/>
                    The reset link is only valid for 1 hour for security reasons.
                  </p>
                </div>
                <p className="text-gray-500 text-xs mb-4">
                  If you don't see the email:
                </p>
                <ul className="text-gray-500 text-xs space-y-1 mb-6">
                  <li>✓ Check your spam or junk folder</li>
                  <li>✓ Wait a few moments and refresh</li>
                  <li>✓ Check if the email was typed correctly</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-300 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Back to Login
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                }}
                className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-all duration-200"
              >
                Try Another Email
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-600 text-center">
              Remember your password?{' '}
              <Link to="/" className="font-semibold text-green-400 hover:text-green-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
