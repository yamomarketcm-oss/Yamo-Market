import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Bus, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`https://yamo-market-server.vercel.app/api/market/validate-reset-token/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsValidToken(true);
      } else {
        const data = await response.json();
        setIsValidToken(false);
        toast.error(data.message || 'Invalid or expired reset link', {
          className: 'bg-red-50 text-red-900 border border-red-200 rounded-xl',
          progressClassName: 'bg-red-500'
        });
      }
    } catch (error) {
      console.error('Validation error:', error);
      setIsValidToken(false);
      toast.error('Failed to validate reset link', {
        className: 'bg-red-50 text-red-900 border border-red-200 rounded-xl',
        progressClassName: 'bg-red-500'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters', {
        className: 'bg-red-50 text-red-900 border border-red-200 rounded-xl',
        progressClassName: 'bg-red-500'
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
        className: 'bg-red-50 text-red-900 border border-red-200 rounded-xl',
        progressClassName: 'bg-red-500'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://yamo-market-server.vercel.app/api/market/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setIsSuccess(true);
      toast.success('Password reset successful!', {
        className: 'bg-green-50 text-green-900 border border-green-200 rounded-xl',
        progressClassName: 'bg-green-500'
      });

      setTimeout(() => {
        navigate('/');
      }, 3000);
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

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-green-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600 font-semibold">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken && !isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
            <p className="text-gray-600 mb-6">
              The reset link has expired or is invalid. Password reset links are only valid for 1 hour.
            </p>
          </div>

          <div className="bg-white py-10 px-8 shadow-2xl rounded-2xl border border-gray-100">
            <div className="space-y-4">
              <Link
                to="/forgot-password"
                className="block w-full py-3 px-4 bg-gradient-to-r from-green-300 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-center"
              >
                Request New Link
              </Link>
              <Link
                to="/"
                className="block w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-all duration-200 text-center"
              >
                Back to Login
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-600">
                Need help?{' '}
                <a href="mailto:support@busbook.com" className="font-semibold text-green-500 hover:text-green-700">
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
          </div>

          <div className="bg-white py-10 px-8 shadow-2xl rounded-2xl border border-gray-100">
            <div className="space-y-4">
              <Link
                to="/"
                className="block w-full py-3 px-4 bg-gradient-to-r from-green-300 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-center"
              >
                Go to Login
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700">
                  <strong>🔒 Security Tip:</strong> Don't share your password with anyone. YamoMarket will never ask for your password via email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

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
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-300 to-green-600 rounded-2xl p-3">
              <Bus className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-300 to-green-600 bg-clip-text text-transparent mb-2">
            Create New Password
          </h2>
          <p className="text-gray-600 text-sm">
            Enter your new password below
          </p>
        </div>

        <div className="bg-white py-10 px-8 shadow-2xl rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 text-green-500 absolute left-4 top-3.5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">Password Strength</span>
                    <span className="text-xs font-semibold" style={{
                      color: passwordStrength < 50 ? '#ef4444' : passwordStrength < 75 ? '#f59e0b' : '#10b981'
                    }}>
                      {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${passwordStrength}%`,
                        background: passwordStrength < 50 ? '#ef4444' : passwordStrength < 75 ? '#f59e0b' : '#10b981'
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <p>✓ At least 6 characters</p>
                    <p className={formData.password.length >= 12 ? 'text-green-600' : ''}>
                      {formData.password.length >= 12 ? '✓' : '○'} At least 12 characters
                    </p>
                    <p className={/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                      {/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? '✓' : '○'} Mix of uppercase & lowercase
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-2.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 text-green-500 absolute left-4 top-3.5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-600 mt-2">Passwords do not match</p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-xs text-green-600 mt-2">✓ Passwords match</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !formData.password || formData.password !== formData.confirmPassword}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Resetting...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-600 text-center">
              Back to{' '}
              <Link to="/" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
