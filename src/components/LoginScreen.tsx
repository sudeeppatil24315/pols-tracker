import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-block">
            {/* Truck Icon */}
            <div className="w-24 h-24 mx-auto mb-4 bg-[#F9D71C] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-5xl">🚚</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-[#F9D71C] mb-2">
            LOS POLLOS TRACKER
          </h1>
          <p className="text-gray-400 text-lg">
            Taste the Family... On Time
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900 rounded-lg p-8 shadow-2xl border border-gray-800">
          <h2 className="text-2xl font-semibold text-white mb-6">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F9D71C] focus:border-transparent transition"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F9D71C] focus:border-transparent transition"
                placeholder="Enter password"
                required
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F9D71C] hover:bg-[#e5c619] text-black font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials Hint */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials:</p>
            <div className="space-y-2 text-xs">
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-gray-400 mb-1">👨‍💼 Admin:</p>
                <p className="text-white font-mono">admin@lospollos.com</p>
                <p className="text-[#F9D71C] font-mono">admin123</p>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-gray-400 mb-1">🚚 Driver (Jesse Pinkman):</p>
                <p className="text-white font-mono">jesse.pinkman@lospollos.com</p>
                <p className="text-[#F9D71C] font-mono">driver123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          © 2024 Los Pollos Hermanos. All rights reserved.
        </p>
      </div>
    </div>
  );
}
