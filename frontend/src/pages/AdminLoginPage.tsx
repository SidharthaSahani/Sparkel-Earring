import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toastService from '../utils/toastService';

interface AdminLoginPageProps {
  onNavigate: (page: string) => void;
}

export default function AdminLoginPage({ onNavigate }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { adminSignIn, signUpAdmin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        // Admin Registration
        if (password.length < 6) {
          toastService.error('Password must be at least 6 characters');
          return;
        }
        
        await signUpAdmin(email, password, fullName);
        toastService.success('Admin account created successfully! You can now log in.');
        setIsRegistering(false);
        setFullName('');
        setPassword('');
      } else {
        // Admin Login
        await adminSignIn(email, password);
        toastService.success('Welcome to the admin panel!');
        onNavigate('admin');
      }
    } catch (error) {
      const errorMessage = isRegistering ? 'Registration failed' : 'Invalid admin credentials';
      toastService.error(errorMessage);
      console.error('Admin auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isRegistering ? 'Admin Registration' : 'Admin Login'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isRegistering 
              ? 'Create an admin account to access the admin panel' 
              : 'Sign in to access the admin panel'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className={`px-4 py-2 font-medium rounded-l-lg ${
                !isRegistering
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsRegistering(true)}
              className={`px-4 py-2 font-medium rounded-r-lg ${
                isRegistering
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Register
            </button>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {isRegistering && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required={isRegistering}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                  placeholder="Your full name"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {isRegistering ? 'Email Address' : 'Admin Email'}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder={isRegistering ? 'you@example.com' : 'Admin email address'}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Password (min 6 characters)"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
              >
                {loading 
                  ? (isRegistering ? 'Creating account...' : 'Signing in...') 
                  : (isRegistering ? 'Create Admin Account' : 'Sign in as Admin')}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-sm text-pink-600 hover:text-pink-500"
            >
              Back to Home
            </button>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            {isRegistering 
              ? 'Already have an admin account? ' 
              : 'Need an admin account? '}
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-pink-600 hover:text-pink-500 font-medium"
            >
              {isRegistering ? 'Sign in instead' : 'Register here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}