import React, { useState } from 'react';
import { MailIcon } from './icons/MailIcon';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [magicLink, setMagicLink] = useState('');
  const [error, setError] = useState('');

  const generateToken = () => {
    // Simple random string generator for simulation
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setError('Please fill in both your full name and email address.');
      return;
    }
    setError('');
    
    // 1. Generate Link
    const token = generateToken();
    const link = `https://patientnavigator.app/verify?token=${token}`;
    setMagicLink(link);

    // Simulate sending the magic link
    setIsLinkSent(true);
  };

  const handleMagicLinkClick = () => {
    // 3. Simulate Authentication
    console.log(`Authentication successful for ${email}.`);
    onLoginSuccess();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
            AuraGuard AI
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            Secure & Simple Access
          </p>
        </header>
        
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          {isLinkSent ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-5">
                <MailIcon className="h-12 w-12 text-green-500 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Check your email!</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                We sent a secure magic link to <br/>
                <strong className="text-slate-800 dark:text-slate-200">{email}</strong>
              </p>
              
              {/* 2. Display Link */}
              <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                  (This is a simulation. Click the link below to log in.)
                </p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMagicLinkClick();
                  }}
                  className="text-blue-500 hover:text-blue-400 break-all text-sm font-mono"
                >
                  {magicLink}
                </a>
              </div>

            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="full-name"
                    name="full-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
              
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

              <div>
                <button
                  type="submit"
                  className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 disabled:opacity-50"
                >
                  Login or Sign Up
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        For demo purposes
                    </span>
                </div>
              </div>

              <div>
                  <button
                    type="button"
                    onClick={onLoginSuccess}
                    className="w-full text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out"
                  >
                    Quick Login (Simulation)
                  </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;